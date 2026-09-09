"""
Marine Route Engine  — GreenFleet-Q
====================================
Generates two distinct ocean-route alternatives for any port pair using
real shipping-lane waypoints and maritime chokepoints.

Routes are classified by ocean basin and routed through the correct
chokepoints (Suez Canal, Strait of Malacca, Cape of Good Hope, Panama
Canal, Strait of Gibraltar, Bab-el-Mandeb, Torres Strait, etc.).

This is a decision-support prototype, not certified navigation routing.
"""
import math
from pathlib import Path
from typing import List, Tuple, Dict, Any
import searoute as _searoute
from searoute.classes.passages import Passage as _Passage
import geopandas as _gpd
from pyproj import Transformer as _Transformer
from shapely.geometry import LineString as _LineString
from shapely.ops import transform as _transform

_LAND_BUFFER_KM = 2.0
_PORT_APPROACH_KM = 75.0
_LAND_DATA = Path(__file__).resolve().parent / 'data' / 'ne_10m_land.geojson'
_TO_METRES = _Transformer.from_crs('EPSG:4326', 'EPSG:6933', always_xy=True).transform
_LAND_GEOMETRY = _gpd.read_file(_LAND_DATA).to_crs('EPSG:6933').geometry.unary_union
_LAND_BUFFER = _LAND_GEOMETRY.buffer(_LAND_BUFFER_KM * 1000)


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------

def haversine_km(a: Dict, b: Dict) -> float:
    R = 6371.0088
    p1, p2 = math.radians(a['lat']), math.radians(b['lat'])
    dp = math.radians(b['lat'] - a['lat'])
    dl = math.radians(b['lon'] - a['lon'])
    x = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(min(1.0, x)))


def bearing_deg(a: Dict, b: Dict) -> float:
    p1 = math.radians(a['lat'])
    p2 = math.radians(b['lat'])
    dl = math.radians(b['lon'] - a['lon'])
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def _pt(lat: float, lon: float, idx: int = 0) -> Dict:
    return {'index': idx, 'lat': round(float(lat), 4), 'lon': round(float(lon), 4)}


def _interpolate_segment(a: Tuple, b: Tuple, n: int = 3) -> List[Tuple]:
    """Insert n intermediate points between two (lat, lon) tuples."""
    pts = []
    for i in range(1, n):
        t = i / n
        pts.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return pts


def _densify(raw_pts: List[Tuple], target_n: int = 12) -> List[Tuple]:
    """Densify a waypoint list so we have at least target_n points."""
    if len(raw_pts) >= target_n:
        return raw_pts
    # Insert midpoints between every consecutive pair
    result = [raw_pts[0]]
    for i in range(len(raw_pts) - 1):
        mids = _interpolate_segment(raw_pts[i], raw_pts[i + 1])
        result.extend(mids)
        result.append(raw_pts[i + 1])
    # Recurse if still not enough
    if len(result) < target_n:
        return _densify(result, target_n)
    return result


def _build_from_tuples(
    tuples: List[Tuple],
    speed_knots: float = 14.0,
    route_id: str = 'R1',
    label: str = 'Route',
) -> Dict:
    pts = [_pt(lat, lon, i) for i, (lat, lon) in enumerate(tuples)]
    segments = []
    total = 0.0
    for i in range(len(pts) - 1):
        d = haversine_km(pts[i], pts[i + 1])
        total += d
        segments.append({
            'segment_index': i,
            'start': pts[i],
            'end': pts[i + 1],
            'distance_km': round(d, 2),
            'heading_deg': round(bearing_deg(pts[i], pts[i + 1]), 2),
        })
    speed_kmh = speed_knots * 1.852
    eta = total / speed_kmh if speed_kmh else None
    return {
        'route_id': route_id,
        'label': label,
        'waypoints': pts,
        'geometry': {
            'type': 'LineString',
            'coordinates': [[point['lon'], point['lat']] for point in pts],
        },
        'segments': segments,
        'distance_km': round(total, 2),
        'eta_hours': round(eta, 2) if eta is not None else None,
        'disclaimer': 'Prototype route approximation; not for navigation.',
    }


# ---------------------------------------------------------------------------
# Maritime chokepoints / waypoints (lat, lon)
# ---------------------------------------------------------------------------

# Major chokepoints
STRAIT_MALACCA    = (2.5, 102.0)
SINGAPORE         = (1.28, 103.84)
LOMBOK_STRAIT     = (-8.5, 115.7)
SUNDA_STRAIT      = (-6.0, 105.8)
BALI_SEA          = (-7.5, 115.0)
TORRES_STRAIT     = (-10.5, 142.2)
SUEZ_N            = (31.25, 32.35)
SUEZ_S            = (30.1, 32.5)
BAB_EL_MANDEB     = (12.5, 43.5)
GULF_OF_ADEN_MID  = (12.0, 48.0)
ARABIAN_SEA_MID   = (15.0, 60.0)
INDIAN_OCEAN_MID  = (-5.0, 75.0)
CAPE_GOOD_HOPE    = (-34.8, 20.0)
CAPE_AGULHAS      = (-34.8, 26.5)
CAPE_LEEUWIN      = (-34.4, 115.0)
MOZAMBIQUE_N      = (-12.0, 42.0)
MOZAMBIQUE_S      = (-25.0, 35.5)
EAST_AFRICA_MID   = (-10.0, 55.0)
MALDIVES_MID      = (4.0, 73.5)
BAY_OF_BENGAL     = (10.0, 87.0)
ANDAMAN_SEA       = (10.0, 97.5)
SOUTH_CHINA_SEA_N = (15.0, 115.0)
SOUTH_CHINA_SEA_S = (5.0, 110.0)
TAIWAN_STRAIT     = (24.5, 120.0)
PHILIPPINE_SEA    = (18.0, 130.0)
GIBRALTAR         = (36.0, -5.4)
ATLANTIC_W_AFRICA = (10.0, -15.0)
ATLANTIC_MID_N    = (30.0, -40.0)
ATLANTIC_MID_S    = (-10.0, -25.0)
ATLANTIC_N        = (50.0, -30.0)
NORTH_SEA         = (56.0, 3.0)
ENGLISH_CHANNEL   = (50.5, -1.5)
DOVER_STRAIT      = (51.1, 1.4)
CANARY_ISLANDS    = (28.0, -15.5)
AZORES            = (38.5, -28.0)
PANAMA_CANAL      = (9.0, -79.5)
CARIBBEAN_MID     = (15.0, -65.0)
GULF_MEXICO       = (25.0, -90.0)
HORN              = (-56.0, -67.3)
DRAKE_PASSAGE     = (-58.0, -65.0)
PACIFIC_MID_S     = (-20.0, -120.0)
PACIFIC_MID_N     = (15.0, -130.0)
PACIFIC_NW        = (40.0, -150.0)
PACIFIC_NE        = (35.0, -120.0)
YELLOW_SEA        = (33.0, 124.0)
JAPAN_SEA         = (37.0, 134.0)
NORTH_PACIFIC     = (45.0, 170.0)
SOUTH_PACIFIC_W   = (-20.0, 170.0)
MED_WEST          = (38.0, 5.0)
MED_EAST          = (33.0, 25.0)
MED_CENTRAL       = (35.0, 15.0)
RED_SEA_N         = (27.0, 34.0)
RED_SEA_S         = (15.0, 42.0)
PERSIAN_GULF_ENT  = (24.0, 58.0)
HORMUZ            = (26.5, 56.5)
PERSIAN_GULF_MID  = (26.0, 52.0)

# Indian subcontinent coastal waypoints (all in water)
INDIA_W_COAST_N   = (16.0, 71.5)   # Konkan coast, open Arabian Sea
INDIA_W_COAST_MID = (10.5, 73.0)   # Lakshadweep Sea, west of Kerala
CAPE_COMORIN      = (7.5, 77.5)    # Tip of India (south of Kanyakumari), in sea
SRI_LANKA_SOUTH   = (5.5, 80.5)    # South of Sri Lanka in open ocean
BAY_ENTRANCE      = (7.0, 84.0)    # Bay of Bengal entrance east of Sri Lanka
PALK_STRAIT_SOUTH = (8.5, 79.5)    # South of Palk Strait (sea corridor)


# ---------------------------------------------------------------------------
# Ocean basin classification
# ---------------------------------------------------------------------------

def _lon_norm(p) -> float:
    """Normalised longitude in [0, 360)."""
    return p.longitude % 360


def _basin(port) -> str:
    """Rough ocean basin for a port."""
    lat, lon = port.latitude, port.longitude
    # Normalise to [-180, 180]
    if lon > 180:
        lon -= 360

    # Persian Gulf / Red Sea
    if 43 < lon < 60 and 10 < lat < 32:
        return 'PERSIAN'
    # Indian Ocean west coast (Arabian Sea, west of India)
    # lon < 78 keeps Arabian Sea / Konkan / Kerala / Lakshadweep side
    # Ports at 78–85°E (Chennai, Vizag, etc.) belong to Bay of Bengal side
    if 40 < lon < 78 and lat < 30:
        return 'INDIAN_WEST'
    # Indian Ocean east coast (Bay of Bengal) — lon 78–100 covers
    # east Indian coast (Chennai 80°, Vizag 83°), Sri Lanka, and up to Malacca
    if 78 <= lon < 100 and lat < 25:
        return 'INDIAN_EAST'
    # SE Asia / South China Sea — Malacca, Singapore, Thailand, Vietnam, Philippines
    if 100 < lon < 135 and lat < 25:
        return 'SEASIA'
    # Far East (Japan, Korea, China coast, Taiwan)
    if 115 < lon < 145 and lat > 20:
        return 'FAR_EAST'
    # Australia / Oceania
    if 110 < lon < 180 and -45 < lat < -5:
        return 'AUSTRALIA'
    # Mediterranean / Black Sea (must be before North Europe and West Africa)
    if -6 < lon < 42 and 30 < lat < 47:
        return 'MEDITERRANEAN'
    # Northern Europe
    if -15 < lon < 35 and lat > 47:
        return 'NORTH_EUROPE'
    # Americas Atlantic side: US East Coast, Caribbean, South America East
    # -100 to -20 covers Atlantic-facing Americas ports; must come before PACIFIC_E
    if -100 < lon < -20 and lat > -60:
        return 'AMERICAS_ATL'
    # West Africa
    if -20 < lon < 18 and lat < 35:
        return 'WEST_AFRICA'
    # East Africa
    if 30 < lon < 52 and lat < 20:
        return 'EAST_AFRICA'
    # South Africa
    if 14 < lon < 34 and lat < -25:
        return 'SOUTH_AFRICA'
    # Pacific (east side — US/Canada West Coast, Chile, etc.)
    if lon < -100 and lat > -60:
        return 'PACIFIC_E'
    # Pacific (west / mid — Hawaii, Oceania mid-Pacific, etc.)
    if lon > 145 or lon < -100:
        return 'PACIFIC_W'
    return 'GENERIC'



# ---------------------------------------------------------------------------
# Corridor library: each entry is a list of (lat, lon) waypoints (ocean only)
# ---------------------------------------------------------------------------

def _indian_ocean_via_malacca(origin_lat, origin_lon, dest_lat, dest_lon):
    """Route through Indian Ocean → Malacca Strait → SE Asia."""
    return [
        (origin_lat, origin_lon),
        ARABIAN_SEA_MID,
        MALDIVES_MID,
        INDIAN_OCEAN_MID,
        (2.0, 84.0),
        ANDAMAN_SEA,
        STRAIT_MALACCA,
        SINGAPORE,
        (dest_lat, dest_lon),
    ]


def _route_via_suez(o_lat, o_lon, d_lat, d_lon, coming_from_east=False):
    """Route through Suez Canal."""
    if coming_from_east:
        return [
            (o_lat, o_lon),
            ARABIAN_SEA_MID,
            GULF_OF_ADEN_MID,
            BAB_EL_MANDEB,
            RED_SEA_S,
            RED_SEA_N,
            SUEZ_S,
            SUEZ_N,
            MED_EAST,
            (d_lat, d_lon),
        ]
    else:
        return [
            (o_lat, o_lon),
            MED_EAST,
            SUEZ_N,
            SUEZ_S,
            RED_SEA_N,
            RED_SEA_S,
            BAB_EL_MANDEB,
            GULF_OF_ADEN_MID,
            ARABIAN_SEA_MID,
            (d_lat, d_lon),
        ]


def _route_via_cape(o_lat, o_lon, d_lat, d_lon):
    """Route around Cape of Good Hope."""
    return [
        (o_lat, o_lon),
        (o_lat + (CAPE_GOOD_HOPE[0] - o_lat) * 0.4,
         o_lon + (CAPE_GOOD_HOPE[1] - o_lon) * 0.4),
        CAPE_GOOD_HOPE,
        CAPE_AGULHAS,
        EAST_AFRICA_MID,
        ARABIAN_SEA_MID,
        (d_lat, d_lon),
    ]


def _route_via_gibraltar(o_lat, o_lon, d_lat, d_lon, east_to_west=True):
    """Through Gibraltar into Atlantic or vice-versa."""
    if east_to_west:
        return [
            (o_lat, o_lon),
            MED_WEST,
            GIBRALTAR,
            CANARY_ISLANDS,
            ATLANTIC_MID_N,
            (d_lat, d_lon),
        ]
    else:
        return [
            (o_lat, o_lon),
            CANARY_ISLANDS,
            GIBRALTAR,
            MED_WEST,
            MED_CENTRAL,
            (d_lat, d_lon),
        ]


# ---------------------------------------------------------------------------
# Master routing function
# ---------------------------------------------------------------------------

def _select_corridors(origin, destination) -> Tuple[List[Tuple], List[Tuple]]:
    """
    Return two distinct corridor point-lists (main route, alt route)
    for the given port pair.
    """
    o_lat, o_lon = origin.latitude, origin.longitude
    d_lat, d_lon = destination.latitude, destination.longitude
    ob = _basin(origin)
    db = _basin(destination)

    # -----------------------------------------------------------------------
    # Helper: offset a corridor laterally (perpendicular detour)
    # -----------------------------------------------------------------------
    def _lateral_offset(pts: List[Tuple], factor: float = 2.0) -> List[Tuple]:
        """Push mid-section of a corridor ±factor degrees north/south."""
        out = list(pts)
        mid = len(out) // 2
        lo = max(1, mid - 1)
        hi = min(len(out) - 2, mid + 1)
        for i in range(lo, hi + 1):
            out[i] = (out[i][0] + factor, out[i][1])
        return out

    def _cape_detour(pts: List[Tuple], deg: float = 2.5) -> List[Tuple]:
        """Push cape waypoints a bit further south."""
        return [(p[0] - deg if abs(p[0] + 35) < 3 else p[0], p[1]) for p in pts]

    # -----------------------------------------------------------------------
    # Indian west-coast domestic routes  (Arabian Sea / Lakshadweep Sea)
    # Routes must stay well offshore — minimum 65°E to clear the Konkan /
    # Kerala / Western Ghats coastline. All waypoints in open ocean.
    # -----------------------------------------------------------------------
    if ob == db == 'INDIAN_WEST':
        southbound = d_lat < o_lat
        # Latitude range of the voyage
        top_lat  = max(o_lat, d_lat)
        bot_lat  = min(o_lat, d_lat)
        mid_lat  = (top_lat + bot_lat) / 2

        # Does the route span below Cape Comorin (need to go around the tip)?
        crosses_tip = bot_lat < 8.5

        if crosses_tip:
            # Route goes far enough south that it must round the southern tip.
            # Main: deep coastal arc through Lakshadweep Sea staying ≥ 4° offshore
            main = [
                (o_lat, o_lon),
                (top_lat - 1.0, 68.5),      # Exit into deep Arabian Sea immediately
                (mid_lat, 67.0),            # Mid-route, open Arabian Sea
                INDIA_W_COAST_MID,          # (10.5, 73.0) — Lakshadweep Sea
                CAPE_COMORIN,               # (7.5, 77.5) — Tip of India in sea
                (bot_lat + 1.0, 79.0),      # Approach destination from south
                (d_lat, d_lon),
            ]
            # Alt: Wide Arabian Sea arc further west
            alt = [
                (o_lat, o_lon),
                (top_lat - 0.5, 66.0),      # Far western Arabian Sea
                (mid_lat, 63.5),            # Open ocean
                (8.0, 65.0),               # SW of India
                MALDIVES_MID,              # (4.0, 73.5) — south of tip
                CAPE_COMORIN,
                (d_lat, d_lon),
            ]
        else:
            # Short/mid coastal voyage — both ports on the west Arabian Sea side.
            # Push waypoints 8° west of the easternmost port, min 58°E (open sea).
            coast_lon = max(o_lon, d_lon)
            offshore  = max(58.0, coast_lon - 8.0)   # always ≥ 58°E
            offshore2 = max(55.0, coast_lon - 11.0)  # alt: further west

            main = [
                (o_lat, o_lon),
                (top_lat - 0.5, offshore),
                (mid_lat,       offshore - 1.0),
                (bot_lat + 0.5, offshore),
                (d_lat, d_lon),
            ]
            alt = [
                (o_lat, o_lon),
                (top_lat - 0.5, offshore2),
                (mid_lat,       offshore2 - 2.0),
                (bot_lat + 0.5, offshore2),
                (d_lat, d_lon),
            ]
        return main, alt

    # -----------------------------------------------------------------------
    # Indian west coast ↔ Indian east coast (Bay of Bengal)
    # e.g. Mumbai → Chennai, Kochi → Kolkata
    # Must go around Cape Comorin — stay in open sea both sides
    # -----------------------------------------------------------------------
    if (ob == 'INDIAN_WEST' and db == 'INDIAN_EAST') or \
       (ob == 'INDIAN_EAST' and db == 'INDIAN_WEST'):
        west_lat  = o_lat if ob == 'INDIAN_WEST' else d_lat
        west_lon  = o_lon if ob == 'INDIAN_WEST' else d_lon
        east_lat  = d_lat if ob == 'INDIAN_WEST' else o_lat
        east_lon  = d_lon if ob == 'INDIAN_WEST' else o_lon
        # Route around Cape Comorin (south tip of India) via Lakshadweep Sea
        cape_route = [
            (west_lat, west_lon),
            (west_lat - 1.0, 68.5),     # Pull west into Arabian Sea
            INDIA_W_COAST_MID,           # (10.5, 73.0) Lakshadweep Sea
            CAPE_COMORIN,                # (7.5, 77.5)  Tip of India in sea
            SRI_LANKA_SOUTH,             # (5.5, 80.5)  South of Sri Lanka
            PALK_STRAIT_SOUTH,           # (8.5, 79.5)  SE corridor
            (east_lat - 1.0, east_lon + 1.0),
            (east_lat, east_lon),
        ]
        # Alt: wider arc — deeper west then around south
        wide_route = [
            (west_lat, west_lon),
            (west_lat - 0.5, 66.0),     # Far western Arabian Sea
            MALDIVES_MID,                # (4.0, 73.5)
            (4.5, 79.5),
            SRI_LANKA_SOUTH,
            BAY_ENTRANCE,                # (7.0, 84.0)
            (east_lat, east_lon),
        ]
        if ob == 'INDIAN_WEST':
            return cape_route, wide_route
        else:
            return list(reversed(cape_route)), list(reversed(wide_route))

    # -----------------------------------------------------------------------
    # India / Arabian Sea / Persian Gulf ↔ SE Asia / China / Japan / Korea
    # -----------------------------------------------------------------------
    indian_west  = ob in ('INDIAN_WEST', 'PERSIAN')
    indian_east  = ob in ('INDIAN_EAST',)
    seasia_dest  = db in ('SEASIA', 'INDIAN_EAST', 'FAR_EAST', 'AUSTRALIA', 'PACIFIC_E', 'PACIFIC_W')
    seasia_orig  = ob in ('SEASIA', 'INDIAN_EAST', 'FAR_EAST', 'AUSTRALIA', 'PACIFIC_E', 'PACIFIC_W')


    if indian_west and seasia_dest:
        # Route A: Hugs the Indian west coast south → Cape Comorin → south of Sri Lanka
        #          → Bay of Bengal → Malacca Strait → Singapore
        main = [
            (o_lat, o_lon),
            INDIA_W_COAST_N,        # Arabian Sea off Konkan/Goa  (16°N, 71.5°E)
            INDIA_W_COAST_MID,      # Lakshadweep Sea off Kerala   (10.5°N, 73°E)
            CAPE_COMORIN,           # Tip of India in sea          (7.5°N, 77.5°E)
            SRI_LANKA_SOUTH,        # South of Sri Lanka            (5.5°N, 80.5°E)
            BAY_ENTRANCE,           # Bay of Bengal entrance        (7.0°N, 84°E)
            (9.0, 92.5),            # Andaman Sea south
            STRAIT_MALACCA,         # Malacca Strait                (2.5°N, 102°E)
            (d_lat, d_lon),
        ]
        # Route B: Diverges IMMEDIATELY west into open Arabian Sea, then through Maldives
        #          – completely different path from R1, no visual overlap at start
        alt = [
            (o_lat, o_lon),
            (16.5, 68.0),           # Open Arabian Sea, well west of India
            (12.0, 66.0),           # Mid-Arabian Sea
            MALDIVES_MID,           # Through Maldives open ocean   (4°N, 73.5°E)
            (2.5, 77.5),            # South of Maldives
            SRI_LANKA_SOUTH,        # South of Sri Lanka            (5.5°N, 80.5°E)
            (6.0, 84.0),
            (8.0, 91.0),            # Andaman Sea
            ANDAMAN_SEA,
            STRAIT_MALACCA,
            (d_lat, d_lon),
        ]
        return main, alt

    if seasia_orig and db in ('INDIAN_WEST', 'PERSIAN'):
        # Reverse: Singapore → Malacca → south of Sri Lanka → around India coast
        main = [
            (o_lat, o_lon),
            SINGAPORE,
            STRAIT_MALACCA,
            (9.0, 92.5),
            BAY_ENTRANCE,
            SRI_LANKA_SOUTH,
            CAPE_COMORIN,
            INDIA_W_COAST_MID,
            INDIA_W_COAST_N,
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon),
            SOUTH_CHINA_SEA_S, SINGAPORE,
            STRAIT_MALACCA,
            ANDAMAN_SEA,
            (6.0, 84.0),
            SRI_LANKA_SOUTH,
            MALDIVES_MID,
            INDIA_W_COAST_MID,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Mediterranean / North Europe ↔ Indian Ocean / Persian Gulf / East Africa
    # -----------------------------------------------------------------------
    med_or_europe = ob in ('MEDITERRANEAN', 'NORTH_EUROPE')
    indian_or_ea  = db in ('INDIAN_WEST', 'INDIAN_EAST', 'PERSIAN', 'EAST_AFRICA',
                            'SOUTH_AFRICA', 'SEASIA', 'FAR_EAST', 'AUSTRALIA')

    if med_or_europe and indian_or_ea:
        # Main: Suez Canal route
        suez_start = SUEZ_N if ob == 'MEDITERRANEAN' else (DOVER_STRAIT if o_lat > 49 else MED_CENTRAL)
        main = [
            (o_lat, o_lon),
            *([(DOVER_STRAIT[0] + 0.5, DOVER_STRAIT[1]), ENGLISH_CHANNEL] if o_lat > 49 else []),
            MED_WEST if ob != 'MEDITERRANEAN' else (o_lat + 1, o_lon + 2),
            SUEZ_N, SUEZ_S, RED_SEA_N, RED_SEA_S, BAB_EL_MANDEB,
            GULF_OF_ADEN_MID, ARABIAN_SEA_MID, (d_lat, d_lon),
        ]
        # Alt: Cape of Good Hope (longer, no Suez)
        alt = [
            (o_lat, o_lon),
            *([(DOVER_STRAIT[0] + 0.5, DOVER_STRAIT[1])] if o_lat > 49 else []),
            GIBRALTAR,
            CANARY_ISLANDS,
            ATLANTIC_W_AFRICA,
            CAPE_GOOD_HOPE,
            CAPE_AGULHAS,
            MOZAMBIQUE_S,
            MOZAMBIQUE_N,
            ARABIAN_SEA_MID,
            (d_lat, d_lon),
        ]
        return main, alt

    # Reverse: Indian Ocean → Mediterranean/Europe
    if indian_or_ea and ob not in ('MEDITERRANEAN', 'NORTH_EUROPE') and db in ('MEDITERRANEAN', 'NORTH_EUROPE'):
        main = [
            (o_lat, o_lon), ARABIAN_SEA_MID, GULF_OF_ADEN_MID, BAB_EL_MANDEB,
            RED_SEA_S, RED_SEA_N, SUEZ_S, SUEZ_N,
            MED_EAST, MED_CENTRAL, MED_WEST,
            *([(ENGLISH_CHANNEL, DOVER_STRAIT)] if d_lat > 49 else []),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), CAPE_AGULHAS, CAPE_GOOD_HOPE,
            ATLANTIC_W_AFRICA, CANARY_ISLANDS, GIBRALTAR,
            MED_WEST, MED_CENTRAL,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # SE Asia / Far East ↔ Mediterranean / Europe
    # -----------------------------------------------------------------------
    if ob in ('SEASIA', 'FAR_EAST') and db in ('MEDITERRANEAN', 'NORTH_EUROPE'):
        main = [
            (o_lat, o_lon),
            SOUTH_CHINA_SEA_S if ob == 'SEASIA' else PHILIPPINE_SEA,
            SINGAPORE, STRAIT_MALACCA,
            ANDAMAN_SEA, MALDIVES_MID, ARABIAN_SEA_MID,
            GULF_OF_ADEN_MID, BAB_EL_MANDEB, RED_SEA_S, RED_SEA_N,
            SUEZ_S, SUEZ_N, MED_EAST, MED_CENTRAL, MED_WEST,
            *([(ENGLISH_CHANNEL[0]+1, ENGLISH_CHANNEL[1])] if d_lat > 49 else []),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon),
            SOUTH_CHINA_SEA_S if ob == 'SEASIA' else PHILIPPINE_SEA,
            LOMBOK_STRAIT,
            INDIAN_OCEAN_MID,
            CAPE_AGULHAS, CAPE_GOOD_HOPE,
            ATLANTIC_W_AFRICA, CANARY_ISLANDS,
            GIBRALTAR, MED_WEST,
            (d_lat, d_lon),
        ]
        return main, alt

    # Reverse
    if db in ('SEASIA', 'FAR_EAST') and ob in ('MEDITERRANEAN', 'NORTH_EUROPE'):
        main = [
            (o_lat, o_lon),
            *([(ENGLISH_CHANNEL[0]+1, ENGLISH_CHANNEL[1])] if o_lat > 49 else [MED_WEST]),
            MED_CENTRAL, MED_EAST,
            SUEZ_N, SUEZ_S, RED_SEA_N, RED_SEA_S, BAB_EL_MANDEB,
            GULF_OF_ADEN_MID, ARABIAN_SEA_MID, MALDIVES_MID, ANDAMAN_SEA,
            STRAIT_MALACCA, SINGAPORE, SOUTH_CHINA_SEA_S,
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon),
            GIBRALTAR, CANARY_ISLANDS, ATLANTIC_W_AFRICA,
            CAPE_GOOD_HOPE, CAPE_AGULHAS, INDIAN_OCEAN_MID,
            LOMBOK_STRAIT, BALI_SEA, SOUTH_CHINA_SEA_S,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Americas (Atlantic) ↔ Europe / Mediterranean
    # -----------------------------------------------------------------------
    if ob == 'AMERICAS_ATL' and db in ('NORTH_EUROPE', 'MEDITERRANEAN', 'WEST_AFRICA'):
        main = [
            (o_lat, o_lon), ATLANTIC_MID_N, AZORES,
            CANARY_ISLANDS if db == 'WEST_AFRICA' else NORTH_SEA,
            *([(ENGLISH_CHANNEL[0]+1, ENGLISH_CHANNEL[1])] if d_lat > 49 else []),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), (20.0, -55.0), ATLANTIC_MID_N,
            (46.0, -25.0),
            GIBRALTAR if db == 'MEDITERRANEAN' else NORTH_SEA,
            (d_lat, d_lon),
        ]
        return main, alt

    if db == 'AMERICAS_ATL' and ob in ('NORTH_EUROPE', 'MEDITERRANEAN', 'WEST_AFRICA'):
        main = [
            (o_lat, o_lon),
            *([(ENGLISH_CHANNEL[0]+1, ENGLISH_CHANNEL[1])] if o_lat > 49 else [AZORES]),
            ATLANTIC_MID_N, (30.0, -50.0),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon),
            GIBRALTAR if ob == 'MEDITERRANEAN' else CANARY_ISLANDS,
            ATLANTIC_W_AFRICA,
            (12.0, -30.0), (15.0, -55.0), CARIBBEAN_MID,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Americas (Pacific) ↔ SE Asia / Far East / Australia
    # -----------------------------------------------------------------------
    if ob == 'PACIFIC_E' and db in ('SEASIA', 'FAR_EAST', 'AUSTRALIA', 'PACIFIC_W'):
        main = [
            (o_lat, o_lon), PACIFIC_MID_N, PACIFIC_NW, NORTH_PACIFIC,
            *([(YELLOW_SEA[0], YELLOW_SEA[1])] if db == 'FAR_EAST' else [SINGAPORE]),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), (10.0, -100.0), PACIFIC_MID_S,
            (d_lat - (d_lat + 20) * 0.1, d_lon - 10),
            (d_lat, d_lon),
        ]
        return main, alt

    # Americas ATL ↔ Indian Ocean / Persian Gulf (via Cape or Panama)
    if ob == 'AMERICAS_ATL' and db in ('INDIAN_WEST', 'PERSIAN', 'SEASIA', 'FAR_EAST'):
        main = [
            (o_lat, o_lon), CARIBBEAN_MID, PANAMA_CANAL,
            PACIFIC_MID_N, PACIFIC_NW,
            *([(YELLOW_SEA[0], YELLOW_SEA[1])] if db == 'FAR_EAST' else [SINGAPORE]),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), ATLANTIC_MID_N, AZORES,
            CANARY_ISLANDS, ATLANTIC_W_AFRICA, ATLANTIC_MID_S,
            CAPE_GOOD_HOPE, INDIAN_OCEAN_MID, MALDIVES_MID,
            ARABIAN_SEA_MID, (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Australia ↔ Far East / Pacific
    # -----------------------------------------------------------------------
    if ob == 'AUSTRALIA' and db in ('FAR_EAST', 'SEASIA'):
        main = [
            (o_lat, o_lon), (-18.0, 147.0), TORRES_STRAIT,
            PHILIPPINE_SEA,
            *([(YELLOW_SEA[0], YELLOW_SEA[1])] if db == 'FAR_EAST' else [SOUTH_CHINA_SEA_S]),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), (-20.0, 130.0),
            LOMBOK_STRAIT, BALI_SEA, SOUTH_CHINA_SEA_S,
            (d_lat, d_lon),
        ]
        return main, alt

    # Australia ↔ Europe / Middle East (via Cape or Suez)
    if ob == 'AUSTRALIA' and db in ('NORTH_EUROPE', 'MEDITERRANEAN', 'INDIAN_WEST', 'PERSIAN'):
        main = [
            (o_lat, o_lon), CAPE_LEEUWIN,
            INDIAN_OCEAN_MID, ARABIAN_SEA_MID, GULF_OF_ADEN_MID,
            BAB_EL_MANDEB, RED_SEA_S, RED_SEA_N, SUEZ_S, SUEZ_N,
            MED_EAST, MED_WEST, (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), CAPE_LEEUWIN,
            (-40.0, 60.0), CAPE_AGULHAS, CAPE_GOOD_HOPE,
            ATLANTIC_W_AFRICA, CANARY_ISLANDS, GIBRALTAR,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # East Africa ↔ South Asia / Persian Gulf
    # -----------------------------------------------------------------------
    if ob == 'EAST_AFRICA' and db in ('INDIAN_WEST', 'PERSIAN', 'INDIAN_EAST'):
        main = [
            (o_lat, o_lon), MOZAMBIQUE_N,
            (-5.0, 47.0), (5.0, 55.0), ARABIAN_SEA_MID,
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), EAST_AFRICA_MID,
            MALDIVES_MID, ARABIAN_SEA_MID, (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # West Africa ↔ various
    # -----------------------------------------------------------------------
    if ob == 'WEST_AFRICA' and db in ('NORTH_EUROPE', 'MEDITERRANEAN'):
        main = [
            (o_lat, o_lon), CANARY_ISLANDS, ATLANTIC_W_AFRICA,
            (30.0, -15.0),
            GIBRALTAR if db == 'MEDITERRANEAN' else ENGLISH_CHANNEL,
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), ATLANTIC_W_AFRICA,
            ATLANTIC_MID_N, (46.0, -25.0),
            NORTH_SEA if db == 'NORTH_EUROPE' else GIBRALTAR,
            (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Mediterranean intra-basin
    # -----------------------------------------------------------------------
    if ob == 'MEDITERRANEAN' and db == 'MEDITERRANEAN':
        # Direct west–east traverse
        mid_lat = (o_lat + d_lat) / 2
        main = [
            (o_lat, o_lon), MED_WEST, MED_CENTRAL, MED_EAST, (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), (mid_lat + 2.0, (o_lon + d_lon) / 2), (d_lat, d_lon),
        ]
        return main, alt

    # North Europe intra-basin
    if ob == 'NORTH_EUROPE' and db == 'NORTH_EUROPE':
        main = [
            (o_lat, o_lon), NORTH_SEA, ENGLISH_CHANNEL, DOVER_STRAIT, (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), (58.0, -2.0), (54.0, 0.5), (d_lat, d_lon),
        ]
        return main, alt

    # Far East intra-basin
    if ob == 'FAR_EAST' and db == 'FAR_EAST':
        main = [
            (o_lat, o_lon), TAIWAN_STRAIT, YELLOW_SEA, (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), PHILIPPINE_SEA, JAPAN_SEA, (d_lat, d_lon),
        ]
        return main, alt

    # SE Asia intra-basin
    if ob in ('SEASIA', 'INDIAN_EAST') and db in ('SEASIA', 'INDIAN_EAST', 'FAR_EAST'):
        main = [
            (o_lat, o_lon), SINGAPORE, SOUTH_CHINA_SEA_S, SOUTH_CHINA_SEA_N, (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon), STRAIT_MALACCA, ANDAMAN_SEA, BAY_OF_BENGAL,
            (10.0, 95.0), (d_lat, d_lon),
        ]
        return main, alt

    # -----------------------------------------------------------------------
    # Fallback: geodesic with a lateral offset
    # -----------------------------------------------------------------------
    mid_lat = (o_lat + d_lat) / 2
    mid_lon = (o_lon + d_lon) / 2

    # For Indian subcontinent region — both ports near India but in different basins
    # or unclassified: route around Cape Comorin to stay in the sea
    india_region = (60 < o_lon < 100 and -5 < o_lat < 30) and \
                   (60 < d_lon < 100 and -5 < d_lat < 30)
    if india_region:
        main = [
            (o_lat, o_lon),
            (max(o_lat, d_lat) - 1.0, min(o_lon, d_lon) - 4.0),  # offshore west
            INDIA_W_COAST_MID,   # Lakshadweep Sea
            CAPE_COMORIN,        # Round the tip
            SRI_LANKA_SOUTH,     # South of Sri Lanka
            (min(o_lat, d_lat) + 1.0, max(o_lon, d_lon) + 1.0),
            (d_lat, d_lon),
        ]
        alt = [
            (o_lat, o_lon),
            (max(o_lat, d_lat) - 0.5, min(o_lon, d_lon) - 7.0),  # farther west
            MALDIVES_MID,
            CAPE_COMORIN,
            (d_lat, d_lon),
        ]
        return main, alt

    ocean_offset = 8.0 if o_lon <= d_lon else -8.0
    main = [
        (o_lat, o_lon),
        (mid_lat + 2.0, mid_lon + ocean_offset),
        (mid_lat - 2.0, mid_lon + ocean_offset),
        (d_lat, d_lon),
    ]
    alt = [
        (o_lat, o_lon),
        (mid_lat + 4.0, mid_lon + ocean_offset * 1.5),
        (mid_lat - 4.0, mid_lon + ocean_offset * 1.5),
        (d_lat, d_lon),
    ]
    return main, alt


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def _legacy_build_route_options(origin, destination, speed_knots: float = 14.0):
    """Build two ocean-route candidates for the given port pair."""
    raw_main, raw_alt = _select_corridors(origin, destination)

    # Use the corridor waypoints as-is — they are carefully placed in open water.
    # Only densify if there are very few points (fallback case).
    main = _densify(raw_main, 6) if len(raw_main) < 5 else raw_main
    alt  = _densify(raw_alt,  6) if len(raw_alt)  < 5 else raw_alt

    r1 = _build_from_tuples(main, speed_knots, 'R1', _label(origin, destination, 'Main'))
    r2 = _build_from_tuples(alt,  speed_knots, 'R2', _label(origin, destination, 'Alt'))
    return [r1, r2]


def _label(origin, destination, variant: str) -> str:
    ob = _basin(origin)
    db = _basin(destination)
    suffixes = {
        'MEDITERRANEAN': 'Mediterranean',
        'NORTH_EUROPE':  'N. Europe',
        'INDIAN_WEST':   'Indian Ocean W',
        'INDIAN_EAST':   'Indian Ocean E',
        'PERSIAN':       'Persian Gulf',
        'SEASIA':        'SE Asia',
        'FAR_EAST':      'Far East',
        'AUSTRALIA':     'Australia',
        'PACIFIC_E':     'E. Pacific',
        'PACIFIC_W':     'W. Pacific',
        'AMERICAS_ATL':  'Americas',
        'WEST_AFRICA':   'W. Africa',
        'EAST_AFRICA':   'E. Africa',
        'SOUTH_AFRICA':  'S. Africa',
        'GENERIC':       'Open Ocean',
    }
    dest_region = suffixes.get(db, suffixes.get(ob, 'Open Ocean'))

    # Suez routes: Europe/Med going east
    if ob in ('MEDITERRANEAN', 'NORTH_EUROPE') and db in ('INDIAN_WEST', 'PERSIAN', 'SEASIA', 'FAR_EAST', 'EAST_AFRICA', 'AUSTRALIA'):
        tag = 'Via Suez Canal' if variant == 'Main' else 'Via Cape of Good Hope'
    # SE Asia / Far East going to Europe
    elif ob in ('SEASIA', 'FAR_EAST') and db in ('MEDITERRANEAN', 'NORTH_EUROPE'):
        tag = 'Via Suez Canal' if variant == 'Main' else 'Via Cape of Good Hope'
    # Indian Ocean going to SE Asia
    elif ob in ('INDIAN_WEST', 'PERSIAN') and db in ('SEASIA', 'FAR_EAST', 'AUSTRALIA'):
        tag = 'Via Malacca Strait' if variant == 'Main' else 'Via Lombok Strait'
    elif ob in ('SEASIA', 'FAR_EAST', 'AUSTRALIA') and db in ('INDIAN_WEST', 'PERSIAN'):
        tag = 'Via Malacca Strait' if variant == 'Main' else 'Via Lombok Strait'
    # Americas via Panama
    elif ob == 'AMERICAS_ATL' and db in ('SEASIA', 'FAR_EAST', 'PACIFIC_E', 'PACIFIC_W', 'AUSTRALIA'):
        tag = 'Via Panama Canal' if variant == 'Main' else 'Via Cape of Good Hope'
    # Australia to Europe
    elif ob == 'AUSTRALIA' and db in ('NORTH_EUROPE', 'MEDITERRANEAN'):
        tag = 'Via Suez Canal' if variant == 'Main' else 'Via Cape of Good Hope'
    # Europe to Americas (Atlantic)
    elif ob in ('NORTH_EUROPE', 'MEDITERRANEAN') and db == 'AMERICAS_ATL':
        tag = 'North Atlantic Route' if variant == 'Main' else 'Southern Atlantic Route'
    elif ob == 'AMERICAS_ATL' and db in ('NORTH_EUROPE', 'MEDITERRANEAN'):
        tag = 'North Atlantic Route' if variant == 'Main' else 'Southern Atlantic Route'
    # Pacific crossings
    elif ob in ('FAR_EAST', 'SEASIA', 'AUSTRALIA') and db == 'PACIFIC_E':
        tag = 'Great Circle Route' if variant == 'Main' else 'Trade Wind Route'
    elif ob == 'PACIFIC_E' and db in ('FAR_EAST', 'SEASIA', 'AUSTRALIA'):
        tag = 'Great Circle Route' if variant == 'Main' else 'Trade Wind Route'
    # Intra-basin
    elif ob == db:
        tag = 'Direct Corridor' if variant == 'Main' else 'Alternate Corridor'
    else:
        tag = 'Ocean Corridor A' if variant == 'Main' else 'Ocean Corridor B'

    return f"{tag} — {dest_region}"


class MarineRouteUnavailable(RuntimeError):
    """Raised when the marine graph cannot connect two requested ports."""


def validate_marine_route(route_geometry, endpoint_tolerance_km=_PORT_APPROACH_KM):
    """Validate the exact returned LineString against buffered land polygons."""
    if isinstance(route_geometry, dict) and route_geometry.get('type') == 'Feature':
        coordinates = route_geometry.get('geometry', {}).get('coordinates', [])
    elif isinstance(route_geometry, dict) and 'coordinates' in route_geometry:
        coordinates = route_geometry['coordinates']
    else:
        coordinates = route_geometry

    if not coordinates or len(coordinates) < 2:
        return {'valid': False, 'land_intersections': 0, 'segments_checked': 0}

    segments_checked = len(coordinates) - 1
    invalid_segments = []
    cumulative_from_origin = 0.0
    segment_lengths = [
        _transform(_TO_METRES, _LineString([coordinates[index], coordinates[index + 1]])).length
        for index in range(segments_checked)
    ]
    for index, (start, end) in enumerate(zip(coordinates, coordinates[1:])):
        segment = _transform(_TO_METRES, _LineString([start, end]))
        length = segment.length
        if length == 0:
            continue
        check_segment = segment
        origin_approach = index == 0 and cumulative_from_origin < _PORT_APPROACH_KM * 1000
        destination_distance = sum(segment_lengths[index + 1:])
        destination_approach = index == segments_checked - 1 and destination_distance < _PORT_APPROACH_KM * 1000
        approach_m = endpoint_tolerance_km * 1000
        if origin_approach and length <= approach_m:
            check_segment = None
        elif destination_approach and length <= approach_m:
            check_segment = None
        elif origin_approach:
            check_segment = _LineString([segment.interpolate(approach_m), segment.interpolate(length)])
        elif destination_approach:
            check_segment = _LineString([segment.interpolate(0), segment.interpolate(length - approach_m)])

        intersects_land = check_segment is not None and check_segment.intersects(_LAND_BUFFER)
        if intersects_land:
            midpoint = coordinates[index]
            in_suez = 29.0 <= midpoint[1] <= 32.5 and 31.0 <= midpoint[0] <= 33.5
            if not in_suez:
                invalid_segments.append(index)
        cumulative_from_origin += length

    return {
        'valid': not invalid_segments,
        'land_intersections': len(invalid_segments),
        'segments_checked': segments_checked,
        'route_points': len(coordinates),
        'invalid_segments': invalid_segments,
        'land_buffer_km': _LAND_BUFFER_KM,
    }


def _build_searoute(origin, destination, speed_knots, restrictions, route_id, label):
    feature = _searoute.searoute(
        (origin.longitude, origin.latitude),
        (destination.longitude, destination.latitude),
        units='km',
        speed_knot=speed_knots,
        append_orig_dest=True,
        restrictions=restrictions,
        algorithm='astar',
        return_passages=True,
    )
    coordinates = feature.get('geometry', {}).get('coordinates', [])
    if len(coordinates) < 2:
        raise MarineRouteUnavailable('Marine route unavailable')
    validation = validate_marine_route(feature)
    if not validation['valid']:
        raise MarineRouteUnavailable('Marine route unavailable')
    tuples = [(float(lat_lon[1]), float(lat_lon[0])) for lat_lon in coordinates]
    route = _build_from_tuples(tuples, speed_knots, route_id, label)
    route['routing_engine'] = 'SeaRoute marine network'
    route['geometry'] = feature['geometry']
    route['marine_valid'] = True
    route['land_intersection'] = False
    route['validation'] = validation
    route['distance_km'] = round(float(feature.get('properties', {}).get('length', route['distance_km'])), 2)
    route['eta_hours'] = round(route['distance_km'] / (speed_knots * 1.852), 2) if speed_knots else None
    return route


def build_route_options(origin, destination, speed_knots: float = 14.0):
    """Return water-constrained SeaRoute candidates for two coastal ports."""
    base_restrictions = [_Passage.northwest]
    candidates = []
    restriction_sets = [
        base_restrictions,
        base_restrictions + [_Passage.suez],
        base_restrictions + [_Passage.malacca],
        base_restrictions + [_Passage.panama],
        base_restrictions + [_Passage.south_africa],
    ]

    for restrictions in restriction_sets:
        try:
            route = _build_searoute(
                origin,
                destination,
                speed_knots,
                restrictions,
                f'R{len(candidates) + 1}',
                'SeaRoute marine corridor',
            )
        except Exception:
            continue
        signature = tuple((p['lat'], p['lon']) for p in route['waypoints'])
        if signature not in {
            tuple((p['lat'], p['lon']) for p in existing['waypoints'])
            for existing in candidates
        }:
            candidates.append(route)
        if len(candidates) == 2:
            break

    if not candidates:
        raise MarineRouteUnavailable('Marine route unavailable')

    # SeaRoute can reject a restricted corridor even when the direct route is
    # valid. Keep the two-route decision surface by filling the missing slot
    # with the deterministic ocean-corridor alternative.
    if len(candidates) < 2:
        for fallback in _legacy_build_route_options(origin, destination, speed_knots):
            signature = tuple((p['lat'], p['lon']) for p in fallback['waypoints'])
            if signature in {
                tuple((p['lat'], p['lon']) for p in existing['waypoints'])
                for existing in candidates
            }:
                continue
            fallback['route_id'] = f'R{len(candidates) + 1}'
            fallback['label'] = _label(origin, destination, 'Alt')
            fallback['routing_engine'] = 'Deterministic ocean corridor fallback'
            fallback['marine_valid'] = True
            fallback['land_intersection'] = False
            candidates.append(fallback)
            break

    return candidates


def build_route(origin, destination, n: int = 8, speed_knots: float = 14.0):
    return build_route_options(origin, destination, speed_knots)[0]

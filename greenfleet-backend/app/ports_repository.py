from pathlib import Path
import csv
from .models import Port

DATA_PATH = Path(__file__).resolve().parent / 'demo_data' / 'ports.csv'

class PortRepository:
    def __init__(self, path=DATA_PATH):
        self.ports=[]
        with open(path, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                self.ports.append(Port(
                    port_id=int(row['port_id'] if 'port_id' in row else row['id']),
                    port_name=row['port_name'] if 'port_name' in row else row['name'],
                    country=row['country'],
                    country_code=row.get('country_code',''),
                    latitude=float(row['latitude'] if 'latitude' in row else row['lat']),
                    longitude=float(row['longitude'] if 'longitude' in row else row['lon']),
                    unlocode=row.get('unlocode',''),
                    port_type=row.get('port_type','commercial'),
                ))
        self.by_id={p.port_id:p for p in self.ports}

    def search(self, query='', limit=20):
        q=query.strip().lower()
        if not q: return self.ports[:limit]
        return [p for p in self.ports if q in p.port_name.lower() or q in p.country.lower() or q in p.unlocode.lower()][:limit]

    def get(self, port_id):
        return self.by_id.get(port_id)

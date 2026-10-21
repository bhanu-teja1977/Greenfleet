# GREENFLEET-Q — COMPLETE WEBSITE REDESIGN

## Reference-Driven UI/UX Implementation | Clean Light Theme | Production-Quality Frontend

### 1. ROLE AND OBJECTIVE

Act as a senior UI/UX designer, product designer, design systems engineer, and expert React frontend developer.

I am providing:

1. A reference image of the desired GreenFleet-Q hero section.
2. The existing GreenFleet-Q project source code.

Your task is to redesign the existing website to match the attached reference image as closely as possible, then extend the same design language consistently across the entire website.

**The attached image is the visual source of truth. Do not invent a different design direction.**

The final website should look like a professionally designed maritime technology product, not a generic AI landing page.

The design must be:

* Clean and minimal.
* Bright and predominantly light.
* Professional and trustworthy.
* Visually attractive without unnecessary decoration.
* Consistent across every section and page.
* Responsive on desktop, tablet, and mobile.
* Functional, accessible, and performant.

Do not stop after creating a plan or a hero mockup. Inspect the codebase and implement the actual website.

---

# 2. MOST IMPORTANT REQUIREMENT: MATCH THE REFERENCE

Study the attached image carefully before writing any code.

Reproduce its major visual characteristics:

* White and very light blue backgrounds.
* A slim, clean navigation bar.
* GreenFleet-Q branding at the top left.
* Navigation links centered in the header.
* A green dashboard button on the right.
* A large, bold, left-aligned hero heading.
* Dark navy headline text with emerald-green emphasis.
* Supporting text beneath the heading.
* Two horizontally aligned CTA buttons.
* Three compact capability indicators beneath the buttons.
* A large maritime image occupying the right side.
* A glowing green maritime route over the image.
* Four small, floating metric cards.
* Subtle shadows, fine borders, and rounded corners.
* Generous whitespace and balanced alignment.

Match the image's composition, proportions, typography, colors, and spacing as closely as practical.

Do not merely copy the text and produce a similar generic layout.

**The target is the same visual composition, implemented as a real website.**

Do not use the reference image as a full-page background. Recreate the interface using React components, CSS, SVG graphics, and real image assets.

Do not add new visual elements unless they improve usability or are necessary to implement the existing design.

---

# 3. REDESIGN THE ENTIRE WEBSITE IN A LIGHT THEME

The attached reference defines the desired hero appearance. Extend this light visual language throughout the complete GreenFleet-Q website.

This requirement applies to:

* Landing page.
* Navigation.
* All landing-page sections.
* Dashboard preview.
* Dashboard interface.
* Route comparison panels.
* Fuel comparison panels.
* Charts and graphs.
* Forms and input controls.
* Cards, tables, and data visualizations.
* Modals, tooltips, dropdowns, and other interface elements.
* Footer.
* Loading, empty, error, and success states.

**Do not keep the existing dark theme in the lower sections or dashboard.**

Use one consistent light theme throughout the application.

Do not introduce unrelated color palettes or switch between dark and light backgrounds arbitrarily.

A limited use of dark navy text and carefully controlled deep-blue maritime imagery is acceptable. However, the interface surfaces, cards, navigation, dashboard panels, and page backgrounds must remain predominantly light.

If a maritime image contains dark ocean water, that is acceptable because the image itself is photographic content, not a dark interface theme.

---

# 4. DESIGN SYSTEM

Create a reusable design system before implementing the individual sections.

Use CSS custom properties or the existing project's equivalent token system.

### Color palette

Start with these values:

```css
:root {
  --background: #ffffff;
  --background-soft: #f7fbfc;
  --background-blue: #eef7fa;

  --surface: #ffffff;
  --surface-muted: #f4f8fa;
  --surface-hover: #edf7f5;

  --text-primary: #10212d;
  --text-secondary: #586b79;
  --text-muted: #80909b;

  --brand-primary: #08b887;
  --brand-primary-hover: #079d74;
  --brand-light: #e5f8f1;

  --accent-cyan: #15c7c4;
  --accent-blue: #55b8dc;

  --border: #e2eaee;
  --border-strong: #cddde4;

  --shadow-soft: 0 8px 30px rgba(22, 52, 67, 0.06);
  --shadow-card: 0 12px 36px rgba(22, 52, 67, 0.08);

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --content-width: 1360px;
}
```

Adjust individual values if needed to achieve a closer match to the attached image.

### Color rules

* White should be the dominant interface color.
* Use light blue sparingly to separate sections.
* Use emerald green for primary actions and highlighted text.
* Use cyan for small maritime details and secondary highlights.
* Use dark navy for headings and important text.
* Use muted gray-blue for body text.
* Use fine borders instead of heavy outlines.
* Use shadows sparingly.

Avoid:

* Large black backgrounds.
* Dark dashboard panels.
* Excessive gradients.
* Neon outlines around every card.
* Multiple competing accent colors.
* Oversaturated green surfaces.
* Unnecessary glassmorphism.

The overall result should feel calm, premium, and trustworthy.

### Typography

Use a clean sans-serif font.

Preferred options:

* Manrope.
* Inter.
* Plus Jakarta Sans.

Use one primary font consistently across the website.

Typography should follow a deliberate hierarchy:

* Hero heading: large, bold, tightly spaced.
* Section headings: strong but smaller than the hero.
* Body text: comfortable to read.
* Labels: compact and understated.
* Metric values: prominent but not oversized.

Use responsive font sizes with `clamp()`.

Avoid excessive letter spacing, unusually thin text, cramped line heights, and inconsistent font weights.

### Layout

* Use a centered content container.
* Maximum width: approximately 1360px.
* Maintain consistent page gutters.
* Use CSS Grid and Flexbox.
* Maintain a consistent spacing system.
* Use responsive layouts instead of fixed positioning wherever possible.
* Avoid horizontal overflow.
* Align section headings and content to a common grid.

---

# 5. NAVIGATION — REPRODUCE THE REFERENCE

Create a slim, white navigation bar with a subtle bottom border.

### Left side

Create the GreenFleet-Q logo:

* Rounded-square GF monogram.
* Thin emerald border.
* Green monogram text.
* GreenFleet-Q wordmark.
* Dark navy wordmark text.
* Emerald Q accent.

Implement the logo with HTML/CSS or inline SVG if no suitable logo asset already exists.

### Center navigation

Include:

* Product
* Capabilities
* How It Works
* About

Use clean typography and restrained hover states.

### Right side

Include:

* A small theme/settings icon only if it has a meaningful purpose.
* A green `Launch Dashboard ↗` button.

Use the existing dashboard route.

Do not invent a new route or replace the existing dashboard.

### Behavior

* Sticky navigation.
* Subtle border or shadow when appropriate.
* Smooth anchor navigation.
* Accessible keyboard focus.
* Responsive mobile menu.
* Proper mobile spacing.
* No layout shifts.

Keep the navigation visually quiet. The hero should remain the primary focal point.

---

# 6. HERO SECTION — RECREATE THE ATTACHED IMAGE

This is the most important section of the project.

Implement it before moving to the rest of the website.

## Layout

Use a wide, two-column layout similar to the reference.

The left column contains the messaging and CTA buttons.

The right column contains the maritime visual and floating metric cards.

At a large desktop viewport, aim for approximately:

* Left column: 43–46%.
* Right column: 54–57%.

Use responsive spacing and alignment.

The hero should have enough vertical breathing room without pushing the content unnecessarily far below the navigation.

### Eyebrow

Display:

`AI + QUANTUM-INSPIRED MARITIME DECISION SUPPORT`

Style:

* Small uppercase text.
* Emerald-green color.
* Increased letter spacing.
* Short horizontal green line before the text.

### Main headline

Use this exact text:

**Plan smarter
voyages.
Sail greener.**

Style:

* Large, bold typography.
* Dark navy for the first two lines.
* Emerald green for `Sail greener.`
* Tight but readable line height.
* Slightly negative letter spacing.
* Strong visual weight.

Match the reference's line breaks and visual proportions on desktop.

Do not force these line breaks on narrow screens if they cause overflow.

### Supporting paragraph

Use this exact copy:

"Predict fuel consumption, compare cleaner fuels, optimize routes and speed, and allocate your fleet with AI-powered intelligence."

Use muted blue-gray text.

Maintain a readable line length and comfortable spacing beneath the heading.

### Primary CTA

Text:

`Explore GreenFleet-Q →`

Appearance:

* Emerald-green background.
* White text.
* Rounded pill or rounded rectangle, matching the reference.
* Comfortable padding.
* Clear hover state.
* Subtle shadow if appropriate.

Action: smoothly scroll to the platform capabilities section.

### Secondary CTA

Text:

`Watch Demo`

Appearance:

* White or transparent background.
* Thin blue-gray border.
* Dark navy text.
* Small play icon.
* Rounded shape.

If a real demo video exists, connect the button to it.

If no video exists, do not create a broken button or a fake video player. Either implement a useful, lightweight product walkthrough using the existing application or omit the interaction until a real demo is available.

### Capability indicators

Below the CTA buttons, create three compact indicators separated by subtle vertical dividers:

1. Fuel-aware ML predictions.
2. QPSO speed + fuel optimization.
3. Marine & weather context.

Use small outline icons, compact labels, and muted supporting text.

Do not turn these indicators into large cards.

### Scroll indicator

Include a minimal `Scroll to explore` indicator at the lower left if the layout has sufficient room.

It should be subtle and should not distract from the primary content.

---

# 7. HERO IMAGE — SHIP AND ROUTE VISUALIZATION

Recreate the right-side maritime visual as closely as possible to the reference.

The composition should contain:

* A cargo vessel in a beautiful ocean setting.
* A visible wake or trail.
* A calm blue ocean palette.
* A distant coastline or subtle mountains.
* A route line drawn across the image.
* Small route nodes.
* Clearly styled origin and destination markers.
* A few floating data cards.

### Asset sourcing

Prefer a suitable, high-quality, openly licensed maritime image.

Possible sources:

* Unsplash.
* Wikimedia Commons.
* Other reputable sources with verified reuse permissions.

Verify the relevant asset license before using the image.

Prefer a local optimized asset stored in the frontend's public assets directory rather than relying on an unstable external image URL.

Do not copy another company's proprietary illustrations.

Do not use a random stock image that does not resemble the reference.

If an appropriate image cannot be found, use a suitable existing project asset or create a restrained SVG-based route visualization over a verified maritime photograph.

### Image treatment

* Blend the image naturally into the white page.
* Use subtle gradients only where needed.
* Keep the ship visible.
* Avoid excessively dark overlays.
* Avoid oversaturation.
* Use a clean, restrained border.
* Keep the image composition spacious.

The visual should feel integrated into the page, not like a separate dark rectangular dashboard.

### Route visualization

Use an inline SVG overlay.

Draw:

* A curved emerald route.
* A restrained cyan secondary route or dashed line.
* A few circular route nodes.
* A highlighted vessel or position marker.
* Origin and destination markers.

Add a very subtle route-drawing animation if it improves the presentation.

Keep the route clear and elegant.

Do not make the route so bright that it overwhelms the ship.

### Origin and destination

Where appropriate, display:

`MUMBAI`

and

`SINGAPORE`

Treat these as labels for the prototype's demonstration route.

Do not imply that the route is a certified navigation route.

---

# 8. FLOATING METRIC CARDS

Create four compact white cards over the maritime image.

Match the reference's positioning and proportions as closely as practical.

### Card 1

Title: `Fuel efficiency`

Value: `+18.4%`

Supporting text: `vs baseline (est.)`

### Card 2

Title: `CO₂ reduction`

Value: `−12.8%`

Supporting text: `operational estimate`

### Card 3

Title: `Optimal speed`

Value: `14.2 knots`

Supporting text: `QPSO selected`

### Card 4

Title: `Route candidates`

Value: `2 evaluated`

Supporting text: `cleaner + faster routes`

### Styling

* White or lightly translucent white surface.
* Fine border.
* Subtle shadow.
* Rounded corners.
* Small outline icon.
* Dark navy text.
* Emerald or cyan highlights.
* Comfortable internal spacing.

Use small supporting charts or indicators only when they improve readability.

Do not make the cards excessively large.

Ensure the cards do not obscure the ship or route.

On mobile, reposition the cards or display their information in a compact row beneath the image.

### Accuracy requirement

These values are illustrative unless verified by the actual application.

Do not present them as confirmed operational results.

Use appropriate labels such as `Illustrative`, `Demo`, or `Estimated` where necessary.

Never invent real-world fuel savings, emissions reductions, or performance guarantees.

---

# 9. REST OF THE LANDING PAGE

After the hero is implemented and visually verified, redesign every remaining landing-page section using the same light design system.

Do not leave the lower sections in their existing dark theme.

Use the following structure unless the existing application requires a different functional arrangement.

## Section A — Platform introduction

Eyebrow:

`THE GREENFLEET-Q PLATFORM`

Heading:

**One platform for smarter maritime decisions.**

Description:

"Combine AI, optimization, and marine data to evaluate fuel choices, compare route alternatives, and plan more efficient voyages."

Create a balanced two-column section.

Use:

* White background.
* A clean product visual.
* Minimal supporting text.
* Generous spacing.

## Section B — Capabilities

Eyebrow:

`INTELLIGENCE THAT MOVES WITH YOUR FLEET`

Heading:

**End-to-end capabilities for a greener tomorrow.**

Create four clean capability cards.

### Fuel Intelligence

"Predict fuel consumption and compare HFO, LNG, methanol, hydrogen, and ammonia under consistent voyage conditions."

### Marine Routing

"Evaluate prototype route alternatives using marine conditions, weather forecasts, and environmental penalties."

### AI Optimization

"Use quantum-inspired optimization to evaluate speed and fuel choices while balancing economic, environmental, and schedule considerations."

### Fleet Allocation

"Evaluate cargo distribution across prototype vessel capacities to understand utilization and unused capacity."

Use restrained green icons, subtle borders, white surfaces, and small hover transitions.

Do not add large decorative gradients to every card.

## Section C — How It Works

Eyebrow:

`HOW IT WORKS`

Heading:

**From voyage data to an optimized decision.**

Create a five-step workflow:

1. Voyage Inputs.
2. Fuel Prediction.
3. Speed + Fuel Optimization.
4. Route Evaluation.
5. Recommended Decision.

Use a horizontal timeline on desktop and a vertical timeline on mobile.

Keep the steps short and clear.

Use a light background and subtle connecting lines.

## Section D — Dashboard preview

Eyebrow:

`SEE THE DECISION BEFORE YOU SAIL`

Heading:

**Your voyage intelligence, in one view.**

Description:

"Compare fuels, review route alternatives, inspect marine conditions, and understand optimization recommendations in one workspace."

Show a preview of the actual dashboard.

Use the existing dashboard components if practical.

Otherwise, create a lightweight HTML/CSS preview that accurately represents the application.

Use:

* White panels.
* Light gray borders.
* Dark navy text.
* Green chart highlights.
* Clean charts.
* Subtle map colors.

The dashboard preview must follow the light theme.

Do not create a fake screenshot and pass it off as the actual interface.

## Section E — Fuel and decision metrics

Heading:

**Better information for better voyage decisions.**

Display the five supported fuels:

* HFO.
* LNG.
* Methanol.
* Hydrogen.
* Ammonia.

Use compact, well-designed metric cards to explain the available decision factors:

* Fuel consumption.
* Fuel-cost index.
* Operational CO₂ estimate.
* Route comparison.
* Selected speed.
* Fleet utilization.

Clearly distinguish prototype estimates from real operational measurements.

Do not invent additional features or unsupported environmental claims.

## Section F — Final CTA

Heading:

**Make every voyage a smarter, greener decision.**

Description:

"Turn voyage data into actionable insights with AI-powered maritime planning."

Primary CTA:

`Launch GreenFleet-Q →`

Use a light blue or pale mint background, subtle decorative linework, and generous spacing.

Avoid a dark full-width CTA section.

## Section G — Footer

Create a clean, light footer containing:

* GreenFleet-Q logo.
* Short product description.
* Product links.
* Capabilities.
* How It Works.
* About.
* GitHub link if the actual repository URL is available.
* Copyright information.

Use a white or very light background and a thin top border.

Do not invent external URLs or social profiles.

---

# 10. THE DASHBOARD MUST ALSO USE THE LIGHT THEME

This is a mandatory requirement.

Inspect the existing dashboard and update its styling to use the same design system.

Preserve the current functionality and data flow.

Update:

* Page background.
* Sidebar.
* Header.
* Cards.
* Input fields.
* Dropdowns.
* Route panels.
* Map containers.
* Fuel comparison tables.
* Charts.
* Metric cards.
* Scenario controls.
* Fleet allocation table.
* Tooltips.
* Modals.
* Empty states.
* Error states.
* Loading states.

### Dashboard visual direction

Use:

* White backgrounds.
* Pale blue-gray page surfaces.
* White cards.
* Subtle gray-blue borders.
* Emerald-green primary actions.
* Dark navy text.
* Muted secondary labels.
* Consistent rounded corners.
* Clean tables and charts.

The dashboard must feel like the same product as the landing page.

Do not leave individual components with black or dark navy interface backgrounds.

For maps, preserve useful geographic contrast. Map tiles themselves may contain darker ocean colors, but surrounding UI panels must remain light.

For charts, use restrained green and blue tones with legible labels and subtle grid lines.

Avoid excessive gradients, glow effects, and unnecessary animation.

If the application has a global dark-theme implementation, remove or disable it by default so the delivered experience is consistently light.

---

# 11. OPEN-SOURCE IMPLEMENTATION

Use the existing React + Vite frontend.

Prefer open-source libraries and existing project dependencies.

Potential tools:

* React for the component architecture.
* Vite for the frontend build.
* CSS Modules or the existing CSS solution for styling.
* Lucide React for outline icons.
* Recharts for charts.
* Leaflet and React Leaflet for maps.
* Motion for React for restrained animations, if needed.
* Manrope, Inter, or another appropriately licensed open-source font.

Official resources:

* React: https://react.dev/
* Vite: https://vite.dev/
* Lucide: https://lucide.dev/
* Recharts: https://recharts.org/
* Leaflet: https://leafletjs.com/
* Motion: https://motion.dev/
* Google Fonts: https://fonts.google.com/

Use only the dependencies that are actually needed.

Verify package compatibility and licensing before installing anything.

Do not introduce paid UI kits, paid icon packages, or unnecessary external services.

Do not replace the backend or machine-learning implementation.

---

# 12. PRESERVE EXISTING PROJECT FUNCTIONALITY

Before making changes, inspect the existing repository.

The project includes:

* A React + Vite frontend.
* A FastAPI backend.
* A Random Forest fuel-consumption model.
* Fuel-choice comparisons.
* Open-Meteo marine and weather integrations.
* Two prototype route alternatives.
* Baseline speed-grid optimization.
* QPSO speed and fuel-choice optimization.
* Fleet allocation.
* Scenario analysis.
* Existing dashboard visualizations.

The main product focus is fuel consumption and fuel-choice comparison, with routing and fleet allocation supporting the final decision.

Preserve:

* Existing API calls.
* API response handling.
* Application routes.
* Dashboard functionality.
* Model integration.
* Fuel comparison logic.
* Optimization behavior.
* Existing working features.

Do not replace working features with static mock data.

Do not rewrite the backend unnecessarily.

Do not remove files or dependencies without understanding their purpose.

If the project uses CSS variables or shared theme classes, update them systematically rather than adding conflicting styles.

---

# 13. CLEAN UI/UX RULES — AVOID GENERIC AI DESIGN

Follow these rules throughout the implementation.

### DO

* Use clear visual hierarchy.
* Use deliberate whitespace.
* Keep headings concise.
* Make cards visually consistent.
* Use restrained borders and shadows.
* Use a coherent icon style.
* Maintain consistent typography.
* Use real product functionality where available.
* Keep animations subtle.
* Ensure every CTA has a real destination.
* Use consistent spacing across sections.
* Prioritize content readability.
* Use responsive layouts.
* Keep decorative elements purposeful.

### DO NOT

* Add random glowing orbs.
* Add unnecessary floating particles.
* Cover every section in gradients.
* Use glassmorphism on every card.
* Add oversized decorative icons.
* Add unnecessary pill-shaped labels everywhere.
* Use different border radii for every component.
* Add meaningless animations.
* Use huge empty sections without purpose.
* Add fake testimonials.
* Invent customer logos.
* Invent performance claims.
* Invent integrations.
* Invent external links.
* Use generic AI-generated illustrations when real product visuals are more appropriate.
* Add fake buttons that do nothing.
* Make the page resemble a cryptocurrency or gaming interface.
* Retain dark sections just to create contrast.

**The goal is a professional product website, not a collection of design effects.**

---

# 14. RESPONSIVENESS

Implement and verify the website at these viewport sizes:

* 1440 × 900.
* 1280 × 800.
* 1024 × 768.
* 768 × 1024.
* 390 × 844.
* 360 × 800.

On desktop:

* Preserve the two-column hero.
* Keep the ship visual large and balanced.
* Prevent metric cards from overlapping the main text.

On tablet:

* Adjust column proportions.
* Reduce heading size.
* Simplify overlays where needed.

On mobile:

* Stack the hero text above the maritime image.
* Keep the headline readable.
* Place CTA buttons appropriately.
* Reduce or reposition floating metric cards.
* Use a mobile navigation menu.
* Stack capability cards.
* Convert the workflow to a vertical timeline.
* Keep charts and tables usable.
* Prevent horizontal scrolling.

Do not simply shrink the desktop layout. Recompose it for smaller screens.

---

# 15. ACCESSIBILITY AND PERFORMANCE

Implement:

* Semantic HTML.
* Keyboard-accessible navigation.
* Visible focus states.
* Appropriate image alt text.
* Accessible labels for icon buttons.
* Adequate text contrast.
* Reduced-motion support.
* Optimized images.
* Lazy loading for below-the-fold images.
* Efficient component rendering.
* Minimal dependencies.
* Proper image dimensions to reduce layout shifts.

The landing page should render even if the backend is unavailable.

Do not run machine-learning inference or expensive optimization just to render the hero.

Keep decorative hero data separate from live application data.

Clearly label illustrative values.

---

# 16. IMPLEMENTATION WORKFLOW

Follow this sequence.

### Step 1 — Audit the codebase

Inspect the frontend structure, current styles, routes, components, dependencies, and dashboard.

Identify how the current theme is implemented.

### Step 2 — Build the design system

Create reusable colors, typography, spacing, buttons, cards, and other shared elements.

### Step 3 — Implement the hero

Match the reference image closely.

Prioritize:

* Navigation alignment.
* Headline size and line breaks.
* CTA proportions.
* Maritime image composition.
* Route overlay.
* Metric card placement.
* Whitespace.
* Light background treatment.

### Step 4 — Verify the hero visually

Run the application and inspect the rendered page.

Compare it with the reference.

Correct any obvious differences in alignment, spacing, typography, colors, and proportions before continuing.

### Step 5 — Implement the remaining landing page

Use the same design system throughout all sections.

### Step 6 — Update the dashboard

Convert all dashboard surfaces and controls to the light theme without breaking functionality.

### Step 7 — Test

Run the existing build and relevant tests.

Check:

* Compilation errors.
* Broken imports.
* Incorrect routes.
* Missing assets.
* Console errors.
* Horizontal overflow.
* Mobile layout.
* Dark-theme remnants.
* Inaccessible controls.
* Broken interactions.

Use browser-based visual verification if available.

### Step 8 — Final polish

Remove unnecessary decoration.

Refine the page until it feels cohesive, clean, balanced, and professionally designed.

---

# 17. DEFINITION OF DONE

The work is complete only when:

1. The hero closely matches the attached reference.
2. The entire website uses a consistent light theme.
3. The dashboard also uses the light theme.
4. All major sections are implemented.
5. The visual hierarchy is clean and consistent.
6. No unnecessary AI-style decoration remains.
7. Existing application functionality is preserved.
8. All CTAs and navigation links work.
9. The layout works on desktop, tablet, and mobile.
10. Open-source libraries and properly licensed assets are used.
11. The frontend builds successfully.
12. Any remaining limitations are documented accurately.

## FINAL DIRECTIVE

Begin by inspecting the existing codebase and the attached image.

Then implement the complete redesign directly in the existing project.

Do not stop at a plan, design description, or sample component.

**Match the reference image closely, use a light color palette across every page, and prioritize clean UI/UX over decorative effects.**

The final result should feel like a premium, professionally designed maritime intelligence product: bright, spacious, elegant, trustworthy, and functional.

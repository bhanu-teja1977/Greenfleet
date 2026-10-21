Act as a senior UI/UX designer and React frontend engineer. Refine the existing GreenFleet-Q hero section to match the attached clean reference image.

Do not rebuild the application from scratch. Inspect the existing code and make targeted changes.

## 1. Fix the hero composition

Maintain the two-column layout:

* Left: headline, supporting text, CTA buttons, and capability indicators.
* Right: ship animation, one restrained route visualization, and four metric cards.

Use a white background with subtle pale-blue atmospheric shading.

Keep the content centered inside a consistent maximum-width container.

Use generous whitespace and ensure both columns feel balanced.

## 2. Fix the ship animation

Use the existing Lottie ship animation:

https://lottiefiles.com/free-animation/ship-4aeAFafS9q

Inspect the actual animation asset and its background before modifying the layout.

* Remove the existing oversized, distracting ship illustration.
* Do not display both a static ship image and the Lottie animation.
* Preserve the animation's aspect ratio.
* Scale the ship proportionally.
* Keep the vessel centered within the right-side visual area.
* Avoid clipping the vessel or stretching the animation.
* If the animation has a solid background, use a compatible light visual container rather than hiding the background with arbitrary CSS.
* If a transparent version is available, use it to blend the ship naturally into the page.

The ship should be the primary visual element, but it should not dominate the entire screen.

## 3. Simplify the route visualization

Retain one elegant emerald-green route curve with a subtle cyan dashed companion line.

Use only a few small route nodes.

Display compact origin and destination labels:

* MUMBAI (INBOM)
* SINGAPORE (SGSIN)

Position the route behind the ship where appropriate.

Do not add multiple overlapping paths, excessive glow, floating particles, decorative clouds, or unrelated map graphics.

Ensure the route does not obscure the ship or compete with the headline.

## 4. Refine the metric cards

Keep exactly four cards:

**Fuel efficiency**
+18.4%
vs baseline (est.)

**CO₂ reduction**
−12.8%
operational estimate

**Optimal speed**
14.2 knots
QPSO selected

**Route candidates**
2 evaluated
cleaner + faster routes

These are illustrative values unless populated with verified application results.

Style the cards with white backgrounds, thin blue-gray borders, subtle shadows, dark navy typography, and small emerald icons.

Use consistent dimensions, padding, typography, and corner radii.

Position the cards around the ship without covering the vessel.

Do not place all four cards at arbitrary fixed coordinates. Use a responsive layout that adapts to the available space.

On mobile, place the cards beneath the ship in a compact two-column grid.

## 5. Refine the left column

Preserve the existing content:

Eyebrow:
AI + QUANTUM-INSPIRED MARITIME DECISION SUPPORT

Headline:
Plan smarter
voyages.
Sail greener.

Supporting text:
Predict fuel consumption, compare cleaner fuels, optimize routes and speed, and allocate your fleet with AI-powered intelligence.

Buttons:
Explore GreenFleet-Q →
Watch Demo

Capabilities:

* Fuel-aware ML predictions.
* QPSO speed + fuel optimization.
* Marine & weather context.

Use dark navy for the first two headline lines and emerald green for “Sail greener.”

Keep the heading bold, with tight but readable line spacing.

Ensure the paragraph has comfortable line height and a readable width.

Keep the primary CTA green and the secondary CTA white with a subtle border.

Maintain the horizontal capability indicators beneath the buttons.

Do not introduce additional badges or decorative elements.

## 6. Improve navigation

Use a clean white navigation bar with a thin bottom border.

Left:

* GF monogram.
* GreenFleet-Q wordmark.

Center:

* Product.
* Capabilities.
* How It Works.
* About.

Right:

* Launch Dashboard button.

Align everything vertically and use a centered content container.

Keep the navigation height compact.

Use subtle hover states and an accessible mobile menu.

Do not add excessive shadows, glass effects, or animated backgrounds.

Ensure the dashboard button opens the existing dashboard route.

## 7. Use this design system

```css
:root {
  --background: #ffffff;
  --background-soft: #f7fbfc;
  --background-blue: #eef7fa;

  --text-primary: #10212d;
  --text-secondary: #586b79;
  --text-muted: #80909b;

  --brand-primary: #08b887;
  --brand-hover: #079d74;
  --brand-light: #e5f8f1;

  --accent-cyan: #15c7c4;

  --border: #e2eaee;
  --border-strong: #cddde4;
}
```

Use CSS Grid and Flexbox rather than excessive absolute positioning.

Avoid hardcoded coordinates that work only at one screen size.

## 8. Responsive behavior

Test at desktop, tablet, and mobile widths.

Desktop:

* Two-column layout.
* Large but balanced ship visual.
* Four carefully positioned metric cards.

Tablet:

* Reduce heading size.
* Reduce card dimensions.
* Adjust column proportions.

Mobile:

* Headline and CTA first.
* Ship animation beneath the text.
* Metrics in a compact grid.
* No overlapping cards.
* No horizontal scrolling.

Respect reduced-motion preferences.

## 9. Verify the actual result

Run the existing application and inspect the rendered page.

Compare it with the attached clean reference image.

Correct:

* Ship size and alignment.
* Route placement.
* Card overlap.
* Headline wrapping.
* Navigation spacing.
* Background transitions.
* Excessive whitespace.
* Mobile responsiveness.

Preserve all existing dashboard, backend, and API functionality.

Do not replace working application features with mock data.

Do not stop after providing a plan. Implement the changes directly in the existing project.

**Final objective:** A clean, light, premium maritime SaaS hero with one well-integrated ship animation, one elegant route line, four restrained metric cards, balanced typography, and a polished navigation bar. Every visual element must have a clear purpose.

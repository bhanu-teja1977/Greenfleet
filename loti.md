# GREENFLEET-Q — HERO ANIMATION & NAVIGATION REFINEMENT

## ROLE

Act as a senior product designer, UI/UX engineer, and expert React developer specializing in premium SaaS websites, animation integration, and responsive design.

Your task is to refine the existing GreenFleet-Q website using the attached screenshot as the visual reference.

The website already has a light theme and a two-column hero layout. The objective is to improve the existing implementation, not rebuild it from scratch.

**Primary goals:**

1. Replace the hero's static ship photograph with the provided Lottie ship animation.
2. Recompose the hero visual so the animation feels naturally integrated into the page.
3. Preserve the maritime route visualization and floating metric cards.
4. Redesign the navigation to be more polished, balanced, and professional.
5. Maintain a consistent, clean light theme across the entire website.
6. Preserve all existing dashboard and backend functionality.

Avoid unnecessary decoration, excessive animations, generic AI-generated aesthetics, and visual clutter.

---

## 1. FIRST: INSPECT THE EXISTING CODEBASE

Before changing anything, inspect the existing React + Vite project.

Identify:

* The current landing-page component.
* The hero section and its layout.
* The existing ship image and its CSS.
* The route visualization and SVG overlays.
* The floating metric cards.
* The navigation component.
* The existing typography and color variables.
* The dashboard route and navigation configuration.
* The dependencies already installed.

Reuse existing components and styling wherever appropriate.

Do not rewrite the entire application.

Do not replace functioning application logic with mock data.

Do not remove existing route calculations, dashboard integrations, or backend API calls.

Make targeted changes and keep the code maintainable.

---

## 2. LOTTIE ANIMATION — REPLACE THE SHIP IMAGE

Use this exact animation as the intended visual asset:

https://lottiefiles.com/free-animation/ship-4aeAFafS9q

### Important

Inspect the animation's actual content, dimensions, aspect ratio, background, motion, and available download or embed options before integrating it.

Do not assume its background is transparent or that it depicts the exact same vessel as the current photograph.

If the LottieFiles page provides a downloadable animation file and its license permits the intended use, prefer downloading the animation and storing it locally in the project.

For example:

`public/animations/greenfleet-ship.json`

Use the actual downloaded filename and location.

If the animation is available only through an official supported embed, evaluate whether that embed is suitable for the existing application. Prefer a locally hosted animation when licensing and file availability allow it.

Do not invent a JSON animation file or use a nonexistent asset path.

### Preferred implementation

Use the existing animation library if the project already has one.

Otherwise, consider the open-source `lottie-react` package.

Official resources:

* LottieFiles animation: https://lottiefiles.com/free-animation/ship-4aeAFafS9q
* Lottie React: https://github.com/Gamote/lottie-react

Check the current package compatibility before installing anything.

Create a reusable React component if appropriate:

`ShipAnimation.jsx`

The component should:

* Load the actual animation.
* Preserve its aspect ratio.
* Scale responsively.
* Avoid unwanted cropping.
* Avoid visible background rectangles.
* Avoid unnecessary loading delays.
* Provide an appropriate loading fallback.
* Respect reduced-motion preferences.
* Clean up correctly when unmounted.

If the animation has a solid background that cannot blend with the page, do not simply place it over the photograph or hide parts of it with arbitrary CSS.

Instead, determine whether a transparent version is available or whether the animation can be integrated using a clean, contained visual panel.

**Do not recreate the existing ship photograph with another photograph. The objective is to use the supplied Lottie animation.**

---

## 3. HERO LAYOUT — KEEP THE EXISTING DESIGN DIRECTION

Retain the current two-column composition.

### Left column

Keep the existing content:

Eyebrow:

`AI + QUANTUM-INSPIRED MARITIME DECISION SUPPORT`

Headline:

**Plan smarter
voyages.
Sail greener.**

Supporting text:

"Predict fuel consumption, compare cleaner fuels, optimize routes and speed, and allocate your fleet with AI-powered intelligence."

Primary CTA:

`Explore GreenFleet-Q →`

Secondary CTA:

`Watch Demo`

Capability indicators:

* Fuel-aware ML predictions.
* QPSO speed + fuel optimization.
* Marine & weather context.

Keep the headline dark navy, with `Sail greener.` highlighted in emerald green.

Preserve the current clean typography, but adjust its size and spacing if the animation changes the overall balance.

Do not rewrite the content or add extra badges without a clear reason.

### Right column

Replace the static photograph with the Lottie ship animation.

The animation should become the main visual element in this column.

Do not stretch the animation to fill the entire container.

Do not distort its aspect ratio.

Do not automatically place a large white rectangle behind it if the animation already has a transparent background.

Use the smallest necessary visual container.

The result should feel like a carefully composed maritime product illustration, not an animation embedded inside an unrelated card.

### Desktop proportions

Use the following as starting points:

* Left column: approximately 42–45%.
* Right column: approximately 55–58%.

Use CSS Grid with flexible column sizing.

Maintain sufficient spacing between the headline and the animated vessel.

Ensure the hero content is vertically balanced.

Do not use fixed pixel positioning that breaks when the viewport changes.

---

## 4. MAKE THE SHIP ANIMATION LOOK PREMIUM

The animation should feel integrated into the website rather than like a decorative GIF.

### If the animation has a transparent background

Use it directly against the light hero background.

Add only subtle environmental details around the vessel, such as:

* A pale blue ocean-inspired gradient.
* A soft, restrained shadow beneath the vessel.
* A few faint curved route lines.
* Small route nodes.
* Minimal origin and destination indicators.

Keep these elements behind the ship.

Do not add excessive particles, glowing circles, or animated backgrounds.

### If the animation has a solid background

First determine whether the animation can be downloaded in a version with transparency.

If transparency is unavailable, use a clean light-blue visual container that complements the animation's actual background.

Do not attempt to remove the background with arbitrary blend modes that produce visible artifacts.

### Scale and alignment

* Keep the ship large enough to be recognizable.
* Center it within the available visual area.
* Preserve comfortable margins.
* Avoid collisions with metric cards.
* Avoid cropping the vessel.
* Maintain visual balance with the large left-side headline.

On desktop, the vessel should be the primary visual focus of the right column.

On mobile, display the animation below the headline and CTA buttons.

---

## 5. ROUTE VISUALIZATION

Preserve the existing maritime route concept, but make it complement the animation.

Use an inline SVG overlay or refine the existing SVG implementation.

The route should contain:

* A smooth emerald-green curve.
* A restrained cyan secondary or dashed line.
* A few small route nodes.
* A highlighted current-position marker.
* Compact origin and destination labels.

Where the route uses the prototype Mumbai-to-Singapore demonstration, retain those labels.

Avoid presenting the visualization as a certified navigation route.

### Animation

If appropriate, add a subtle SVG route-drawing animation.

Keep the movement slow and understated.

Do not animate every node independently.

Do not add multiple competing paths.

Do not let the route line cross the ship in a way that obscures its details.

If the Lottie already contains movement or route-like elements, reduce additional animation accordingly.

**The vessel animation and route line must feel like one coherent visual composition.**

---

## 6. FLOATING METRIC CARDS

Retain four compact metric cards around the animated ship.

### Card 1

Fuel efficiency
`+18.4%`
`vs baseline (est.)`

### Card 2

CO₂ reduction
`−12.8%`
`operational estimate`

### Card 3

Optimal speed
`14.2 knots`
`QPSO selected`

### Card 4

Route candidates
`2 evaluated`
`cleaner + faster routes`

These are illustrative reference values unless populated from verified application results.

Label them appropriately and do not present them as guaranteed real-world outcomes.

### Visual styling

Use:

* White backgrounds.
* Fine blue-gray borders.
* Subtle shadows.
* Dark navy text.
* Small emerald or cyan icons.
* Consistent padding.
* Consistent corner radii.
* Compact supporting labels.

### Placement

Position the cards around the animation without covering the vessel.

Avoid fixed `top`, `left`, and `right` values that only work at one viewport width.

Use a responsive layout, a positioned visual wrapper, or CSS Grid as appropriate.

At smaller desktop widths, reduce the card size or simplify the composition.

On mobile, move the metrics below the animation instead of forcing four cards to float around a narrow visual.

Do not add more cards.

---

## 7. NAVIGATION — REDESIGN IT TO FEEL MORE PROFESSIONAL

The current navigation is functional, but it should feel more deliberate and visually balanced.

Create a refined, light navigation bar inspired by premium enterprise SaaS products.

### Overall appearance

* White background.
* Thin, light-gray bottom border.
* Consistent vertical alignment.
* Comfortable horizontal padding.
* A centered maximum-width content container.
* Clean typography.
* No heavy shadows.
* No excessive glassmorphism.
* No unnecessary floating shapes.

### Left: GreenFleet-Q brand

Display:

* GF monogram inside a small rounded-square outline.
* GreenFleet-Q wordmark.
* Emerald Q accent.

Use the existing logo if one already exists.

Otherwise, implement it with HTML/CSS or inline SVG.

Ensure the logo is vertically aligned with the navigation links.

### Center: Navigation links

Use:

* Product
* Capabilities
* How It Works
* About

Style:

* Medium-weight dark navy text.
* Consistent spacing.
* Subtle hover transitions.
* A restrained emerald highlight when hovering.
* A clear focus indicator for keyboard users.

Avoid excessive letter spacing.

Avoid animated underlines that move dramatically across the screen.

If the links target sections on the landing page, use smooth scrolling and appropriate anchor offsets.

### Right: Dashboard action

Display:

`Launch Dashboard ↗`

Use:

* Emerald-green background.
* White text.
* A compact directional arrow.
* Comfortable padding.
* A moderate border radius.
* A subtle shadow.
* A restrained hover state.

The button should stand out without becoming oversized.

Connect it to the existing dashboard route.

Do not invent a new dashboard path.

### Navigation interactions

Implement:

* Sticky positioning if appropriate.
* Smooth section navigation.
* A responsive mobile menu.
* Accessible keyboard navigation.
* Visible focus states.
* Correct active states where useful.

On scroll, the navigation may acquire a very subtle shadow or background treatment.

Avoid dramatic transformations, excessive blur, or large height changes.

### Mobile navigation

On narrow screens:

* Keep the logo visible.
* Replace the full navigation with an accessible menu button.
* Keep the dashboard action available if space allows.
* Otherwise, place it prominently inside the mobile menu.
* Prevent horizontal overflow.
* Ensure the menu closes after navigation.

Do not squeeze every desktop link into a narrow header.

---

## 8. LIGHT DESIGN SYSTEM

Keep the entire website in a consistent light theme.

Use these starting colors:

```css
:root {
  --background: #ffffff;
  --background-soft: #f7fbfc;
  --background-blue: #eef7fa;

  --surface: #ffffff;
  --surface-muted: #f4f8fa;

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

Apply this design language consistently to the landing page and dashboard.

Do not introduce dark sections simply to create contrast.

The ocean and ship may naturally contain darker photographic colors, but the surrounding UI should remain light.

Use gradients only when they serve a specific purpose.

Prefer whitespace, composition, typography, and subtle borders over decorative effects.

---

## 9. ANIMATION AND INTERACTION PRINCIPLES

The website should feel alive without becoming distracting.

Use motion only when it improves the experience.

Appropriate effects:

* The ship's existing Lottie animation.
* A subtle SVG route reveal.
* Gentle button hover transitions.
* Minimal card hover effects.
* Soft section entrance transitions, if needed.

Avoid:

* Multiple competing animations.
* Floating cards that move continuously.
* Excessive pulsing.
* Parallax on every element.
* Random particles.
* Heavy WebGL effects.
* Unnecessary Three.js scenes.
* Scroll-jacking.
* Animated gradients across the entire page.

Respect `prefers-reduced-motion`.

If reduced motion is enabled, stop nonessential motion and configure the Lottie animation to use a suitable static or reduced-motion presentation where possible.

Avoid introducing a large animation framework if CSS and the existing Lottie library are sufficient.

---

## 10. RESPONSIVE DESIGN

Verify the composition at:

* 1440 × 900.
* 1280 × 800.
* 1024 × 768.
* 768 × 1024.
* 390 × 844.
* 360 × 800.

### Desktop

* Preserve the two-column hero.
* Keep the ship animation prominent.
* Position the metric cards carefully.
* Maintain alignment between the heading and visual.

### Tablet

* Reduce the headline size.
* Adjust column proportions.
* Reduce metric card sizes.
* Simplify the route overlay if necessary.

### Mobile

* Stack the hero content vertically.
* Place the headline and CTA buttons first.
* Show the ship animation below the text.
* Move metric cards into a clean responsive row or grid.
* Prevent the route overlay from becoming cluttered.
* Use an accessible mobile navigation menu.
* Avoid horizontal scrolling.

Do not merely scale down the desktop design.

Recompose the layout for each screen size.

---

## 11. PERFORMANCE AND ACCESSIBILITY

Ensure:

* The Lottie asset is loaded efficiently.
* The page does not block rendering while the animation loads.
* A graceful fallback is available.
* The animation does not cause layout shifts.
* The image or animation preserves its intended aspect ratio.
* Keyboard navigation works.
* Buttons and icons have accessible labels.
* Text contrast remains sufficient.
* Motion preferences are respected.
* Existing API calls and dashboard behavior remain intact.

Do not fetch heavy backend data just to display the hero.

Do not treat illustrative metrics as live values.

---

## 12. IMPLEMENTATION WORKFLOW

Complete the work in this order.

### Phase 1: Audit

Inspect the existing hero, navigation, route SVG, metric cards, styling, dependencies, and application routes.

### Phase 2: Integrate the Lottie

Verify the actual animation asset and license.

Integrate it into a reusable React component.

Confirm that it renders correctly against the light background.

### Phase 3: Recompose the hero

Remove the static photograph.

Integrate the animation, route line, metric cards, and origin/destination labels.

Correct alignment, spacing, and responsive behavior.

### Phase 4: Refine navigation

Implement the improved header, hover states, sticky behavior, and mobile menu.

### Phase 5: Check the entire website

Ensure the landing page and dashboard remain consistent with the light design system.

### Phase 6: Verify visually

Run the actual application.

Inspect desktop and mobile screenshots.

Compare the hero with the supplied reference.

Correct:

* Animation scale.
* Image or animation background.
* Headline wrapping.
* Hero proportions.
* Metric card positions.
* Navigation alignment.
* Excessive whitespace.
* Mobile overflow.

### Phase 7: Test

Run the existing build and relevant tests.

Check for broken imports, missing assets, console errors, broken navigation, and regression in dashboard functionality.

Do not claim tests passed unless they were actually run.

---

## 13. FINAL QUALITY STANDARD

The finished result should feel like a polished maritime technology product.

The ship animation should be the centerpiece of the hero, supported by an elegant route visualization and a small number of carefully placed metrics.

The navigation should be refined and balanced.

The light theme should remain consistent.

Every element should have a clear purpose.

**Do not add visual complexity to make the page look impressive. Make the page impressive through composition, proportion, typography, and restraint.**

Start by inspecting the existing project, then implement the changes directly in the codebase.

Do not stop after writing a plan.

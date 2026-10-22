# Requirements Document

## Introduction

A premium dark-themed developer portfolio built as a fully client-side single-page application (SPA) using React 18, TypeScript, Vite, and Tailwind CSS. The portfolio presents a developer's professional identity through ten distinct sections — Navbar, Hero, About, TechStack, Skills, Projects, Services, Testimonials, Contact, and Footer — with a cohesive dark aesthetic using neon-green accents, glassmorphism surfaces, and restrained scroll-reveal animations. All personal content lives in typed data files so the portfolio owner can update it without modifying component code. The contact form supports configurable third-party delivery via an environment variable.

---

## Glossary

- **Application**: The complete developer portfolio SPA running in the browser.
- **Navbar**: The top navigation bar component with transparent-to-glass scroll transition.
- **Hero**: The first section displaying developer name, tagline, CTA buttons, stats, and portrait.
- **About**: The section displaying developer biography, resume button, and bento-grid highlights.
- **TechStack**: The section displaying a responsive grid of technology icons and names.
- **Skills**: The section displaying skill categories with progress bars.
- **Projects**: The section displaying filterable projects in a carousel.
- **Services**: The section displaying service offerings in a bento grid.
- **Testimonials**: The section displaying approach/philosophy cards in a carousel.
- **Contact**: The section containing the contact form and contact info cards.
- **Footer**: The bottom section with navigation columns, service links, and social links.
- **GlassCard**: A reusable glassmorphism surface UI primitive.
- **ProgressBar**: An accessible progress bar UI primitive with ARIA attributes.
- **Carousel**: A reusable slide-based carousel UI component with keyboard-accessible controls.
- **SectionWrapper**: A layout primitive providing standard section padding and max-width container.
- **PersonalData**: The typed data object from `data/personal.ts` containing name, bio, contact, socials, and stats.
- **TechItem**: A typed data object representing a single technology with name and icon.
- **SkillEntry**: A typed data object representing a single skill with name, proficiency label, and 0–100 level.
- **SkillCategory**: A typed grouping of SkillEntry objects under a category title.
- **Project**: A typed data object representing a portfolio project with title, description, tags, categories, image, and optional links.
- **Service**: A typed data object representing a service offering with icon, title, and description.
- **ApproachEntry**: A typed data object representing a development philosophy card with icon, heading, and body.
- **ContactFormData**: The typed form state object with name, email, subject, and message fields.
- **ContactFormErrors**: A typed partial object mapping form field names to validation error strings.
- **FormStatus**: The discriminated union type `'idle' | 'submitting' | 'success' | 'error'` representing contact form submission state.
- **Tailwind_Config**: The `tailwind.config.ts` file serving as the single source of truth for design tokens.
- **useCarousel**: The custom React hook managing carousel index state and navigation.
- **useScrollReveal**: The custom React hook attaching IntersectionObserver to scroll-reveal elements.
- **useNavbarScroll**: The custom React hook tracking whether the page has scrolled past a pixel threshold.
- **useMediaQuery**: The custom React hook returning the current match state of a CSS media query.
- **validateForm**: The pure validation function that takes ContactFormData and returns ContactFormErrors.
- **reveal**: A CSS utility class applied to elements that should animate in on first intersection.
- **visible**: A CSS class added by useScrollReveal to elements when they first intersect the viewport.

---

## Requirements

### Requirement 1: Application Structure and Layout

**User Story:** As a visitor, I want to view a complete developer portfolio in a single page, so that I can learn about the developer without navigating between pages.

#### Acceptance Criteria

1. THE Application SHALL render all ten sections — Navbar, Hero, About, TechStack, Skills, Projects, Services, Testimonials, Contact, and Footer — on a single HTML page.
2. WHEN the portfolio loads, THE Application SHALL display all sections in the correct vertical order: Navbar, Hero, About, TechStack, Skills, Projects, Services, Testimonials, Contact, Footer.
3. THE Application SHALL operate entirely client-side with no server-side rendering and no client-side routing library.
4. THE Application SHALL load all section content from typed data files in `src/data/` without requiring changes to component code when content is updated.

---

### Requirement 2: Design System and Visual Tokens

**User Story:** As a developer maintaining the portfolio, I want a single source of truth for all visual tokens, so that I can update colors, fonts, and spacing consistently across the entire application.

#### Acceptance Criteria

1. THE Tailwind_Config SHALL define all required color tokens: `bg-primary` (#050605), `bg-secondary` (#0A0C0A), `bg-card` (#111411), `bg-elevated` (#151A15), `green-primary` (#7CFF6B), `green-secondary` (#4ADE80), `text-primary` (#F5F7F4), `text-secondary` (#A1A8A0), `text-muted` (#707770), `border-subtle` (rgba(255,255,255,0.10)), and `border-green` (rgba(124,255,107,0.25)).
2. THE Tailwind_Config SHALL define `Space Grotesk` as the `heading` font family and `Inter` as the `body` font family.
3. THE Tailwind_Config SHALL define responsive font sizes using `clamp()` for the `hero` (clamp(56px, 6vw, 72px)), `section` (clamp(40px, 4vw, 48px)), and `card` (clamp(18px, 2vw, 24px)) size tokens.
4. THE Application SHALL import Space Grotesk and Inter from Google Fonts with `display=swap` to prevent flash of invisible text.
5. WHERE `prefers-reduced-motion: reduce` is set, THE Application SHALL reduce all CSS animation and transition durations to 0.01ms and disable smooth scroll behavior.

---

### Requirement 3: Navbar Component

**User Story:** As a visitor, I want a navigation bar that adapts its appearance as I scroll and provides a mobile-friendly menu, so that I can navigate to any section easily on any device.

#### Acceptance Criteria

1. WHEN the page scroll position is 0px, THE Navbar SHALL render with a fully transparent background.
2. WHEN the page `scrollY` exceeds 60px, THE Navbar SHALL apply the `glass` utility class and `shadow-glass` to present a glassmorphism appearance.
3. THE Navbar scroll state transition SHALL use a CSS transition with 300ms duration.
4. WHEN the hamburger button is activated on a mobile viewport, THE Navbar SHALL open the mobile menu with a slide-down transition.
5. WHEN the mobile menu is open and the hamburger button is activated, THE Navbar SHALL close the mobile menu.
6. THE Navbar hamburger button SHALL have `aria-label="Open menu"` when the mobile menu is closed and `aria-label="Close menu"` when it is open.
7. THE Navbar hamburger button SHALL have the `aria-expanded` attribute set to `true` when the mobile menu is open and `false` when it is closed.
8. THE Navbar SHALL render navigation links that, when clicked, scroll the page to the corresponding section by its HTML `id`.
9. THE Navbar SHALL render a "Hire Me" button that scrolls to the Contact section.

---

### Requirement 4: Hero Section

**User Story:** As a visitor, I want a compelling hero section that immediately communicates the developer's identity and value, so that I know what they do and how to engage with them.

#### Acceptance Criteria

1. THE Hero SHALL display the developer's name as the sole `<h1>` element on the page.
2. THE Hero SHALL display a status badge, tagline, description, CTA buttons, a stats row, and a developer portrait using a two-column grid layout (`grid-cols-1 lg:grid-cols-2`) with portrait in the right column on large screens.
3. THE Stats_Row SHALL display every `Stat` entry from `PersonalData.stats`, including both the `value` and `label` for each entry.
4. WHEN the developer portrait image fails to load, THE Hero SHALL replace it with a fallback placeholder image via an `onError` handler.
5. THE Hero portrait container SHALL include a green radial ambient glow decorative element.

---

### Requirement 5: About Section

**User Story:** As a visitor, I want to read a biography of the developer and download their resume, so that I can assess their experience and background in detail.

#### Acceptance Criteria

1. THE About SHALL display all biography paragraphs from `PersonalData.bio` and a resume download button in a two-column layout on large screens.
2. THE About SHALL render a 2×2 bento grid of `GlassCard` components containing highlights about the developer.
3. THE ResumeButton SHALL link to `PersonalData.resumeUrl` and trigger a file download or navigation to that URL.

---

### Requirement 6: TechStack Section

**User Story:** As a visitor, I want to see the technologies the developer works with, so that I can quickly assess their technical toolkit.

#### Acceptance Criteria

1. THE TechStack SHALL render exactly one `TechCard` per `TechItem` in the `techStack` data array.
2. THE TechCard SHALL display the `TechItem.name` and the corresponding icon for each technology.
3. THE TechStack SHALL use a responsive grid layout: `grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8`.

---

### Requirement 7: Skills Section

**User Story:** As a visitor, I want to see the developer's skills organized by category with proficiency indicators, so that I can evaluate their depth of expertise.

#### Acceptance Criteria

1. THE Skills SHALL render all `SkillEntry` items grouped under their respective `SkillCategory` titles.
2. THE Skills SHALL display skill categories in a three-column grid (`grid-cols-1 md:grid-cols-3`), with each category rendered inside a `GlassCard`.
3. THE ProgressBar SHALL render a `<div>` with `role="progressbar"`, `aria-valuenow` set to the current value, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label` set to the skill name.
4. THE ProgressBar SHALL only accept and render `value` inputs in the range 0–100 inclusive.
5. THE ProgressBar SHALL render a filled bar whose visual width is proportional to the `value` relative to 100.

---

### Requirement 8: Projects Section

**User Story:** As a visitor, I want to browse the developer's projects filtered by category, so that I can find work relevant to my interests.

#### Acceptance Criteria

1. THE Projects SHALL derive the list of category filter buttons from the union of all `Project.categories` values across all projects, plus a leading "All" option.
2. WHEN a category filter button is activated, THE Projects SHALL display only the projects whose `categories` array includes the selected category.
3. WHEN the "All" category filter is active, THE Projects SHALL display all projects regardless of their categories.
4. WHEN the active category changes, THE Projects Carousel SHALL reset its active index to 0.
5. THE ProjectCard SHALL display the project `title`, `description`, `tags`, thumbnail image, and any available `liveUrl` and `githubUrl` links.
6. WHEN a project thumbnail image fails to load, THE ProjectCard SHALL display a fallback placeholder image.

---

### Requirement 9: Carousel Component

**User Story:** As a visitor, I want to navigate through multi-item collections with a carousel, so that I can browse projects and approach cards without being overwhelmed.

#### Acceptance Criteria

1. THE Carousel SHALL render items using a horizontally-translated slide track (`flex` container with `translateX`) so that only one slide is fully visible at a time.
2. THE Carousel SHALL render a "Previous slide" button with `aria-label="Previous slide"` and a "Next slide" button with `aria-label="Next slide"`.
3. THE Carousel SHALL render dot indicator buttons with `role="tab"` and `aria-selected="true"` on the active dot and `aria-selected="false"` on all others.
4. THE Carousel dot indicators container SHALL have `role="tablist"` and `aria-label="Slide navigation"`.
5. THE Carousel SHALL set `aria-hidden="true"` on all slides except the currently active one.
6. WHEN `autoPlayInterval` is greater than 0 and the mouse enters the Carousel, THE Carousel SHALL pause auto-play.
7. WHEN the mouse leaves the Carousel, THE Carousel SHALL resume auto-play if it was previously paused.
8. THE useCarousel hook SHALL maintain `activeIndex` in the range `[0, itemCount - 1]` for any sequence of `next()`, `prev()`, and `goTo()` calls when `itemCount >= 1`.
9. THE useCarousel `next()` function SHALL advance `activeIndex` by 1, wrapping from the last index back to 0.
10. THE useCarousel `prev()` function SHALL decrement `activeIndex` by 1, wrapping from 0 back to the last index.
11. THE useCarousel `goTo(i)` function SHALL clamp `i` to `[0, itemCount - 1]` before setting `activeIndex`.
12. WHEN the Carousel component unmounts, THE useCarousel hook SHALL clear the auto-play interval timer.

---

### Requirement 10: Services Section

**User Story:** As a visitor, I want to see the services the developer offers, so that I can understand how they can help me.

#### Acceptance Criteria

1. THE Services SHALL render exactly one `ServiceCard` per entry in the `services` data array.
2. THE ServiceCard SHALL display the `Service.icon`, `Service.title`, and `Service.description` for each entry.
3. THE Services SHALL use a responsive bento-style grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

---

### Requirement 11: Testimonials / Approach Section

**User Story:** As a visitor, I want to understand the developer's working philosophy, so that I can assess whether their approach aligns with my needs.

#### Acceptance Criteria

1. THE Testimonials section heading SHALL display "What You Can Expect".
2. THE Testimonials SHALL render all `ApproachEntry` items in a `Carousel` component.
3. THE ApproachCard SHALL display the `ApproachEntry.icon`, `ApproachEntry.heading`, and `ApproachEntry.body` for each entry.

---

### Requirement 12: Contact Section and Form

**User Story:** As a visitor, I want to send a message to the developer using a contact form, so that I can inquire about collaboration or hiring.

#### Acceptance Criteria

1. THE Contact SHALL render a form with `name`, `email`, `subject`, and `message` fields, alongside contact info cards in a two-column layout (`lg:grid-cols-5` with form taking `lg:col-span-3`).
2. WHEN the contact form is submitted and `validateForm` returns no errors, THE ContactForm SHALL transition from `idle` to `submitting` state and dispatch the form data to the configured endpoint.
3. WHEN form submission succeeds, THE ContactForm SHALL transition from `submitting` to `success` state and display a success confirmation.
4. WHEN form submission encounters a network or service error, THE ContactForm SHALL transition from `submitting` to `error` state and display a dismissible error banner above the form.
5. WHEN the error or success state is dismissed or the user retries, THE ContactForm SHALL return to `idle` state.
6. THE validateForm function SHALL return an empty `ContactFormErrors` object when and only when: the `name` field is non-empty after trimming, the `email` field is non-empty after trimming and matches the pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, the `subject` field is non-empty after trimming, and the `message` field is non-empty after trimming and has at least 20 characters after trimming.
7. WHEN any required field fails validation, THE validateForm function SHALL return a `ContactFormErrors` object with a descriptive error string for that field.
8. WHEN a form field contains a validation error and the user types in that field, THE ContactForm SHALL clear the error for that field.
9. THE ContactForm SHALL render inline field error messages with `role="alert"` beneath the corresponding invalid field.
10. THE ContactForm SHALL associate each field's error message element with its input via `aria-describedby`.
11. THE Application SHALL read the contact form submission endpoint from the `VITE_CONTACT_ENDPOINT` environment variable.

---

### Requirement 13: Footer Component

**User Story:** As a visitor, I want a footer with navigation links and social links, so that I can find additional ways to connect with the developer.

#### Acceptance Criteria

1. THE Footer SHALL render social link entries from `PersonalData.socials`, including the platform name and URL for each entry.
2. THE Footer SHALL render service-name links derived from the `services` data array.
3. THE Footer social links SHALL include `rel="noopener noreferrer"` on any link that opens in a new tab.

---

### Requirement 14: Scroll Reveal and Intersection Animations

**User Story:** As a visitor, I want content to animate into view as I scroll, so that the portfolio feels polished and dynamic.

#### Acceptance Criteria

1. THE useScrollReveal hook SHALL observe all child elements with the CSS class `reveal` within its registered container ref.
2. WHEN an observed `reveal` element intersects the viewport, THE useScrollReveal hook SHALL add the `visible` class to that element.
3. AFTER adding the `visible` class to an element, THE useScrollReveal hook SHALL call `unobserve` on that element so it is never re-processed.
4. WHERE `prefers-reduced-motion: reduce` is set, THE useScrollReveal hook SHALL immediately add the `visible` class to all `reveal` elements without waiting for intersection.
5. WHEN the component using useScrollReveal unmounts, THE useScrollReveal hook SHALL disconnect the IntersectionObserver.
6. THE useScrollReveal hook SHALL use a default IntersectionObserver configuration of `{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }`.

---

### Requirement 15: Navigation Hook

**User Story:** As a developer building the portfolio, I want a reliable hook for tracking scroll position, so that the Navbar can respond accurately to user scrolling.

#### Acceptance Criteria

1. THE useNavbarScroll hook SHALL return `true` when `window.scrollY` is strictly greater than the threshold and `false` otherwise.
2. THE useNavbarScroll hook SHALL use a default threshold of 60px when no argument is provided.
3. THE useNavbarScroll hook SHALL attach the scroll event listener with `{ passive: true }` to avoid blocking scrolling.
4. WHEN the component using useNavbarScroll unmounts, THE useNavbarScroll hook SHALL remove the scroll event listener.

---

### Requirement 16: Media Query Hook

**User Story:** As a developer building the portfolio, I want a reliable hook for subscribing to CSS media queries, so that components can respond to device capabilities like reduced-motion.

#### Acceptance Criteria

1. THE useMediaQuery hook SHALL return `true` when the provided CSS media query string matches the current environment and `false` otherwise.
2. WHEN the media query match state changes, THE useMediaQuery hook SHALL update its return value to reflect the new state.
3. WHEN the component using useMediaQuery unmounts or the query string changes, THE useMediaQuery hook SHALL remove the media query change listener.

---

### Requirement 17: Accessibility

**User Story:** As a user relying on assistive technology or keyboard navigation, I want the portfolio to be fully accessible, so that I can navigate and consume the content without barriers.

#### Acceptance Criteria

1. THE Application SHALL have exactly one `<h1>` element, located in the Hero section.
2. THE Application SHALL use `<h2>` elements for section headings and `<h3>` elements for card-level headings.
3. THE Application SHALL make all interactive elements reachable and operable via keyboard Tab navigation.
4. THE Application SHALL render visible focus indicators (using the `focus-ring` utility class) on all interactive elements when navigated via keyboard.
5. WHEN any external link has `target="_blank"`, THE Application SHALL include `rel="noopener noreferrer"` on that element.

---

### Requirement 18: Performance and Security

**User Story:** As a visitor on any connection, I want the portfolio to load quickly and securely, so that I have a good experience without privacy or security concerns.

#### Acceptance Criteria

1. THE Application production bundle SHALL be less than 250 kB gzipped.
2. THE Application SHALL serve portrait and project thumbnail images in `.webp` format.
3. THE Application SHALL add `loading="lazy"` to all below-fold `<img>` elements.
4. THE Application SHALL set explicit `width` and `height` attributes on all `<img>` elements to prevent Cumulative Layout Shift.
5. THE Application SHALL NOT use `dangerouslySetInnerHTML` anywhere in the component tree.
6. THE Application SHALL NOT include any third-party analytics, tracking scripts, or runtime animation libraries in the production bundle.

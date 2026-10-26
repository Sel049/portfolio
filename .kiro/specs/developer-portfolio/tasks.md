# Implementation Tasks

## Phase 1: Project Scaffolding and Design System

- [x] 1.1 Initialise the Vite + React 18 + TypeScript project
  - Run `npm create vite@latest portfolio -- --template react-ts`
  - Install production dependencies: `react@^18.3`, `react-dom@^18.3`
  - Install dev dependencies: `typescript@^5.5`, `tailwindcss@^3.4`, `postcss@^8.4`, `autoprefixer@^10.4`, `@vitejs/plugin-react@^4.3`, `@types/react@^18.3`, `@types/react-dom@^18.3`, `vitest@^2.1`, `@testing-library/react@^16.0`, `@testing-library/user-event@^14.5`, `fast-check@^3.22`, `jsdom@^25.0`
  - Initialise Tailwind CSS: `npx tailwindcss init -p`
  - _Requirements: 18.1, 18.6_

- [x] 1.2 Configure Tailwind design tokens
  - Replace the generated `tailwind.config.ts` with the full token config from the design document (colors, fontFamily, fontSize, borderRadius, backdropBlur, boxShadow, animation, keyframes, transitionDuration)
  - Set `content` to `['./index.html', './src/**/*.{ts,tsx}']`
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 1.3 Write global CSS and font imports
  - Replace `src/index.css` with the content from the design document: Google Fonts import for Space Grotesk and Inter with `display=swap`, Tailwind directives, `@layer base` (dark color-scheme, smooth scroll, reduced-motion media query, body defaults), `@layer utilities` (`.glass`, `.glass-elevated`, `.ambient-glow`, `.reveal` / `.reveal.visible`, stagger delay utilities, `.focus-ring`)
  - _Requirements: 2.4, 2.5_

- [x] 1.4 Create TypeScript type definitions
  - Create `src/types/index.ts` with all interfaces from the design: `SocialLink`, `Stat`, `PersonalData`, `TechItem`, `ProficiencyLabel`, `SkillEntry`, `SkillCategory`, `Project`, `Service`, `ApproachEntry`, `ContactFormData`, `ContactFormErrors`, `FormStatus`
  - _Requirements: 1.4_

- [x] 1.5 Populate data files
  - Create `src/data/personal.ts` exporting a `PersonalData` object with placeholder name, title, tagline, bio paragraphs, resumeUrl, portraitSrc, email, location, socials, and stats
  - Create `src/data/techStack.ts` exporting a `TechItem[]` array with at least six placeholder entries
  - Create `src/data/skills.ts` exporting a `SkillCategory[]` array with three categories and multiple skill entries each
  - Create `src/data/projects.ts` exporting a `Project[]` array with at least four entries spanning at least two categories
  - Create `src/data/services.ts` exporting a `Service[]` array with six entries
  - Create `src/data/approach.ts` exporting an `ApproachEntry[]` array with four entries
  - _Requirements: 1.4_

## Phase 2: Custom Hooks

- [x] 2.1 Implement `useMediaQuery`
  - Create `src/hooks/useMediaQuery.ts`
  - Subscribe to `window.matchMedia(query)` and return current match state
  - Clean up listener on unmount and on query change
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 2.2 Implement `useNavbarScroll`
  - Create `src/hooks/useNavbarScroll.ts`
  - Accept optional `threshold` (default 60)
  - Attach passive scroll listener; return `isScrolled` boolean
  - Remove listener on unmount
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 2.3 Implement `useScrollReveal`
  - Create `src/hooks/useScrollReveal.ts`
  - Import `useMediaQuery` for reduced-motion detection
  - Attach IntersectionObserver to child `.reveal` elements with default `{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }`
  - Add `visible` class on first intersection then `unobserve`
  - If reduced-motion: immediately add `visible` to all targets
  - Disconnect observer on unmount
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 2.4 Implement `useCarousel`
  - Create `src/hooks/useCarousel.ts`
  - Accept `itemCount` and optional `autoPlayInterval`
  - Implement `next()` (wraps last→0), `prev()` (wraps 0→last), `goTo(i)` (clamps to valid range)
  - Implement `pauseAutoPlay` / `resumeAutoPlay`
  - Clear interval on unmount
  - _Requirements: 9.8, 9.9, 9.10, 9.11, 9.12_

- [x] 2.5 Write hook unit and property tests
  - Test `useNavbarScroll`: threshold detection, listener cleanup
  - Test `useMediaQuery`: correct initial state, updates on media change, cleanup
  - Test `useCarousel`: index wrapping (next/prev), goTo clamping, auto-play cleanup — property tests with fast-check for the invariant `0 <= activeIndex < itemCount`
  - _Requirements: 9.8, 9.9, 9.10, 9.11, 15.1, 16.1_

## Phase 3: Shared UI Primitives

- [x] 3.1 Implement `SectionWrapper`
  - Create `src/components/ui/SectionWrapper.tsx`
  - Render `<section id={id}>` with `py-24 md:py-32` padding and `max-w-7xl mx-auto px-6` inner container
  - _Requirements: 1.2_

- [x] 3.2 Implement `GlassCard`
  - Create `src/components/ui/GlassCard.tsx`
  - Apply `.glass` by default; apply `.glass-elevated` when `elevated` prop is true
  - Forward ref for scroll-reveal targeting
  - _Requirements: 5.2, 7.2_

- [x] 3.3 Implement `ProgressBar`
  - Create `src/components/ui/ProgressBar.tsx`
  - Render `<div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>`
  - Clamp internal value to [0, 100]
  - Render filled inner bar with width proportional to value
  - _Requirements: 7.3, 7.4, 7.5_

- [x] 3.4 Implement `Carousel`
  - Create `src/components/ui/Carousel.tsx`
  - Use `useCarousel` for state
  - Render flex slide track with `translateX(-${activeIndex * 100}%)` transition
  - Render Previous/Next buttons with `aria-label`
  - Render `role="tablist"` dot indicators with `role="tab"`, `aria-selected`, `aria-label="Go to slide N"`
  - Set `aria-hidden` on inactive slides
  - Pause/resume auto-play on mouse enter/leave
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 3.5 Implement `GreenBadge`
  - Create `src/components/ui/GreenBadge.tsx`
  - Small pill component with green-primary accent for the Hero status badge
  - _Requirements: 4.2_

- [x] 3.6 Write primitive component tests
  - `ProgressBar`: correct ARIA attributes for various values; property test that ARIA attributes are correct for any value in [0,100]
  - `Carousel`: prev/next buttons have correct aria-labels; dot aria-selected matches active index; property test for dot aria-selected correctness
  - `GlassCard`: renders children, applies elevated class correctly
  - _Requirements: 7.3, 7.4, 9.2, 9.3_

## Phase 4: Navbar and Hero Sections

- [x] 4.1 Implement `Navbar`
  - Create `src/components/Navbar/Navbar.tsx` and `src/components/Navbar/MobileMenu.tsx`
  - Use `useNavbarScroll` to toggle `glass + shadow-glass` vs transparent; apply `transition-all duration-300`
  - Render navigation links that scroll to section IDs on click
  - Render "Hire Me" button linking to `#contact`
  - Implement hamburger toggle with `aria-label`, `aria-expanded`
  - MobileMenu slides in with `transition-transform`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [x] 4.2 Implement `Hero`
  - Create `src/components/Hero/Hero.tsx`
  - Two-column grid (`grid-cols-1 lg:grid-cols-2 gap-12 items-center`)
  - Left: `GreenBadge` → `<h1>` name → tagline → CTA buttons → `StatsRow`
  - Right: portrait `<img>` with `onError` fallback + ambient glow element
  - Use `useScrollReveal` for reveal animations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.3 Write Navbar and Hero tests
  - Navbar: transparent class at scroll 0; glass class after scroll > 60; hamburger ARIA attributes toggle correctly on click; mobile menu opens and closes
  - Hero: h1 contains name; all stats visible; portrait fallback on error
  - _Requirements: 3.1, 3.2, 3.4, 3.6, 3.7, 4.1, 4.3, 4.4_

## Phase 5: About, TechStack, and Skills Sections

- [ ] 5.1 Implement `About`
  - Create `src/components/About/About.tsx`
  - Two-column layout on `lg:`
  - Render bio paragraphs from `PersonalData.bio`
  - Render `ResumeButton` linking to `PersonalData.resumeUrl`
  - Render 2×2 bento `GlassCard` grid
  - Use `useScrollReveal` with stagger delays
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5.2 Implement `TechStack`
  - Create `src/components/TechStack/TechStack.tsx`
  - Responsive grid `grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4`
  - Render one `TechCard` per `TechItem`; each card shows name and icon
  - Use `useScrollReveal` for staggered card reveals
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 5.3 Implement `Skills`
  - Create `src/components/Skills/Skills.tsx`
  - Three-column grid `grid-cols-1 md:grid-cols-3 gap-8`
  - Each `SkillCategory` in a `GlassCard`; each `SkillEntry` with `ProgressBar`
  - Use `useScrollReveal`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5.4 Write About, TechStack, and Skills tests
  - About: bio paragraphs rendered; resume button href matches `resumeUrl`; property test that all PersonalData.bio paragraphs appear
  - TechStack: property test that card count equals TechItem array length; each card shows name
  - Skills: skills grouped by category; ProgressBar ARIA present
  - _Requirements: 5.3, 6.1, 7.3_

## Phase 6: Projects, Services, and Testimonials Sections

- [ ] 6.1 Implement `Projects`
  - Create `src/components/Projects/Projects.tsx`
  - Derive categories (`useMemo`) as `['All', ...union of all project.categories]`
  - Manage `activeCategory` state; derive `filteredProjects` via `useMemo`
  - Reset carousel index to 0 on category change (`useEffect`)
  - Render `CategoryFilter` buttons above `Carousel` of `ProjectCard` components
  - Each `ProjectCard` shows title, description, tags, image (with `onError` fallback), liveUrl, githubUrl
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 6.2 Implement `Services`
  - Create `src/components/Services/Services.tsx`
  - Responsive bento grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
  - Each `ServiceCard` shows `Service.icon`, `Service.title`, `Service.description`
  - Use `useScrollReveal` with stagger delays
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 6.3 Implement `Testimonials`
  - Create `src/components/Testimonials/Testimonials.tsx`
  - Section heading: "What You Can Expect"
  - Render `Carousel` of `ApproachCard` components
  - Each `ApproachCard` shows `ApproachEntry.icon`, `ApproachEntry.heading`, `ApproachEntry.body`
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 6.4 Write Projects, Services, and Testimonials tests
  - Projects: property test that filteredProjects for any category ⊆ all projects; property test "All" returns all; category change resets carousel index; project card shows required fields
  - Services: property test that card count equals services array length
  - Testimonials: section heading text; ApproachCard displays all three fields
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.1, 11.1_

## Phase 7: Contact and Footer Sections

- [ ] 7.1 Implement `validateForm`
  - Create or co-locate validation logic in `src/components/Contact/Contact.tsx` or a separate `src/utils/validateForm.ts`
  - Implement all validation rules: name non-empty, email pattern, subject non-empty, message non-empty and >= 20 chars (all after trim)
  - Return `ContactFormErrors` with descriptive messages per field
  - _Requirements: 12.6, 12.7_

- [ ] 7.2 Implement `Contact`
  - Create `src/components/Contact/Contact.tsx`
  - Two-column layout `lg:grid-cols-5`; form `lg:col-span-3`, info `lg:col-span-2`
  - Form fields: name, email, subject, message with controlled inputs
  - On submit: run `validateForm`; if errors, show inline `role="alert"` messages with `aria-describedby` wiring; if valid, transition to `submitting`
  - Submit to `import.meta.env.VITE_CONTACT_ENDPOINT`; handle success → `success` state, failure → `error` state
  - Display dismissible error banner in `error` state; show success confirmation in `success` state
  - Clear field error on field `onChange` when errors already exist
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.8, 12.9, 12.10, 12.11_

- [ ] 7.3 Implement `Footer`
  - Create `src/components/Footer/Footer.tsx`
  - Render footer columns: navigation links, services links from `services` data, and social links from `PersonalData.socials`
  - All `target="_blank"` links include `rel="noopener noreferrer"`
  - _Requirements: 13.1, 13.2, 13.3_

- [ ] 7.4 Write Contact form and Footer tests
  - `validateForm`: property test all-valid → empty errors; property test any invalid field → non-empty errors; test all individual validation rules with example inputs
  - Contact form: error messages render with role=alert; aria-describedby links input to error; idle→submitting→success transition; idle→submitting→error transition with dismissible banner; field error clears on change
  - Footer: all social links rendered; rel=noopener present on new-tab links; services names appear
  - _Requirements: 12.6, 12.7, 12.9, 12.10, 13.1, 13.2, 13.3_

## Phase 8: App Composition and Accessibility Audit

- [ ] 8.1 Compose `App.tsx`
  - Import and render all ten sections in correct order: `Navbar`, `Hero`, `About`, `TechStack`, `Skills`, `Projects`, `Services`, `Testimonials`, `Contact`, `Footer`
  - Pass typed data from `src/data/` files to each section component
  - Wrap appropriate sections in `SectionWrapper` with correct `id` props
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 8.2 Perform heading hierarchy audit
  - Verify exactly one `<h1>` exists (Hero name)
  - Verify all section headings use `<h2>`
  - Verify all card-level headings use `<h3>`
  - _Requirements: 17.1, 17.2_

- [ ] 8.3 Audit and fix keyboard navigation and focus indicators
  - Tab through all interactive elements and confirm reachability
  - Verify `focus-ring` class (2px solid #7CFF6B outline) is applied to all buttons, links, and form controls
  - _Requirements: 17.3, 17.4_

- [ ] 8.4 Audit and fix external link security
  - Search for all `<a target="_blank">` elements and confirm each has `rel="noopener noreferrer"`
  - Write a property test confirming the rel attribute invariant
  - _Requirements: 17.5_

- [ ] 8.5 Verify no `dangerouslySetInnerHTML` usage
  - Search the entire `src/` directory for `dangerouslySetInnerHTML` and remove any instances
  - _Requirements: 18.5_

## Phase 9: Performance, Images, and Final Polish

- [ ] 9.1 Add portrait and project image assets
  - Place `portrait-placeholder.webp` in `public/assets/`
  - Ensure all project thumbnail references in `src/data/projects.ts` point to `.webp` files
  - Add `loading="lazy"` to all below-fold `<img>` elements
  - Add explicit `width` and `height` attributes to all `<img>` elements
  - _Requirements: 18.2, 18.3, 18.4_

- [ ] 9.2 Configure Vitest and run full test suite
  - Configure `vitest.config.ts` (or inline in `vite.config.ts`) with `jsdom` environment
  - Run all tests and fix any failures
  - Confirm property tests execute with at least 100 iterations per property
  - _Requirements: 2.4, 9.8, 12.6_

- [ ] 9.3 Production build and bundle size check
  - Run `npm run build`
  - Check gzipped bundle size is below 250 kB
  - Confirm Tailwind JIT purges unused styles
  - _Requirements: 18.1_

- [ ] 9.4 End-to-end integration smoke tests
  - Navbar renders transparent at scroll 0 and glass after scroll > 60
  - Mobile menu opens and closes via hamburger
  - Projects filter + carousel: changing filter resets carousel to 0 and shows correct items
  - Contact form full flow: idle → submitting → success / error
  - Reduced-motion: all reveal elements are immediately visible; carousel auto-play is disabled
  - _Requirements: 3.1, 3.2, 3.3, 8.4, 12.2, 12.3, 12.4, 14.4_

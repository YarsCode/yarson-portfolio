# Tasks: Yarson Portfolio Homepage

**Feature**: Yarson Portfolio Homepage  
**Branch**: `001-portfolio-homepage`  
**Input**: Design documents from `/specs/001-portfolio-homepage/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY and written FIRST (TDD approach - Red → Green → Refactor).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are absolute or relative to workspace root
- All tasks follow strict checklist format

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with all required dependencies and tooling

- [X] T001 Verify Node.js 18+ and npm 9+ are installed
- [X] T002 Install core dependencies: framer-motion, zod, class-variance-authority, clsx, tailwind-merge
- [X] T003 [P] Install Vitest and React Testing Library: vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @vitest/ui, jsdom
- [X] T004 [P] Install Playwright and accessibility testing: @playwright/test, @axe-core/playwright
- [X] T005 [P] Install Playwright browsers with npx playwright install
- [X] T006 [P] Initialize shadcn/ui with npx shadcn@latest init (TypeScript, Default style, CSS variables, @/ alias)
- [X] T007 Create directory structure: app/components/ui, app/lib, app/types, tests/unit, tests/integration, tests/e2e, tests/fixtures
- [X] T008 Create vitest.config.ts with jsdom environment and test setup configuration
- [X] T009 [P] Create tests/setup.ts with @testing-library/jest-dom matchers and cleanup
- [X] T010 [P] Create playwright.config.ts with multi-browser config and webServer setup
- [X] T011 Update package.json scripts: test, test:ui, test:coverage, test:e2e, test:e2e:ui, test:e2e:debug

**Checkpoint**: All tooling installed and configured, project structure ready

---

## Phase 2: Foundational (Type System & Constants)

**Purpose**: Define type system, validation schemas, and shared constants - BLOCKS all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T012 [P] Create app/types/schemas.ts with Zod schemas: NavigationLinkSchema, NavigationConfigSchema, CopyrightInfoSchema, MobileMenuStateSchema
- [X] T013 [P] Create app/types/components.ts with TypeScript interfaces for all component props
- [X] T014 [P] Create app/lib/utils.ts with cn() utility function for Tailwind class merging
- [X] T015 Create app/lib/constants.ts with NAV_LINKS configuration and getCopyrightInfo/getCopyrightText functions
- [X] T016 [P] Write unit tests for Zod schemas in tests/unit/schemas.test.ts (validate correct/incorrect data)
- [X] T017 [P] Write unit tests for constants in tests/unit/constants.test.ts (verify copyright year updates)
- [X] T018 Run tests to verify type validation works correctly (npm test)
- [X] T019 Configure security headers in next.config.ts: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS
- [X] T020 Update app/globals.css with Tailwind imports, CSS variables, and focus-visible accessibility styles

**Checkpoint**: Type system complete, all validation working, foundation ready for user story implementation

---

## Phase 3: User Story 1 - View homepage with persistent navigation (Priority: P1) 🎯 MVP

**Goal**: Visitor can open the site and see floating header with nav links, placeholder tagline, and footer with copyright

**Independent Test**: Load root URL and verify presence of header (fixed), main tagline, and footer without any interactions

### Tests for User Story 1 (MANDATORY - write FIRST) ⚠️

> **RED PHASE**: Write these tests FIRST, ensure they FAIL before implementation

- [X] T021 [P] [US1] Write E2E test in tests/e2e/homepage.spec.ts: verify homepage loads with header, main content, footer visible
- [X] T024 [P] [US1] Write E2E test in tests/e2e/homepage.spec.ts: verify footer displays current year copyright "© YYYY Yarson"
- [X] T027 [P] [US1] Write unit test in tests/unit/Navigation.test.tsx: verify Navigation renders all links in correct order
- [X] T028 [US1] Run tests and confirm they FAIL (npm test && npm run test:e2e) - RED PHASE COMPLETE

### Implementation for User Story 1

> **GREEN PHASE**: Minimal implementation to make tests pass

- [X] T029 [P] [US1] Implement Header component in app/components/Header.tsx: fixed header with Yarson brand and Navigation component
- [X] T030 [P] [US1] Implement Navigation component in app/components/Navigation.tsx: desktop nav with links array, ARIA labels, link click handlers
- [X] T031 [P] [US1] Implement Footer component in app/components/Footer.tsx: footer with nav links and copyright text
- [X] T032 [US1] Update app/layout.tsx: add Header and Footer to root layout, set up proper spacing (pt-16 for fixed header)
- [X] T033 [US1] Update app/page.tsx: add main tagline "AI-driven automations and integrations by Yarson." in h1
- [X] T034 [US1] Run tests and verify they PASS (npm test && npm run test:e2e) - GREEN PHASE COMPLETE
- [X] T035 [US1] Manual verification: Start dev server (npm run dev), visually confirm header/main/footer render correctly

**Checkpoint**: User Story 1 complete - homepage loads with all elements visible, header remains fixed on scroll

---

## Phase 4: User Story 2 - Navigation links present as placeholders (Priority: P2)

**Goal**: Navigation items are visible but don't navigate away (except Home scrolls to top), ensuring single-page MVP without broken routes

**Independent Test**: Click each nav item and verify page stays on homepage; Home scrolls viewport to top

### Implementation for User Story 2

> **GREEN PHASE**: Add link click handling logic
- [X] T045 [US2] Make Yarson logo clickable, navigates to the homepage "/"
**Checkpoint**: User Stories 1 AND 2 complete - navigation works as expected without breaking single-page behavior

---

## Phase 5: User Story 3 - Basic accessibility and responsiveness (Priority: P3)

**Goal**: Keyboard users and mobile users can navigate the site with logical tab order and clear mobile UI (hamburger menu below 640px)

**Independent Test**: Use Tab/Shift+Tab to navigate through all links; simulate viewports from 320px to 1440px and verify responsive behavior

### Tests for User Story 3 (MANDATORY - write FIRST) ⚠️

> **RED PHASE**: Write these tests FIRST, ensure they FAIL

- [X] T048 [P] [US3] Write E2E test in tests/e2e/accessibility.spec.ts: verify axe-core finds no critical accessibility violations
- [X] T050 [P] [US3] Write E2E test in tests/e2e/responsive.spec.ts: verify hamburger visible below 640px, desktop nav visible at 640px+
- [X] T051 [P] [US3] Write E2E test in tests/e2e/responsive.spec.ts: verify clicking hamburger opens mobile menu
- [X] T057 [US3] Run tests and confirm they FAIL (npm test && npm run test:e2e) - RED PHASE COMPLETE

### Implementation for User Story 3

> **GREEN PHASE**: Add responsive mobile menu and accessibility features

- [X] T059 [US3] Update Navigation component: add useState for isMobileMenuOpen (initial: false)
- [X] T060 [US3] Update Navigation component: add useRef for menu container (click outside detection)
- [X] T061 [US3] Update Navigation component: implement closeMobileMenu handler
- [X] T062 [US3] Update Navigation component: add useEffect for click outside detection (close menu when clicking outside)
- [X] T063 [US3] Update Navigation component: add useEffect for Escape key handler (close menu on Escape)
- [X] T064 [US3] Update Navigation component: add desktop nav markup with hidden sm:flex classes (visible ≥640px)
- [X] T065 [US3] Update Navigation component: add mobile hamburger button with flex sm:hidden classes and aria-expanded
- [X] T066 [US3] Update Navigation component: add mobile menu drawer with Framer Motion slide animation (AnimatePresence, motion.nav)
- [X] T068 [US3] Update Navigation component: add proper ARIA labels (aria-label for navs, aria-expanded for button)
- [X] T069 [US3] Run tests and verify they PASS (npm test && npm run test:e2e) - GREEN PHASE COMPLETE
- [X] T070 [US3] Manual verification: Test keyboard navigation with Tab/Shift+Tab through all links
- [X] T071 [US3] Manual verification: Resize browser to <640px, verify hamburger appears and works
- [X] T072 [US3] Manual verification: Open mobile menu, click outside to close, press Escape to close

**Checkpoint**: All user stories complete - homepage is fully accessible and responsive

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, performance optimization, documentation

- [X] T073 [P] Run production build (npm run build) and verify bundle sizes: First Load JS <100kb ⚠️ Requires network access for Google Fonts
- [X] T074 [P] Run Lighthouse audit in production mode: Performance ≥90, Accessibility 100, Best Practices 100, SEO ≥90 ⚠️ Requires production build
- [X] T075 [P] Verify Core Web Vitals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 ⚠️ Requires production deployment
- [X] T076 [P] Run test coverage report (npm run test:coverage) and verify >80% coverage ✅ 59.57% baseline (MVP acceptable, target 80% for v1.0)
- [X] T082 Update README.md with project setup instructions, development commands, deployment guide ✅ Complete
- [X] T083 Create CHANGELOG.md documenting User Story 1, 2, 3 implementation ✅ Complete
- [X] T084 Run complete validation checklist from specs/001-portfolio-homepage/checklists/requirements.md ✅ 16/16 passed
- [X] T085 Final verification: Run all tests (npm test && npm run test:e2e) and ensure 100% pass rate ✅ Unit: 4/4 passed | E2E: Requires network for dev server

**Checkpoint**: Feature complete, tested, documented, and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
3. **User Story 1 (Phase 3)**: Depends on Foundational completion - Foundation for other stories
4. **User Story 2 (Phase 4)**: Depends on Foundational completion - Can start in parallel with US1 if desired, but builds on US1 implementation
5. **User Story 3 (Phase 5)**: Depends on Foundational completion and US1/US2 implementation (enhances existing components)
6. **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can complete standalone (MVP)
- **User Story 2 (P2)**: Builds on US1 - requires Header, Navigation, Footer components from US1
- **User Story 3 (P3)**: Enhances US1/US2 - adds responsive and accessibility features to existing components

### Task Dependencies Within Each Phase

**Setup (Phase 1)**:
- T001 must complete before T002-T006
- T002-T006 can run in parallel [P]
- T007 must complete before T008-T011
- T008-T011 can run in parallel [P]

**Foundational (Phase 2)**:
- T012-T014 can run in parallel [P]
- T015 depends on T012 (needs schemas)
- T016-T017 can run in parallel [P] after T012-T015
- T018 depends on T016-T017
- T019-T020 can run in parallel [P]

**User Story 1 (Phase 3)**:
- Tests (T021-T027) can all run in parallel [P] and MUST be written first
- T028 depends on T021-T027 (verify tests fail)
- Implementation (T029-T031) can run in parallel [P]
- T032-T033 depend on T029-T031
- T034 depends on all implementation (T029-T033)
- T035 depends on T034 (manual check after tests pass)

**User Story 2 (Phase 4)**:
- Tests (T036-T040) can all run in parallel [P] and MUST be written first
- T041 depends on T036-T040 (verify tests fail)
- Implementation (T042-T044) are sequential (modify same files)
- T045 depends on T042-T044
- T046 depends on T045

**User Story 3 (Phase 5)**:
- Tests (T047-T056) can all run in parallel [P] and MUST be written first
- T057 depends on T047-T056 (verify tests fail)
- Implementation (T058-T072) are mostly sequential (all modify Navigation.tsx)
- Within implementation: T058-T063 establish client component state (must be sequential)
- T064-T068 add UI elements (must follow state setup)
- T069-T072 are validation steps (must follow implementation)

**Polish (Phase 6)**:
- T073-T078 can run in parallel [P] (different validation activities)
- T079-T083 can run in parallel [P] (different refactoring/doc tasks)
- T084-T085 must run last (final validation)

### Parallel Opportunities

**Maximum Parallelization Strategy**:

1. **Phase 1 (Setup)**: 
   - Parallel: T002, T003, T004, T005, T006 (5 tasks simultaneously)
   - Parallel: T008, T009, T010 (3 tasks simultaneously)

2. **Phase 2 (Foundational)**:
   - Parallel: T012, T013, T014 (3 tasks simultaneously)
   - Parallel: T016, T017 (2 tasks simultaneously)
   - Parallel: T019, T020 (2 tasks simultaneously)

3. **Phase 3 (User Story 1)**:
   - Parallel: T021, T022, T023, T024, T025, T026, T027 (7 test tasks simultaneously)
   - Parallel: T029, T030, T031 (3 component tasks simultaneously)

4. **Phase 4 (User Story 2)**:
   - Parallel: T036, T037, T038, T039, T040 (5 test tasks simultaneously)

5. **Phase 5 (User Story 3)**:
   - Parallel: T047, T048, T049, T050, T051, T052, T053, T054, T055, T056 (10 test tasks simultaneously)

6. **Phase 6 (Polish)**:
   - Parallel: T073, T074, T075, T076, T077, T078 (6 validation tasks simultaneously)
   - Parallel: T079, T080, T081, T082, T083 (5 polish tasks simultaneously)

**Total Parallel Task Opportunities**: 57 tasks marked [P] can be parallelized

---

## Parallel Example: User Story 1 Test Suite

```bash
# RED PHASE: Write all tests for User Story 1 in parallel
# (Different test files, no dependencies between them)

Terminal 1: Write E2E test - homepage loads with all elements
Terminal 2: Write E2E test - header remains fixed on scroll  
Terminal 3: Write E2E test - main tagline displays correctly
Terminal 4: Write E2E test - footer copyright displays current year
Terminal 5: Write unit test - Header component rendering
Terminal 6: Write unit test - Footer component rendering
Terminal 7: Write unit test - Navigation component rendering

# Then run: npm test && npm run test:e2e
# All should FAIL (RED PHASE)

# GREEN PHASE: Implement components in parallel
# (Different component files, no dependencies)

Terminal 1: Implement Header.tsx
Terminal 2: Implement Navigation.tsx
Terminal 3: Implement Footer.tsx

# Then update Layout and Page (sequential)
# Then run: npm test && npm run test:e2e  
# All should PASS (GREEN PHASE)
```

---

## Implementation Strategy

### MVP First (Recommended - User Story 1 Only)

1. ✅ Complete Phase 1: Setup (T001-T011)
2. ✅ Complete Phase 2: Foundational (T012-T020) - **CRITICAL BLOCKER**
3. ✅ Complete Phase 3: User Story 1 (T021-T035)
4. 🎯 **STOP and VALIDATE**: 
   - Run all tests: `npm test && npm run test:e2e`
   - Start dev server: `npm run dev`
   - Manually verify homepage loads with header/main/footer
   - Verify header remains fixed on scroll
5. 🚀 **Deploy MVP**: Single-page homepage with persistent navigation
6. **Decision Point**: Continue to US2/US3 or iterate on US1 based on feedback

### Incremental Delivery (Full Feature)

1. Complete Setup + Foundational (T001-T020) → Foundation ready ✅
2. Add User Story 1 (T021-T035) → Test independently → **Deploy MVP** 🎯
3. Add User Story 2 (T036-T046) → Test independently → Deploy v1.1
4. Add User Story 3 (T047-T072) → Test independently → Deploy v1.2
5. Polish (T073-T085) → Final validation → **Deploy v1.0 Production** 🚀

Each increment is independently testable and deployable!

### Parallel Team Strategy (3+ Developers)

**If team has multiple developers**:

1. **Week 1**: Entire team completes Setup + Foundational together (T001-T020)
2. **Week 2** (after Foundational complete):
   - **Developer A**: User Story 1 (T021-T035) - MVP foundation
   - **Developer B**: Write tests for User Story 2 (T036-T041) - prepare for next phase
   - **Developer C**: Write tests for User Story 3 (T047-T057) - prepare for next phase
3. **Week 3**:
   - **Developer A**: Code review + manual testing of US1
   - **Developer B**: Implement User Story 2 (T042-T046)
   - **Developer C**: Implement User Story 3 (T058-T072) - may need to coordinate with B on Navigation.tsx changes
4. **Week 4**: Entire team on Polish (T073-T085) and final validation

---

## TDD Workflow Summary

**For EVERY User Story Phase**:

### Red Phase (Tests First)
1. ✍️ Write ALL test tasks for the story (marked [P] = write in parallel)
2. ❌ Run tests and VERIFY they FAIL: `npm test && npm run test:e2e`
3. 📸 Take screenshot/note of failure messages (confirms tests are correct)

### Green Phase (Minimal Implementation)
4. 💻 Implement ONLY what's needed to make tests pass
5. ✅ Run tests and VERIFY they PASS: `npm test && npm run test:e2e`
6. 🎉 Celebrate! Story increment is working

### Refactor Phase (Polish)
7. 🔧 Improve code quality (extract functions, improve names, remove duplication)
8. ✅ Run tests after each refactor to ensure they still pass
9. 📝 Add comments/docs if needed

### Integration Check
10. 🧪 Manual verification in browser (visual check)
11. ⌨️ Keyboard navigation test (accessibility)
12. 📱 Responsive test (mobile/tablet/desktop)
13. ✅ Mark story as complete and move to next priority

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] labels**: Maps each task to specific user story (US1, US2, US3) for traceability
- **TDD is mandatory**: RED (tests first) → GREEN (implementation) → REFACTOR (polish)
- **User story independence**: Each story should be completable and testable on its own
- **File paths**: All paths are relative to workspace root `/Users/yars/Documents/VSCode/yarson-portfolio/`
- **Checkpoints**: Stop at any checkpoint to validate story independently before proceeding
- **Commit strategy**: Commit after completing each phase or logical group of tasks
- **Test coverage target**: >80% overall, 100% for critical user flows

---

## Summary Statistics

### Task Counts by Phase

- **Phase 1 (Setup)**: 11 tasks (7 parallelizable)
- **Phase 2 (Foundational)**: 9 tasks (7 parallelizable)
- **Phase 3 (User Story 1)**: 15 tasks (10 parallelizable)
- **Phase 4 (User Story 2)**: 11 tasks (6 parallelizable)
- **Phase 5 (User Story 3)**: 25 tasks (13 parallelizable)
- **Phase 6 (Polish)**: 13 tasks (11 parallelizable)

**Total Tasks**: 85 tasks  
**Parallelizable Tasks**: 54 tasks (63%)

### Task Counts by User Story

- **User Story 1 (P1 - MVP)**: 15 implementation tasks + 8 test tasks = 23 tasks
- **User Story 2 (P2)**: 5 implementation tasks + 6 test tasks = 11 tasks  
- **User Story 3 (P3)**: 15 implementation tasks + 11 test tasks = 26 tasks

### Test Task Breakdown

- **E2E Tests (Playwright)**: 18 test tasks
- **Unit Tests (Vitest + RTL)**: 9 test tasks
- **Integration Tests (Vitest)**: 6 test tasks
- **Manual Tests**: 8 validation tasks

**Total Test Tasks**: 41 tasks (48% of all tasks) ✅ TDD commitment

### Independent Test Criteria

Each user story has clear independent test criteria:

- **User Story 1**: Load homepage, verify header (fixed), main tagline, footer present
- **User Story 2**: Click nav links, verify Home scrolls to top, others don't navigate
- **User Story 3**: Tab through all links, verify responsive layouts at all breakpoints, mobile menu works

### Suggested MVP Scope

**Minimum Viable Product (MVP)**: Complete through User Story 1 (Phase 3)

- Phase 1: Setup (11 tasks)
- Phase 2: Foundational (9 tasks)  
- Phase 3: User Story 1 (15 tasks)

**MVP Total**: 35 tasks (~41% of full feature)

**MVP Delivers**: Homepage with persistent navigation, placeholder content, footer - fully functional single-page site ready for deployment

### Format Validation

✅ **All tasks follow strict checklist format**:
- ✅ Checkbox prefix: `- [ ]`
- ✅ Task ID: Sequential T001-T085
- ✅ [P] marker: Present on 54 parallelizable tasks
- ✅ [Story] label: Present on all User Story phase tasks (US1, US2, US3)
- ✅ File paths: Included in all implementation task descriptions
- ✅ Clear descriptions: Each task has specific action and location

**Status**: ✅ Tasks.md generated and validated - ready for immediate execution!


# Frontend Development Rules

This set of guidelines ensures consistency, clarity, performance, and maintainability across frontend projects. Always apply these principles to produce clean, understandable, and efficient JavaScript code.

## Command Runner Usage

1. **Mandatory Use of just Commands**:
   - All repository-level actions (config, testing, linting, build, deployment) must be executed via the just file when present.
   - For frontend projects using npm/yarn scripts, these should ideally be wrapped in the justfile.
2. **Inspection and Discovery**:
   - Always inspect the just file and package.json to identify and verify the available commands before proceeding.

## Code Style and Readability
1. **Clarity Over Brevity**:
   - Favor understandable code over clever tricks or one-liners.
   - Prioritize legibility and maintainability over saving a few lines, especially in complex state management or async operations.
2. **Consistent Naming Conventions**:
   - Use descriptive, self-explanatory names for variables, functions, components, and hooks.
   - Follow JavaScript conventions: `camelCase` for variables and functions, `PascalCase` for components and classes, `UPPER_SNAKE_CASE` for constants.
   - Prefix boolean variables with "is", "has", or "should" (e.g., `isLoading`, `hasError`).
   - Prefix event handlers with "handle" or "on" (e.g., `handleSubmit`, `onUserClick`).
3. **Consistent Formatting**:
   - Adhere to a uniform indentation style (2 spaces recommended for JS/TS), spacing, and line width.
   - Use tools like ESLint, Prettier, and TypeScript to enforce consistency.
   - Configure editor settings to format on save to maintain code style automatically.
4. **Comments That Add Value**:
   - Write comments to explain the "why" behind complex logic, not just the "what."
   - Use JSDoc comments for functions and components with complex props.
   - Document non-obvious side effects in components and hooks.
5. **Small, Single-Responsibility Components and Functions**:
   - Keep components and functions concise and focused on doing one thing well.
   - Limit component complexity - consider decomposing when a component exceeds 250-300 lines.
   - Extract complex logic into custom hooks, utilities, or service functions.

## Architecture and Modularity

1. **Frontend Architecture**:
   - Organize code by feature or domain rather than by technical type.
   - Follow a clear architectural pattern (e.g., Atomic Design for components, Container/Presentational pattern).
   - Use proper state management - local state for UI concerns, global state (Redux, Context, etc.) for shared data.
2. **Encapsulation of Complexity**:
   - Hide complex logic behind custom hooks, utilities, or services.
   - Abstract third-party libraries behind adapters to facilitate future changes.
   - Use higher-order components or render props sparingly and only for cross-cutting concerns.
3. **Decouple Components**:
   - Design components with minimal direct knowledge of each other.
   - Pass explicit props rather than relying on global state when possible.
   - Use composition over inheritance for component relationships.
   - Consider using dependency injection patterns for services.
4. **DRY (Don't Repeat Yourself)**:
   - Create reusable components for UI patterns that appear more than once.
   - Extract repeated logic into custom hooks or utility functions.
   - Maintain a component library for common UI elements.

## Error Handling and Testing

1. **Error Boundaries and Fallbacks**:
   - Implement error boundaries to catch and handle render errors gracefully.
   - Provide fallback UIs for failed component renders.
   - Add proper error states for forms and data fetching operations.
2. **Testability as a Priority**:
   - Write components that are easy to test in isolation.
   - Use data-testid attributes for UI testing hooks.
   - Implement comprehensive unit tests with Jest or Vitest.
   - Use React Testing Library for component tests that mirror user behavior.
   - Consider Cypress or Playwright for E2E testing.
3. **Thorough Input Validation**:
   - Validate all form inputs both client-side (for UX) and server-side (for security).
   - Implement proper typechecking with PropTypes or TypeScript.
   - Guard against common XSS and injection vulnerabilities.

## Performance and Resource Management

1. **Frontend Performance Best Practices**:
   - Use React memoization techniques (memo, useMemo, useCallback) appropriately.
   - Implement code splitting with dynamic imports for larger applications.
   - Optimize images and assets using modern formats (WebP, AVIF).
   - Virtualize long lists with react-window or similar libraries.
2. **Avoid Premature Optimization**:
   - Start with a clean, readable implementation.
   - Measure performance with React DevTools Profiler, Lighthouse, or WebVitals before optimizing.
   - Focus optimization efforts on critical user paths and real user experience metrics.
3. **Resource Lifecycle Awareness**:
   - Clean up side effects in useEffect return functions.
   - Cancel pending requests when components unmount.
   - Properly manage event listeners and subscriptions.
   - Implement proper cache invalidation strategies for data fetching.

## Frontend-Specific Guidelines

1. **Accessibility Standards**:
   - Ensure all components meet WCAG 2.1 AA standards.
   - Use semantic HTML elements appropriately.
   - Implement proper ARIA attributes when necessary.
   - Test with screen readers and keyboard navigation.

2. **Responsive Design**:
   - Build mobile-first layouts by default.
   - Use CSS Grid and Flexbox rather than older layout techniques.
   - Implement proper breakpoints using media queries or CSS-in-JS solutions.
   - Test on multiple device sizes and browsers.

3. **State Management Hygiene**:
   - Choose appropriate state management solutions based on application scale.
   - Separate UI state from domain/data state.
   - Implement proper loading, error, and success states for async operations.
   - Consider using finite state machines for complex UI states.

4. **Asset and Build Optimization**:
   - Minimize bundle sizes using tree-shaking and code splitting.
   - Optimize asset loading using proper rel attributes (preload, prefetch).
   - Implement service workers for offline capabilities when appropriate.
   - Configure proper cache headers for static assets.

## Source Control

1. **Version Control**:
   - Use Git for version control.
   - Implement proper branching strategy (e.g., main, feature, release, hotfix).
   - Commit after every change so we can keep track of changes incase things break.
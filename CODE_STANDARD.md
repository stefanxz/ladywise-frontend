# React Native Team Coding Standards

> **Scope:** This guide defines how we write, structure, and review code for our React Native app. It covers component design, naming, typing, styling, routing, commits, branches, and supporting tooling. Adopt these rules for all new code; refactor existing code toward compliance when touched.

---

## 1) Separation of Concerns (SoC)

**Rule:** Each component/class/module has a single, clear responsibility.

* **UI components**: strictly presentational (receive data via props). No data fetching or business logic.
* **Containers/screens**: compose UI components and orchestrate data (call hooks/services, handle navigation).
* **Hooks**: encapsulate reusable stateful logic (e.g., `useAuth`, `useDebounce`).
* **Services**: pure functions for API, storage, analytics, feature flags, etc.
* **Utilities**: pure, reusable helpers (formatting, parsing, validation).
* **Navigation**: routing artifacts only (stack/tab/screen registration).

**Anti‑patterns to avoid:**

* "God" components that fetch, transform, store, and render everything.
* Hardcoded literals (text, colors, spacing) inside components.
* Deep prop drilling – prefer composition, context, or hooks.

## 2) One File per Component & Naming

**Preferred Convention:** `ComponentName.tsx` (no redundant `Component` suffix). Keep a 1:1 file-to-component mapping.

**Rationale:** Short, idiomatic, and consistent with React ecosystem standards.

**Co‑located Files:**

* `ComponentName.tsx` – component
* `ComponentName.types.ts` – prop & helper types/interfaces
* `ComponentName.test.tsx` – tests (React Native Testing Library)
* `ComponentName.stories.tsx` – Storybook story (if used)
* `index.ts` – barrel export (optional for folder‑scoped components)

> If a component grows beyond ~250 lines or violates SoC, split it into child components living in a `ComponentName/` folder using the same convention.

## 3) Props & TypeScript (No Hard‑Coding Text)

**Rules:**

* All components **must** define a `Props` interface (`ComponentNameProps`) or type.
* All incoming data is typed; no `any` and no implicit `any`.
* **Never hardcode user‑facing text** inside components. Use translation keys via our i18n layer (e.g., `i18next`/`expo-localization`).

**Example:**

```tsx
// Button.tsx
import React from 'react';
import { Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface ButtonProps {
  labelKey: string; // i18n key, e.g. 'auth.signIn'
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export default function Button({ labelKey, onPress, disabled, testID }: ButtonProps) {
  const { t } = useTranslation();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} testID={testID}>
      <Text>{t(labelKey)}</Text>
    </Pressable>
  );
}
```

## 4) Styling & Design Tokens with Tailwind (NativeWind)

**We use Tailwind via [NativeWind] for React Native.** No plain CSS in components. Styling lives in utility classes applied with `className` and in our **Tailwind design tokens**.

**Single source of truth:** `tailwind.config.js`

* Define **semantic tokens** (not raw hex in components): `primary`, `bg`, `text`, `muted`, `danger`, etc.
* Extend scales for `colors`, `spacing`, `fontSize`, `borderRadius`, `shadow`, and `opacity`.
* Keep names semantic so UI can change without refactors.

> We **do not** maintain `assets/styles/main.css`. For web targets, Tailwind generates CSS automatically; on native, NativeWind compiles class names to RN styles at runtime.

### 4.1 Config example — semantic design tokens

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#9333EA',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        bg: {
          DEFAULT: '#FFFFFF',
          muted: '#F3F4F6',
        },
        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
        border: '#E5E7EB',
      },
      spacing: {
        'xs': '4',
        'sm': '8',
        'md': '12',
        'lg': '16',
        'xl': '24',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
      borderRadius: {
        xl: 16,
        '2xl': 24,
      },
    },
  },
  plugins: [],
};
```

> Tip: Add an alias file `src/theme/tokens.ts` that re-exports the same semantic names (for places where you need numbers at runtime), but **treat Tailwind config as canonical**.

### 4.2 Using Tailwind in components

```tsx
// Card.tsx
import { View } from 'react-native';
import React from 'react';

export function Card({ children }: React.PropsWithChildren) {
  return (
    <View className="bg-bg rounded-2xl p-lg shadow">
      {children}
    </View>
  );
}
```

```tsx
// Button.tsx
import { Pressable, Text } from 'react-native';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

const base = 'px-xl py-md rounded-xl items-center justify-center';
const variants: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  danger: 'bg-danger',
};

export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''}`} onPress={onPress} disabled={disabled}>
      <Text className="text-white font-semibold">{label}</Text>
    </Pressable>
  );
}
```

### 4.3 Dark mode and theming

* Use Tailwind’s `dark:` variant together with NativeWind’s color scheme integration.
* Provide a theme toggle via `useColorScheme()` or a persisted setting, and set the provider at the app root.

```tsx
// Example dark styles
<View className="bg-bg dark:bg-black">
  <Text className="text-text dark:text-white">…</Text>
</View>
```

### 4.4 When Tailwind isn’t enough

* **Dynamic values** (computed at runtime) can use `StyleSheet.create` **sparingly**; still derive from the same scales (e.g., spacing multipliers).
* Complex animations should use `react-native-reanimated` + class utilities for base styles.

```tsx
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  meter: (pct: number) => ({ width: `${pct}%` }),
});

<View className="h-2 bg-border rounded-full">
  <View className="h-2 bg-success rounded-full" style={styles.meter(progress)} />
</View>
```

### 4.5 Do & Don’t

**Do**

* Use **semantic** classes/tokens (`bg-primary`, `text-text`) instead of raw hex.
* Keep components class-based and composable; prefer variants over boolean style props explosion.
* Centralize spacing/typography in Tailwind scales.

**Don’t**

* Hardcode colors or magic numbers in components.
* Mix many inline styles with Tailwind—favor classes, fall back only for true dynamic cases.
* Maintain parallel CSS files for native; Tailwind config is the single source.

**Assumption:** We use Expo + TypeScript + (optional) Expo Router for file‑based routing.

```
app/                        # Expo Router (file-based routing)
  (tabs)/                   # route groups
    index.tsx               # tab navigator
    home.tsx                # /home
    settings.tsx            # /settings
  _layout.tsx               # root layout for app router
  +not-found.tsx

src/
  components/
    Button/
      Button.tsx
      Button.types.ts
      Button.test.tsx
      index.ts
    Card/
      Card.tsx
      Card.types.ts
      index.ts
  screens/                  # non-router screens, or screen parts used by routes
    HomeScreen/
      HomeScreen.tsx
      HomeScreen.types.ts
  hooks/
    useAuth.ts
    useDebounce.ts
  services/
    api/
      client.ts            # axios/fetch setup
      users.ts             # user endpoints
    storage/
      secureStore.ts
    analytics/
      index.ts
  state/
    store.ts               # Zustand/Redux store
    slices/
      authSlice.ts
  theme/
    colors.ts
    spacing.ts
    typography.ts
    index.ts
  utils/
    formatters.ts
    validators.ts
  i18n/
    index.ts               # i18next init
    locales/
      en.json
      nl.json

assets/
  fonts/
  images/
  styles/
    main.css               # (web mirror only; TS is source of truth)

tests/
  setup.ts                 # RTL/Jest setup

app.json / app.config.ts
babel.config.js
package.json
tsconfig.json
.eslintrc.cjs
.prettierrc
```

**Notes:**

* Use absolute imports with the `@` alias for `src/*` via `tsconfig.json` + Babel module resolver.
* Keep screens thin; push logic to hooks/services.
* Co-locate tests with their subjects or place under `tests/` for e2e/integration.

## 6) File‑Based Routing

**Rule:** If we use Expo Router, respect its conventions strictly.

* Files in `app/` map to routes (`app/home.tsx` → `/home`).
* Use [route groups] like `(auth)/login.tsx` for grouping without affecting paths.
* Use `_layout.tsx` for nested layouts/stacks/tabs.
* Dynamic routes: `[id].tsx`, catch‑alls: `[...slug].tsx`.

> If we **do not** use Expo Router, ignore `app/` and define navigators under `src/navigation/` (React Navigation). In either case, keep navigation artifacts separate from UI components.

## 7) Commit Messages — Conventional Commits

**Format:** `<type>(optional-scope): <short summary>`

**Allowed `type` values:**

* `feat`: new feature
* `fix`: bug fix
* `docs`: documentation changes only
* `style`: code style changes (formatting, no logic)
* `refactor`: code change that neither fixes a bug nor adds a feature
* `perf`: performance improvement
* `test`: add/fix tests
* `build`: changes to build system or dependencies
* `ci`: CI/CD configuration changes (workflows, pipelines)
* `chore`: other changes that don’t modify src or test files
* `revert`: revert a previous commit

**Examples:**

* `feat(auth): add biometric login on iOS`
* `fix(network): retry 429 responses with backoff`
* `docs(readme): add architecture diagram`
* `refactor(theme): extract semantic color tokens`

**Body & footer:** Use the body to explain **what** and **why**. Use footer for breaking changes & issue links.

* `BREAKING CHANGE: renamed theme import paths`
* `Closes #123`

## 8) Branching Model

**Preferred:** Trunk‑based with short‑lived branches + protected `main`.

* `main` — always releasable; protected; requires PR & checks.
* `feat/*` — feature branches, e.g., `feat/auth-biometric`.
* `fix/*` — hotfix/bugfix branches, e.g., `fix/login-token-refresh`.
* `chore/*`, `docs/*`, `refactor/*`, etc., as needed.
* Optional release branches: `release/x.y.z` for stabilization if needed.

**Rules:**

* Always branch from `main`.
* Small, focused PRs (< ~300 LOC preferred) with clear scope.
* Rebase on latest `main` before opening PR; prefer rebase over merge for a linear history.
* Delete remote branches after merge.

> If the team prefers **Git Flow**, adapt names: `develop`, `release/*`, `hotfix/*`. Otherwise default to trunk‑based.

## 9) Linting, Formatting, and Type Safety

* **TypeScript:** `"strict": true` in `tsconfig.json`.
* **ESLint:** `eslint-config-universe` (Expo) or `@react-native/eslint-config`. Enforce no `any`, exhaustive deps for hooks, import ordering, and accessibility.
* **Prettier:** opinionated formatting; no bikeshedding.
* **Husky + lint-staged:** run `tsc --noEmit`, `eslint --fix`, `prettier --check` on staged files before commit.

## 10) Testing

### What kinds of tests do we write?

* **Unit/UI tests** (Jest + React Native Testing Library): components, hooks, utilities.
* **Contract/API tests** (Jest + MSW): validate client ↔ API interactions without hitting the network.
* **End‑to‑end (E2E)** (Detox): automate real device/emulator flows.

### 10.1 Quick start (Jest + React Native Testing Library)

**Install (Expo):**

```bash
# Expo projects
npm i -D jest jest-expo @testing-library/react-native @testing-library/jest-native @types/jest msw whatwg-fetch
```

**Install (Bare React Native):**

```bash
# Bare RN projects
npm i -D jest @testing-library/react-native @testing-library/jest-native react-test-renderer @types/jest msw whatwg-fetch
```

**Package scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:ci": "jest --ci --reporters=default --reporters=jest-junit"
  }
}
```

**Jest config (Expo):** `jest.config.js`

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**Jest config (Bare RN):**

```js
module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-clone-referenced-element|@react-navigation|expo.*|@expo.*)/)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**Test setup:** `tests/setup.ts`

```ts
import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';

// Silence RN logs that clutter test output
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

// Example mocks commonly needed
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
```

**Example component test:** `src/components/Button/Button.test.tsx`

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from './Button';

it('renders translated label and triggers onPress', () => {
  const onPress = jest.fn();
  // simple i18n stub
  jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k:string) => k }) }));

  render(<Button labelKey="auth.signIn" onPress={onPress} />);

  expect(screen.getByText('auth.signIn')).toBeOnTheScreen();
  fireEvent.press(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalled();
});
```

**Example hook test:** `src/hooks/useDebounce.test.ts`

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

test('debounces value updates', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), { initialProps: { v: 'a' } });
  expect(result.current).toBe('a');
  rerender({ v: 'ab' });
  act(() => { jest.advanceTimersByTime(299); });
  expect(result.current).toBe('a');
  act(() => { jest.advanceTimersByTime(1); });
  expect(result.current).toBe('ab');
});
```

**Navigation test tips:**

* For Expo Router, render the screen component directly and mock `expo-router` hooks:

  ```ts
  jest.mock('expo-router', () => ({ useLocalSearchParams: () => ({ id: '1' }), useRouter: () => ({ push: jest.fn() }) }));
  ```
* For React Navigation, wrap under a mocked navigator or use `NavigationContainer`.

### 10.2 Mocking network with MSW

**Setup:** `tests/msw/server.ts`

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  http.get('https://api.example.com/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice', avatarUrl: 'https://…' });
  })
);
```

**Wire up in setup:**

```ts
// tests/setup.ts
import { server } from './msw/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Usage in tests:**

```ts
import { server } from '@/../tests/msw/server';
import { http, HttpResponse } from 'msw';

server.use(http.get('https://api.example.com/users/404', () => HttpResponse.json({ message: 'Not found' }, { status: 404 })));
```

### 10.3 Snapshots (use sparingly)

* Use snapshots for **stable** UI (icons, simple presentational components).
* Avoid snapshotting complex/volatile components; prefer explicit assertions.

### 10.4 E2E testing with Detox (Android/iOS)

**Install:**

```bash
npm i -D detox jest-circus
npx detox init -r jest
```

**Detox config:** `detox.config.js`

```js
/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: { args: { '$0': 'jest' }, jest: { setupTimeout: 120000 } },
  apps: {
    'android.debug': { type: 'android.apk', build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug', binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk' },
    'ios.debug': { type: 'ios.app', build: 'xcodebuild -workspace ios/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build', binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/App.app' }
  },
  devices: { emulator: { type: 'android.emulator', device: { avdName: 'Pixel_5_API_33' } } },
  configurations: { 'android.debug': { device: 'emulator', app: 'android.debug' } }
};
```

**Example E2E test:** `e2e/app.e2e.ts`

```ts
describe('Auth flow', () => {
  beforeAll(async () => { await device.launchApp(); });
  it('signs in successfully', async () => {
    await element(by.id('email-input')).typeText('alice@example.com');
    await element(by.id('password-input')).typeText('password');
    await element(by.id('signin-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

**Run:**

```bash
# unit/UI
npm run test
# e2e
npx detox build -c android.debug
npx detox test -c android.debug
```

### 10.5 CI basics (GitHub Actions example)

```yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test:ci
```

> For Detox on CI, prefer a macOS runner for iOS and set up an Android emulator or use a device farm. Cache Gradle/Pods where applicable.

### 10.6 Coverage & thresholds

* Generate with `npm run test:cov`; publish coverage in PRs (Codecov or GitHub annotations).
* Suggested thresholds: **lines 80%**, **functions 80%**, **branches 70%** to start.

### 10.7 Troubleshooting

* "Cannot find module 'react-native-reanimated'": ensure jest mock in `tests/setup.ts`.
* Red screen: unhandled timers → use `jest.useFakeTimers()` and advance timers.
* Async UI not found → use `findBy*` queries with `await` instead of `getBy*`.

---

## 11) Accessibility & Internationalization

* Provide `accessibilityRole`, `accessibilityLabel`, and support screen readers.
* All user-visible strings must come from i18n JSONs; base locale is `en`, include `nl`.
* Support RTL where possible; avoid layout assumptions.

## 12) Performance Guidelines

* Memoize heavy components with `React.memo`.
* Use `useCallback`/`useMemo` for stable references.
* Virtualize long lists (`FlatList`/`SectionList`), provide `keyExtractor`, `getItemLayout` when possible.
* Avoid inline object/array literals in `style` or props for frequently re-rendered components.
* Batch network calls and debounce user input.

## 13) Error Handling & Logging

* Centralize API error mapping (`services/api/errors.ts`).
* Show human‑readable messages via a toast/snackbar utility.
* Log unexpected errors with a reporter (e.g., Sentry) including device context.

## 14) Environment & Configuration

* Use `.env` (and `app.config.ts`) for environment variables; never commit secrets.
* Provide `.env.example` with placeholders.
* Access configuration through a typed `config.ts` module.

## 15) Pull Request Checklist (Author)

* [ ] Scope is focused; SoC respected; components small & reusable.
* [ ] Types complete; no `any`; props documented.
* [ ] No hardcoded user‑facing text; i18n keys used.
* [ ] Theme tokens used; no magic numbers or inline colors.
* [ ] Unit tests added/updated; CI green.
* [ ] Screenshots/GIFs for visual changes.
* [ ] Accessibility verified.
* [ ] Documentation updated (README/CHANGELOG as needed).

## 16) Code Review Guidelines (Reviewer)

* Enforce SoC, naming, and file structure.
* Demand clear commit messages and branch naming.
* Check for dead code, duplication, and unnecessary complexity.
* Verify tests, accessibility, and performance considerations.

## 17) Exceptions & Deviations

* Deviations require a short ADR (Architecture Decision Record) under `docs/adr/` explaining the context, decision, and consequences.

---

**TL;DR**

* One responsibility per unit. One component per file. `ComponentName.tsx`.
* Typed props. No hardcoded strings—use i18n.
* Central theme tokens in `src/theme/*`; mirror to CSS only for web.
* Use Expo Router file-based routing **if enabled**; otherwise keep navigation isolated.
* Conventional Commits + trunk-based branches.
* Strict TS, ESLint, Prettier, pre-commit checks.
* Tests, a11y, performance, and clear PR process.


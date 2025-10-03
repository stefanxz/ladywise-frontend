# React Native Team Coding Standards

> **Scope:** This guide defines how we write, structure, and review code for our React Native app. It covers component design, naming, typing, styling, routing, commits, branches, and supporting tooling. Adopt these rules for all new code; refactor existing code toward compliance when touched.

---

## 1) Separation of Concerns (SoC)

**Rule:** Each component/class/module has a single, clear responsibility.

* **UI components**: strictly presentational, receive necessary data and callbacks via props. For example, a `UserCard` component displays a user's name and avatar, but does not fetch them directly (this is handled by the container component and passed down as a prop).
* **Containers/screens**: compose UI components and orchestrate data (call hooks/services, handle navigation).
* **Hooks**: encapsulate reusable stateful logic (e.g., `useAuth`, `useDebounce`).
* **Utilities**: pure, reusable helpers (formatting, parsing, validation).

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
* `index.ts` – barrel export (optional for folder‑scoped components)

> If a component grows beyond ~250 lines or violates SoC, split it into child components living in a `ComponentName/` folder using the same convention.

## 3) Props & TypeScript (No Hard‑Coding Text)

**Rules:**

* All components **must** define a `Props` interface (`ComponentNameProps`) or type.
* All incoming data is typed; no `any` and no implicit `any`.
* **Never hardcode user‑facing text** inside components. Use translation keys via our i18n layer (e.g., `i18next`/`expo-localization`).

**Example: `Button.tsx`**

```tsx
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

**We use Tailwind via [NativeWind](https://www.nativewind.dev/) for React Native.** No plain CSS in components. Styling lives in utility classes applied with `className`.

**Example:**
```tsx
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

To define global colors, fonts, spacing, etc. add to the [`tailwind.config.js`](./tailwind.config.js). For example:

```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
      },
      fontFamily: {
        heading: ['Poppins_700Bold'],
        body: ['Poppins_400Regular'],
      },
    },
  },
  plugins: [],
}
```

# 5) Project Structure

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
  screens/                  # non-router screens, or screen parts used by routes    
  hooks/  
  state/
    store.ts               # Zustand/Redux store
    slices/
      authSlice.ts
  utils/
    formatters.ts
    validators.ts
assets/
  fonts/
  images/
  styles/
    main.css               
tests/
  setup.ts                 # RTL/Jest setup
app.json / app.config.ts
babel.config.js
package.json
tsconfig.json
.eslintrc.cjs
.prettierrc
```

## 6) File‑Based Routing

**Rule:** If we use Expo Router, respect its conventions strictly.

* Files in `app/` map to routes (`app/home.tsx` → `/home`).
* Use [route groups] like `(auth)/login.tsx` for grouping without affecting paths.
* Use `_layout.tsx` for nested layouts/stacks/tabs.
* Dynamic routes: `[id].tsx`, catch‑alls: `[...slug].tsx`.

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


## 11) Performance Guidelines

* Memoize heavy components with `React.memo`.
* Use `useCallback`/`useMemo` for stable references.
* Virtualize long lists (`FlatList`/`SectionList`), provide `keyExtractor`, `getItemLayout` when possible.
* Avoid inline object/array literals in `style` or props for frequently re-rendered components.
* Batch network calls and debounce user input.

## 12) Environment & Configuration

* Use `.env` (and `app.config.ts`) for environment variables; never commit secrets.
* Provide `.env.example` with placeholders.
* Access configuration through a typed `config.ts` module.

## 13) Pull Request Checklist (Author)

* [ ] Scope is focused; SoC respected; components small & reusable.
* [ ] Types complete; no `any`; props documented.
* [ ] No hardcoded user‑facing text; i18n keys used.
* [ ] Theme tokens used; no magic numbers or inline colors.
* [ ] Unit tests added/updated; CI green.
* [ ] Screenshots/GIFs for visual changes.
* [ ] Accessibility verified.
* [ ] Documentation updated (README/CHANGELOG as needed).

## 14) Code Review Guidelines (Reviewer)

* Enforce SoC, naming, and file structure.
* Demand clear commit messages and branch naming.
* Check for dead code, duplication, and unnecessary complexity.
* Verify tests, accessibility, and performance considerations.
* Tests, a11y, performance, and clear PR process.


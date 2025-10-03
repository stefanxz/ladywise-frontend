# Team Coding Standards

## 1. Component Naming and Structure
One component per file: a component lives in its own `ComponentName.tsx` file.

Components use PascalCase naming (e.g. `UserCard`).

For each component, its files must be grouped within a single folder for clarity. Below is the preferred structure for any non-trivial component.
```
src/
└── components/
    └── UserProfileCard/
        ├── UserProfileCard.tsx      # The component logic and JSX
        ├── UserProfileCard.types.ts # TypeScript props and interfaces
        ├── UserProfileCard.test.tsx # Unit tests for the component
        └── index.ts                 # Barrel export: export * from './UserProfileCard';
```

Each component should have a single responsibility. We distinguish between two primary types:
- **Presentational Components** (`src/components/`): their purpose is to display UI and receive all data and callbacks exclusively through props. They do not contain business logic, fetch data, or manage global state. They must be **reusable**.
- **Container Components** (`app/` or `src/screens`): their purpose is to compose presentational components and manage logic. They are responsible for fetching data, calling hooks (`useAuth`, `useQuery`) and managing state.

Every component must define its props using a TypeScript `interface` named `ComponentNameProps`. Props should be strictly typed (no `any` types).

**Example:**
```tsx
import { Pressable, Text } from 'react-native';

export interface ButtonProps {
  labelKey: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ labelKey, onPress, disabled }: ButtonProps) {
  return(
    <Pressable onPress={ onPress }>
      <Text className="font-body text-white">{ labelKey }</Text>
    </Pressable>
  )
}
```

## 2. Styling
Styling must be done using Tailwind CSS (via NativeWind) utility classes.

**Example:**
```tsx
<View className="bg-background-primary p-4 rounded-lg border border-border-subtle">
  <Text className="text-text-primary font-heading text-lg">Hello World</Text>
</View>
```

To add a new colors, fonts, spacing, etc. modify [`tailwind.config.js`](./tailwind.config.js).

**Example:**
```tsx
// tailwind.config.js
module.exports = {
// ...
theme: {
    extend: {
      colors: {
        // Use a structured, semantic naming convention
        background: {
          primary: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        brand: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
        },
      },
    fontFamily: {
        heading: ['Poppins_700Bold'],
        body: ['Poppins_400Regular'],
      },
    },
  },
  // ...
}
```

## 3. Git Workflow
We use a simple, trunk-based development model. The `main` branch is our source of truth.
### Branching
- `main` is the primary branch. Must always be stable and deployable.
- **Feature branches**: all work happens on a feature branch, created from `main`.
- **Naming Convention**: `type/short-description`. For example, `feat/user-profile-editing`, `fix/login-crash-on-ios`, `refactor/hooks`.

### Commits
We follow the **Conventional Commits** specification.

**Format:** `type(scope) description`
- `feat`: new feature
- `fix`: bug fix
- `chore`: routine tasks, dependency updates, build changes
- `refactor`: rewriting code w/o changing behavior
- `docs`: documentation
- `style`: code formatting changes
- `test`: adding/fixing tests

**Examples:**
- `feat(auth): implement biometric sign-in`
- `fix(profile): prevent crash when avatar is null`
- `chore: upgrade expo sdk to v50`

### Pull Requests
  - Keep pull requests small and focused. The PR description should explain the **what** and the **why**. Make sure all CI checks (linting, tests) pass before requesting a review. Ideally, rebase on `main` before merging to maintain a linear history.

## Testing

### Unit/UI Tests (Jest, React Native Testing Library)
Test individual components, hooks, and utility functions. The goal is to verify that a component renders correctly based on its props and that user interactions trigger the correct callbacks.

Note that component tests must live in the same subfolder as the tested component, and should be named `ComponentName.test.tsx`.

### E2E Tests (Detox)
Test critical user flows across multiple screens. The goal is to simulate a real user interacting with the compiler app on a device.

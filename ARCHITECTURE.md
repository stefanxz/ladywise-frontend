# LadyWise Frontend Architecture

This document provides a high-level overview of the architectural decisions, patterns, and structure of the LadyWise React Native application.

## High-Level Overview

LadyWise is built using the **Expo** ecosystem, leveraging modern React Native capabilities.
- **Routing**: We use **Expo Router** (v3) for filesystem-based routing, making navigation intuitive and mirroring web standards.
- **Styling**: **NativeWind** allows us to use utility-first Tailwind CSS classes, ensuring design consistency and rapid UI development.
- **State**: We prefer local state for component-specific logic and React Context for global app state (Auth, Theme).

## Directory Structure

The project is organized by feature and function:

```
/
├── app/                  # Application Routes (Expo Router)
│   ├── (auth)/           # Authentication stack (Login, Register) - hidden from URL
│   ├── (main)/           # Main App stack (Tabs: Home, Calendar, etc.)
│   └── onboarding/       # Onboarding flow screens
├── components/           # Reusable UI Components
│   ├── [Component]/      # Co-located component files (Logic, Styles, Tests)
│   └── ...
├── context/              # Global React Context Providers
├── hooks/                # Custom React Hooks (Business Logic)
├── lib/                  # Core Utilities & API
│   ├── api.ts            # Axios instance & endpoints
│   └── types/            # Shared TypeScript interfaces
├── constants/            # App-wide constants (Colors, Strings)
└── assets/               # Static assets (Images, Fonts)
```

## Key Architectural Patterns

### 1. Navigation & Routing (`app/`)
We use Expo Router's directory-based routing.
- **Groups**: Folders like `(auth)` and `(main)` organize routes without affecting the URL path.
- **Layouts**: `_layout.tsx` files define shared UI (headers, tab bars) and navigation logic (stacks vs tabs) for their sub-directories.
- **Auth Guard**: The root layout or high-level contexts check for authentication tokens and redirect users between `(auth)` and `(main)` groups automatically.

### 2. State Management
- **AuthContext**: Manages the user's session token, ID, and login/logout methods. Persists data to secure storage.
- **QuestionnaireContext**: A specialized context used during the onboarding flow to aggregate answers across multiple screens before final submission.
- **Local State**: Screens and components manage their own UI state (form inputs, loading toggles).

### 3. API Layer (`lib/api.ts`)
- All backend communication is centralized in `lib/api.ts`.
- Functions are typed (returning `Promise<Type>`).
- We use a singleton Axios instance configured with interceptors to attach authentication tokens automatically.

### 4. Component Design
- **Container vs. Presentational**: While not strictly enforced in separate folders, we encourage separating logic (hooks, data fetching) from rendering.
- **Atomic Design Influence**: Small, generic components (Buttons, Inputs) are composed into larger, feature-specific components (Forms, Cards).

### 5. Theming (`NativeWind`)
- Styling is applied via `className` props.
- We extend the Tailwind configuration (`tailwind.config.js`) with our custom color palette (`colors.ts`) to ensure brand consistency (e.g., `bg-brand`, `text-headingText`).

## Data Flow

1.  **User Action**: User interacts with UI (e.g., submits a form).
2.  **Handler**: Component calls a handler function.
3.  **Logic/Hook**: Handler invokes a custom hook or Context method.
4.  **API**: The hook calls a function from `lib/api.ts`.
5.  **State Update**: The response updates local state or global Context.
6.  **Render**: UI re-renders to reflect the new state (success message, data table, etc.).

## Security & Privacy
- **Secure Storage**: Sensitive tokens are stored using secure platform storage mechanisms (via helper libraries).
- **Environment Variables**: API URLs and non-secret configuration are managed via `.env` files.

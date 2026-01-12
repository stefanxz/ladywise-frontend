# Changes Walkthrough

This document outlines the fixes and improvements made during this session.

## 1. Fixed "PhaseCardProps" Type Error
**Location**: `app/(main)/home.tsx`

**Issue**: The `PhaseCard` component was throwing a type error because the `subtitle` prop was missing, but `PhaseCardProps` required it.

**Fix**: Added the `subtitle` prop, passing the cycle status description.

```diff
<PhaseCard
  // ... other props
+ subtitle={
+   cycleStatus?.nextEvent
+     ? `${cycleStatus.daysUntilNextEvent} days until ${cycleStatus.nextEvent.toLowerCase()}`
+     : "Log your first period to begin tracking."
+ }
/>
```

## 2. Fixed User Name Not Updating
**Location**: `app/(main)/home.tsx`

**Issue**: The user's name was only fetched on the initial component mount (`useEffect`). If the user updated their profile and navigated back, the old name persisted.

**Fix**: Moved the fetching logic into `useFocusEffect`, ensuring data is refreshed every time the screen comes into focus.

```diff
- useEffect(() => {
+ useFocusEffect(
+   useCallback(() => {
      // Fetch User Profile on every focus
      const user = await getUserById(token, userId);
      // ...
+   }, [])
+ );
```

## 3. Fixed "Hello, there" Placeholder Flash
**Location**: `app/(main)/home.tsx`

**Issue**: `userName` was initialized to `""`, causing the app to fall back to "there" while the network request was pending (approx. 200ms).

**Fix**: Initialized `userName` using the cached `email` from `AuthContext`, providing an immediate, meaningful value.

```diff
- const [userName, setUserName] = useState<string>("");
+ const [userName, setUserName] = useState<string>(
+   email ? email.split("@")[0] : "",
+ );
```

## 4. Addressing Profile Update Latency (Status: 40s Timeout)
**Location**: `lib/api.ts` & `app/(main)/settings/profile.tsx`

**Issue**: Updating the profile was timing out or showing "Update Failed" for user, even when it succeeded on the backend.
**Diagnosis**: Backend logs showed a **~55-second delay** for the `updateHealthDocument` operation (likely due to synchronous LLM risk analysis).

**Changes**:
1.  **Increased API Timeout**: Changed from 10s to **40s** (originally proposed 90s to fully cover the 55s delay, but set to 40s per your preference).
2.  **Optimized Update Logic**: In `profile.tsx`, we separated `updateUser` (fast) and `updateHealthDocument` (slow) to allow independent execution.

> [!NOTE]
> Since the backend takes ~55s, a 40s timeout *may still result in false failure messages* for health updates. A 60s+ timeout is recommended if the backend cannot be optimized.

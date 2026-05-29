# Health Dashboard — Modular Refactor

A fully modularised React health-tracking dashboard with Google Fit integration and manual entry support.

---

## Project Structure

```
src/
├── constants/
│   └── index.js               # App-wide constants (URLs, keys, thresholds, colors)
│
├── utils/
│   └── index.js               # Pure helper functions (storage, formatting, insights)
│
├── hooks/
│   └── useHealthData.js       # Single custom hook — ALL state and data logic lives here
│
└── components/
    ├── ui/
    │   └── index.jsx          # Reusable primitives: Badge, MetricCard, EmptyState,
    │                          #   LoadingScreen, SyncError
    │
    ├── dashboard/
    │   ├── Dashboard.jsx      # ⭐ Orchestration-only component (no data logic inside)
    │   ├── DashboardHeader.jsx # Profile, source toggle, action button
    │   ├── ActivityChart.jsx  # Recharts AreaChart with custom tooltip
    │   ├── HistoryTable.jsx   # Recent entries table
    │   └── Sidebar.jsx        # InsightsPanel + VitalsPanel
    │
    └── modals/
        └── ManualEntryModal.jsx # Fully controlled form with validation
```

---

## Bugs Fixed

### 1. Stale closure on `fetchGoogleData`
**Before:** `fetchGoogleData` was declared as a plain `async` function inside
`Dashboard`, then called inside `useEffect`. Each render created a new
reference, but the effect captured the old one.

**Fix:** Wrapped in `useCallback` inside `useHealthData.js`. The hook's
`useEffect` init block then uses the stable reference via the ESLint
exemption comment.

---

### 2. `loading` stuck as `true` on Google Fit error
**Before:** The `catch` branch in `fetchGoogleData` logged the error but
never called `setLoading(false)`, leaving the app on the loading screen
indefinitely.

**Fix:** `setLoading(false)` moved into the `finally` block so it always
runs regardless of success or failure.

---

### 3. Uncontrolled → controlled React warning in the modal
**Before:** `ManualEntryModal` initialised form fields from `initialData`
directly. Fields absent from `initialData` were `undefined`, causing React
to treat those inputs as uncontrolled, then controlled (warning + potential
cursor bugs).

**Fix:** `DEFAULT_FORM` defines every key with an empty string `""` as the
fallback. Merge with `initialData` maps `null`/`undefined` values to `""`:
```js
Object.entries(initialData).map(([k, v]) => [k, v ?? ""])
```

---

### 4. Redundant date property in `handleManualSave`
**Before:**
```js
const entry = { ...newData, date: newData.date, source: 'manual' };
```
`date: newData.date` is a no-op on top of the spread — confusing and
fragile if the spread ever overrides it.

**Fix:** Removed; entry is now `{ ...formData, source: 'manual' }`.

---

### 5. Numeric parsing done at change-time (caused NaN in storage)
**Before:** Some implementations parsed numbers immediately on `onChange`,
which turned an empty field into `NaN` and persisted it to localStorage.

**Fix:** Fields are kept as raw strings in component state and parsed at
`handleSubmit` time only. Empty strings become `null` in the saved payload.

---

### 6. `toggleSource` re-fetch logic used stale `googleData.length`
**Before:** The length check inside `toggleSource` captured a stale closure
value in some render cycles, causing unnecessary re-fetches.

**Fix:** `googleData.length` is declared as a dependency in `useCallback`,
so the check always sees the current value.

---

### 7. No sync error surface
**Before:** Network errors in `fetchGoogleData` were silently swallowed into
`console.error` only — the user saw nothing.

**Fix:** Added `syncError` state. The `SyncError` component renders a
dismissible red banner when set.

---

### 8. `today` could be wrong entry (non-latest after filter)
**Before:** `setToday(sortedData[sortedData.length - 1])` assumed the sorted
array always had the newest entry last. If two entries shared a date,
ordering was non-deterministic.

**Fix:** After `sortByDate`, `latest = sorted[sorted.length - 1]` is always
the true maximum date because sort is stable and consistent.

---

### 9. Modal did not scroll-lock body or handle ESC
**Before:** The modal overlaid content but did not prevent scrolling behind
it, and clicking Escape did not close it.

**Fix:** Two `useEffect` calls in `ManualEntryModal`:
- One toggles `document.body.style.overflow = "hidden"` while open.
- One binds/unbinds an `Escape` key listener while open.

---

## Design Improvements

| Area | Before | After |
|---|---|---|
| Background | `bg-slate-950` flat | `#080c14` + subtle indigo grid pattern |
| Cards | Flat rounded-3xl | Gradient accent per metric, hover scale |
| Border radius | `rounded-3xl` everywhere | Contextual `rounded-xl` / `rounded-2xl` |
| Badges | Text-only | Dot indicator + pill shape |
| Chart tooltip | Default recharts | Custom dark card tooltip |
| Empty state | Generic | Action button pointing to correct action |
| Loading | Plain text | Animated pulse indicator |
| Modal | Single column form | 2-column grid with validation feedback |
| Vitals sidebar | Raw strings | Icon per vital, unit label separated |
| Insights | Bullet list | Left-border accent cards, status badge |

---

## Usage

```jsx
// App.jsx
import { Dashboard } from "./src/index";

export default function App() {
  return <Dashboard />;
}
```

To replace the original `ManuallyEntry` import:
```jsx
// Old (from Dashboard.jsx)
import ManualEntryModal from "./ManuallyEntry";

// New
import { ManualEntryModal } from "../modals/ManualEntryModal";
```

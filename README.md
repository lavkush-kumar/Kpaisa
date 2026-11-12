# Flight Seat Selection & Passenger Management

React + Vite. Mock data only. Supports 3–2 and 2–3–2 layouts, per-passenger seat assignment, dynamic pricing, and meal selection (bonus).

## Run
```bash
npm install
npm run dev        # local
npm run build      # production build in /dist
```
Deploy: push to GitHub and import into Vercel (zero config), or publish `dist/` to GitHub Pages.

## State management
All booking state lives in one `useReducer` inside `hooks/useBooking.js`:
`{ layout, count, activeId, seats: {passengerId → seatId}, meals: {passengerId → mealId} }`.
Components are presentational; they read state and dispatch actions. Seat map data (async, with loading/error/empty states) is local to `App`.

## Seat assignment logic
- **One seat per passenger:** `seats` is keyed by passenger id, so assigning replaces the previous seat.
- **No double booking:** the reducer ignores `ASSIGN` if the seat id already exists in `seats`; `App` also shows a toast explaining why.
- **Occupied seats** are disabled and give feedback if triggered.
- **Switching passengers** only changes `activeId`, so existing assignments are kept.
- **Change/remove:** click another seat to move, click your own seat or "Remove seat" to clear it.
- **Changing passenger count** trims assignments/meals for removed passengers; **switching layout** clears seats (seat ids differ per aircraft).

## Pricing
Seat price comes from its category (Standard ₹0, Premium ₹250, Extra Legroom ₹350). Totals are derived on every render from `seats` + `meals`, never stored, so they can't go stale.

## Structure
```
src/
  data.js              layouts, categories, meals, mock async API
  hooks/useBooking.js  reducer + selectors
  components/          Seat, SeatMap, PassengerPanel, Summary
  App.jsx              data loading, toasts, composition
```

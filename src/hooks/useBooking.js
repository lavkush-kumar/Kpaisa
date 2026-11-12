import { useReducer } from "react";

const MAX = 6;
const makePassengers = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Passenger ${i + 1}` }));

const initial = { layout: "3-2", count: 2, activeId: 1, seats: {}, meals: {} }; // seats: {passengerId: seatId}

// Pure reducer: all assignment rules live here, so UI can't break them.
function reducer(state, action) {
  switch (action.type) {
    case "SET_LAYOUT": // seat ids differ between aircraft, so assignments reset
      return state.layout === action.layout ? state : { ...state, layout: action.layout, seats: {} };
    case "SET_COUNT": {
      const count = Math.min(MAX, Math.max(1, action.count));
      const keep = (obj) => Object.fromEntries(Object.entries(obj).filter(([id]) => +id <= count));
      return { ...state, count, activeId: Math.min(state.activeId, count), seats: keep(state.seats), meals: keep(state.meals) };
    }
    case "SET_ACTIVE": return { ...state, activeId: action.id };
    case "ASSIGN": {
      const taken = Object.values(state.seats).includes(action.seatId);
      if (taken) return state;
      return { ...state, seats: { ...state.seats, [state.activeId]: action.seatId } }; // replaces previous seat
    }
    case "REMOVE": { const { [action.id]: _, ...rest } = state.seats; return { ...state, seats: rest }; }
    case "SET_MEAL": return { ...state, meals: { ...state.meals, [action.id]: action.mealId } };
    default: return state;
  }
}

export function useBooking() {
  const [state, dispatch] = useReducer(reducer, initial);
  const passengers = makePassengers(state.count);
  const ownerOf = (seatId) => passengers.find((p) => state.seats[p.id] === seatId);
  return { state, dispatch, passengers, ownerOf, MAX };
}

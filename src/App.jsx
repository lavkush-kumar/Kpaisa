import { useEffect, useState, useCallback } from "react";
import { LAYOUTS, fetchSeatMap } from "./data.js";
import { useBooking } from "./hooks/useBooking.js";
import PassengerPanel from "./components/PassengerPanel.jsx";
import SeatMap from "./components/SeatMap.jsx";
import Summary from "./components/Summary.jsx";

export default function App() {
  const { state, dispatch, passengers, ownerOf, MAX } = useBooking();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    setStatus("loading");
    fetchSeatMap(state.layout).then((r) => { setRows(r); setStatus("ready"); }).catch(() => setStatus("error"));
  }, [state.layout]);
  useEffect(load, [load]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); } }, [toast]);

  const seatLookup = (id) => rows.flat().flatMap((r) => (r.groups ? r.groups.flat() : [])).find((s) => s.id === id);

  const handleSelect = (seat) => {
    const owner = ownerOf(seat.id);
    if (seat.occupied) return setToast("That seat is already occupied.");
    if (owner && owner.id !== state.activeId) return setToast(`${seat.id} is already assigned to ${owner.name}.`);
    if (owner) return dispatch({ type: "REMOVE", id: owner.id }); // clicking your own seat again unselects it
    dispatch({ type: "ASSIGN", seatId: seat.id });
    const active = passengers.find((p) => p.id === state.activeId);
    setToast(`${seat.id} assigned to ${active.name}.`);
  };

  return (
    <main className="app">
      <header className="top">
        <div>
          <h1>Choose your seats</h1>
          <p>Pick a passenger, then tap a seat. Prices update as you go.</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Aircraft layout">
          {Object.entries(LAYOUTS).map(([key, l]) => (
            <button key={key} role="tab" aria-selected={state.layout === key} onClick={() => dispatch({ type: "SET_LAYOUT", layout: key })}>{l.label}</button>
          ))}
        </div>
      </header>

      <div className="grid">
        <div className="side">
          <PassengerPanel state={state} dispatch={dispatch} passengers={passengers} seatLookup={seatLookup} max={MAX} />
          <Summary passengers={passengers} state={state} seatLookup={seatLookup} />
        </div>
        {status === "loading" && <div className="card skeleton" aria-busy="true">Loading seat map…</div>}
        {status === "error" && (
          <div className="card state" role="alert">
            <p>We couldn’t load the seat map.</p>
            <button className="primary" onClick={load}>Try again</button>
          </div>
        )}
        {status === "ready" && (rows.length
          ? <SeatMap rows={rows} ownerOf={ownerOf} activeId={state.activeId} onSelect={handleSelect} />
          : <div className="card state">No seats are available on this flight.</div>)}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

import { MEALS, formatPrice } from "../data.js";

export default function PassengerPanel({ state, dispatch, passengers, seatLookup, max }) {
  return (
    <section className="card" aria-label="Passengers">
      <div className="head">
        <h2>Passengers</h2>
        <div className="stepper">
          <button aria-label="Remove passenger" disabled={state.count <= 1} onClick={() => dispatch({ type: "SET_COUNT", count: state.count - 1 })}>−</button>
          <output>{state.count}</output>
          <button aria-label="Add passenger" disabled={state.count >= max} onClick={() => dispatch({ type: "SET_COUNT", count: state.count + 1 })}>+</button>
        </div>
      </div>
      <ul className="plist">
        {passengers.map((p) => {
          const seat = seatLookup(state.seats[p.id]);
          const active = p.id === state.activeId;
          return (
            <li key={p.id} className={active ? "p p--active" : "p"}>
              <div className="prow">
                <button className="avatar" aria-pressed={active} aria-label={`Select ${p.name}`} onClick={() => dispatch({ type: "SET_ACTIVE", id: p.id })}>P{p.id}</button>
                <input className="pname" aria-label={`Name of passenger ${p.id}`} maxLength={24} value={state.names[p.id] ?? ""} placeholder={`Passenger ${p.id}`}
                  onFocus={() => dispatch({ type: "SET_ACTIVE", id: p.id })} onChange={(e) => dispatch({ type: "SET_NAME", id: p.id, name: e.target.value })} />
                <span className="pseat">{seat ? `${seat.id} · ${formatPrice(seat.price)}` : "No seat yet"}</span>
              </div>
              <div className="pextras">
                <label>
                  Meal
                  <select value={state.meals[p.id] ?? "none"} onChange={(e) => dispatch({ type: "SET_MEAL", id: p.id, mealId: e.target.value })}>
                    {MEALS.map((m) => <option key={m.id} value={m.id}>{m.name} ({formatPrice(m.price)})</option>)}
                  </select>
                </label>
                {seat && <button className="link" onClick={() => dispatch({ type: "REMOVE", id: p.id })}>Remove seat</button>}
              </div>
            </li>
          );
        })}
      </ul>
      <button className="link reset" onClick={() => dispatch({ type: "RESET" })}>Reset all selections</button>
    </section>
  );
}

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
              <button className="pselect" aria-pressed={active} onClick={() => dispatch({ type: "SET_ACTIVE", id: p.id })}>
                <span className="avatar">P{p.id}</span>
                <span className="pname">{p.name}</span>
                <span className="pseat">{seat ? `${seat.id} · ${formatPrice(seat.price)}` : "No seat yet"}</span>
              </button>
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
    </section>
  );
}

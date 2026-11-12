import { MEALS, formatPrice } from "../data.js";

export default function Summary({ passengers, state, seatLookup }) {
  const lines = passengers.map((p) => {
    const seat = seatLookup(state.seats[p.id]);
    const meal = MEALS.find((m) => m.id === (state.meals[p.id] ?? "none"));
    return { p, seat, meal, subtotal: (seat?.price ?? 0) + meal.price };
  });
  const seatTotal = lines.reduce((s, l) => s + (l.seat?.price ?? 0), 0);
  const mealTotal = lines.reduce((s, l) => s + l.meal.price, 0);
  return (
    <section className="card" aria-label="Price summary">
      <h2>Summary</h2>
      <ul className="lines">
        {lines.map(({ p, seat, meal, subtotal }) => (
          <li key={p.id}>
            <div><b>{p.name}</b><small>{seat ? `Seat ${seat.id} (${formatPrice(seat.price)})` : "Seat not selected"} · {meal.name}</small></div>
            <span>₹{subtotal}</span>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div><dt>Seats</dt><dd>₹{seatTotal}</dd></div>
        <div><dt>Meals</dt><dd>₹{mealTotal}</dd></div>
        <div className="grand"><dt>Total</dt><dd>₹{seatTotal + mealTotal}</dd></div>
      </dl>
    </section>
  );
}

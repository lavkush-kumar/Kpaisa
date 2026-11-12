import { useState } from "react";
import Seat from "./Seat.jsx";
import { CATEGORIES, formatPrice } from "../data.js";

const Legend = () => (
  <ul className="legend">
    {[["available", "Available"], ["occupied", "Occupied"], ["selected", "Your pick"], ["assigned", "Other passenger"]].map(([k, t]) => (
      <li key={k}><i className={`dot seat--${k}`} />{t}</li>
    ))}
    {Object.entries(CATEGORIES).filter(([k]) => k !== "standard").map(([k, c]) => (
      <li key={k}><i className={`dot ring seat--${k}`} />{c.label} · ₹{c.price}</li>
    ))}
  </ul>
);

export default function SeatMap({ rows, ownerOf, activeId, onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <section className="card" aria-label="Seat map">
      <Legend />
      <div className="info" aria-live="polite">
        {hover
          ? <>Seat <b>{hover.id}</b> · {CATEGORIES[hover.category].label} · <b>{hover.occupied ? "Occupied" : formatPrice(hover.price)}</b></>
          : "Hover or focus a seat to see its price."}
      </div>
      <div className="cabin">
        {rows.map((row) => (
          <div className="row" key={row.number}>
            {row.groups.map((group, gi) => (
              <div className="group" key={gi}>
                {gi > 0 && <span className="rownum" aria-hidden>{row.number}</span>}
                {group.map((seat) => {
                  const owner = ownerOf(seat.id);
                  return <Seat key={seat.id} seat={seat} owner={owner} isActive={owner?.id === activeId} onSelect={onSelect} onHover={setHover} />;
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

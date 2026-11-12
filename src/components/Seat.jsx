export default function Seat({ seat, owner, isActive, onSelect, onHover }) {
  const state = seat.occupied ? "occupied" : owner ? (isActive ? "selected" : "assigned") : "available";
  const label = `Seat ${seat.id}, ${seat.category}, ${seat.price ? "₹" + seat.price : "free"}${seat.occupied ? ", occupied" : ""}`;
  return (
    <button
      type="button"
      className={`seat seat--${state} seat--${seat.category}`}
      aria-label={label}
      aria-pressed={!!owner}
      disabled={seat.occupied}
      onClick={() => onSelect(seat)}
      onMouseEnter={() => onHover(seat)}
      onFocus={() => onHover(seat)}
    >
      {owner ? `P${owner.id}` : seat.letter}
    </button>
  );
}

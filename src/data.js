// Mock data + a fake async "API" so loading/error states are real.
export const LAYOUTS = {
  "3-2": { label: "3–2", groups: [["A", "B", "C"], ["D", "E"]], rows: 14 },
  "2-3-2": { label: "2–3–2", groups: [["A", "B"], ["C", "D", "E"], ["F", "G"]], rows: 14 },
};

export const CATEGORIES = {
  standard: { label: "Standard", price: 0 },
  premium: { label: "Premium", price: 250 },
  legroom: { label: "Extra Legroom", price: 350 },
};

// Overrides taken from the assessment's sample table
const OVERRIDES = { "1A": "standard", "1B": "standard", "1C": "legroom", "1D": "standard", "1E": "premium", "2A": "legroom", "2B": "standard" };

const categoryFor = (row, letter) => {
  const key = `${row}${letter}`;
  if (OVERRIDES[key]) return OVERRIDES[key];
  if (row <= 3) return "premium";
  if (row === 7 || row === 8) return "legroom"; // exit rows
  return "standard";
};

// Deterministic "random" occupancy so the demo is stable between reloads
const isOccupied = (row, letter) => (row * 7 + letter.charCodeAt(0) * 13) % 6 === 0 && !OVERRIDES[`${row}${letter}`];

export const MEALS = [
  { id: "none", name: "No meal", price: 0 },
  { id: "veg", name: "Veg thali", price: 0 },
  { id: "sandwich", name: "Grilled sandwich", price: 120 },
  { id: "wrap", name: "Paneer wrap", price: 180 },
  { id: "biryani", name: "Chicken biryani", price: 250 },
];

export const fetchSeatMap = (layoutKey) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const layout = LAYOUTS[layoutKey];
      if (!layout) return reject(new Error("Unknown aircraft layout."));
      const rows = Array.from({ length: layout.rows }, (_, i) => {
        const number = i + 1;
        return {
          number,
          groups: layout.groups.map((letters) =>
            letters.map((letter) => {
              const category = categoryFor(number, letter);
              return { id: `${number}${letter}`, row: number, letter, category, price: CATEGORIES[category].price, occupied: isOccupied(number, letter) };
            })
          ),
        };
      });
      resolve(rows);
    }, 500);
  });

export const formatPrice = (n) => (n === 0 ? "Free" : `₹${n}`);

import { describe, it, expect } from "vitest";
import { reducer, initial } from "./useBooking.js";

const run = (...actions) => actions.reduce(reducer, initial);

describe("seat assignment rules", () => {
  it("assigns a seat to the active passenger", () => {
    expect(run({ type: "ASSIGN", seatId: "1A" }).seats).toEqual({ 1: "1A" });
  });
  it("replaces the previous seat (one seat per passenger)", () => {
    expect(run({ type: "ASSIGN", seatId: "1A" }, { type: "ASSIGN", seatId: "2B" }).seats).toEqual({ 1: "2B" });
  });
  it("blocks two passengers on one seat", () => {
    const s = run({ type: "ASSIGN", seatId: "1A" }, { type: "SET_ACTIVE", id: 2 }, { type: "ASSIGN", seatId: "1A" });
    expect(s.seats).toEqual({ 1: "1A" });
  });
  it("keeps assignments when switching passengers", () => {
    const s = run({ type: "ASSIGN", seatId: "1A" }, { type: "SET_ACTIVE", id: 2 }, { type: "ASSIGN", seatId: "1B" });
    expect(s.seats).toEqual({ 1: "1A", 2: "1B" });
  });
  it("removes a seat", () => {
    expect(run({ type: "ASSIGN", seatId: "1A" }, { type: "REMOVE", id: 1 }).seats).toEqual({});
  });
  it("drops data of removed passengers when count shrinks", () => {
    const s = run({ type: "SET_ACTIVE", id: 2 }, { type: "ASSIGN", seatId: "3C" }, { type: "SET_COUNT", count: 1 });
    expect(s.seats).toEqual({});
    expect(s.activeId).toBe(1);
  });
  it("clears seats when layout changes", () => {
    expect(run({ type: "ASSIGN", seatId: "1A" }, { type: "SET_LAYOUT", layout: "2-3-2" }).seats).toEqual({});
  });
  it("clamps passenger count between 1 and 6", () => {
    expect(run({ type: "SET_COUNT", count: 99 }).count).toBe(6);
    expect(run({ type: "SET_COUNT", count: 0 }).count).toBe(1);
  });
});

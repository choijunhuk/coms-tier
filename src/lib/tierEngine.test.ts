import { describe, expect, it } from "vitest";
import {
  calculateTierStats,
  createDefaultRows,
  createTierShareText,
  generateTierResult,
  moveItemToTier,
  unplaceItem,
} from "./tierEngine";
import type { TierItem, TierTemplate } from "../types/tier";

const items: TierItem[] = [
  { id: "ts", name: "TypeScript", description: "타입 안정성", tags: ["language"] },
  { id: "py", name: "Python", description: "빠른 실험", tags: ["language"] },
  { id: "java", name: "Java", description: "백엔드 기본기", tags: ["language"] },
];

const template: TierTemplate = {
  id: "languages",
  title: "개발 언어 티어표",
  description: "COMS 언어 취향 정리",
  category: "language",
  rows: createDefaultRows(),
  items,
  createdAt: "2026-06-19T00:00:00.000Z",
  updatedAt: "2026-06-19T00:00:00.000Z",
  isSample: true,
};

describe("tierEngine", () => {
  it("creates the default S through D rows", () => {
    const rows = createDefaultRows();

    expect(rows.map((row) => row.name)).toEqual(["S", "A", "B", "C", "D"]);
    expect(rows.every((row) => row.color.startsWith("#"))).toBe(true);
  });

  it("moves an item between tiers without duplicate placements", () => {
    let placements = moveItemToTier([], "ts", "tier-s");
    placements = moveItemToTier(placements, "ts", "tier-a");

    expect(placements).toEqual([{ itemId: "ts", tierId: "tier-a", placedAt: expect.any(String) }]);
  });

  it("returns an item to the unplaced area", () => {
    const placements = moveItemToTier([], "ts", "tier-s");
    const next = unplaceItem(placements, "ts");

    expect(next).toHaveLength(0);
  });

  it("generates result rows and tier stats", () => {
    const placements = [
      ...moveItemToTier([], "ts", "tier-s"),
      ...moveItemToTier([], "py", "tier-a"),
    ];
    const result = generateTierResult(template, placements, { now: () => "done" });
    const stats = calculateTierStats([result], template);

    expect(result.rows[0]?.items.map((item) => item.name)).toEqual(["TypeScript"]);
    expect(stats.find((stat) => stat.itemId === "ts")?.sTierCount).toBe(1);
    expect(stats.find((stat) => stat.itemId === "ts")?.mostPlacedTier).toBe("S");
  });

  it("creates COMS share text from top tier items", () => {
    const result = generateTierResult(template, moveItemToTier([], "ts", "tier-s"), { now: () => "done" });
    const text = createTierShareText(result);

    expect(text).toContain("COMS 티어표");
    expect(text).toContain("개발 언어 티어표");
    expect(text).toContain("TypeScript");
  });
});

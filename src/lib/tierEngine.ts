import type { TierItem, TierPlacement, TierResult, TierRow, TierStats, TierTemplate } from "../types/tier";

interface EngineOptions {
  now?: () => string;
}

const defaultNow = (): string => new Date().toISOString();

const makeId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const createDefaultRows = (): TierRow[] => [
  { id: "tier-s", name: "S", color: "#0071e3", description: "지금 바로 고르는 최상위 선택" },
  { id: "tier-a", name: "A", color: "#34c759", description: "믿고 쓰는 좋은 선택" },
  { id: "tier-b", name: "B", color: "#ffcc00", description: "상황에 따라 충분히 좋은 선택" },
  { id: "tier-c", name: "C", color: "#ff9f0a", description: "호불호와 조건이 있는 선택" },
  { id: "tier-d", name: "D", color: "#ff3b30", description: "이번에는 아래쪽에 두는 선택" },
];

export const createTierRow = (name: string, color = "#0071e3", description = ""): TierRow => ({
  id: `tier-${name.toLowerCase()}-${Date.now().toString(36)}`,
  name,
  color,
  description,
});

export const moveItemToTier = (
  placements: TierPlacement[],
  itemId: string,
  tierId: string,
  options: EngineOptions = {},
): TierPlacement[] => [
  ...placements.filter((placement) => placement.itemId !== itemId),
  { itemId, tierId, placedAt: (options.now ?? defaultNow)() },
];

export const unplaceItem = (placements: TierPlacement[], itemId: string): TierPlacement[] =>
  placements.filter((placement) => placement.itemId !== itemId);

export const itemsForTier = (template: TierTemplate, placements: TierPlacement[], tierId: string): TierItem[] => {
  const itemMap = new Map(template.items.map((item) => [item.id, item]));
  return placements
    .filter((placement) => placement.tierId === tierId)
    .map((placement) => itemMap.get(placement.itemId))
    .filter((item): item is TierItem => Boolean(item));
};

export const getUnplacedItems = (template: TierTemplate, placements: TierPlacement[]): TierItem[] => {
  const placed = new Set(placements.map((placement) => placement.itemId));
  return template.items.filter((item) => !placed.has(item.id));
};

export const generateTierResult = (
  template: TierTemplate,
  placements: TierPlacement[],
  options: EngineOptions = {},
): TierResult => ({
  id: makeId("tier-result"),
  templateId: template.id,
  templateTitle: template.title,
  rows: template.rows.map((row) => ({
    row,
    items: itemsForTier(template, placements, row.id),
  })),
  unplacedItems: getUnplacedItems(template, placements),
  placements,
  completedAt: (options.now ?? defaultNow)(),
});

const scoreForRow = (rows: TierRow[], tierId: string): number => {
  const index = rows.findIndex((row) => row.id === tierId);
  if (index < 0) {
    return 0;
  }
  return Math.max(1, rows.length - index);
};

export const calculateTierStats = (results: TierResult[], template: TierTemplate): TierStats[] => {
  const stats = new Map<
    string,
    { itemName: string; sTierCount: number; aTierCount: number; scoreTotal: number; totalPlacements: number; counts: Map<string, number> }
  >();

  template.items.forEach((item) => {
    stats.set(item.id, {
      itemName: item.name,
      sTierCount: 0,
      aTierCount: 0,
      scoreTotal: 0,
      totalPlacements: 0,
      counts: new Map<string, number>(),
    });
  });

  results
    .filter((result) => result.templateId === template.id)
    .forEach((result) => {
      result.placements.forEach((placement) => {
        const stat = stats.get(placement.itemId);
        const row = template.rows.find((candidate) => candidate.id === placement.tierId);
        if (!stat || !row) {
          return;
        }
        stat.totalPlacements += 1;
        stat.scoreTotal += scoreForRow(template.rows, row.id);
        stat.counts.set(row.name, (stat.counts.get(row.name) ?? 0) + 1);
        if (row.name.toUpperCase() === "S") {
          stat.sTierCount += 1;
        }
        if (row.name.toUpperCase() === "A") {
          stat.aTierCount += 1;
        }
      });
    });

  return Array.from(stats.entries())
    .map(([itemId, stat]) => {
      const mostPlacedTier =
        Array.from(stat.counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "-";
      return {
        itemId,
        itemName: stat.itemName,
        sTierCount: stat.sTierCount,
        aTierCount: stat.aTierCount,
        averageTierScore: stat.totalPlacements === 0 ? 0 : stat.scoreTotal / stat.totalPlacements,
        mostPlacedTier,
        totalPlacements: stat.totalPlacements,
      };
    })
    .sort((a, b) => b.sTierCount - a.sTierCount || b.averageTierScore - a.averageTierScore || a.itemName.localeCompare(b.itemName));
};

export const createTierShareText = (result: TierResult): string => {
  const topRow = result.rows[0];
  const topNames = topRow?.items.map((item) => item.name).join(", ") || "아직 없음";
  const topLabel = topRow?.row.name ?? "S";
  return `COMS 티어표 '${result.templateTitle}'를 만들었음. 내 ${topLabel}티어는 ${topNames}!`;
};

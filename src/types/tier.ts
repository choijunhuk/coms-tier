export type TierCategory =
  | "language"
  | "framework"
  | "project"
  | "seminar"
  | "food"
  | "meme"
  | "error"
  | "activity"
  | "custom";

export interface TierRow {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface TierItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface TierTemplate {
  id: string;
  title: string;
  description: string;
  category: TierCategory;
  rows: TierRow[];
  items: TierItem[];
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface TierPlacement {
  itemId: string;
  tierId: string;
  placedAt: string;
}

export interface TierResultRow {
  row: TierRow;
  items: TierItem[];
}

export interface TierResult {
  id: string;
  templateId: string;
  templateTitle: string;
  rows: TierResultRow[];
  unplacedItems: TierItem[];
  placements: TierPlacement[];
  completedAt: string;
}

export interface TierStats {
  itemId: string;
  itemName: string;
  sTierCount: number;
  aTierCount: number;
  averageTierScore: number;
  mostPlacedTier: string;
  totalPlacements: number;
}

import { useDroppable } from "@dnd-kit/core";
import type { TierItem, TierRow as TierRowType } from "../types/tier";
import { TierItemCard } from "./TierItemCard";

interface TierRowProps {
  row: TierRowType;
  items: TierItem[];
  selectedItemId?: string;
  onItemClick: (itemId: string) => void;
}

export function TierRow({ row, items, selectedItemId, onItemClick }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: row.id });

  return (
    <section ref={setNodeRef} className={`tier-row ${isOver ? "tier-row-over" : ""}`}>
      <div className="tier-row-label" style={{ backgroundColor: row.color }}>
        <span>{row.name}</span>
      </div>
      <div className="min-w-0 flex-1 p-3">
        <div className="flex flex-wrap gap-3">
          {items.length === 0 ? (
            <p className="px-2 py-3 text-sm font-semibold text-[var(--app-subtle)]">{row.description || "여기로 항목을 옮겨보세요."}</p>
          ) : (
            items.map((item) => <TierItemCard key={item.id} item={item} selected={selectedItemId === item.id} onClick={onItemClick} />)
          )}
        </div>
      </div>
    </section>
  );
}

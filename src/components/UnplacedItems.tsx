import { useDroppable } from "@dnd-kit/core";
import type { TierItem } from "../types/tier";
import { TierItemCard } from "./TierItemCard";

interface UnplacedItemsProps {
  items: TierItem[];
  selectedItemId?: string;
  onItemClick: (itemId: string) => void;
}

export function UnplacedItems({ items, selectedItemId, onItemClick }: UnplacedItemsProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "unplaced" });

  return (
    <section ref={setNodeRef} className={`coms-card p-4 ${isOver ? "ring-2 ring-[var(--app-accent)]/30" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[var(--app-text)]">미배치 항목</h2>
        <span className="text-xs font-bold text-[var(--app-subtle)]">{items.length}개</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {items.length === 0 ? (
          <p className="text-sm font-semibold text-[var(--app-muted)]">모든 항목이 티어에 배치되었습니다.</p>
        ) : (
          items.map((item) => <TierItemCard key={item.id} item={item} selected={selectedItemId === item.id} onClick={onItemClick} />)
        )}
      </div>
    </section>
  );
}

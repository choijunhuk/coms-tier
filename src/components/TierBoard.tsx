import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { getUnplacedItems, itemsForTier, moveItemToTier, unplaceItem } from "../lib/tierEngine";
import type { TierPlacement, TierTemplate } from "../types/tier";
import { TierRow } from "./TierRow";
import { UnplacedItems } from "./UnplacedItems";

interface TierBoardProps {
  template: TierTemplate;
  placements: TierPlacement[];
  onChange: (placements: TierPlacement[]) => void;
  onSave: () => void;
}

export function TierBoard({ template, placements, onChange, onSave }: TierBoardProps) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  const sensors = useSensors(pointerSensor);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  const selectItem = (itemId: string): void => {
    setSelectedItemId((current) => (current === itemId ? undefined : itemId));
  };

  const placeSelected = (tierId: string): void => {
    if (!selectedItemId) {
      return;
    }
    onChange(moveItemToTier(placements, selectedItemId, tierId));
    setSelectedItemId(undefined);
  };

  const unplaceSelected = (): void => {
    if (!selectedItemId) {
      return;
    }
    onChange(unplaceItem(placements, selectedItemId));
    setSelectedItemId(undefined);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const itemId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    if (!overId) {
      return;
    }
    if (overId === "unplaced") {
      onChange(unplaceItem(placements, itemId));
      return;
    }
    if (template.rows.some((row) => row.id === overId)) {
      onChange(moveItemToTier(placements, itemId, overId));
    }
  };

  const reset = (): void => {
    onChange([]);
    setSelectedItemId(undefined);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <UnplacedItems items={getUnplacedItems(template, placements)} selectedItemId={selectedItemId} onItemClick={selectItem} />
        <section className="coms-card overflow-hidden p-2">
          <div className="grid gap-2">
            {template.rows.map((row) => (
              <TierRow key={row.id} row={row} items={itemsForTier(template, placements, row.id)} selectedItemId={selectedItemId} onItemClick={selectItem} />
            ))}
          </div>
        </section>

        {selectedItemId ? (
          <section className="coms-card sticky bottom-3 z-20 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <p className="text-sm font-black text-[var(--app-text)]">선택한 항목을 어디에 둘까요?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {template.rows.map((row) => (
                <button key={row.id} type="button" className="tier-place-button" style={{ borderColor: row.color }} onClick={() => placeSelected(row.id)}>
                  {row.name}
                </button>
              ))}
              <button type="button" className="coms-button-ghost" onClick={unplaceSelected}>
                미배치
              </button>
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" className="coms-button-ghost" onClick={reset}>
            <RotateCcw size={16} /> 초기화
          </button>
          <button type="button" className="coms-button-primary" onClick={onSave}>
            <Save size={16} /> 결과 저장
          </button>
        </div>
      </div>
    </DndContext>
  );
}

import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { Play } from "lucide-react";
import { useState } from "react";
import { mediaFromInput } from "../lib/media";
import type { TierItem } from "../types/tier";

interface TierItemCardProps {
  item: TierItem;
  selected?: boolean;
  onClick?: (itemId: string) => void;
}

export function TierItemCard({ item, selected = false, onClick }: TierItemCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const initial = item.name.trim().charAt(0) || "C";
  const media = item.media ?? mediaFromInput(item.imageUrl);

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`tier-item-card ${selected ? "tier-item-card-selected" : ""} ${isDragging ? "opacity-60" : ""}`}
      style={{ transform: CSS.Translate.toString(transform) }}
      onClick={() => onClick?.(item.id)}
      {...listeners}
      {...attributes}
    >
      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--app-accent-soft)] text-lg font-black text-[var(--app-accent-text)]">
        {media?.type === "youtube" ? (
          <span className="grid h-full w-full place-items-center bg-[#0f0f0f] text-white">
            <Play size={18} fill="currentColor" />
          </span>
        ) : media && !imageFailed ? (
          <img className="h-full w-full object-cover" src={media.url} alt="" onError={() => setImageFailed(true)} />
        ) : (
          initial
        )}
      </div>
      <div className="min-w-0">
        <p className="break-words text-sm font-black leading-5 text-[var(--app-text)]">{item.name}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--app-muted)]">{item.description}</p>
      </div>
    </button>
  );
}

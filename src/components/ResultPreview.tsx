import { Play } from "lucide-react";
import { mediaFromInput } from "../lib/media";
import type { TierResult } from "../types/tier";

interface ResultPreviewProps {
  result: TierResult;
}

export function ResultPreview({ result }: ResultPreviewProps) {
  return (
    <section className="coms-card overflow-hidden p-2">
      <div className="grid gap-2">
        {result.rows.map(({ row, items }) => (
          <div key={row.id} className="tier-row">
            <div className="tier-row-label" style={{ backgroundColor: row.color }}>
              <span>{row.name}</span>
            </div>
            <div className="min-w-0 flex-1 p-3">
              <div className="flex flex-wrap gap-3">
                {items.length === 0 ? (
                  <p className="px-2 py-3 text-sm font-semibold text-[var(--app-subtle)]">비어 있음</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="tier-result-chip">
                      <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded bg-white/70">
                        {item.media?.type === "youtube" || mediaFromInput(item.imageUrl)?.type === "youtube" ? (
                          <Play size={13} fill="currentColor" />
                        ) : item.media ?? mediaFromInput(item.imageUrl) ? (
                          <img className="h-full w-full object-cover" src={(item.media ?? mediaFromInput(item.imageUrl))?.url} alt="" />
                        ) : null}
                      </span>
                      {item.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

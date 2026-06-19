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
                  items.map((item) => {
                    const media = item.media ?? mediaFromInput(item.imageUrl);
                    const isYt = media?.type === "youtube" || mediaFromInput(item.imageUrl)?.type === "youtube";
                    const hasMedia = Boolean(media ?? mediaFromInput(item.imageUrl));

                    return (
                      <div key={item.id} className="tier-result-chip">
                        {(isYt || hasMedia) && (
                          <span className="tier-result-chip-thumb">
                            {isYt ? (
                              <Play size={10} fill="currentColor" className="text-[var(--app-text)]" />
                            ) : (
                              <img
                                className="h-full w-full object-cover"
                                src={(media ?? mediaFromInput(item.imageUrl))?.url}
                                alt=""
                              />
                            )}
                          </span>
                        )}
                        {item.name}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

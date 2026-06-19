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

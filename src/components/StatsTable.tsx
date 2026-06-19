import type { TierStats } from "../types/tier";

interface StatsTableProps {
  stats: TierStats[];
}

export function StatsTable({ stats }: StatsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--app-hairline)] bg-[var(--app-surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--app-surface-soft)] text-xs font-black text-[var(--app-subtle)]">
            <tr>
              <th className="px-4 py-3">항목</th>
              <th className="px-4 py-3">S 배치</th>
              <th className="px-4 py-3">A 배치</th>
              <th className="px-4 py-3">평균 점수</th>
              <th className="px-4 py-3">최다 티어</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--app-hairline)]">
            {stats.map((stat) => (
              <tr key={stat.itemId} className="text-[var(--app-text)]">
                <td className="max-w-64 break-words px-4 py-4 font-black">{stat.itemName}</td>
                <td className="px-4 py-4">{stat.sTierCount}</td>
                <td className="px-4 py-4">{stat.aTierCount}</td>
                <td className="px-4 py-4">{stat.averageTierScore.toFixed(1)}</td>
                <td className="px-4 py-4 font-bold">{stat.mostPlacedTier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

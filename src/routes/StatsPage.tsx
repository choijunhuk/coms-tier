import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { StatsTable } from "../components/StatsTable";
import { findSampleTier } from "../lib/sampleData";
import { getStoredResults, getStoredTemplates } from "../lib/storage";
import { calculateTierStats } from "../lib/tierEngine";
import type { TierTemplate } from "../types/tier";

const findTemplate = (id: string | undefined): TierTemplate | undefined => {
  if (!id) {
    return undefined;
  }
  return getStoredTemplates().find((template) => template.id === id) ?? findSampleTier(id);
};

export function StatsPage() {
  const { id } = useParams();
  const template = useMemo(() => findTemplate(id), [id]);
  const stats = template ? calculateTierStats(getStoredResults(), template) : [];

  if (!template) {
    return <EmptyState title="통계를 계산할 티어표가 없습니다" description="먼저 티어표를 만들거나 샘플을 저장해 주세요." actionLabel="홈으로" actionTo="/" />;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Local stats</p>
        <h1 className="mt-3 break-words text-4xl font-black text-[var(--app-text)]">{template.title} 통계</h1>
        <p className="mt-3 text-base leading-7 text-[var(--app-muted)]">이 브라우저에서 저장한 결과만 기반으로 계산합니다. 서버 DB로 옮기기 쉽도록 계산 로직은 `lib`에 분리했습니다.</p>
      </header>
      <StatsTable stats={stats} />
    </div>
  );
}

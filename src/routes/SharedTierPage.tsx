import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ResultPreview } from "../components/ResultPreview";
import { TierList } from "../components/TierList";
import { getSharedDocument } from "../lib/miniApi";
import type { TierResult, TierTemplate } from "../types/tier";

const isResult = (payload: TierResult | TierTemplate): payload is TierResult =>
  "placements" in payload && "rows" in payload;

export function SharedTierPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<TierResult | TierTemplate | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("공유 링크가 올바르지 않습니다.");
      return;
    }
    getSharedDocument(slug)
      .then((document) => setPayload(document.payload))
      .catch(() => setError("공유된 티어표를 찾을 수 없습니다."));
  }, [slug]);

  if (error) {
    return <EmptyState title="공유 티어표를 열 수 없습니다" description={error} actionLabel="홈으로" actionTo="/" />;
  }

  if (!payload) {
    return <div className="coms-card p-6 text-sm font-bold text-[var(--app-muted)]">공유 티어표를 불러오는 중입니다.</div>;
  }

  if (isResult(payload)) {
    return (
      <div className="space-y-6">
        <header className="coms-card p-6">
          <p className="apple-eyebrow">Shared result</p>
          <h1 className="mt-3 break-words text-4xl font-black text-[var(--app-text)]">{payload.templateTitle}</h1>
        </header>
        <ResultPreview result={payload} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Shared template</p>
        <h1 className="mt-3 text-4xl font-black text-[var(--app-text)]">공유된 티어표</h1>
      </header>
      <TierList title="바로 배치" templates={[payload]} emptyText="공유된 템플릿이 없습니다." />
      <button type="button" className="coms-button-primary" onClick={() => navigate(`/edit/${payload.id}`, { state: { template: payload } })}>
        이 티어표 배치하기
      </button>
    </div>
  );
}

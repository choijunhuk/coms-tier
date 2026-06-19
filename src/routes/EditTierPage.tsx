import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { TierBoard } from "../components/TierBoard";
import { findSampleTier } from "../lib/sampleData";
import { clearDraftPlacements, getDraftPlacements, getStoredTemplates, saveDraftPlacements, saveResult } from "../lib/storage";
import { generateTierResult } from "../lib/tierEngine";
import type { TierPlacement, TierTemplate } from "../types/tier";

const findTemplate = (id: string | undefined): TierTemplate | undefined => {
  if (!id) {
    return undefined;
  }
  return getStoredTemplates().find((template) => template.id === id) ?? findSampleTier(id);
};

export function EditTierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as { template?: TierTemplate; storageWarning?: boolean } | null;
  const routeTemplate = routeState && routeState.template?.id === id ? routeState.template : undefined;
  const template = useMemo(() => routeTemplate ?? findTemplate(id), [id, routeTemplate]);
  const [placements, setPlacements] = useState<TierPlacement[]>(() => (template ? getDraftPlacements(template.id) : []));
  const [storageWarning, setStorageWarning] = useState(routeState?.storageWarning ? "브라우저 저장소에 저장되지 않은 티어표입니다. 새로고침하면 사라질 수 있습니다." : "");

  useEffect(() => {
    setPlacements(template ? getDraftPlacements(template.id) : []);
  }, [template]);

  if (!template) {
    return <EmptyState title="티어표를 찾을 수 없습니다" description="삭제되었거나 이 브라우저에 저장되지 않은 티어표입니다." actionLabel="홈으로" actionTo="/" />;
  }

  const changePlacements = (next: TierPlacement[]): void => {
    setPlacements(next);
    saveDraftPlacements(template.id, next);
  };

  const save = (): void => {
    const result = generateTierResult(template, placements);
    const saved = saveResult(result);
    clearDraftPlacements(template.id);
    navigate(`/result/${result.id}`, { state: saved ? undefined : { result, storageWarning: true } });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Arrange</p>
        <h1 className="mt-3 break-words text-4xl font-black text-[var(--app-text)]">{template.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-muted)]">
          PC에서는 항목을 드래그해서 옮기고, 모바일에서는 항목을 터치한 뒤 아래 배치 버튼을 누르면 됩니다.
        </p>
      </header>
      {storageWarning ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {storageWarning}
          <button type="button" className="ml-2 underline" onClick={() => setStorageWarning("")}>
            닫기
          </button>
        </p>
      ) : null}
      <TierBoard template={template} placements={placements} onChange={changePlacements} onSave={save} />
    </div>
  );
}

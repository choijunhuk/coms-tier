import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TierForm } from "../components/TierForm";
import { saveTemplate } from "../lib/storage";
import type { TierTemplate } from "../types/tier";

export function CreateTierPage() {
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState("");

  const handleSubmit = (template: TierTemplate): void => {
    const saved = saveTemplate(template);
    setSaveError(saved ? "" : "브라우저 저장소에 저장하지 못했습니다. 지금 만든 티어표는 이 화면 흐름에서만 이어집니다.");
    navigate(`/edit/${template.id}`, { state: saved ? undefined : { template, storageWarning: true } });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Create</p>
        <h1 className="mt-3 text-4xl font-black text-[var(--app-text)]">티어표 만들기</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-muted)]">
          기본 S/A/B/C/D 티어에서 시작하고, 색상과 이름을 바꿔 COMS 주제에 맞게 조정할 수 있습니다.
        </p>
      </header>
      {saveError ? <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{saveError}</p> : null}
      <TierForm onSubmit={handleSubmit} />
    </div>
  );
}

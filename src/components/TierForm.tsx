import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { mediaFromInput } from "../lib/media";
import { uploadMediaFile } from "../lib/miniApi";
import { sampleTierItems } from "../lib/sampleData";
import { createDefaultRows, createTierRow } from "../lib/tierEngine";
import type { TierCategory, TierItem, TierRow, TierTemplate } from "../types/tier";

interface TierFormProps {
  onSubmit: (template: TierTemplate) => void;
}

const categories: { value: TierCategory; label: string }[] = [
  { value: "language", label: "개발 언어" },
  { value: "framework", label: "프레임워크" },
  { value: "project", label: "프로젝트" },
  { value: "seminar", label: "세미나 주제" },
  { value: "food", label: "야식 메뉴" },
  { value: "meme", label: "개발자 밈" },
  { value: "error", label: "에러 메시지" },
  { value: "activity", label: "동아리 활동" },
  { value: "custom", label: "직접 입력" },
];

const createDraftItem = (index: number): TierItem => ({
  id: `item-${Date.now().toString(36)}-${index}`,
  name: "",
  description: "",
  imageUrl: "",
  tags: [],
});

export function TierForm({ onSubmit }: TierFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TierCategory>("language");
  const [rows, setRows] = useState<TierRow[]>(createDefaultRows());
  const [items, setItems] = useState<TierItem[]>([0, 1, 2, 3].map(createDraftItem));
  const [uploadingId, setUploadingId] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState("");

  const validItems = items.filter((item) => item.name.trim().length > 0);
  const canSubmit = title.trim().length > 0 && description.trim().length > 0 && rows.length >= 2 && validItems.length >= 1;

  const updateRow = (id: string, patch: Partial<TierRow>): void => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const updateItem = (id: string, patch: Partial<TierItem>): void => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const setMediaUrl = (id: string, value: string): void => {
    updateItem(id, { imageUrl: value, media: mediaFromInput(value) });
  };

  const uploadItemMedia = async (item: TierItem, file: File | undefined): Promise<void> => {
    if (!file) {
      return;
    }
    setUploadingId(item.id);
    setUploadError("");
    try {
      const url = await uploadMediaFile(file, item.name || "티어표 항목");
      setMediaUrl(item.id, url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "미디어 업로드에 실패했습니다.");
    } finally {
      setUploadingId(undefined);
    }
  };

  const addSamples = (): void => {
    setItems(sampleTierItems.map((sample, index) => ({ ...sample, id: `${sample.id}-${index}` })));
    if (!title) {
      setTitle("개발 언어 티어표");
      setDescription("COMS 구성원의 언어 취향을 등급으로 나눠봅니다.");
      setCategory("language");
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    const now = new Date().toISOString();
    onSubmit({
      id: `tier-${Date.now().toString(36)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      rows,
      items: validItems.map((item, index) => ({
        ...item,
        id: item.id || `item-${index}`,
        name: item.name.trim(),
        description: item.description.trim() || "설명이 아직 없습니다.",
        imageUrl: item.imageUrl?.trim() || undefined,
        media: item.media ?? mediaFromInput(item.imageUrl),
        tags: item.tags,
      })),
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <section className="coms-card grid gap-4 p-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--app-text)]">제목</span>
          <input className="coms-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 개발 언어 티어표" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--app-text)]">카테고리</span>
          <select className="coms-input" value={category} onChange={(event) => setCategory(event.target.value as TierCategory)}>
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-[var(--app-text)]">설명</span>
          <textarea className="coms-input min-h-28 resize-y py-3" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
      </section>

      <section className="coms-card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[var(--app-text)]">티어 행</h2>
          <button type="button" className="coms-button-ghost" onClick={() => setRows((current) => [...current, createTierRow(`T${current.length + 1}`)])}>
            <Plus size={16} /> 티어 행 추가
          </button>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid gap-3 md:grid-cols-[0.6fr_0.6fr_1fr_auto]">
            <input className="coms-input" value={row.name} onChange={(event) => updateRow(row.id, { name: event.target.value })} aria-label="티어 이름" />
            <input className="coms-input h-11" type="color" value={row.color} onChange={(event) => updateRow(row.id, { color: event.target.value })} aria-label="티어 색상" />
            <input className="coms-input" value={row.description} onChange={(event) => updateRow(row.id, { description: event.target.value })} placeholder="티어 설명" />
            <button type="button" className="coms-icon-button" onClick={() => setRows((current) => current.filter((target) => target.id !== row.id))} disabled={rows.length <= 2} aria-label={`${row.name} 티어 삭제`}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[var(--app-text)]">항목 목록</h2>
          <div className="flex gap-2">
            <button type="button" className="coms-button-ghost" onClick={addSamples}>
              <Sparkles size={16} /> 샘플 항목
            </button>
            <button type="button" className="coms-button-primary" onClick={() => setItems((current) => [...current, createDraftItem(current.length)])}>
              <Plus size={16} /> 항목 추가
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          {uploadError ? <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{uploadError}</p> : null}
          {items.map((item, index) => (
            <article key={item.id} className="coms-card grid gap-3 p-4 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto]">
              <input className="coms-input" value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} placeholder={`항목 ${index + 1} 이름`} />
              <input className="coms-input" value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} placeholder="짧은 설명" />
              <div className="grid gap-2">
                <input className="coms-input" value={item.imageUrl ?? ""} onChange={(event) => setMediaUrl(item.id, event.target.value)} placeholder="이미지/GIF/YouTube URL" />
                <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--app-hairline)] bg-[var(--app-surface)] px-3 text-xs font-black text-[var(--app-muted)] transition hover:bg-[var(--app-surface-soft)]">
                  {uploadingId === item.id ? "업로드 중..." : "파일 업로드"}
                  <input className="sr-only" type="file" accept="image/*,.gif" onChange={(event) => void uploadItemMedia(item, event.target.files?.[0])} />
                </label>
              </div>
              <input
                className="coms-input"
                value={item.tags.join(", ")}
                onChange={(event) => updateItem(item.id, { tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })}
                placeholder="태그, 쉼표로 구분"
              />
              <button type="button" className="coms-icon-button" onClick={() => setItems((current) => current.filter((target) => target.id !== item.id))} aria-label={`${item.name || "항목"} 삭제`}>
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="coms-button-primary min-h-12 px-6" disabled={!canSubmit}>
          티어표 만들기
        </button>
      </div>
    </form>
  );
}

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TierList } from "../components/TierList";
import { listProfileDocuments, listSharedDocuments } from "../lib/miniApi";
import type { MiniDocument } from "../lib/miniApi";
import { sampleTiers } from "../lib/sampleData";
import { getStoredTemplates } from "../lib/storage";
import type { TierResult, TierTemplate } from "../types/tier";

type TierPayload = TierTemplate | TierResult;

const isTemplate = (payload: TierPayload): payload is TierTemplate => "items" in payload && "title" in payload;
const isResult = (payload: TierPayload): payload is TierResult => "placements" in payload && "templateTitle" in payload;

export function HomePage() {
  const [query, setQuery] = useState("");
  const [profileDocs, setProfileDocs] = useState<MiniDocument<TierPayload>[]>([]);
  const [sharedDocs, setSharedDocs] = useState<MiniDocument<TierPayload>[]>([]);
  const navigate = useNavigate();
  const storedTemplates = getStoredTemplates();
  const allTemplates = useMemo(() => [...storedTemplates, ...sampleTiers], [storedTemplates]);
  const filteredTemplates = allTemplates.filter((template) => {
    const haystack = `${template.title} ${template.description} ${template.category}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  useEffect(() => {
    listSharedDocuments().then(setSharedDocs).catch(() => setSharedDocs([]));
    listProfileDocuments().then(setProfileDocs).catch(() => setProfileDocs([]));
  }, []);

  const openProfileDoc = (doc: MiniDocument<TierPayload>): void => {
    if (isTemplate(doc.payload)) {
      navigate(`/edit/${doc.payload.id}`, { state: { template: doc.payload } });
      return;
    }
    if (isResult(doc.payload)) {
      navigate(`/result/${doc.payload.id}`, { state: { result: doc.payload } });
    }
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div>
          <p className="apple-eyebrow">COMS tier board</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight text-[var(--app-text)] sm:text-6xl">좋다, 애매하다, 다시 생각한다를 한 화면에.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--app-muted)]">
            개발 언어, 프레임워크, 야식 메뉴, 에러 메시지, 활동 주제를 S/A/B/C/D로 나눠보고 COMS 안에서 가볍게 공유하세요.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="coms-button-primary min-h-12 px-5" to="/create">
              티어표 만들기
            </Link>
            <a className="coms-button-ghost min-h-12 px-5" href="#samples">
              샘플 보기
            </a>
          </div>
        </div>
        <div className="coms-card p-5">
          <div className="mini-tier-board">
            {["S", "A", "B", "C", "D"].map((name, index) => (
              <div key={name} className="mini-tier-row">
                <span>{name}</span>
                <i style={{ width: `${92 - index * 12}%` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="coms-card p-4">
        <label className="flex items-center gap-3">
          <Search size={18} className="text-[var(--app-subtle)]" />
          <input
            className="h-11 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[var(--app-subtle)]"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="언어, 프레임워크, 야식, 에러 메시지 검색"
          />
        </label>
      </section>

      {query ? (
        <TierList title="검색 결과" templates={filteredTemplates} emptyText="조건에 맞는 티어표가 없습니다." />
      ) : (
        <>
          <TierList title="최근 만든 티어표" templates={storedTemplates} emptyText="아직 직접 만든 티어표가 없습니다." />
          <ServerTierList title="내 프로필 저장" docs={profileDocs} emptyText="로그인 후 만든 티어표와 결과가 여기에 저장됩니다." onOpen={openProfileDoc} />
          <ServerTierList title="COMS 공유 티어표" docs={sharedDocs} emptyText="아직 공유된 티어표가 없습니다." />
          <div id="samples">
            <TierList title="샘플 티어표" templates={sampleTiers} emptyText="샘플을 불러오지 못했습니다." />
          </div>
        </>
      )}
    </div>
  );
}

interface ServerTierListProps {
  title: string;
  docs: MiniDocument<TierPayload>[];
  emptyText: string;
  onOpen?: (doc: MiniDocument<TierPayload>) => void;
}

function ServerTierList({ title, docs, emptyText, onOpen }: ServerTierListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-black text-[var(--app-text)]">{title}</h2>
        <span className="text-xs font-bold text-[var(--app-subtle)]">{docs.length}개</span>
      </div>
      {docs.length === 0 ? (
        <div className="coms-card px-5 py-8 text-center text-sm font-semibold text-[var(--app-muted)]">{emptyText}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <article key={`${doc.contentType}-${doc.contentId}`} className="coms-card flex min-h-52 flex-col p-5">
              <p className="text-xs font-bold uppercase text-[var(--app-accent-text)]">{doc.contentType === "result" ? "결과" : "템플릿"} · {doc.ownerName || doc.ownerStudentId}</p>
              <h3 className="mt-2 break-words text-xl font-black leading-7 text-[var(--app-text)]">{doc.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--app-muted)]">{doc.description || "설명이 없습니다."}</p>
              <div className="mt-auto pt-5">
                {doc.shared && doc.shareUrl ? (
                  <Link className="coms-button-primary" to={doc.shareUrl.replace("/tier", "")}>
                    공유 링크 열기
                  </Link>
                ) : (
                  <button type="button" className="coms-button-primary" onClick={() => onOpen?.(doc)}>
                    열기
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TierList } from "../components/TierList";
import { sampleTiers } from "../lib/sampleData";
import { getStoredTemplates } from "../lib/storage";

export function HomePage() {
  const [query, setQuery] = useState("");
  const storedTemplates = getStoredTemplates();
  const allTemplates = useMemo(() => [...storedTemplates, ...sampleTiers], [storedTemplates]);
  const filteredTemplates = allTemplates.filter((template) => {
    const haystack = `${template.title} ${template.description} ${template.category}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

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
          <div id="samples">
            <TierList title="샘플 티어표" templates={sampleTiers} emptyText="샘플을 불러오지 못했습니다." />
          </div>
        </>
      )}
    </div>
  );
}

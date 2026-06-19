import { Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ResultPreview } from "../components/ResultPreview";
import { shareProfileDocument } from "../lib/miniApi";
import { copyText, createResultShareText } from "../lib/share";
import { getResultById } from "../lib/storage";

export function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const routeState = location.state as { result?: ReturnType<typeof getResultById>; storageWarning?: boolean } | null;
  const result = id ? getResultById(id) ?? routeState?.result : routeState?.result;
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const shareText = useMemo(() => (result ? createResultShareText(result) : ""), [result]);

  if (!result) {
    return <EmptyState title="결과를 찾을 수 없습니다" description="이 브라우저에 저장된 결과가 아니거나 삭제되었습니다." actionLabel="홈으로" actionTo="/" />;
  }

  const copy = async (): Promise<void> => {
    try {
      const shared = await shareProfileDocument("result", result);
      const link = shared.shareUrl ? `${window.location.origin}${shared.shareUrl}` : "";
      const ok = await copyText(link ? `${shareText}\n${link}` : shareText);
      setCopied(ok);
      setShareMessage(link ? `공유 링크가 생성되었습니다: ${link}` : "공유 텍스트를 복사했습니다.");
    } catch {
      const ok = await copyText(shareText);
      setCopied(ok);
      setShareMessage(ok ? "서버 공유는 실패했지만 공유 텍스트를 복사했습니다. 로그인 상태를 확인해주세요." : "공유에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="coms-card p-6">
        <p className="apple-eyebrow">Share result</p>
        <h1 className="mt-3 break-words text-4xl font-black text-[var(--app-text)]">{result.templateTitle}</h1>
        <p className="mt-4 rounded-lg bg-[var(--app-surface-soft)] px-4 py-4 text-base font-bold leading-7 text-[var(--app-text)]">{shareText}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="coms-button-primary" onClick={copy}>
            <Share2 size={16} /> 결과 복사
          </button>
          <Link className="coms-button-ghost" to={`/edit/${result.templateId}`}>
            다시 수정하기
          </Link>
          <Link className="coms-button-ghost" to="/create">
            새로 만들기
          </Link>
        </div>
      </header>
      {routeState?.storageWarning ? (
        <p className="coms-alert-warn">
          브라우저 저장소에 결과를 저장하지 못했습니다. 이 결과는 새로고침하면 사라질 수 있습니다.
        </p>
      ) : null}
      {copied || shareMessage ? <p className="coms-alert-ok">{shareMessage || "공유 텍스트를 복사했습니다."}</p> : null}
      <ResultPreview result={result} />
    </div>
  );
}

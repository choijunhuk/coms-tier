import { Layers3, LogIn } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { loginComsUser } from "../lib/miniApi";
import type { ComsUser, LoginCredentials } from "../lib/miniApi";

interface LoginScreenProps {
  onLogin: (user: ComsUser) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({ identifier: "", password: "", rememberMe: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const identifier = credentials.identifier.trim();
    if (!identifier || !credentials.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      onLogin(await loginComsUser({ ...credentials, identifier }));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[var(--app-bg)] px-4 py-8 text-[var(--app-text)]">
      <section className="mx-auto grid w-full max-w-5xl gap-6 self-center lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5">
          <span className="accent-icon grid size-14 place-items-center rounded-lg bg-[var(--app-accent)]">
            <Layers3 size={28} />
          </span>
          <div>
            <p className="apple-eyebrow">COMS only</p>
            <h1 className="mt-3 max-w-xl break-words text-5xl font-black leading-tight sm:text-6xl">로그인 후 티어표를 엽니다.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[var(--app-muted)]">
              COMS 계정으로 확인된 구성원만 티어표 목록, 공유 링크, 저장 결과를 볼 수 있습니다.
            </p>
          </div>
        </div>

        <form className="coms-card space-y-4 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.14)]" onSubmit={(event) => void submit(event)}>
          <div>
            <p className="apple-eyebrow">COMS account</p>
            <h2 className="mt-2 text-2xl font-black">COMS 티어표 로그인</h2>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-bold">학번 또는 이메일</span>
            <input className="coms-input" value={credentials.identifier} onChange={(event) => setCredentials((current) => ({ ...current, identifier: event.target.value }))} autoComplete="username" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold">비밀번호</span>
            <input className="coms-input" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} autoComplete="current-password" />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[var(--app-muted)]">
            <input type="checkbox" checked={credentials.rememberMe} onChange={(event) => setCredentials((current) => ({ ...current, rememberMe: event.target.checked }))} />
            로그인 유지
          </label>
          {error ? <p className="coms-alert-error">{error}</p> : null}
          <button type="submit" className="coms-button-primary min-h-12 w-full" disabled={loading}>
            <LogIn size={16} /> {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}

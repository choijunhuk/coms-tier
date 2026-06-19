import { Layers3, LogIn, LogOut, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { FormEvent, ReactNode } from "react";
import { getCurrentUser, loginComsUser, logoutComsUser } from "../lib/miniApi";
import type { ComsUser, LoginCredentials } from "../lib/miniApi";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<ComsUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({ identifier: "", password: "", rememberMe: true });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const identifier = credentials.identifier.trim();
    if (!identifier || !credentials.password) {
      setAuthError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const nextUser = await loginComsUser({ ...credentials, identifier });
      setUser(nextUser);
      setCredentials((current) => ({ ...current, identifier: "", password: "" }));
      setAuthOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await logoutComsUser();
      setUser(null);
      setAuthOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "로그아웃에 실패했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--app-hairline)] bg-[color-mix(in_srgb,var(--app-surface)_88%,transparent)] backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2 font-black">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--app-accent)] text-white">
              <Layers3 size={18} />
            </span>
            <span className="truncate">COMS 티어표</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <NavLink className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`} to="/">
              <Layers3 size={15} /> 목록
            </NavLink>
            <NavLink className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`} to="/create">
              <Plus size={15} /> 만들기
            </NavLink>
            {user ? (
              <>
                <span className="hidden rounded-full bg-[var(--app-accent-soft)] px-3 py-2 text-xs font-black text-[var(--app-accent-text)] sm:inline-flex">
                  {user.name}
                </span>
                <button type="button" className="coms-nav-link" onClick={() => void logout()} disabled={authLoading}>
                  <LogOut size={15} /> 로그아웃
                </button>
              </>
            ) : (
              <button type="button" className="coms-nav-link" onClick={() => setAuthOpen((open) => !open)}>
                <LogIn size={15} /> 로그인
              </button>
            )}
          </div>
        </nav>
        {authOpen && !user ? (
          <div className="fixed inset-x-4 top-16 z-50 mx-auto max-w-md">
            <form className="coms-card space-y-4 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.16)]" onSubmit={(event) => void submitLogin(event)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="apple-eyebrow">COMS account</p>
                  <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">티어표에서 바로 로그인</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">COMS 계정으로 저장, 업로드, 공유 링크 생성을 사용할 수 있습니다.</p>
                </div>
                <button type="button" className="coms-icon-button" onClick={() => setAuthOpen(false)} aria-label="로그인 닫기">
                  <X size={16} />
                </button>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-bold text-[var(--app-text)]">학번 또는 이메일</span>
                <input className="coms-input" value={credentials.identifier} onChange={(event) => setCredentials((current) => ({ ...current, identifier: event.target.value }))} autoComplete="username" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-[var(--app-text)]">비밀번호</span>
                <input className="coms-input" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} autoComplete="current-password" />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-[var(--app-muted)]">
                <input type="checkbox" checked={credentials.rememberMe} onChange={(event) => setCredentials((current) => ({ ...current, rememberMe: event.target.checked }))} />
                로그인 유지
              </label>
              {authError ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{authError}</p> : null}
              <button type="submit" className="coms-button-primary min-h-11 w-full" disabled={authLoading}>
                {authLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

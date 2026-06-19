import { Layers3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getCurrentUser } from "../lib/miniApi";
import type { ComsUser } from "../lib/miniApi";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<ComsUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

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
              <span className="hidden rounded-full bg-[var(--app-accent-soft)] px-3 py-2 text-xs font-black text-[var(--app-accent-text)] sm:inline-flex">
                {user.name}
              </span>
            ) : (
              <a className="coms-nav-link" href="/login">
                로그인
              </a>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

import { Layers3, LogOut, Moon, Plus, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getCurrentUser, logoutComsUser } from "../lib/miniApi";
import type { ComsUser } from "../lib/miniApi";
import { AuthGate } from "./AuthGate";
import { LoginScreen } from "./LoginScreen";
import { useTheme } from "../contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<ComsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((nextUser) => {
        if (mounted) setUser(nextUser);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await logoutComsUser();
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthGate checking={checking} user={user} loginScreen={<LoginScreen onLogin={setUser} />}>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
        <header
          className="sticky top-0 z-40 border-b border-[var(--app-hairline)] backdrop-blur-xl"
          style={{ background: "var(--app-nav-bg)" }}
        >
          <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <Link to="/" className="flex min-w-0 items-center gap-2 font-black">
              <img src={logoUrl} alt="" className="size-9 shrink-0 object-contain" draggable={false} />
              <span className="truncate">COMS 티어표</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <NavLink
                className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`}
                to="/"
              >
                <Layers3 size={15} /> 목록
              </NavLink>
              <NavLink
                className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`}
                to="/create"
              >
                <Plus size={15} /> 만들기
              </NavLink>
              <span className="hidden rounded-full bg-[var(--app-accent-soft)] px-3 py-2 text-xs font-black text-[var(--app-accent-text)] sm:inline-flex">
                {user?.name}
              </span>

              {/* Theme toggle */}
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={resolvedTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
                title={resolvedTheme === "dark" ? "라이트 모드" : "다크 모드"}
              >
                {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button
                type="button"
                className="coms-nav-link"
                onClick={() => void logout()}
                disabled={authLoading}
              >
                <LogOut size={15} /> 로그아웃
              </button>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </div>
    </AuthGate>
  );
}

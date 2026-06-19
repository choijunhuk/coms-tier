import type { ReactNode } from "react";
import type { ComsUser } from "../lib/miniApi";

interface AuthGateProps {
  checking: boolean;
  user: ComsUser | null;
  loginScreen: ReactNode;
  children: ReactNode;
}

export function AuthGate({ checking, user, loginScreen, children }: AuthGateProps) {
  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--app-bg)] px-4 text-center text-[var(--app-text)]">
        <div className="coms-card max-w-sm p-6">
          <p className="apple-eyebrow">COMS account</p>
          <h1 className="mt-2 text-2xl font-black">로그인 상태 확인 중</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return loginScreen;
  }

  return children;
}

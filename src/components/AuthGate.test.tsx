import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthGate } from "./AuthGate";

const user = { studentId: "20250001", name: "홍길동" };

describe("AuthGate", () => {
  it("hides app content until a COMS member is logged in", () => {
    const markup = renderToStaticMarkup(
      <AuthGate checking={false} user={null} loginScreen={<section>COMS 티어표 로그인</section>}>
        <main>샘플 티어표 목록</main>
      </AuthGate>,
    );

    expect(markup).toContain("COMS 티어표 로그인");
    expect(markup).not.toContain("샘플 티어표 목록");
  });

  it("shows app content after login", () => {
    const markup = renderToStaticMarkup(
      <AuthGate checking={false} user={user} loginScreen={<section>COMS 티어표 로그인</section>}>
        <main>샘플 티어표 목록</main>
      </AuthGate>,
    );

    expect(markup).toContain("샘플 티어표 목록");
    expect(markup).not.toContain("COMS 티어표 로그인");
  });
});

import { createDefaultRows } from "./tierEngine";
import type { TierCategory, TierItem, TierTemplate } from "../types/tier";

const now = "2026-06-19T00:00:00.000Z";

const item = (id: string, name: string, description: string, tags: string[] = []): TierItem => ({
  id,
  name,
  description,
  tags,
});

const template = (
  id: string,
  title: string,
  description: string,
  category: TierCategory,
  items: TierItem[],
): TierTemplate => ({
  id,
  title,
  description,
  category,
  rows: createDefaultRows(),
  items,
  createdAt: now,
  updatedAt: now,
  isSample: true,
});

export const sampleTierItems: TierItem[] = [
  item("typescript", "TypeScript", "타입 안정성과 프론트 생산성을 동시에 챙기는 선택", ["frontend"]),
  item("python", "Python", "AI, 자동화, 빠른 실험에 강한 언어", ["ai"]),
  item("java", "Java", "백엔드 기본기와 안정감이 좋은 언어", ["backend"]),
  item("rust", "Rust", "성능과 안전성을 동시에 노리는 언어", ["systems"]),
  item("go", "Go", "단순한 서버와 도구 제작에 좋은 언어", ["server"]),
  item("kotlin", "Kotlin", "Android와 JVM에서 산뜻한 선택", ["mobile"]),
  item("cpp", "C++", "알고리즘과 성능 튜닝의 고전", ["algorithm"]),
  item("javascript", "JavaScript", "브라우저와 생태계의 기본값", ["web"]),
];

export const sampleTiers: TierTemplate[] = [
  template("sample-language", "개발 언어 티어표", "COMS 구성원의 언어 취향을 등급으로 나눠봅니다.", "language", sampleTierItems),
  template("sample-framework", "프레임워크 티어표", "프로젝트 시작 전 떠오르는 프레임워크를 정리합니다.", "framework", [
    item("react", "React", "컴포넌트 기반 UI의 기본 선택", ["frontend"]),
    item("spring", "Spring Boot", "백엔드 서비스의 든든한 선택", ["backend"]),
    item("next", "Next.js", "React 기반 풀스택 프레임워크", ["fullstack"]),
    item("vite", "Vite", "개발 서버가 빠른 프론트 도구", ["tooling"]),
    item("django", "Django", "관리자와 ORM이 강한 Python 프레임워크", ["backend"]),
    item("flutter", "Flutter", "모바일 UI를 빠르게 만드는 도구", ["mobile"]),
    item("tailwind", "Tailwind CSS", "작업 속도가 빠른 유틸리티 CSS", ["design"]),
    item("express", "Express", "가볍게 시작하는 Node 서버", ["node"]),
  ]),
  template("sample-food", "야식 메뉴 티어표", "세미나 뒤 가장 만족스러운 메뉴를 정리합니다.", "food", [
    item("chicken", "치킨", "공유하기 쉬운 대표 야식", ["classic"]),
    item("pizza", "피자", "조각 단위로 나누기 좋은 선택", ["share"]),
    item("tteokbokki", "떡볶이", "매운맛이 필요한 날", ["spicy"]),
    item("burger", "버거", "빠르게 먹고 돌아가기 좋은 메뉴", ["quick"]),
    item("ramen", "라면", "새벽 작업의 상징", ["late-night"]),
    item("jokbal", "족발", "회의 뒤 존재감 있는 메뉴", ["party"]),
    item("sushi", "초밥", "조용하지만 만족도 높은 선택", ["clean"]),
    item("sandwich", "샌드위치", "가볍게 먹기 좋은 메뉴", ["light"]),
  ]),
  template("sample-error", "개발자 에러 메시지 티어표", "기억에 남는 에러 메시지를 등급으로 정리합니다.", "error", [
    item("undefined", "Cannot read properties of undefined", "JS의 익숙한 경고", ["js"]),
    item("null-pointer", "NullPointerException", "객체가 없다는 신호", ["java"]),
    item("segfault", "Segmentation fault", "시스템 프로그래밍의 묵직한 메시지", ["cpp"]),
    item("cors", "CORS policy blocked", "프론트와 백엔드가 만나는 장벽", ["web"]),
    item("merge", "Merge conflict", "협업의 흔적", ["git"]),
    item("port", "Port already in use", "서버가 이미 켜진 상태", ["dev"]),
  ]),
  template("sample-activity", "COMS 활동 티어표", "동아리 활동 중 가장 끌리는 순간을 정리합니다.", "activity", [
    item("seminar", "정기 세미나", "지식 공유의 기본 루틴", ["study"]),
    item("project", "팀 프로젝트", "같이 만들며 배우는 활동", ["build"]),
    item("hackathon", "해커톤", "짧은 시간에 몰입하는 제작 경험", ["event"]),
    item("code-review", "코드 리뷰", "서로의 코드를 더 낫게 만드는 시간", ["quality"]),
    item("study", "스터디", "작게 꾸준히 배우는 모임", ["learn"]),
    item("after-party", "뒤풀이", "사람이 남는 시간", ["community"]),
  ]),
  template("sample-project", "COMS 프로젝트 티어표", "만들어보고 싶은 프로젝트 주제를 등급으로 나눕니다.", "project", [
    item("study-matcher", "스터디 매칭", "관심 분야 기반 매칭", ["community"]),
    item("seminar-archive", "세미나 아카이브", "자료와 영상 정리", ["archive"]),
    item("club-dashboard", "활동 대시보드", "동아리 상태를 한눈에", ["ops"]),
    item("bug-arena", "버그 아레나", "에러 해결 기록 공유", ["fun"]),
    item("portfolio-lab", "포트폴리오 랩", "프로젝트 전시 도구", ["career"]),
    item("algorithm-league", "알고리즘 리그", "풀이 시즌제", ["algorithm"]),
  ]),
];

export const findSampleTier = (id: string): TierTemplate | undefined =>
  sampleTiers.find((tier) => tier.id === id);

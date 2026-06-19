# COMS 티어표

COMS 동아리 내부에서 여러 주제를 등급별로 나눠보고 공유할 수 있는 티어표 MVP입니다. 개발 언어, 프레임워크, 프로젝트, 세미나 주제, 야식 메뉴, 개발자 밈, 에러 메시지, 동아리 활동 같은 주제로 확장할 수 있습니다.

기본 접속 주소는 `/tier`입니다. 한글 URL은 사용하지 않습니다.

## 주요 기능

- 티어표 만들기: 제목, 설명, 카테고리, 티어 행 이름/색상/설명, 항목 이름/설명/이미지/GIF/YouTube URL/태그 입력
- 샘플 티어표: 개발 언어, 프레임워크, 야식 메뉴, 에러 메시지, COMS 활동, COMS 프로젝트
- 편집: 미배치 항목, 티어 행, PC 드래그 앤 드롭, 모바일 터치 후 티어 선택, 미배치로 되돌리기, 초기화, 결과 저장
- 결과: 완성된 티어표, 공유 텍스트, 공유 링크 생성, 다시 수정하기, 새로 만들기
- COMS 계정 저장: 로그인 상태에서는 만든 티어표와 결과를 내 프로필 저장소에 저장
- 공유 모음: 공유한 티어표와 결과를 `/tier/shared/:slug` 링크와 메인 공유 목록에서 조회
- 미디어: 이미지 파일 업로드, GIF 파일 업로드, 이미지/GIF URL, YouTube 링크 미리보기 지원
- 통계: localStorage 기반 S 티어 배치 횟수, A 티어 배치 횟수, 평균 티어 점수, 가장 많이 배치된 티어

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- localStorage 저장
- `@dnd-kit/core` 기반 드래그 앤 드롭
- COMS 웹사이트 API 연동: `/api/auth/me`, `/api/files`, `/api/mini-apps/tier/*`
- Vitest 기반 엔진 테스트
- 정적 파일 배포

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 방법

```bash
npm run build
```

## 테스트

```bash
npm test
npm run typecheck
```

## COMS 계정 저장과 공유

이 앱은 프론트 단독으로도 동작하지만, `coms-website` 백엔드가 함께 배포되어 있으면 같은 도메인의 COMS 로그인 세션을 사용합니다.

- 로그인 사용자 확인: `GET /api/auth/me`
- 내 프로필 저장: `PUT /api/mini-apps/tier/profile/{template|result}/{id}`
- 내 저장 목록: `GET /api/mini-apps/tier/profile`
- 공유 발행: `POST /api/mini-apps/tier/profile/{template|result}/{id}/share`
- 공유 목록: `GET /api/mini-apps/tier/shared`
- 공유 상세: `GET /api/mini-apps/tier/shared/{slug}`
- 이미지/GIF 업로드: `POST /api/files`

로그인하지 않았거나 API를 사용할 수 없는 환경에서는 기존 localStorage 저장과 텍스트 복사 기능으로 fallback합니다. 공유 링크는 `https://coms.kw.ac.kr/tier/shared/{slug}` 형식입니다.

## 미디어 입력

- 이미지 URL과 GIF URL은 그대로 티어 항목 미디어로 렌더링합니다.
- YouTube URL은 embed URL로 변환하고, 티어표에서는 재생 배지와 함께 미리보기로 표시합니다.
- 파일 업로드는 COMS 서버 파일 API에 저장한 뒤 `/api/files/{id}/inline` URL을 사용합니다.
- 외부 API나 유료 API는 사용하지 않습니다.

## 배포 방법

GitHub Actions는 `main` 브랜치 push 시 자동 실행됩니다.

1. checkout
2. Node 22 설치
3. `npm ci`
4. `npm run build`
5. SSH key 등록
6. 서버에 `/var/www/coms-tier` 생성
7. `rsync`로 `dist/` 업로드

GitHub Secrets에 다음 값을 등록해야 합니다.

- `SSH_HOST`
- `SSH_USER` (기본값 가정: `kw`)
- `SSH_KEY`
- `SSH_PORT` (기본값 가정: `22`)

`dist` 폴더가 서버의 `/var/www/coms-tier`로 업로드됩니다.

## Nginx 설정 예시

아래는 COMS 서버에서 두 독립 서비스를 함께 연결할 때의 공통 예시입니다. 이 레포가 직접 배포하는 경로는 `/tier/`이며, `/worldcup/` 블록은 함께 운영될 `coms-worldcup`용 참고입니다. Nginx에서 `/worldcup/`와 `/tier/`를 각각 정적 빌드 디렉토리로 `alias` 처리합니다. `alias`를 사용할 때는 `location ^~ /tier/`와 `alias /var/www/coms-tier/`처럼 양쪽 끝의 `/`를 맞춰야 합니다. `/tier`로 접속하면 `/tier/`로 redirect되게 설정합니다.

```nginx
location = /worldcup {
    return 301 /worldcup/;
}

location ^~ /worldcup/ {
    alias /var/www/coms-worldcup/;
    try_files $uri $uri/ /worldcup/index.html;
}

location = /tier {
    return 301 /tier/;
}

location ^~ /tier/ {
    alias /var/www/coms-tier/;
    try_files $uri $uri/ /tier/index.html;
}
```

## Vite base와 React Router basename

배포 경로와 반드시 일치해야 합니다.

- Vite `base`: `/tier/`
- React Router `basename`: `/tier`

이 값이 다르면 정적 자산 경로나 새로고침 라우팅이 깨질 수 있습니다.

## 폴더 구조

```txt
src/
  main.tsx
  App.tsx
  routes/
    HomePage.tsx
    CreateTierPage.tsx
    EditTierPage.tsx
    ResultPage.tsx
    StatsPage.tsx
    SharedTierPage.tsx
  components/
    Layout.tsx
    TierList.tsx
    TierForm.tsx
    TierBoard.tsx
    TierRow.tsx
    TierItemCard.tsx
    UnplacedItems.tsx
    ResultPreview.tsx
    StatsTable.tsx
    EmptyState.tsx
  lib/
    media.ts
    miniApi.ts
    tierEngine.ts
    storage.ts
    sampleData.ts
    share.ts
  types/
    tier.ts
```

## localStorage 데이터 구조

- `coms-tier:templates`: 사용자가 만든 `TierTemplate[]`
- `coms-tier:results`: 저장된 `TierResult[]`
- `coms-tier:draft:{templateId}`: 편집 중인 `TierPlacement[]`

통계는 `TierResult[]`를 읽어 `lib/tierEngine.ts`의 `calculateTierStats`에서 계산합니다. COMS 서버 저장소는 같은 payload를 `mini_app_documents`에 JSON으로 저장하므로, 서버 DB 통계로 옮길 때도 이 계산 함수를 기준으로 API 응답을 설계하면 됩니다.

서버 저장 문서 개념:

- `app`: `tier`
- `contentType`: `template` 또는 `result`
- `contentId`: 템플릿/결과 ID
- `payload`: `TierTemplate` 또는 `TierResult`
- `shared`: 공유 목록 노출 여부
- `shareSlug`: 공유 상세 링크 식별자

## 향후 개선 아이디어

- 서버 기반 전체 통계
- 댓글 기능
- 좋아요 기능
- 결과 이미지 다운로드
- 카카오톡/디스코드 공유
- 관리자 신고/삭제 기능
- 인기순 랭킹
- 실제 COMS 회원만 작성 가능하게 제한
- 관리자 페이지 추가

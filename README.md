# COMS 티어표

COMS 동아리 내부에서 여러 주제를 등급별로 나눠보고 공유할 수 있는 티어표 MVP입니다. 개발 언어, 프레임워크, 프로젝트, 세미나 주제, 야식 메뉴, 개발자 밈, 에러 메시지, 동아리 활동 같은 주제로 확장할 수 있습니다.

기본 접속 주소는 `/tier`입니다. 한글 URL은 사용하지 않습니다.

## 주요 기능

- 티어표 만들기: 제목, 설명, 카테고리, 티어 행 이름/색상/설명, 항목 이름/설명/이미지 URL/태그 입력
- 샘플 티어표: 개발 언어, 프레임워크, 야식 메뉴, 에러 메시지, COMS 활동, COMS 프로젝트
- 편집: 미배치 항목, 티어 행, PC 드래그 앤 드롭, 모바일 터치 후 티어 선택, 미배치로 되돌리기, 초기화, 결과 저장
- 결과: 완성된 티어표, 공유 텍스트, 결과 복사, 다시 수정하기, 새로 만들기
- 통계: localStorage 기반 S 티어 배치 횟수, A 티어 배치 횟수, 평균 티어 점수, 가장 많이 배치된 티어

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- localStorage 저장
- `@dnd-kit/core` 기반 드래그 앤 드롭
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

통계는 `TierResult[]`를 읽어 `lib/tierEngine.ts`의 `calculateTierStats`에서 계산합니다. 서버 DB로 옮길 때 이 계산 함수를 기준으로 API 응답을 설계하면 됩니다.

## 향후 개선 아이디어

- 로그인 연동
- COMS 계정 기반 작성자 표시
- 서버 DB 저장
- 이미지 업로드
- 댓글 기능
- 좋아요 기능
- 결과 이미지 다운로드
- 카카오톡/디스코드 공유
- 관리자 신고/삭제 기능
- 인기순 랭킹
- coms-website 메인과 연결
- 실제 COMS 회원만 작성 가능하게 제한
- 관리자 페이지 추가

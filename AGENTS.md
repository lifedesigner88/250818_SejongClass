# AGENTS.md

프로젝트 운영 맥락과 우선순위 보존용 메모.

## 프로젝트 성격

- 운영 중인 학습 플랫폼.
- 수학, 물리, 코딩을 통해 사람의 생각과 행동을 구조적으로 이해하도록 돕는 서비스.
- README는 면접용 짧은 설명 유지.

## 현재 기술 스택

- React 19
- React Router 7 SSR
- Vite 7
- Tailwind CSS 4
- TypeScript
- PostgreSQL
- Drizzle ORM
- Supabase SSR / Supabase Auth
- Toss Payments
- Resend
- Node.js 22.12.0+

## 운영 관련 핵심 원칙

- 운영 서비스이므로 안전 우선.
- 운영 환경에서 로그인 없는 관리자 권한 노출 금지.
- 데모용 기능은 환경 변수로 분리.
- 데모 환경의 실제 결제, 메일 발송, 알림 부작용 최소화.
- 운영 DB의 데모 환경 직접 연결 금지.

## 현재 데모 운영 의사결정

- 면접 전까지 약 3주 유지 가능한 데모 환경 목표.
- 배포 기준은 `Docker Compose`.
- 우선 검토 대상은 `AWS Lightsail 4GB` Linux VM.
- 현재 범위에서 Terraform 기본값 채택 안 함.
- 장기적으로 Oracle, AWS EC2, Lightsail, 다른 Linux VM 이동 가능 구조 유지.

## 데모 데이터 전략

- 샘플 데이터 또는 비식별화 데이터 우선 사용.
- 운영 사용자, 결제, 알림, 방문 로그 데이터 재사용 금지.
- 현재는 데모 admin 1개 + 데모 일반 유저 3개(kakao, google, github) 구조 사용.
- 면접 종료 후 임시 데모 계정 권한 회수 또는 삭제.

## 현재 데모 구현 상태

- 데모용 Supabase 프로젝트 별도 사용.
- 데모 환경에서 실제 OAuth provider 연동은 사용하지 않음.
- 데모 환경에서 이메일/비밀번호 기반 demo 계정 4개(admin, kakao, google, github) 사용.
- `DEMO_MODE=true`일 때 로그인 다이얼로그에서 `Kakao`, `Google`, `GitHub`, `Admin` 버튼 노출.
- `Admin` 버튼은 `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD`를 사용하고 `/admin`으로 이동.
- `Kakao`, `Google`, `GitHub` 버튼은 각각 `DEMO_KAKAO_*`, `DEMO_GOOGLE_*`, `DEMO_GITHUB_*` 계정으로 로그인.
- 데모 로그인 성공 시 로그인 다이얼로그는 자동으로 닫힘.
- 공용 demo 계정 로그아웃은 `signOut({ scope: "local" })`로 현재 브라우저 세션에만 적용.
- 데모 admin 계정 프로비저닝은 `npm run demo:ensure-admin` 사용.
- 프로필 사진 업로드용 Supabase Storage bucket `avatars`는 public bucket + image only + 1MB 제한 + 사용자 본인 폴더 정책으로 구성.
- 데모 스토리지 프로비저닝은 `npm run demo:setup-storage` 사용.
- 데모 Supabase 연결 정보는 `DEMO_SUPABASE_*`, `VITE_DEMO_SUPABASE_*` 환경 변수 사용.
- 데모 DB 연결 정보는 `DEMO_DATABASE_URL` 환경 변수 사용.
- 데모 admin 계정은 Supabase Auth 계정과 앱 DB `users.role=admin`을 함께 맞춰야 함.
- Supabase 쿠키 파싱은 고정 project id 대신 현재 활성 Supabase 프로젝트 기준으로 처리.

## 데모 배포 메모

- 데모 인프라 작업은 별도 공개 레포 `/home/lifedesigner88/260312-demo-infra`에서 진행.
- 현재 앱 기본 포트는 호스트/컨테이너 모두 `5173`.
- `compose.yaml`은 `PORT=${PORT:-5173}`, `HOST_PORT=${HOST_PORT:-5173}` 기준.
- `BASE_URL`은 데모 공개 도메인과 반드시 일치시킴.
- GitHub Actions 컨테이너 워크플로는 `.github/workflows/publish-container.yml`.
- 기본 이미지 이름은 `ghcr.io/<github-owner>/250818-sejongclass-node`.
- `demo` 푸시 또는 수동 실행으로 GHCR에 `latest`, branch, `sha-*` 태그를 발행.
- Lightsail에서 GHCR pull 시 private package면 GitHub PAT 또는 적절한 package read 권한 토큰 필요.
- 현재 데모 도메인:
- `vue-spring.sejongclass.kr`
- `vue-spring-file.sejongclass.kr`
- `rr7-fullstack.sejongclass.kr`
- Cloudflare DNS + Lightsail + Caddy 조합 우선.
- Cloudflare는 초기 연결 시 `DNS only` 우선.

## 데모 배포/복구 순서

- `.env.example`를 기반으로 `.env` 작성.
- 필수 env: `BASE_URL`, `PORT`, `HOST_PORT`, `DEMO_MODE`, `DEMO_DATABASE_URL`, `DEMO_SUPABASE_KEY`, `DEMO_SUPABASE_ID`, `VITE_DEMO_SUPABASE_PUBLIC`, `VITE_DEMO_SUPABASE_ID`, `DEMO_ADMIN_*`, `DEMO_KAKAO_*`, `DEMO_GOOGLE_*`, `DEMO_GITHUB_*`.
- 데모 DB 초기화가 필요하면 `node ./scripts/db/restore_demo_dump.mjs` 실행.
- 데모 Auth 계정과 앱 DB role 정합성은 `npm run demo:ensure-admin`로 맞춤.
- 데모 프로필 업로드용 storage bucket/policy는 `npm run demo:setup-storage`로 맞춤.
- 앱 배포는 `docker compose up -d --build`.
- 배포 후 확인 우선순위: `localhost:5173` 또는 공개 `BASE_URL` 접속, `Admin` 로그인 후 `/admin`, 일반 데모 유저 로그인 후 `/themes`, 프로필 사진 업로드.
- 운영 DB, 운영 Supabase, 운영 결제/메일 키와 데모 env 혼용 금지.

## 데모 덤프 메모

- 데모용 선별 덤프는 `scripts/db/selective_dump.sh` 사용.
- 덤프 스크립트는 Docker fallback 없이 로컬 `pg_dump`만 사용.
- 포함 테이블 목록은 `config/db/demo_content_tables.txt`에서 관리.
- 현재 선별 덤프 결과는 `dumps/selective/20260312/` 기준으로 보관.
- `users`, `enrollments`, `payments`, `notifications`, `visitlogs`, `comments` 데이터 제외.
- `scripts/db/restore_demo_dump.mjs`는 demo DB의 `public` schema를 드롭 후 복원하므로 demo 환경에서만 실행.

## AI 작업 규칙

- README는 짧고 핵심 위주로 유지.
- 구현 내용과 계획 내용 혼용 금지.
- 배포 관련 작업은 Docker 기반 재현성 우선.
- 인증, 결제, 메일, DB 변경은 특히 신중하게 처리.
- 새 환경 생성 시 로컬 실행, 데모 실행, 운영 실행 구분 문서화.
- 데모 관련 확정 사항과 변경 사항은 `AGENTS.md`에 누적 기록.
- Docker 이미지 빌드 시 `.env`, `.env.*`는 build context에 포함하지 않고 `.env.example`만 유지.

## 자주 보는 경로

- `README.md`: 면접용 요약 문서
- `app/routes.ts`: 주요 라우트 구조
- `app/root.tsx`: 인증/전역 로딩/전역 UI 흐름
- `app/supa-clents.ts`: Supabase SSR 클라이언트 설정
- `app/db/index.ts`: DB 연결 및 스키마 등록
- `app/feature/admin`: 관리자 기능
- `app/api`: 서버 액션과 배치성 API

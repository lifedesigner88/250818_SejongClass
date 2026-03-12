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
- 시간 부족 시 임시 데모 admin 계정 1개 운영 가능.
- 면접 종료 후 임시 데모 admin 계정 권한 회수 또는 삭제.

## 현재 데모 구현 상태

- 데모용 Supabase 프로젝트 별도 사용.
- 데모 환경에서 OAuth 미사용.
- 데모 환경에서 이메일/비밀번호 기반 admin 계정 1개 사용.
- `DEMO_MODE=true`일 때 로그인 다이얼로그에서 `면접용 Admin 바로 입장` 버튼 노출.
- 데모 바로 입장은 `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD` 사용.
- 데모 Supabase 연결 정보는 `DEMO_SUPABASE_*`, `DEMO_VITE_SUPABASE_*` 환경 변수 사용.
- 데모 DB 연결 정보는 `DEMO_DATABASE_URL` 환경 변수 사용.
- 데모 admin 계정은 Supabase Auth 계정과 앱 DB `users.role=admin`을 함께 맞춰야 함.
- Supabase 쿠키 파싱은 고정 project id 대신 현재 활성 Supabase 프로젝트 기준으로 처리.

## 데모 배포 메모

- 데모 인프라 작업은 별도 공개 레포 `/home/lifedesigner88/260312-demo-infra`에서 진행.
- 현재 데모 도메인:
- `vue-spring.sejongclass.kr`
- `vue-spring-file.sejongclass.kr`
- `rr7-fullstack.sejongclass.kr`
- Cloudflare DNS + Lightsail + Caddy 조합 우선.
- Cloudflare는 초기 연결 시 `DNS only` 우선.

## 데모 덤프 메모

- 데모용 선별 덤프는 `scripts/db/selective_dump.sh` 사용.
- 덤프 스크립트는 Docker fallback 없이 로컬 `pg_dump`만 사용.
- 포함 테이블 목록은 `config/db/demo_content_tables.txt`에서 관리.
- 현재 선별 덤프 결과는 `dumps/selective/20260312/` 기준으로 보관.
- `users`, `enrollments`, `payments`, `notifications`, `visitlogs`, `comments` 데이터 제외.

## AI 작업 규칙

- README는 짧고 핵심 위주로 유지.
- 구현 내용과 계획 내용 혼용 금지.
- 배포 관련 작업은 Docker 기반 재현성 우선.
- 인증, 결제, 메일, DB 변경은 특히 신중하게 처리.
- 새 환경 생성 시 로컬 실행, 데모 실행, 운영 실행 구분 문서화.
- 데모 관련 확정 사항과 변경 사항은 `AGENTS.md`에 누적 기록.

## 자주 보는 경로

- `README.md`: 면접용 요약 문서
- `app/routes.ts`: 주요 라우트 구조
- `app/root.tsx`: 인증/전역 로딩/전역 UI 흐름
- `app/supa-clents.ts`: Supabase SSR 클라이언트 설정
- `app/db/index.ts`: DB 연결 및 스키마 등록
- `app/feature/admin`: 관리자 기능
- `app/api`: 서버 액션과 배치성 API

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

## AI 작업 규칙

- README는 짧고 핵심 위주로 유지.
- 구현 내용과 계획 내용 혼용 금지.
- 배포 관련 작업은 Docker 기반 재현성 우선.
- 인증, 결제, 메일, DB 변경은 특히 신중하게 처리.
- 새 환경 생성 시 로컬 실행, 데모 실행, 운영 실행 구분 문서화.

## 자주 보는 경로

- `README.md`: 면접용 요약 문서
- `app/routes.ts`: 주요 라우트 구조
- `app/root.tsx`: 인증/전역 로딩/전역 UI 흐름
- `app/supa-clents.ts`: Supabase SSR 클라이언트 설정
- `app/db/index.ts`: DB 연결 및 스키마 등록
- `app/feature/admin`: 관리자 기능
- `app/api`: 서버 액션과 배치성 API

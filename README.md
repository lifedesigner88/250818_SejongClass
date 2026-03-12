# SejongClass

수학, 물리, 코딩을 통해 사람의 생각과 행동을 구조적으로 이해하도록 돕는 운영 중인 학습 플랫폼입니다.

## 한 줄 소개

정답을 빨리 맞히는 서비스가 아니라, 왜 그런 선택과 행동이 나오는지를 설명할 수 있는 사고의 지도를 만드는 서비스입니다.

## 핵심 목표

- 사람의 감정, 생각, 행동을 구조적으로 이해하기
- 공식 암기보다 개념과 원리를 먼저 이해하기
- 코드와 실험으로 사고를 검증하기
- 이론을 삶의 해석으로 연결하기

## 학습 관점

- 수학: 생각을 구조와 비교의 언어로 바라봄
- 물리: 변화를 시간 속의 과정으로 바라봄
- 코딩: 생각을 규칙으로 바꾸고 검증함
- 인생: 이론이 실제 삶을 설명하는지 다시 질문함

## 주요 기능

- `Theme -> Subject -> Textbook -> Major -> Middle -> Unit` 구조의 학습 콘텐츠
- 무료/유료 수강 등록과 진도율 관리
- 유닛 기반 영상 학습과 리치 텍스트 콘텐츠
- 댓글, 대댓글, 좋아요, 알림
- 관리자용 콘텐츠 수정 및 댓글 모더레이션

## 현재 운영 방식

- 인증: Supabase OAuth
- 사용자 권한: 앱 DB의 `users.role` 기반 `user/admin`
- 결제: Toss Payments
- 메일: Resend
- 배치 작업: 교재 통계 재계산, 오래된 알림 정리
- 관리자 접근: 프론트와 서버에서 모두 권한 검증

## 면접용 데모 운영 전략

- 목적: 면접 기간 3주 동안 안정적으로 재현 가능한 데모 환경 운영
- 배포 기준: `Docker Compose` 기반으로 앱과 DB를 함께 실행
- 배포 대상: `AWS Lightsail 4GB` Linux VM 우선 검토
- 배포 방식: `AWS CLI`로 인스턴스 생성 후 SSH 접속, `docker compose up -d`
- IaC: 현재 범위에서는 Terraform보다 CLI + Compose가 더 단순하고 실용적
- 운영 원칙: 운영 서비스와 데모 환경 분리
- 데이터 원칙: 운영 DB를 직접 노출하지 않고, 가능하면 샘플/데모 데이터 사용
- 부작용 차단: 데모에서는 결제, 메일, 알림 등 실운영 부작용 최소화

## 기술 스택

- Frontend: React 19, React Router 7 SSR, Vite 7, Tailwind CSS 4, Radix UI
- Backend: React Router loaders/actions, TypeScript, Node.js 22.12.0+
- Database/Auth: PostgreSQL, Drizzle ORM, Supabase SSR, Supabase Auth
- Infra/Integration: Vercel preset, Toss Payments, Resend, React Email
- Learning UX: Tiptap, React Markdown, KaTeX, react-youtube

## 프로젝트 폴더 구조

```text
app/
  api/              서버 액션, 결제, 댓글, 유저, 배치 API
  common/           공통 컴포넌트와 유틸
  db/               Drizzle DB 설정
  feature/
    admin/          관리자 페이지
    auth/           인증 관련 로직
    comments/       댓글/대댓글
    enrollments/    수강 등록과 진도
    subjects/       과목 탐색
    textbooks/      교재 레이아웃과 학습 진입
    themes/         테마 목록
    units/          유닛 상세 학습 화면
    users/          프로필과 사용자 정보
```

## 실행 방법

```bash
nvm install
nvm use
npm install
npm run dev
```

## 면접에서 강조할 포인트

- 실제 운영 중인 서비스라는 점
- 관리자 기능도 서버에서 다시 검증한다는 점
- 면접용 데모는 운영 환경과 분리해서 안전하게 공개한다는 점
- 기능 구현보다 운영 판단과 구조 설계에 집중한 프로젝트라는 점

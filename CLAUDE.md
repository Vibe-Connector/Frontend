# VibeLink Frontend — claude.md

## 프로젝트 개요

VibeLink는 **AI 기반 공감각 큐레이션 플랫폼**이다.
사용자가 기분·시간·날씨·공간·동반자를 3단계로 입력하면, AI가 분위기 이미지를 생성하고 음악·커피·조명·콘텐츠를 추천한다.

### 핵심 가치
- **감각의 번역**: 추상적 감정 → 구체적 사물(음악, 커피, 조명, 영상)로 전환
- **원클릭 실행**: 추천 결과를 외부 서비스(Spotify, Netflix, Philips Hue 등)로 즉시 실행
- **자기 발견**: Vibe 아카이브 + 분석 리포트를 통한 감정 패턴 탐색

### 타깃 페르소나
| 페르소나 | 핵심 니즈 | 주요 사용 흐름 |
|---------|----------|--------------|
| **The Creator** (콘텐츠 에디터, 27세) | 추상적 컨셉 → 마케팅 소재 제작 | Vibe 생성 → 이미지 다운로드 → 인스타그램 공유 |
| **The Host** (스타트업 PM, 31세) | 홈파티/데이트에 일관된 테마 경험 제공 | Vibe 생성 → 원클릭 연동(Spotify + Hue) |
| **The Explorer** (대학생, 22세) | 취향 발견 및 확장 | Vibe 생성 → 아카이브 저장 → 리포트 확인 |

---

## 구현 현황

### 완료 (Foundation Layer)
- **디자인 시스템**: Tailwind v4 `@theme` 기반 시맨틱 토큰 (색상, radius, 간격, 폰트)
- **레이아웃 컴포넌트**: Header, Footer, Sidebar (fish-eye 호버, 모드 전환 애니메이션)
- **공통 UI 라이브러리**: Button(3종), Dropdown, Modal, Alert, Pagination, TabToggle, ProfileDropdown
- **프로젝트 설정**: TypeScript strict mode, Vite path alias (`@/*`), ESLint flat config
- **상태 관리 (기초)**: AppModeContext (헤더/사이드바 모드 동기화), useClickOutside 훅

### 스캐폴딩됨 (파일 생성, 내용 미구현)
- **페이지**: 16개 페이지 파일 (빈 상태)
- **라우터**: `src/router/index.tsx` (빈 상태)

### 미착수 (Core Features)
- Feature 모듈 (auth, vibe, archive, feed, notification, integration, report)
- 상태 관리 (Zustand, React Query)
- API 레이어 (HTTP 클라이언트, interceptor)
- 인증 플로우 (JWT, 소셜 로그인)
- Vibe 3단계 플로우
- 다국어 (i18n)
- 테스트 인프라
- 환경 변수 설정

---

## 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| Framework | **React** with **Vite** | React 19.2, Vite 7.2 | SPA 기반 |
| Language | **TypeScript** | 5.9 | strict mode 활성 |
| 라우팅 | **React Router** | v7.13 | 중첩 라우트 활용 (미구현) |
| 스타일링 | **Tailwind CSS v4** | 4.1 | `@theme` 인라인 설정, `@tailwindcss/vite` 플러그인 |
| 상태 관리 (예정) | **Zustand** (글로벌) + **React Query** (서버 상태) | 미설치 | Vibe 플로우는 Zustand store 분리 |
| 다국어 (예정) | **react-i18next** | 미설치 | ko, en, zh 지원 |
| 폼 관리 (예정) | **React Hook Form** + **Zod** | 미설치 | 회원가입, 프로필 수정 등 |
| HTTP (예정) | **Axios** 또는 **ky** | 미설치 | interceptor 기반 JWT 갱신 |
| 차트/시각화 (예정) | **Recharts** 또는 **D3.js** | 미설치 | 분석 리포트 |
| 테스트 (예정) | **Vitest** + **React Testing Library** | 미설치 | 핵심 플로우 위주 |
| 빌드/배포 | Vite → **Docker** → **AWS EC2** | - | Docker Compose 기반 (미설정) |

---

## 디렉토리 구조 (현재)

```
src/
├── components/
│   ├── common/                # 공통 UI 컴포넌트 (구현 완료)
│   │   ├── Alert.tsx
│   │   ├── ButtonDefault.tsx
│   │   ├── ButtonOrange.tsx
│   │   ├── ButtonPrimary.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── TabToggle.tsx
│   │   └── index.ts           # barrel export
│   ├── feedback/              # 피드백 컴포넌트 (빈 디렉토리)
│   └── layout/                # 레이아웃 컴포넌트 (구현 완료)
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── hooks/                     # 커스텀 훅
│   ├── AppModeContext.tsx      # 앱 모드 Context Provider
│   ├── useAppMode.ts          # AppModeContext 소비 훅
│   └── useClickOutside.ts     # 외부 클릭 감지 훅
│
├── pages/                     # 라우트 단위 페이지 (빈 파일들)
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── Explore.tsx
│   ├── Feed.tsx
│   ├── FeedDetail.tsx
│   ├── VibeConnector.tsx      # Vibe 3단계 플로우 메인
│   ├── VibeConnectorConnect.tsx
│   ├── VibeConnectorEdit.tsx
│   ├── VibeConnectorLoading.tsx
│   ├── VibeConnectorResult.tsx
│   ├── Profile.tsx
│   ├── ProfileSettings.tsx
│   ├── ProfileAnalysisReport.tsx
│   ├── Archive.tsx
│   ├── ArchiveDetail.tsx
│   └── ComponentTestPage.tsx  # 공통 컴포넌트 테스트 페이지 (구현 완료)
│
├── router/                    # 라우트 설정 (빈 파일)
│   └── index.tsx
│
├── types/                     # 타입 정의
│   └── app-mode.ts            # SidebarMode, ProfilePage, AppModeContextValue
│
├── assets/                    # 정적 파일
│   └── react.svg
│
├── App.tsx                    # 앱 루트 (AppModeProvider + Layout)
├── main.tsx                   # Vite 진입점
└── index.css                  # 글로벌 스타일 + 디자인 토큰 (@theme)
```

### 디렉토리 구조 (목표 — 기능 구현 시 확장)

```
src/
├── components/                 # (현재) 공통 컴포넌트
│   ├── common/
│   ├── feedback/               # LoadingSpinner, ErrorBoundary, EmptyState, Skeleton
│   └── layout/
│
├── features/                   # (예정) 도메인별 기능 모듈
│   ├── auth/
│   │   ├── components/         # LoginForm, SignupForm, SocialLoginButtons
│   │   ├── hooks/              # useAuth, useOAuth
│   │   ├── api/                # authApi.ts
│   │   ├── store/              # authStore.ts (Zustand)
│   │   └── types.ts
│   ├── vibe/
│   │   ├── components/
│   │   │   ├── step1/          # MindMapSelector, MoodKeywordChip
│   │   │   ├── step2/          # AnalogClock, WeatherCardSelector
│   │   │   ├── step3/          # PlaceCardSelector, CompanionCardSelector
│   │   │   ├── result/         # VibeImage, RecommendationList, ItemCard
│   │   │   └── StepIndicator.tsx
│   │   ├── hooks/              # useVibeFlow, useVibeResult, useRecommendations
│   │   ├── api/                # vibeApi.ts
│   │   ├── store/              # vibeFlowStore.ts (3단계 상태 관리)
│   │   └── types.ts
│   ├── archive/
│   │   ├── components/         # FolderList, ArchiveGrid, ArchiveItemCard, FolderCreateModal
│   │   ├── hooks/              # useArchive, useFolders
│   │   ├── api/
│   │   ├── store/
│   │   └── types.ts
│   ├── feed/
│   │   ├── components/         # FeedCard, CommentSection, LikeButton, FeedComposer
│   │   ├── hooks/              # useFeed, useComments, useFollow
│   │   ├── api/
│   │   └── types.ts
│   ├── notification/
│   │   ├── components/         # NotificationList, NotificationBadge
│   │   ├── hooks/              # useNotifications
│   │   ├── api/
│   │   └── types.ts
│   ├── integration/
│   │   ├── components/         # SpotifyConnectButton, HueControlPanel
│   │   ├── hooks/              # useExternalService, useOAuthConnect
│   │   ├── api/
│   │   └── types.ts
│   └── report/
│       ├── components/         # MoodHeatmap, EmotionTrendChart, ReportExport
│       ├── hooks/
│       ├── api/
│       └── types.ts
│
├── hooks/                      # (현재) 범용 훅
├── pages/                      # (현재) 페이지
├── router/                     # (현재) 라우터
├── types/                      # (현재) 타입
│
├── shared/                     # (예정) 범용 공유 모듈
│   ├── utils/                  # formatDate, cn (classNames), validators
│   ├── constants/              # routes.ts, queryKeys.ts, breakpoints.ts
│   └── types/                  # global.d.ts, api.d.ts
│
├── i18n/                       # (예정) 다국어 리소스
│   ├── config.ts
│   └── locales/
│       ├── ko.json
│       ├── en.json
│       └── zh.json
│
└── styles/                     # (현재 index.css에 통합됨, 필요 시 분리)
```

---

## 라우트 구조 (계획)

```
/                              → 랜딩 또는 Vibe 생성 페이지로 리다이렉트
/login                         → 로그인 (Login.tsx)
/signup                        → 회원가입 (SignUp.tsx)
/auth/callback/:provider       → 소셜 로그인 콜백

/vibe                          → Vibe 생성 3단계 플로우 (VibeConnector.tsx)
/vibe/connect                  → Vibe 연결 (VibeConnectorConnect.tsx)
/vibe/edit                     → Vibe 편집 (VibeConnectorEdit.tsx)
/vibe/loading                  → Vibe 생성 대기 (VibeConnectorLoading.tsx)
/vibe/result/:sessionId        → Vibe 결과 (VibeConnectorResult.tsx)

/explore                       → 탐색 (Explore.tsx)
/feed                          → 공개 피드 목록 (Feed.tsx)
/feed/:feedId                  → 피드 상세 (FeedDetail.tsx)

/profile                       → 프로필 (Profile.tsx)
/profile/settings              → 설정 (ProfileSettings.tsx)
/profile/report                → 분석 리포트 (ProfileAnalysisReport.tsx)

/archive                       → 아카이브 (Archive.tsx)
/archive/:folderId             → 아카이브 상세 (ArchiveDetail.tsx)
```

### 라우트 가드
- **인증 필수**: `/vibe/*`, `/profile/*`, `/feed`, `/archive/*`
- **비인증만 접근**: `/login`, `/signup`
- JWT 만료 시 → 리프레시 토큰으로 갱신 시도 → 실패 시 `/login` 리다이렉트

---

## 구현된 컴포넌트 상세

### Layout 컴포넌트

#### Header (`src/components/layout/Header.tsx`)
- TabToggle로 Generate/Explore 모드 전환
- 알림 벨 아이콘 + ProfileDropdown
- AppModeContext와 연동하여 사이드바 모드 동기화
- 탭 토글이 항상 화면 중앙에 위치

#### Sidebar (`src/components/layout/Sidebar.tsx`)
- Fish-eye 호버 효과 (scale 변환)
- 2가지 모드: explore (Home, My Feed, Archive, Report) / profile (Home, My Info, Settings)
- 부드러운 CSS 트랜지션 애니메이션

#### Footer (`src/components/layout/Footer.tsx`)
- 로고, 저작권, 소셜 링크 (Notion, GitHub)
- 디자인 토큰 활용 (text-muted, spacing-page-x 등)

### Common UI 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|---------|------|------|
| ButtonPrimary | `common/ButtonPrimary.tsx` | pill/rect variant, 디자인 토큰 적용 |
| ButtonDefault | `common/ButtonDefault.tsx` | 기본 스타일 버튼 |
| ButtonOrange | `common/ButtonOrange.tsx` | 오렌지 강조 버튼 |
| Dropdown | `common/Dropdown.tsx` | 키보드 접근성 지원, useClickOutside 활용 |
| Pagination | `common/Pagination.tsx` | 4종 variant (square, circle, text, minimal) |
| Modal | `common/Modal.tsx` | 아이콘/이미지 지원, 액션 버튼 |
| Alert | `common/Alert.tsx` | 알림 컴포넌트 |
| TabToggle | `common/TabToggle.tsx` | 슬라이딩 인디케이터 애니메이션 |
| ProfileDropdown | `common/ProfileDropdown.tsx` | 프로필 메뉴, useClickOutside 활용 |

### 커스텀 훅

| 훅 | 파일 | 설명 |
|---|------|------|
| AppModeContext | `hooks/AppModeContext.tsx` | SidebarMode 상태 관리 Provider |
| useAppMode | `hooks/useAppMode.ts` | AppModeContext 소비 훅 |
| useClickOutside | `hooks/useClickOutside.ts` | 외부 클릭 감지 (Dropdown, ProfileDropdown에서 사용) |

---

## 핵심 기능 상세

### 1. Vibe 생성 플로우 (3단계) — 미구현

Vibe 플로우는 앱의 **핵심 경험**이다. 각 단계를 비동기로 전환하며 서버에 중간 저장한다.

#### Step 1 — 무드 선택 (마인드맵 UI)
- **UI**: 마인드맵 형태의 인터랙티브 키워드 맵
- 중앙 노드에서 기분 형용사 키워드가 방사형으로 배치
- 복수 선택 가능 (선택 시 시각적 하이라이트)
- 직접 입력 가능 (커스텀 키워드 추가)
- **데이터**: `mood_keywords` 테이블에서 키워드 목록 로드 (다국어 대응)
- **상태**: `vibeFlowStore.selectedMoods: string[]`

#### Step 2 — 시간 + 날씨 선택
- **시간**: 아날로그 시계 UI로 시간대 선택 (드래그 또는 탭)
  - `time_options` 테이블 기반 (새벽/아침/낮/저녁/밤)
- **날씨**: 카드 선택 UI (단일 선택)
  - `weather_options` 테이블 기반 (맑음/흐림/비/눈 등)
- **상태**: `vibeFlowStore.selectedTime`, `vibeFlowStore.selectedWeather`

#### Step 3 — 공간 + 동반자 선택
- **공간**: 카드 선택 UI (단일 선택)
  - `place_options` 테이블 기반 (집/카페/사무실/야외 등)
- **동반자**: 카드 선택 UI (단일 선택)
  - `companion_options` 테이블 기반 (혼자/친구/연인/가족 등)
- **상태**: `vibeFlowStore.selectedPlace`, `vibeFlowStore.selectedCompanion`

#### 단계 전환 동작
1. 각 단계 완료 시 → 서버에 `vibe_sessions` 중간 저장 (비동기)
2. 마지막 단계 완료 → 최종 프롬프트 조합 → AI 분석 요청
3. AI 응답 대기 중 → 로딩 애니메이션 (분위기 있는 트랜지션)
4. 결과 생성 완료 → 결과 페이지로 이동

#### Vibe 플로우 Zustand Store 설계

```typescript
interface VibeFlowState {
  currentStep: 1 | 2 | 3;
  sessionId: string | null;

  // Step 1
  selectedMoods: string[];

  // Step 2
  selectedTime: string | null;
  selectedWeather: string | null;

  // Step 3
  selectedPlace: string | null;
  selectedCompanion: string | null;

  // Actions
  setMoods: (moods: string[]) => void;
  setTime: (time: string) => void;
  setWeather: (weather: string) => void;
  setPlace: (place: string) => void;
  setCompanion: (companion: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
```

### 2. 결과 페이지 — 미구현

결과 페이지는 AI 분석 결과를 시각적으로 표현한다.

#### 구성 요소
- **한 문장 요약**: AI가 생성한 Vibe 설명 텍스트
- **AI 생성 이미지**: 비동기로 생성되며 완료 시 표시 (WebSocket 또는 polling)
- **추천 아이템 리스트** (도메인별 그룹):
  - 음악: Spotify 플레이리스트 (앨범아트, 곡명, 아티스트)
  - 커피: 네스프레소 캡슐 (이미지, 이름, 풍미 노트)
  - 조명: K 온도 + 밝기 추천 (색상 프리뷰)
  - 콘텐츠: 영화/드라마 추천 (포스터, 제목, 장르)
- 각 아이템 hover → 상세 정보 팝오버
- **액션 버튼**: 저장, 공유, 재생성, 외부 서비스 연동

#### 이미지 생성 비동기 처리
```
사용자 제출 → API POST → sessionId 반환
              → 폴링 or WebSocket으로 상태 확인
              → status: "processing" | "completed" | "failed"
              → completed 시 이미지 URL 수신 → 렌더링
```

#### 수정 기능
- 추천 아이템 개별 교체 (같은 도메인 내 대안 추천 요청)
- 프롬프트 수정 후 재생성 (전체 재생성)
- 요소 드래그로 재배치 (레이아웃 커스터마이징)

### 3. 마이페이지 — 미구현

| 하위 페이지 | 기능 |
|-----------|------|
| **프로필** (Profile.tsx) | 프로필 이미지, 닉네임, 팔로워/팔로잉/게시글 수 |
| **설정** (ProfileSettings.tsx) | 알림 설정, 테마 (라이트/다크), 외부 서비스 연동 관리, 회원 탈퇴 |
| **분석 리포트** (ProfileAnalysisReport.tsx) | 월간/연간 감정 분석 |
| **아카이브** (Archive.tsx) | 폴더 목록 (최대 20개), 폴더 내 저장 아이템, 필터/정렬/검색 |

#### 아카이브 상세
- Vibe 조합 전체 저장 또는 개별 아이템 저장
- 저장 시 메모 추가 (최대 200자)
- 폴더 생성 (이름, 아이콘, 순서 설정), 최대 20개
- 다중 선택 일괄 이동/삭제
- 필터: 도메인별 (미디어/음악/커피/조명)
- 정렬: 저장일순, 이름순, 폴더순
- 상세 조회: 저장 당시 조합 + AI 추천 논리 표시
- **용량 제한**: 사용자당 최대 500개 (잔여 수 표시)

### 4. 피드 — 미구현

- 기본 비공개 (사용자가 피드 작성으로 공개 전환)
- 피드 작성: 이미지 + 글귀 + 아이템 목록 구성
- 좋아요/싫어요 토글
- 댓글 작성/수정/삭제
- 정렬: 시간순, 좋아요순, 분위기별
- 고정 피드 지정 (프로필 상단)
- 팔로우/언팔로우
- AI 인사이트: 유사 감정 패턴 사용자의 인기 Vibe 추천

### 5. 공유 및 외부 연동 — 미구현

| 기능 | 구현 |
|------|------|
| 이미지 다운로드 | Blob → download link |
| 이미지/링크 복사 | Clipboard API |
| 인스타그램 발행 | Instagram Graph API 또는 Share Sheet |
| Spotify 연동 | OAuth 2.0 → 플레이리스트 자동 생성 |
| OTT 연동 | Netflix/디플/티빙 시청 목록 추가 |
| Philips Hue 연동 | OAuth → 조명 색온도/밝기 제어 |
| 네스프레소 | 어필리에이트 링크로 구매 페이지 이동 |

#### 외부 연동 플로우
```
[실행하기] 클릭
  → 연동 여부 확인
  → 미연동: OAuth 로그인 모달 → 연동 완료 → 실행
  → 연동됨: 즉시 실행 (API 호출)
```

### 6. 알림 — 미구현

- 알림 목록 조회 + 읽음 처리 (soft delete)
- 알림 유형: 아카이빙 알림, 이벤트 알림, 이미지 생성 완료
- 알림 클릭 → 해당 페이지로 이동
- 헤더에 미읽음 알림 뱃지 표시

### 7. 분석 리포트 — 미구현

- 특정 날짜에 월간/연간 리포트 생성 기능 활성화 (모달로 알림)
- 리포트 구성:
  - 월별 감정 키워드 빈도 (히트맵 또는 워드클라우드)
  - 가장 많이 느낀 감정 Top N
  - Vibe와 공간 상관관계 분석 (매트릭스)
  - Vibe 변화 추이 (라인 차트)
- 이미지 파일로 내보내기 (html-to-image 등)

---

## 디자인 시스템

### 디자인 토큰 (`src/index.css` `@theme`)

#### 색상 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-brand` | `#171E03` | 로고, 활성 탭 배경, 주요 버튼 |
| `--color-accent` | `#F1863B` | CTA 버튼, 알림 뱃지, 하이라이트 |
| `--color-primary` | `#F4B225` | 주요 UI 요소 |
| `--color-surface` | `#F2F2F2` | 탭 토글 배경, 카드/입력필드 배경 |
| `--color-high-emphasis` | `#333333` | 본문 텍스트 |
| `--color-caption` | `#82898E` | 캡션 텍스트 |
| `--color-low-emphasis` | `#9C9C9C` | 보조 텍스트 |
| `--color-text-primary` | `#F1863B` | 강조 텍스트 |
| `--color-muted` | `#999999` | 푸터 로고, 저작권, 소셜 아이콘 |
| `--color-stroke` | `#DADADA` | 테두리 |
| `--color-disabled` | `#EDEEEF` | 비활성 요소 |
| `--color-input` | `#F2F5F9` | 입력 필드 배경 |
| `--color-search` | `#F6F7F8` | 검색 필드 배경 |
| `--color-icon` | `#33363F` | 헤더 아이콘 |
| `--color-sidebar-icon` | `#9D9AA4` | 사이드바 아이콘 |
| `--color-sidebar-text` | `#3A383F` | 사이드바 텍스트 |
| `--color-primary-bg` | `#FFE4E4` | Primary 배경색 |
| `--color-purple` | `#7572FF` | 보조 컬러 |
| `--color-blue` | `#0090F9` | 보조 컬러 |
| `--color-green` | `#ACA05F` | 보조 컬러 |
| `--color-blue-bg` | `#F5F8FF` | Blue 배경색 |
| `--color-green-bg` | `#EFFFF7` | Green 배경색 |

#### Border Radius 토큰

모든 컴포넌트는 아래 3단계 radius 토큰을 사용한다.

| 토큰 | Tailwind 클래스 | 값 | 용도 |
|------|----------------|-----|------|
| `--radius-control` | `rounded-control` | 8px | 입력 필드, 드롭다운, 버튼(rect), 페이지네이션 등 컨트롤 요소 |
| `--radius-card` | `rounded-card` | 16px | 모달, 알림, 카드 등 표면/컨테이너 요소 |
| `--radius-pill` | `rounded-pill` | 9999px | 탭 토글, 태그, 뱃지, pill 버튼 |
| *(내장)* | `rounded-full` | 9999px | 아이콘 버튼, 원형 요소 |

> **규칙**: 새 컴포넌트를 만들 때 `rounded-lg`, `rounded-2xl` 등 Tailwind 기본 클래스 대신 반드시 위 시맨틱 토큰을 사용할 것.

#### 간격 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--spacing-header` | 82px | 헤더 높이 (피그마 109px × 0.75) |
| `--spacing-footer` | 122px | 푸터 높이 (피그마 162px × 0.75) |
| `--spacing-page-x` | 48px | 페이지 좌우 패딩 (피그마 64px × 0.75) |
| `--spacing-tab-btn` | 107px | 탭 버튼 최소 너비 (피그마 142px × 0.75) |

#### 폰트

| 토큰 | 값 |
|------|-----|
| `--font-pretendard` | "Pretendard", system-ui, -apple-system, sans-serif |
| `--font-sans` | 'Pretendard Variable', Pretendard, system-ui, sans-serif |

#### 기타

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--shadow-card` | `0 2px 8px rgba(0, 0, 0, 0.08)` | 카드 그림자 |
| `--animate-fade-in` | `fade-in 0.2s ease-out` | 페이드인 애니메이션 |
| `animate-smooth` | `transition: all 300ms ease-out` | 부드러운 트랜지션 (@utility) |

---

## UI/UX 가이드라인

### 디자인 원칙
1. **핵심 정서**: 따뜻함(warmth) + 탐색(exploration)
2. **컬러**: 감성적 팔레트 (무드에 따라 동적 변화 고려)
3. **타이포**: Pretendard Variable (한글/영문 공용)
4. **모션**: 단계 전환 시 부드러운 트랜지션 (150~300ms)
5. **마이크로 카피**: 따뜻한 톤 ("다음 Vibe를 탐색해볼까요?")
6. **여백**: 넉넉한 여백으로 감성적 호흡감
7. **피그마 비율**: 모든 수치는 피그마 값 × 0.75 적용

### 반응형 브레이크포인트
```
Mobile:  < 640px   (sm)
Tablet:  640-1024px (md)
Desktop: > 1024px   (lg)
```

### 접근성
- 색상 대비 WCAG 2.1 AA 이상
- 키보드 네비게이션 (Tab, Enter, Escape)
- aria-label, role 속성 적용
- 이미지 alt 텍스트

### 에러 처리 패턴
- **네트워크 에러**: Toast 알림 + 재시도 버튼
- **401 Unauthorized**: 자동 토큰 갱신 → 실패 시 로그인 리다이렉트
- **404**: 커스텀 NotFound 페이지
- **AI 생성 실패**: 재시도 유도 메시지 + 대체 이미지 표시
- **폼 유효성**: 인라인 에러 메시지 (필드 하단)

### 로딩 상태
- **스켈레톤 UI**: 목록, 카드 영역
- **스피너**: 버튼 내부 (Submit 등)
- **프로그레스**: AI 이미지 생성 대기 (감성적 애니메이션)
- **낙관적 업데이트**: 좋아요 토글, 읽음 처리

---

## 상태 관리 전략 (계획)

### 원칙
- **서버 상태**: React Query (캐시, 재검증, 낙관적 업데이트)
- **클라이언트 상태**: Zustand (Vibe 플로우, 인증, UI 설정)
- **UI 모드 상태**: React Context (AppModeContext — 현재 구현됨)
- **URL 상태**: React Router searchParams (필터, 정렬, 페이지네이션)

### 현재 구현된 상태 관리

| Store | 역할 | 구현 |
|-------|------|------|
| `AppModeContext` | 사이드바 모드 (explore/profile), 프로필 활성 페이지 | React Context |

### 예정 Zustand Store

| Store | 역할 | 영속성 |
|-------|------|--------|
| `authStore` | JWT 토큰, 사용자 기본 정보 | localStorage |
| `vibeFlowStore` | 3단계 Vibe 입력 상태, 현재 단계 | sessionStorage (이탈 시 복원) |
| `uiStore` | 테마 (light/dark), 사이드바 열림/닫힘, 언어 설정 | localStorage |
| `notificationStore` | 미읽음 알림 수 | 메모리 (폴링으로 갱신) |

### React Query 키 컨벤션 (예정)

```typescript
export const queryKeys = {
  // Vibe
  vibeOptions: ['vibe', 'options'] as const,
  vibeResult: (sessionId: string) => ['vibe', 'result', sessionId] as const,
  vibeHistory: (page: number) => ['vibe', 'history', page] as const,

  // Archive
  folders: ['archive', 'folders'] as const,
  folderItems: (folderId: string, filters?: object) =>
    ['archive', 'folder', folderId, filters] as const,

  // Feed
  feeds: (sort: string) => ['feed', 'list', sort] as const,
  feedDetail: (feedId: string) => ['feed', 'detail', feedId] as const,
  feedComments: (feedId: string) => ['feed', 'comments', feedId] as const,

  // User
  profile: (userId?: string) => ['user', 'profile', userId] as const,
  followers: (userId: string) => ['user', 'followers', userId] as const,

  // Notification
  notifications: ['notification', 'list'] as const,
  unreadCount: ['notification', 'unread'] as const,

  // Report
  report: (type: 'monthly' | 'yearly', date: string) =>
    ['report', type, date] as const,

  // Search
  searchHistory: ['search', 'history'] as const,
  trending: ['trending'] as const,
} as const;
```

---

## API 연동 설계 (계획)

### 기본 설정

```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: JWT 토큰 주입
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: 401 시 토큰 갱신
apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // refreshToken으로 갱신 시도 → 실패 시 로그아웃
    }
    return Promise.reject(err);
  },
);
```

### 주요 API 엔드포인트 (예상)

```
# 인증
POST   /api/auth/signup           # 회원가입
POST   /api/auth/login            # 로그인
POST   /api/auth/logout           # 로그아웃
POST   /api/auth/refresh          # 토큰 갱신
POST   /api/auth/social/:provider # 소셜 로그인
DELETE /api/auth/withdraw         # 회원 탈퇴

# Vibe 옵션 (다국어)
GET    /api/vibe/options           # 모든 옵션 (무드, 시간, 날씨, 공간, 동반자)

# Vibe 세션
POST   /api/vibe/sessions          # 세션 생성
PATCH  /api/vibe/sessions/:id      # 단계별 업데이트
POST   /api/vibe/sessions/:id/generate  # AI 생성 요청
GET    /api/vibe/sessions/:id/status    # 생성 상태 폴링
GET    /api/vibe/sessions/:id/result    # 결과 조회

# Vibe 결과
PATCH  /api/vibe/results/:id/items/:itemId  # 아이템 교체
POST   /api/vibe/results/:id/regenerate     # 재생성
GET    /api/vibe/history                     # 생성 이력 (페이지네이션)

# 아카이브
GET    /api/archive/folders         # 폴더 목록
POST   /api/archive/folders         # 폴더 생성
PATCH  /api/archive/folders/:id     # 폴더 수정 (이름, 아이콘, 순서)
DELETE /api/archive/folders/:id     # 폴더 삭제
GET    /api/archive/folders/:id/items  # 폴더 내 아이템 (필터, 정렬)
POST   /api/archive/items           # 아이템 저장 (메모 포함)
PATCH  /api/archive/items/:id       # 메모 수정
DELETE /api/archive/items           # 다중 삭제 (body: ids[])
PATCH  /api/archive/items/move      # 다중 이동 (body: ids[], folderId)

# 피드
GET    /api/feeds                   # 피드 목록 (정렬, 무한스크롤)
POST   /api/feeds                   # 피드 작성
DELETE /api/feeds/:id               # 피드 삭제
POST   /api/feeds/:id/like          # 좋아요 토글
GET    /api/feeds/:id/comments      # 댓글 목록
POST   /api/feeds/:id/comments      # 댓글 작성
PATCH  /api/feeds/comments/:id      # 댓글 수정
DELETE /api/feeds/comments/:id      # 댓글 삭제
PATCH  /api/feeds/:id/pin           # 고정 피드

# 팔로우
POST   /api/users/:id/follow        # 팔로우
DELETE /api/users/:id/follow        # 언팔로우
GET    /api/users/:id/followers     # 팔로워 목록
GET    /api/users/:id/following     # 팔로잉 목록

# 프로필
GET    /api/users/me                # 내 프로필
PATCH  /api/users/me                # 프로필 수정
PATCH  /api/users/me/avatar         # 프로필 이미지 변경

# 알림
GET    /api/notifications           # 알림 목록
PATCH  /api/notifications/:id/read  # 읽음 처리
GET    /api/notifications/unread-count

# 외부 서비스
GET    /api/integrations            # 연동 상태 목록
POST   /api/integrations/:service/connect    # OAuth 연동
DELETE /api/integrations/:service/disconnect  # 연동 해제
POST   /api/integrations/spotify/playlist    # Spotify 플레이리스트 생성
POST   /api/integrations/hue/apply           # Hue 조명 적용
POST   /api/integrations/ott/watchlist       # OTT 시청 목록 추가

# 검색
GET    /api/search/history          # 검색 이력
DELETE /api/search/history/:id      # 개별 삭제
DELETE /api/search/history          # 전체 삭제
GET    /api/search/vibe?q=keyword   # 키워드 검색

# 트렌딩
GET    /api/trending                # 트렌딩 Vibe

# 분석 리포트
GET    /api/reports/monthly/:date   # 월간 리포트
GET    /api/reports/yearly/:year    # 연간 리포트
POST   /api/reports/export          # 이미지 내보내기

# 캘린더
GET    /api/calendar/:year/:month   # 월별 생성 기록
```

---

## 다국어 (i18n) 전략 — 미구현

### 구조
- `react-i18next` + 네임스페이스 분리
- DB에 번역된 옵션 데이터 존재 (`*_translations` 테이블)
- UI 텍스트는 JSON 파일, 동적 데이터(무드 키워드 등)는 API 응답에 포함
- 현재 컴포넌트 내 텍스트는 한국어 하드코딩 상태

### 네임스페이스
```
i18n/locales/ko.json
{
  "common": { "save": "저장", "cancel": "취소", "delete": "삭제", ... },
  "auth": { "login": "로그인", "signup": "회원가입", ... },
  "vibe": { "step1Title": "지금 어떤 기분인가요?", ... },
  "archive": { ... },
  "feed": { ... },
  "report": { ... },
  "notification": { ... },
  "settings": { ... },
  "error": { "network": "네트워크 오류가 발생했습니다", ... }
}
```

### API 요청 시 언어 전달
```typescript
apiClient.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language; // 'ko' | 'en' | 'zh'
  return config;
});
```

---

## 인증 플로우 (계획)

### JWT 기반
```
로그인 → accessToken (메모리/Zustand) + refreshToken (httpOnly cookie 권장)
         → API 요청 시 Authorization: Bearer {accessToken}
         → 만료 시 /api/auth/refresh로 갱신
         → 갱신 실패 → 로그아웃 + /login 리다이렉트
```

### 소셜 로그인 (OAuth 2.0)
```
1. 프론트에서 /auth/callback/:provider 로 리다이렉트 URL 설정
2. 소셜 로그인 버튼 클릭 → 카카오/네이버/구글 OAuth 페이지
3. 인증 완료 → /auth/callback/:provider?code=xxx
4. 콜백 페이지에서 code를 백엔드로 전달
5. 백엔드에서 JWT 발급 → 프론트 저장 → 메인 페이지 이동
```

### 소셜 회원가입
- 소셜 로그인 후 필수 정보 부족 시 → 추가 정보 입력 폼 표시
- 필수: 이름, 닉네임, 전화번호 / 선택: 성별, 연령
- 약관 동의 필수 (서비스 이용약관, 개인정보 처리방침)

---

## 성능 최적화

| 전략 | 적용 대상 |
|------|----------|
| **코드 스플리팅** | `React.lazy` + `Suspense` (라우트 단위) |
| **이미지 최적화** | WebP 포맷, lazy loading, srcset (반응형) |
| **무한 스크롤** | 피드, 이력 목록 (Intersection Observer) |
| **프리페칭** | 다음 단계 옵션 데이터, 인접 페이지 |
| **디바운싱** | 검색 입력 (300ms) |
| **캐시 전략** | React Query staleTime/cacheTime 튜닝 |
| **번들 분석** | `rollup-plugin-visualizer`로 번들 사이즈 모니터링 |

---

## 환경 변수 (미설정)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WEBSOCKET_URL=ws://localhost:8080/ws

# OAuth
VITE_KAKAO_CLIENT_ID=
VITE_NAVER_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=

# External Services
VITE_SPOTIFY_CLIENT_ID=
VITE_SPOTIFY_REDIRECT_URI=

# Feature Flags
VITE_ENABLE_FEED=true
VITE_ENABLE_REPORT=true
VITE_ENABLE_HUE=true
```

---

## 코딩 컨벤션

### 네이밍
- 컴포넌트: PascalCase (`MoodKeywordChip.tsx`)
- 훅: camelCase, `use` 접두사 (`useVibeFlow.ts`)
- 상수: UPPER_SNAKE_CASE (`MAX_ARCHIVE_COUNT = 500`)
- API 함수: `동사 + 대상` (`fetchVibeResult`, `createFolder`)
- 타입: PascalCase + 접미사 (`VibeResultResponse`, `FolderCreateRequest`)

### 컴포넌트 패턴
- 컨테이너/프레젠테이션 분리 (복잡한 경우)
- 커스텀 훅으로 비즈니스 로직 추출
- Props 인터페이스 명시적 정의
- `children` 사용 시 `PropsWithChildren` 활용

### 커밋 컨벤션
```
feat: 새로운 기능
fix: 버그 수정
style: 스타일링 변경 (기능 변경 없음)
refactor: 리팩토링
chore: 빌드, 설정 변경
docs: 문서 수정
test: 테스트 추가/수정
```

### Path Alias
- `@/*` → `src/*` (vite.config.ts + tsconfig.app.json에 설정됨)

---

## 보류 기능 (v2 이후)

| 기능 | 상태 | 비고 |
|------|------|------|
| 관리자 대시보드 (ADM-001~008) | 보류 | 별도 어드민 앱 or 페이지로 분리 예정 |
| 결제/구독 (PAY-001~008) | 보류 | PG 연동 필요 |
| WebSocket 실시간 알림 | 선택 | 초기엔 폴링, 스케일 시 WebSocket 전환 |
| PWA | 미정 | 모바일 경험 강화 시 검토 |
| SSR/SSG | 미적용 | SEO가 크리티컬하지 않음 (SPA 유지) |

---

## 참고 사항

### DB 스키마 핵심 테이블 (프론트 연동 시 참고)
- `users`, `user_profiles`, `social_accounts`: 사용자/인증
- `vibe_sessions`, `vibe_results`, `vibe_result_items`: Vibe 생성 플로우
- `mood_keywords`, `time_options`, `weather_options`, `place_options`, `companion_options`: 옵션 마스터 + 다국어 번역
- `archive_folders`, `archive_vibes`: 아카이브
- `feeds`, `feed_likes`, `feed_comments`, `follows`: 소셜
- `notifications`: 알림
- `external_service_connections`: 외부 서비스 연동 상태
- `search_histories`, `trending_vibes`, `mood_trends`: 검색/트렌드
- `reports`: 분석 리포트 (JSON 데이터)

### 리텐션 순환 구조 (프론트 UX 반영)
```
오늘의 Vibe 푸시 → Vibe 생성 → 아카이브 저장 → Vibe 다이어리(캘린더)
                                                    ↓
                                            분석 리포트 확인
                                                    ↓
                                            커뮤니티(피드) 공유
                                                    ↓
                                          다른 사용자 Vibe 탐색 → 다시 Vibe 생성
```

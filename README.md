# 🚀 Invest Future (IF)
## 실시간 시장 영향을 체험하는 혁신적인 암호화폐 모의투자 플랫폼

> **"만약에 이때 투자했다면 지금 얼마를 벌었을까?"**
> 
> 누구나 한 번쯤 해본 생각입니다. 하지만 현실적인 제약으로 인해 투자 경험을 쌓기는 쉽지 않죠.
> 
> **Invest Future(IF)**에서는 **실제 시장과 동일한 영향력을 체험**할 수 있는 모의투자를 통해 
> 안전하게 투자 경험을 쌓고 전문성을 기를 수 있습니다.

**🌐 서비스 URL:** ~~https://investfuture.my~~ AWS 지원 중단으로 로컬실행만 가능합니다.

## 📚 개발 후기 및 기술 블로그

프로젝트 개발 과정에서 겪은 기술적 도전과 해결 과정을 정리한 문서들입니다:

- **[배포 및 인프라 구축 후기](./docs/[개발후기]CI-CD.md)** - Docker, GitHub Actions, AWS EC2를 활용한 CI/CD 파이프라인 구축 과정
- **[차트 성능 개선 후기](./docs/[개발후기]-차트성능개선.md)** - AmCharts에서 TradingView Lightweight Charts로 마이그레이션하여 성능 최적화한 과정
- **[웹소켓 개선 후기](./docs/[개발후기]-웹소켓개선.md)** - 개별 STOMP 연결에서 단일 인스턴스 공유로 리팩토링한 실시간 통신 최적화 과정


## 🖥️ 로컬 실행 방법

### 📋 Prerequisite
- **Git** 
- **Node.js**
- **Yarn**
- **Docker**

#### 아래 명령어를 터미널에 붙여넣기 하세요.
```bash
git clone https://github.com/CleanEngine/cleanengine-fe.git
cd cleanengine-fe

chmod +x scripts/demo.sh

./scripts/demo.sh
```

#### 스크립트가 실행된 후 다음주소에 접속하세요.
- **프론트엔드**: http://localhost:3000



### 📊 프로젝트 개요
- **개발 기간**: 2025.05.02 ~ 2025.06.25 (2개월, 1차 mvp + 2차 테스트 + 3차 성능개선), 이후 유지보수 및 기능 추가 ~
- **총 커밋**: 331개
- **테스트 커버리지**: 60% (3차 기준)
- **핵심 기술**: React 19, TypeScript, React Router v7, XState, STOMP WebSocket
- **아키텍처**: Feature-Sliced Design (FSD)
- **배포**: AWS + Github Action + Docker

## 🎯 핵심 혁신: "멀티버스 문제" 해결

### 기존 모의투자 서비스의 한계
기존 모의투자 서비스는 3가지 주요 한계가 있었습니다:

| 유형 | 문제점 | 현실성 |
|------|--------|--------|
| **턴제 모의투자** | 실시간 거래 경험 불가 | ❌ 비현실적 |
| **자체 시장 모의투자** | 실제 시장과 완전 분리 | ❌ 비현실적 |
| **실시간 모의투자** | 거래가 차트에 반영되지 않음 | ⚠️ 부분적 현실성 |

### 🚀 IF의 혁신적 해결책

> **핵심 아이디어**: 사용자의 거래가 실제로 차트에 영향을 미치면서도, 실제 시장 가격과의 동기화를 유지

**문제**: 사용자 거래가 차트에 반영되면 시간이 지날수록 실제 시장과의 괴리가 커집니다. (멀티버스 현상)

**해결**: **자동화된 봇 시스템**이 실시간으로 시장 차이를 감지하고 **매수/매도 주문을 통해 가격을 보간**합니다.

<img width="1540" alt="차트 시연" src="https://github.com/user-attachments/assets/3f007d49-9aff-4563-8c5f-3884de261e5b" />

#### ✨ 결과
- ✅ **사용자 거래의 실제 시장 영향** 체험 
- ✅ **실제 시장 가격과의 동기화** 유지
- ✅ **현실적인 거래 경험** 제공



## 💻 주요 기능

### 🔥 실시간 거래 시스템
- **실시간 호가창**: STOMP WebSocket을 통한 실시간 매수/매도 호가 표시
- **즉시 체결**: 시장가/지정가 주문 지원 및 실시간 체결 처리
- **실시간 차트**: 사용자 거래가 즉시 반영되는 캔들스틱 차트
- **다중 시간프레임**: 1분, 5분, 15분, 30분 차트 지원

### 📊 고급 차트 기능
- **무한 스크롤**: 과거 데이터 자동 로딩으로 히스토리 분석 가능
- **인터랙티브 툴팁**: 마우스 호버 시 상세 정보 표시
- **실시간 업데이트**: WebSocket을 통한 지연 없는 가격 반영

### 👤 포트폴리오 관리
- **자산 현황**: 포트폴리오 가치 계산 및 수익률 표시
- **파이 차트**: 자산 배분 시각화 (클릭 시 해당 코인으로 스크롤)
- **거래 내역**: 체결/미체결 주문 관리 및 주문 취소 기능

### 🤖 AI 채팅 도우미
- **채팅 상담**: 투자 관련 질문 및 시장 분석 지원

### 🔐 보안 & 인증
- **카카오 OAuth**: 간편한 소셜 로그인
- **JWT 세션**: HttpOnly + Secure 쿠키로 XSS 공격 방지
- **보호된 라우팅**: 인증 기반 페이지 접근 제어
- **토큰 보안**: Access Token을 안전한 쿠키에 저장하여 클라이언트 사이드 스크립트 접근 차단

## 🛠️ 기술 스택 & 아키텍처

### 💡 기술 스택
```
Frontend Framework     → React 19 + TypeScript
Routing & SSR         → React Router v7 (Framework Mode)
State Management      → XState (이벤트 기반) + React Context
Real-time Communication → STOMP.js WebSocket
Charts & Visualization → AmCharts 5 → Recharts → Lightweight Charts
Styling              → Tailwind CSS v4 + Pretendard Font
Build Tool           → Vite 6
Testing              → Vitest + React Testing Library + MSW
Code Quality         → Biome (Linting & Formatting)
CI/CD                → AWS + GitHub Actions + Docker
```

### 🏗️ 아키텍처 설계 원칙

#### 1. **Feature-Sliced Design (FSD)**
확장성을 위한 계층형 아키텍처

```
src/
├── app/          # 애플리케이션 셸 (프로바이더, 라우팅)
├── features/     # 비즈니스 기능 (거래, 인증, 채팅, 프로필)  
├── entities/     # 핵심 비즈니스 엔티티 (코인, 사용자, 주문, 세션)
├── shared/       # 재사용 가능한 인프라 (UI, API, 유틸, 훅)
└── widgets/      # 복합 UI 블록 (네비바, 인증 모달)
```

**전통적 방식 vs FSD**
- ❌ **기존**: components, pages, hooks (기능별 분리) → 파일 찾기 어려움, 의존성 파악 곤란
- ✅ **FSD**: 목적별 분리로 높은 응집도와 낮은 결합도 달성

#### 2. **이벤트 드리븐 상태 관리 (XState)**
복잡한 UI 플로우를 위한 유한 상태 머신

<img width="1131" alt="XState 상태 다이어그램" src="https://github.com/user-attachments/assets/1a1acee9-aab4-48ac-80eb-82b6f8da30af" />
   
```typescript
// 주문 폼 상태 머신 예시
const formMachine = setup({
  types: {
    context: {} as FormContext,
    events: {} as FormEvents,
  },
}).createMachine({
  initial: 'idle',
  states: {
    idle: { on: { SUBMIT: 'validating' } },
    validating: { 
      invoke: { src: 'validateOrder' },
      on: { 
        SUCCESS: 'submitting',
        ERROR: 'error' 
      }
    },
    submitting: { /* ... */ },
    error: { /* ... */ }
  }
});
```

**XState 도입 이유:**
- ✅ **예측 가능한 상태 변화**: 버그 감소 및 디버깅 용이성
- ✅ **복잡한 비즈니스 로직 관리**: 주문 프로세스, 채팅 플로우
- ✅ **시각적 상태 다이어그램**: 팀 커뮤니케이션 개선

#### 3. **React Router v7 Framework Mode**

**현재 렌더링 전략:**
- **SSR (Server-Side Rendering)**: 모든 페이지가 서버에서 초기 렌더링
- **Client-Side Navigation**: 페이지 간 이동은 클라이언트에서 처리
- **데이터 로더**: 서버사이드 데이터 페칭으로 초기 로딩 성능 최적화

**주요 이점:**
- ✅ **빠른 초기 로딩**: 서버에서 완성된 HTML 제공
- ✅ **SEO 최적화**: 검색 엔진 크롤링 지원  
- ✅ **부드러운 네비게이션**: 페이지 간 새로고침 없이 전환
- ✅ **실시간 기능**: WebSocket 연결로 동적 업데이트

#### 4. **실시간 데이터 아키텍처**

```typescript
// WebSocket 연결 관리
const StompProvider = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: WEBSOCKET_URL,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });
    
    stompClient.activate();
    setClient(stompClient);
    
    return () => stompClient.deactivate();
  }, []);
  
  return (
    <StompContext.Provider value={{ client, connected }}>
      {children}
    </StompContext.Provider>
  );
};
```

**실시간 데이터 플로우:**
1. **WebSocket 연결** → STOMP.js 클라이언트 초기화
2. **구독 관리** → 코인별 가격/호가 채널 구독
3. **데이터 변환** → 원시 데이터를 차트/UI 형식으로 변환
4. **상태 업데이트** → React 상태 관리와 연동
5. **UI 반영** → 지연 없는 실시간 업데이트

#### 5. **차트 기술 구현**
```
AmCharts 5 → Lightweight Charts
(무한스크롤 구현 실패) → (무한스크롤 구현 성공)
```

**기술 변경 배경:**
- **AmCharts 5 한계**: 뛰어난 성능과 다양한 기능을 제공했으나, **과거 데이터 무한 스크롤 구현에서 기술적 제약** 발생
- **핵심 요구사항**: 사용자가 차트를 좌측으로 스크롤할 때 과거 데이터를 동적으로 로딩하는 기능이 필수
- **해결책 모색**: AmCharts 5의 기본동작 override 실패로 인해 무한 스크롤 구현 실패

**최종 선택: Lightweight Charts**
- ✅ **무한 스크롤 구현 성공**: 과거 데이터 동적 로딩 완벽 지원
- ✅ **Canvas 기반 고성능**: 대용량 실시간 데이터 처리
- ✅ **유연한 API**: React와의 원활한 통합 및 커스터마이징

---

## 📈 개발 타임라인

### 🏗️ 1차 MVP 개발 (2025.05.02 - 2025.05.15)
**핵심 거래 시스템 구현**
- **프로젝트 기반**: React 19 + TypeScript + Vite, FSD 아키텍처
- **실시간 시스템**: STOMP WebSocket 연결 및 AmCharts 5 차트 구현
- **거래 엔진**: XState 기반 주문 폼 상태 관리 및 실시간 체결 시스템
- **인증 시스템**: 카카오 OAuth 로그인 및 JWT 세션 관리
- **거래 기능**: 시장가/지정가 주문, 실시간 호가창, 체결 목록
- **배포 선행**: EC2 + Github Action + Docker를 사용하여 CD 파이프라인을 선행한 후 개발 시작

https://github.com/user-attachments/assets/779b77f1-e778-4a53-b37f-d79a2dc187e8

### 🧪 2차 테스트 강화 (2025.05.16 - 2025.06.06)
**품질 보증 및 테스트 커버리지 확대**
- **단위 테스트**: 60% 커버리지 달성, React Testing Library + Vitest
- **CI 파이프라인**: SonarQube 코드 품질 관리, GitHub Actions 워크플로우
- **AI 채팅봇**: XState 기반 채팅 상태 머신 및 메시지 컴포넌트
- **다중 코인**: BTC, ETH 등 주요 암호화폐 거래 지원
- **실시간 알림**: 체결 완료 시 토스트 알림 시스템

### ⚡ 3차 성능 개선 (2025.06.07 - 2025.06.25) 
**차트 기술 전환 및 성능 최적화**
- **차트 마이그레이션**: AmCharts 5 → Lightweight Charts (무한 스크롤 구현)
- **번들 최적화**: 청크 분리, 지연 로딩, 렌더링 블록 CSS 최적화
- **무한 스크롤**: 과거 데이터 동적 로딩 및 중복 패칭 방지
- **기술 지표**: 볼린저 밴드, 이동평균선, 차트 툴팁
- **모니터링**: Sentry 오류 추적 시스템 도입

### 🔧 유지보수 (2025.06.26 이후)
**안정성 향상 및 사용자 경험 개선**
- **포트폴리오**: 파이차트 자산 시각화, 체결 내역 페이지네이션
- **사용자 경험**: 에러 바운더리, 로딩 상태, 반응형 레이아웃
- **데이터 품질**: 실시간 가격 포맷팅, 호가 정렬 개선
- **인증 개선**: 로그인 상태 검증, 자동 리다이렉트
- **테스트 확장**: 추가 컴포넌트 및 훅 단위 테스트

---

## 🎯 핵심 성과 & 혁신

### 📊 개발 지표
- **총 커밋 수**: 331개 (체계적인 버전 관리)
- **테스트 커버리지(3차 기준)**: 60% (높은 코드 품질)

### 🚀 기술적 혁신
1. **실시간 시장 영향 시뮬레이션**: 봇 보간 시스템
2. **XState 기반 상태 관리**: 예측 가능한 복잡한 UI 플로우
3. **React Router v7 선도적 도입**: 하이브리드 렌더링 전략
4. **60% 테스트 커버리지(3차 기준)**: 프로덕션 수준의 품질 보증

### 💡 비즈니스 가치
- **차별화된 사용자 경험**: 실제 시장 영향을 체험하는 유일한 모의투자 플랫폼
- **한국 시장 특화**: 카카오 로그인, 원화 표시, 한국 시간대 지원
- **확장 가능한 아키텍처**: FSD 패턴으로 신규 기능 추가 용이
- **모바일 퍼스트**: 반응형 디자인으로 모든 디바이스 지원

---

## 🚀 시작하기

### 📋 사전 요구사항
- Node.js 18+
- Yarn 1.22+
- Docker (선택사항)

### ⚡ 빠른 실행
```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 테스트 실행
yarn test

# 빌드
yarn build
```

### 🐳 Docker 실행
```bash
# Docker 이미지 빌드
docker build -t invest-future .

# 컨테이너 실행
docker run -p 3000:3000 invest-future
```

### 🔧 환경 변수 설정
```env
# 예시 코드입니다.
VITE_API_URL=https://api.investfuture.my
VITE_STOMP_URL=wss://api.investfuture.my
VITE_OAUTH_URL=https://kauth.kakao.com/oauth/authorize
VITE_APP_SECRET=your-secret-key
```

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요! ⭐**

*혁신적인 암호화폐 모의투자로 안전하게 투자 경험을 쌓아보세요.*

</div>

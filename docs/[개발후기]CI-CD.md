# CI/CD 개발일지

- **cleanengine-fe**: React Router V7 기반 프론트엔드 애플리케이션
- **cleanengine-reverseproxy**: Nginx 기반 리버스 프록시 서버
- **도메인**: investfuture.my
- **서비스**: 실시간 거래소 추종 모의투자 시뮬레이터

## 배포 우선 개발 전략

CleanEngine 팀은 **"배포 환경 먼저, 개발은 나중에"** 라는 전략을 채택했습니다. 이는 다음과 같은 이유 때문이었습니다:

### 왜 배포를 먼저 구축했는가?

**1. 팀 동기화 (Team Alignment)**
- 모든 팀원이 **동일한 환경**을 바라보며 개발할 수 있음
- 각자 로컬에서 작업한 내용이 **실제 운영 환경**에서 어떻게 동작하는지 즉시 확인 가능
- 팀 전체가 **같은 목표와 진행 상황**을 공유할 수 있는 기준점 제공

**2. 지속적 피드백 루프 (Continuous Feedback Loop)**
- **CI/CD 파이프라인**이 구축되어 있어야 개발 결과물을 즉시 배포하고 테스트 가능
- 기능 개발 후 **즉시 실제 환경에서 검증**할 수 있어 빠른 피드백 수집
- 버그나 문제점을 **조기에 발견**하고 수정할 수 있는 환경 구성

**3. 개발 생산성 향상**
- 로컬 환경과 운영 환경의 **차이로 인한 문제 최소화**
- 팀원 간 **"내 컴퓨터에서는 잘 돌아가는데"** 라는 문제 상황 방지
- **표준화된 배포 프로세스**로 개발에만 집중할 수 있는 환경 조성

**4. 프로젝트 진행 상황 투명성**
- 언제든지 **실제 동작하는 서비스**를 통해 프로젝트 현황 확인 가능
- 클라이언트나 이해관계자에게 **구체적인 결과물** 시연 가능
- 개발 중인 기능들이 **실제 사용자 환경**에서 어떻게 작동하는지 실시간 검증

이러한 배포 우선 전략 덕분에 CleanEngine 팀은 개발 초기부터 안정적이고 확장 가능한 인프라 위에서 개발을 진행할 수 있었습니다.

---

## 배포 아키텍처 진화 과정

### 1단계: 단일 EC2 기반 멀티 컨테이너 배포 (2025년 4월-5월)

**배경:**
- 처음부터 HTTPS 적용을 목표로 한 보안 중심 설계
- HttpOnly, Secure 쿠키 옵션 사용으로 인한 SSL/TLS 필수
- Docker Hub 무료 티어 활용한 이미지 레지스트리

**초기 아키텍처:**
```
[GitHub Actions] → [Docker Hub] → [단일 EC2 인스턴스]
                                        ↓
                                   [Docker Compose]
                                        ├── Nginx Reverse Proxy (80,443)
                                        ├── React Frontend (3000)
                                        ├── Spring Boot Backend (8080)
                                        ├── AI Server (8000)
                                        └── MariaDB (3306)
```

**주요 특징:**
- 처음부터 리버스 프록시 구성으로 HTTPS 지원
- Docker Compose를 통한 멀티 컨테이너 관리
- Let's Encrypt SSL 인증서 자동 갱신
- GitHub Actions 기반 CI/CD 파이프라인

**한계점:**
- 단일 EC2에서 모든 서비스 실행으로 인한 성능 병목
- 여러 거래소 API 연동으로 인한 백엔드 서버 부하
- AI 서버 리소스 사용량으로 인한 전체 시스템 성능 저하

### 2단계: 서비스별 EC2 분리 - 성능 최적화 (2025년 6월-7월)

**분리 배경:**
- 백엔드에서 다중 거래소 연동 (업비트, 빗썸 등) 처리 부하 증가
- 다중 코인 지원으로 인한 실시간 데이터 처리량 급증
- AI 서버의 머신러닝 모델 실행으로 인한 CPU/메모리 사용량 증가

**분산 아키텍처:**
```
[인터넷] → [리버스 프록시 EC2]
              ├── / → [프론트엔드 EC2]
              ├── /api/ → [백엔드 EC2] ← [MariaDB EC2]
              └── /ai/ → [AI 서버 EC2]
```

**EC2 인스턴스 구성:**
1. **리버스 프록시 EC2**: Nginx 리버스 프록시 전용
   - t3.small (2 vCPU, 2GB RAM)
   - SSL 종료, 라우팅, 정적 파일 캐싱
   - 모든 외부 트래픽의 진입점

2. **프론트엔드 EC2**: React 애플리케이션 전용
   - t3.small (2 vCPU, 2GB RAM)
   - React Router V7 SSR/SPA 하이브리드

3. **백엔드 EC2**: Spring Boot API 서버
   - t3.medium (2 vCPU, 4GB RAM)
   - 다중 거래소 API 연동, 실시간 데이터 처리
   - MariaDB와 Private IP로 통신

4. **AI 서버 EC2**: 머신러닝 모델 서버
   - t3.large (2 vCPU, 8GB RAM)
   - 투자 추천 알고리즘, 시장 분석 모델
   - 리버스 프록시를 통해서만 접근 가능

5. **MariaDB EC2**: 데이터베이스 서버
   - t3.small (2 vCPU, 2GB RAM)
   - Private IP 기반 접근 (10.0.0.x:3306)
   - 백엔드 서버를 통해서만 접근 가능
   - 프론트엔드에서 직접 접근 불가

**리버스 프록시 라우팅 설정:**
```nginx
# cleanengine-reverseproxy/nginx.conf
upstream react_app {
  server 10.0.0.4:3000;    # 프론트엔드 EC2 private IP
}

upstream api-server {
  server 10.0.0.138:8080;  # 백엔드 EC2 private IP
}

upstream ai-server {
  server 10.0.0.12:8000;   # AI 서버 EC2 private IP
}

server {
  listen 443 ssl;
  server_name investfuture.my;

  # 프론트엔드로 라우팅
  location / {
    proxy_pass http://react_app/;
  }

  # 백엔드 API로 라우팅
  location /api/ {
    proxy_pass http://api-server/api/;
  }

  # AI 서버로 라우팅
  location /ai/ {
    proxy_pass http://ai-server/;
  }
}
```

**트래픽 흐름:**
- 클라이언트 → 리버스 프록시 → 프론트엔드 (일반 페이지)
- 클라이언트 → 리버스 프록시 → 백엔드 (거래 API)
- 클라이언트 → 리버스 프록시 → AI 서버 (AI 분석 API)
- 백엔드 → MariaDB (Private IP 통신, 데이터베이스 쿼리)

**데이터베이스 접근 제어:**
- **보안 설계**: 프론트엔드에서 데이터베이스 직접 접근 차단
- **중앙 집중식 데이터 관리**: 모든 데이터베이스 작업은 백엔드 API를 통해서만 수행
- **Private Network**: MariaDB는 Private IP로만 접근 가능하여 외부 노출 방지

**성능 개선 효과:**
- AI 서버 독립 실행으로 전체 시스템 안정성 향상
- 서비스별 독립 배포 및 스케일링 가능

### 3단계: 성능 최적화 및 품질 관리 강화 (2025년 6월-8월)

**성능 최적화 설정 적용 (6월 12일):**
- **HTTP/3 및 QUIC 프로토콜**: 연결 지연시간 최소화
- **Gzip 압축**: 대역폭 사용량 최적화
- **정적 파일 캐싱**: Nginx 기반 에지 캐싱
- **WebSocket 프록시**: 실시간 거래 데이터 스트리밍

**에셋 로딩시간 단축을 위한 Nginx 설정:**
```nginx
# HTTP/3 및 성능 최적화
listen 443 quic reuseport;
http3 on;
http2 on;
add_header Alt-Svc 'h3=":443"; ma=86400';

# Gzip 압축
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript 
           font/ttf font/opentype font/woff font/woff2;

# 정적 파일 캐싱
location ~* \.(js|css|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf)$ {
  proxy_cache STATIC_CACHE;
  proxy_cache_valid 200 302 60m;
  expires 60m;
  add_header Cache-Control "public, immutable, no-transform, max-age=3600";
}

# WebSocket 프록시 (실시간 호가 데이터)
location /api/coin/min {
  proxy_pass http://api-server/api/coin/min;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 86400s;
}
```

**추가 인프라 (7월):**
- **SonarQube EC2**: 코드 품질 분석 서버
  - t3.medium (2 vCPU, 4GB RAM)
  - 정적 코드 분석, 코드 커버리지 측정
  - PostgreSQL 내장 실행

**최종 아키텍처:**
```
[개발자] → [GitHub] → [GitHub Actions] → [SonarQube EC2]
                           ↓
                    [Docker Hub Registry]
                           ↓
                    [배포 스크립트 실행]
                           ↓
        [리버스 프록시 EC2] ← [외부 트래픽]
              ├── / → [프론트엔드 EC2]
              ├── /api/ → [백엔드 EC2]
              └── /ai/ → [AI 서버 EC2]
```

**운영 최적화:**
- 시스템 모니터링 및 로그 관리 강화
- 자동화된 배포 프로세스 안정화
- 성능 메트릭 수집 및 분석

---

## 기술적 변화 포인트

### 보안 우선 설계
- **초기부터 HTTPS 필수**: HttpOnly, Secure 쿠키 설정
- **환경변수 기반 비밀정보 관리**: JWT_SECRET, KAKAO_CLIENT_ID 등

### 리버스 프록시 중심 아키텍처
- **단일 진입점**: 모든 외부 트래픽이 리버스 프록시를 통과
- **라우팅 기반 분산**: URL 경로에 따른 서비스 라우팅

### 성능 중심 서비스 분리
- **리소스 최적화**: CPU/메모리 사용량에 따른 인스턴스 타입 선택
- **네트워크 최적화**: Private IP 기반 내부 통신
- **독립적 스케일링**: 서비스별 개별 확장 가능
- **데이터베이스 분리**: MariaDB 전용 EC2
- **보안 강화**: 데이터베이스 직접 접근 차단, 백엔드를 통한 중앙 집중식 데이터 관리

### 개발 품질 관리
- **SonarQube 도입**: 정적 코드 분석 자동화
- **CI/CD 파이프라인**: 테스트 → 분석 → 배포 자동화

---

## 성능 및 비용 개선 지표

### 성능 개선
- **프론트엔드 로딩시간**: HTTP/3으로 브라우저에서 에셋 로딩 시간 단축
- **AI 서버 독립성**: 백엔드 부하와 무관한 AI 서비스 제공

### 운영 효율성
- **코드 품질**: SonarQube 도입으로 버그 발생 가능 코드 탐지
- **개발 생산성**: 테스트 자동화

### 비용 최적화
- **Docker Hub 무료 티어**: 이미지 레지스트리 비용 0원
- **Let's Encrypt**: SSL 인증서 비용 절약

---

## 배포 변화 타임라인

| 날짜 | 주요 변화 | 커밋 해시 | 설명 |
|------|-----------|-----------|------|
| 2025-04-30 | 초기 배포 환경 구축 | `453835f` | 단일 EC2 + Docker Compose |
| 2025-05-01 | 리버스 프록시 설정 | `02ae3c2` | HTTPS 적용한 nginx.conf |
| 2025-05-15 | SSL 인증서 자동화 | `7c300a7` | Let's Encrypt 설정 |
| 2025-06-01 | EC2 분리 시작 | `3fd9383` | 백엔드 전용 EC2 분리 |
| 2025-06-15 | WebSocket 지원 | `0c984b6` | 실시간 데이터 스트리밍 |
| 2025-07-01 | AI 서버 분리 | `a954d3a` | AI 전용 EC2 구성 |
| 2025-07-15 | SonarQube 도입 | - | 코드 품질 관리 EC2 추가 |
| 2025-08-01 | 성능 최적화 완료 | `4c47152` | HTTP/3, 캐싱, 압축 적용 |

---

## 학습한 교훈

### 1. 보안 우선 설계의 중요성
처음부터 HTTPS를 고려한 아키텍처 설계로 인해 나중에 보안 관련 리팩토링 비용을 절약할 수 있었습니다.

### 2. 리버스 프록시의 중앙 집중식 라우팅
단일 진입점을 통한 트래픽 관리로 보안, 모니터링, 캐싱을 일관되게 적용할 수 있었습니다.

### 3. 서비스 독립성의 중요성
백엔드와 AI 서버를 독립적으로 운영함으로써 한 서비스의 장애가 다른 서비스에 영향을 주지 않도록 했습니다.

### 4. 점진적 확장의 효과
초기 단일 인스턴스 → 서비스별 분리 → 품질 관리 도구 추가의 점진적 확장으로 안정적인 인프라를 구축했습니다.

### 5. 무료 도구 활용
Docker Hub 무료 티어, Let's Encrypt 등 무료 도구를 적극 활용하여 초기 비용을 최소화했습니다.
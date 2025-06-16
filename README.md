# board_fastapi 프로젝트

## 개요
이 프로젝트는 최신 웹 기술을 활용하여 빠르고 확장성 있는 게시판 시스템을 구현합니다.  
프론트엔드와 백엔드를 분리하여 개발 및 배포 효율성을 높였으며, 클라우드 기반 데이터베이스와 자동화된 배포 시스템을 적용하였습니다.
---
## 구성
1. **Frontend**  
   - **React + Vite + TypeScript**  
   - `board_rv` 디렉토리로 별도 분리  
   - 최신 프론트엔드 스택을 활용하여 빠른 개발과 유지보수 용이

2. **Backend**  
   - **FastAPI**  
   - Python 기반의 고성능 백엔드  
   - RESTful API 제공

3. **Database**  
   - **MongoDB Atlas**  
   - 클라우드 기반 DB로 비용 절감 및 무중단 서버 연결  
   - 확장성과 안정성 확보

4. **CI/CD & 배포**  
   - **GitHub Actions (WorkFlow)**  
   - 프론트엔드와 백엔드 모두 오라클 클라우드(OCI)에 자동 배포  
   - 코드 변경 시 자동 테스트 및 배포로 운영 효율성 극대화

---
## 주요 특징

- 최신 웹 프레임워크 및 클라우드 인프라 활용
- 프론트/백엔드 완전 분리 구조
- 자동화된 배포 파이프라인
- 무중단 서비스와 비용 효율성

---
## 폴더 구조

```
board_fastapi/
├── board_fastapi/    # FastAPI 백엔드
├── board_rv/         # React 프론트엔드
├── .github/          # GitHub Actions 워크플로우
├── Board.iml
└── README.md
```

---

## 문의
- 담당자: stradivirus9@gmail.com
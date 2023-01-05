# DO GREEN 🌏🌱

## 서비스 소개

"환경 도메인 뉴스레터 구독 서비스"

각 카테고리 별로 분류된 주제를 구독하여 뉴스레터를 볼 수 있고, 댓글과 좋아요로 상호작용 가능합니다. 
## 배포 링크
https://do-green.vercel.app

## 1. TECH STACK

### BACKEND
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">

<img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"> <img src="https://img.shields.io/badge/GCP-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/zod-000000?style=for-the-badge&logo=zod&logoColor=white">

## 주요 구현내용
- 도메인 로직을 분리하기 위해 Layered Architecture 적용
- Dockerfile과 GCP를 사용한 배포 자동화
- MongoDB Atlas를 사용하여 애플리케이션과 데이터베이스 분리
- 페이지네이션으로 올 쿼리 요청 최적화
- Zod library로 request parsing
- TypeScript의 Pick, Omit, Union 타입을 이용하여 재사용성 극대화
- type-guard 용도로 사용하는 tiny-invariant 라이브러리를 커스텀하여 유틸 함수 구현
- Express의 request 타입을 확장하여 미들웨어에서 공유 가능한 context 생성
- S3 bucket으로 이미지 파일 스토리지 분리

### FRONTEND 

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"> <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=React_Query&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">

<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

- react-query와 zustand를 이용한 상태관리
- 코멘트와 뉴스페이지에 Infinity scroll 구현
- 좋아요에 optimistic update 적용
- alert/confirm 등 재사용성 있는 dialog modal 구현
- skeleton screen 적용

## 2. 기능 상세

메인페이지
- Autoplay Carousel
- Infinite Autoplay Carousel
- 페이지 최상단 이동 버튼 구현
- 카테고리 목록 조회


로그인
- react-hook-form과 yup을 이용한 validation
- 모달 창을 이용하여 페이지 이동없이 로그인 가능 
- 로그인하는 경로에 따라, 로그인 이후의 경로 이동
- 모달알람 창을 통하여 로그인 오류 및 로그아웃 확인


회원가입
- react-hook-form과 yup을 이용한 validation
- 동일한 이름과 이메일이 존재하는지 중복 확인

내 정보 수정
- react-hook-form과 yup을 이용한 validation
- 현재 비밀번호를 필수로 입력한 뒤, 원하는 정보만 선택하여 수정 가능
- 모달, 알람 창을 통하여 제출 확인 선택과 에러 상태 확인 가능
- 모달을 통하여 페이지 이동없이 회원탈퇴 가능

카테고리 페이지
- 카드 Hover Flip 애니메이션
- 구독완료/취소 react toast 알림
- 로그인/유저 여부에 따른 구독 상태변화
- 모달, 알림창 공통 컴포넌트/훅 관리 
- 카테고리 목록 조회
- 구독하기, 구독 목록 조회

뉴스레터 페이지
- react-hook-form과 yup을 이용한 validation

마이페이지
- Progress bar CSS 적용
- React heatmap calender CSS 적용
- 반응형 네비게이션바 구현
- 유저 정보 조회, 수정, 삭제
- 구독 목록 조회, 구독 취소

## 3. ARCHITECTURE

### 서비스 구조도
<img src="./stack.png">

### ERD
<img src="./DoGreen ERD.png">


## 4. 참고 링크

- [figma](https://www.figma.com/file/tXtlbgXtKAsmPOo2scuaUn/team2-team-library?node-id=0%3A1&t=gwOCbP2MqN0caJlU-1)

- [API 문서](https://documenter.getpostman.com/view/18622149/2s8YzXwfp4)

## 4. 프로젝트 팀원 역할 분담

| 이름   | 포지션  | 담당업무                                                     |
| ------ | ------- | ------------------------------------------------------------ |
| 박지수 | 팀장/FE | 뉴스, 코멘트, 카테고리 구현 및 환경설정/라우팅               |
| 이예나 | FE      | 메인페이지, 카테고리, 마이페이지, 모달 구현                  |
| 이지현 | FE      | 로그인, 모달, 유저 관련 기능 구현                            |
| 지시안 | FE      | 어드민, 헤더/네비게이터/푸터 구현                            |
| 서윤지 | BE      | 유저, JWT, 구독 기능, 이미지 업로드, 배포, 에러처리 미들웨어 |
| 손형석 | BE      | 카테고리, 뉴스레터, 좋아요, 댓글 기능 구현                   |

## 5. 실행 방법

- BE
  ```
  1. docker 실행
  2. yarn dev
  ```
- FE
  ```
  1. npm i
  2. npm run dev
  ```

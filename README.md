# DO GREEN 🌏🌱

## 서비스 소개

"환경 도메인 뉴스레터 구독 서비스"

각 카테고리 별로 분류된 주제를 구독하여 뉴스레터를 볼 수 있고, 댓글과 좋아요로 상호작용 가능합니다. 
## 배포 링크(현재 이용 불가능합니다)
https://do-green.vercel.app

## 1. TECH STACK

### FRONTEND 

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"> <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=React_Query&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">

<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

- react-query와 zustand를 이용한 상태관리
- 코멘트와 뉴스페이지에 Infinity scroll 구현
- 좋아요에 optimistic update 적용
- alert/confirm 등 재사용성 있는 dialog modal 구현
- skeleton screen 적용

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


## 2. 기능 상세

메인페이지
![main](https://user-images.githubusercontent.com/91370858/210854665-c1435853-bb4f-4280-b11d-7b0b50fe3192.gif)

로그인
![login](https://user-images.githubusercontent.com/91370858/210854751-b85a8c9c-06ae-4c12-b5aa-625159d6d760.gif)

회원가입
![register](https://user-images.githubusercontent.com/91370858/210854810-add6e776-fadd-4b75-9202-d197babfc999.gif)


내 정보 수정
![mypage](https://user-images.githubusercontent.com/91370858/210854849-7564d075-c67e-41d5-a974-d4a98f173697.gif)

카테고리 페이지
![category](https://user-images.githubusercontent.com/91370858/210854876-585566c3-681b-4801-b042-ec72b86f9a26.gif)

뉴스레터 페이지
![postpage](https://user-images.githubusercontent.com/91370858/210854915-fd90e680-2b0c-4879-9420-fe7cb90f883d.gif)

내 구독정보 조회
![mypagesub](https://user-images.githubusercontent.com/91370858/210854950-e55a444f-0e8a-4acf-96e6-addcaacf5652.gif)


## 3. ARCHITECTURE

### 서비스 구조도
<img src="./stack.png">

### ERD
<img src="./DoGreen ERD.png">


## 4. 참고 링크

- [figma](https://www.figma.com/file/tXtlbgXtKAsmPOo2scuaUn/team2-team-library?node-id=0%3A1&t=gwOCbP2MqN0caJlU-1)

- [API 문서](https://documenter.getpostman.com/view/18622149/2s8YzXwfp4)


## 5. 프로젝트 팀원 역할 분담

| 이름   | 포지션  | 담당업무                                                     |
| ------ | ------- | ------------------------------------------------------------ |
| 박지수 | 팀장/FE | 뉴스, 코멘트, 카테고리 구현 및 환경설정/라우팅               |
| 이예나 | FE      | 메인페이지, 카테고리, 마이페이지, 모달 구현                  |
| 이지현 | FE      | 로그인, 모달, 유저 관련 기능 구현                            |
| 지시안 | FE      | 어드민, 헤더/네비게이터/푸터 구현                            |
| 서윤지 | BE      | 유저API, 어드민API, 구독API, 이미지 업로드 API, 배포, 문서화 |
| 손형석 | BE      | 카테고리API, 뉴스레터API, 좋아요API, 댓글API 구현, 문서화                   |

## 6. 실행 방법

### BE
- root path

```shell
$ ./backend
```
- dependency
```shell
yarn install
```

- command
```shell
$ yarn dev 또는 yarn start
```


### FE
- dependency
```shell
$ npm install
```

- command
```shell
$ npm run dev
```


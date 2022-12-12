# branch name rule
[FE or BE]-feature-[작업대상]<br>
ex)<br>
```FE-feature-mypage```<br>
```BE-feature-reviewAPI```
# Commit rule
- **단일한 기능**에 대하여 커밋하도록 함.
```
 feat : 새로운 기능에 대한 커밋
 fix : 수정에 대한 커밋
 docs : 문서 수정에 대한 커밋
 set : 프로젝트 세팅에 대한 커밋
 chore : 빌드 업무 수정, 패키지 매니저 수정한 커밋
 refactor : 기존 코드를 리팩토링한 커밋
```
ex)
```git commit -m "[feat] 로그인 기능 구현"```
# MR(PR) rule
- MR 시 동료를 reviewer로 설정하여 반드시 검토 후 merge할 것.
- MR 후 전체 팀원에게 공유하여 pull할 수 있도록 함.
제목: [날짜]-[FE or BE]: [MR 요약]
내용: MR에 대한 상세 설명<br>
ex)
```
제목: 
221212-FE: mypage 구현
내용:
1. mypage header/footer 연결
2. 개인정보 수정 기능 구현
```
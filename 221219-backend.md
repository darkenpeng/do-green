## card schema -> category schema 변경 ( 기존 category schema는 삭제 )

1. category schema structure

categoryNmae : ex)News, Food, LifeStyle ...etc
MascotName : ex) Penguin, Lion, Tiger, rabbit ...etc 
MascotImage : imgURL
posts : ref "post schema"

2. post schema structure

category : ref "category schema"
content : contents text
like : ref "like schema"
comment : ref "comment schema"

> categoryName, mascotName은 프론트에서 표현 할 때는 펭귄의 뉴스, 사자의 음식 처럼 1:1 대응( 백도 그렇게 대응시켜야 할듯) 
>> 모든 카테고리의 글은 1명의 admin만 관리

## 의견 제시

categoryName을 배열로 만들고 배열의 0번째는 마스코트이름, 1번째를 카테고리 이름으로저장?
프론트에서 꺼내쓸때는 .categoryName[0]이 전하는 .categoryName[1]! -> (펭귄이 전하는 뉴스!)
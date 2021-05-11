---
layout: post
title: "[Javascript] async await(어싱크 어웨잇) 다루기"
featured-img: asyncawait
categories: [studying]
---

### async, await 개념 간단히 정리

javacript에서 promise를 중첩해서 사용해서 여러 비동기를 처리할 경우 코드의 가독성이 떨어질 수 있다. promise를 이용하지 않고도 간편하게 비동기를 작성할 수 있는 방법이 있다.  
async, await api를 사용하면 비동기 처리를 동기식으로 코드를 순서대로 작성하는 것처럼 간편하게 코드를 작성할 수 있게 도와준다.  
promise를 깔끔하게 사용할 수 있는 방법으로 볼 수 있겠다.  
(항상 promise보다 async await가 좋은 건 아님. promise를 써야 맞는 경우도 있고, 둘 다 사용 가능한데 async await를 사용해야 코드가 더 깔끔해지는 경우가 있음.)

1. async

- promise 사용

```javascript
const exampleFunction = () => {
  return new Promise((resolve, reject) => {
    // 시간 오래 걸리는 작업 진행중...
    resolve("success");
  });
};

const promise = exampleFunction();
promise.then(console.log); // 'success' 두 번째로 출력
console.log(promise); // Promise {<fulfilled>: "success"} 첫 번째로 출력
```

- async 사용

```javascript
const exampleFunction = async () => {
    // 시간 오래 걸리는 작업 진행중...
    return 'success';
});
}
const promise = exampleFunction();
promise.then(console.log); // 'success' 두 번째로 출력
console.log(promise); // Promise {<fulfilled>: "success"} 첫 번째로 출력
```

다음과 같이 함수 앞에 async 키워드 붙여주면 된다.  
함수 안에 promise 사용하지 않아도 자동적으로 함수 안에 있는 코드 블록들이 promise로 변환이 된다. 즉, async 함수는 promise를 return한다.

2. await

async 붙은 함수 안에서만 쓸 수 있고, await을 쓰게 되면 딜레이가 끝날 때까지 기다려주게 된다.

**예시**

```javascript
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// await 사용 x
const newFunction = () => {
  return delay(3000).then(() => "done");
};

// await 사용
const newFunction1 = async () => {
  await delay(3000);
  return "done 1";
};

const newFunction2 = async () => {
  await delay(3000);
  return "done 2";
};
```

async await를 사용하면 동기적인 코드를 작성하듯이(자연스럽게) 구현하고 return값도 자연스럽게 설정할 수 있으므로 훨씬 간편하고 코드의 가독성이 증가한다.  
그리고 error처리는 try, catch 이용하면 된다.

### references

유튜브. (2020.06.25). 자바스크립트 13. 비동기의 꽃 JavaScript async 와 await 그리고 유용한 Promise APIs | 프론트엔드 개발자 입문편 (JavaScript ES6) [비디오파일]. 검색경로 https://www.youtube.com/watch?v=aoQSOZfz3vQ

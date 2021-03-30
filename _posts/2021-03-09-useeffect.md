---
layout: post
title: "useEffect in React"
featured-img: useEffect
categories: [React]
---

### 들어가며

useEffect 사용 예시들과 함께 useEffect 훅에 대해서 알아보자.

### useEffect Syntax

```javascript
// takes two arguments
useEffect(() => {
  // some code
  return () => ...; // optional
}, [someProp, someState]);
```

useEffect의 첫 번째 파라미터에는 callback 함수가, 두 번째 파라미터에는 deps 배열(의존값들이 들어감, optional)이 들어간다.  
callback 함수가 return 하는 함수는 cleanup 함수라고 부르는데 cleanup 함수는 useEffect의 뒷정리 역할을 한다.  
즉, 이펙트를 되돌린다.

### 사용 예시

1.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(count);
    }, 1000);
  });

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}
```

useEffect에서 deps parameter를 생략하는 경우에는 컴포넌트가 리렌더링 될 때마다 호출된다(화면에 그려진 후에 callback 함수 호출).  
위의 Counter 컴포넌트에서는 click 버튼을 클릭할 때마다 count state 값이 update 돼서 리렌더링이 되고 useEffect의 callback 함수가 실행된다.  
위의 예시에서 1초 이내에 click 버튼을 빠르게 연속으로 3번 클릭하는 경우를 생각해 보자.  
리 렌더링이 3번 일어나게 되고 각 렌더링마다 useEffect의 callback함수가 3번 실행되게 되는데 console에는 1초 후에 1, 2, 3이 순서대로 출력된다(3, 3, 3이 출력되지 않는 점에 유의).  
모든 렌더링은 고유의 prop, state, useEffect의 callback 함수, useEffect의 cleanup 함수를 가지고 있기 때문에 최신의 state 값을 가져오지 않고 렌더링이 된 시점에서 update 된 state 값을 읽는다.

첫 번째 렌더링의 경우에는(컴포넌트가 처음 화면에 그려질 때) 고유의 count 값은 0, useEffect의 callback 함수는 다음과 같다.

```javascript
() => {
  setTimeout(() => console.log(0), 1000);
};
```

따라서 처음 버튼을 클릭하기 전에는 컴포넌트가 화면에 그려진 후 console에 0이 출력되게 된다.  
두 번째 렌더링의 경우에는(처음 버튼을 클릭하는 경우) count 값이 1로 update 되므로 고유의 count 값은 1이 되고 useEffect의 callback 함수는
다음과 같다.

```javascript
() => {
  setTimeout(() => console.log(1), 1000);
};
```

따라서 1초 후에 console에 1이 출력되게 된다.  
이처럼 세 번째, 네 번째 렌더링의 경우마다 고유의 count, callback 함수가 존재하므로(결정되므로) 1초 후에 1, 2, 3이 순서대로 출력되게 된다.

2.

```javascript
function User({ prop_value }) {

  useEffect(() => {
    console.log('컴포넌트가 처음 화면에 그려진 뒤에만 실행됨');
    return console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);
```

useEffect에서 deps parameter를 빈 배열로 넣어주면 useEffect의 callback 함수는 컴포넌트가 처음 렌더링 될 때만(처음 화면에 그려질 때) 실행된다.  
따라서 callback 함수가 return 하는 함수는 컴포넌트가 화면에서 사라질 때에 호출이 된다.  
주로 외부 API(REST API 등)를 요청하거나 라이브러리(D3, Video.js 등)를 사용하거나 setInterval 을 통한 반복 작업 혹은 setTimeout 을 통한 작업 예약 해야 할 때 위처럼 사용된다.

3.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count]);

  return { count };
}
```

컴포넌트가 처음 화면에 그려질 때, 그리고 deps배열에 있는 변수(count)가 update 될 때마다 useEffect의 callback 함수가 실행된다.(렌더링이 된 후에 실행됨)  
cleanup 함수는 이펙트가 update 된 state와 함께 리렌더링이 된 후(화면에 그려진 후)에 실행된다.  
첫 번째 렌더링의 경우에는(컴포넌트가 처음 화면에 그려질 때) 고유의 count 값은 0 -> interval이 1초마다 setCount(0 + 1)이 실행되도록 설정된다.  
1초 후에 count가 1로 update 되고 난 후의 두 번째 렌더링을 통해 update 된 count 값(1)과 함께 화면에 그려진 후에 이전 이펙트의 클린업 함수가 실행되고(이전에 등록한 interval이 해제됨), 고유의 count 값(1)과 함께 현재 이펙트의 callback 함수가 실행된다(interval이 1초마다 setCount(1 + 1)이 실행되도록 설정됨).  
cleanup 함수는 최신의 state/prop 값을 읽지 않고, cleanup 함수가 정의된 시점의 렌더링에 있던 값을 읽는다.  
다시 정리하면 순서는 다음과 같다.

1. 리액트가 {count: 1}을 가지고 UI를 렌더링한다. 화면상에서 {count: 1}이 반영된 UI를 볼 수 있다.
2. 리액트는 {count: 0} 에 대한 이펙트를 클린업한다(setCount(0 + 1)에 해당하는 interval이 해제됨).
3. 리액트가 {count: 1}에 대한 이펙트를 실행한다(count가 1로 update 될 때의 렌더링에 해당하는 useEffect의 callback 함수가 실행됨)

### useEffect 함수 사용 시 주의할 점

- useEffect 에 첫 번째 파라미터 함수로 async 함수를 사용하면 다음과 같은 error가 뜬다.  
  _React Hook Warnings for async function in useEffect: useEffect function must return a cleanup function or nothing_
  async 함수는 promise를 반환하기 때문이다.  
  따라서 cleanup 함수를 return하는 경우에는 userEffect에서 async 함수를 첫 번째 인자로 사용하지 않도록 주의하자.
- useEffect의 callback함수 안에서 어떤 state나 props를 사용할 때 useEffect의 deps에 해당 state와 props를 반드시 넣어주어야 한다. 넣어주지 않는다면 useEffect 에 등록한 함수가 실행될 때 state나 props가 최근 업데이트된 값을 가리키지 않게 된다.
- cleanup 함수를 사용할 줄 알아야 한다.  
  단적인 예로, 컴포넌트를 DOM에서 제거할 때 컴포넌트를 처음에 렌더링 했을 때 등록한 timeout, interval, eventListener와 같은 것들이 컴포넌트가 제거된 후에도 남아있을 수 있기 때문에 컴포넌트가 사라지거나 리렌더링 되기 전에 remove를 해주는 것이다.  
  그런 게 남아있으면 앱 성능에 영향을 미칠 수 있다.  
  또한 메모리 누수를 방지할 수 있게 된다.

#### 참고 문헌

"벨로퍼트와 함께하는 모던 리액트", 2021년 03월 09일 접속, https://react.vlpt.us/basic/16-useEffect.html  
"rinae's devlog", 2021년 03월 17일 접속, rinae.dev/posts/a-complete-guide-to-useeffect-ko#%EA%B7%B8%EB%9F%AC%EB%A9%B4-%ED%81%B4%EB%A6%B0%EC%97%85cleanup%EC%9D%80-%EB%AD%90%EC%A7%80>

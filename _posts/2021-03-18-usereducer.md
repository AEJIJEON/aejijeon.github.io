---
layout: post
title: "[React] useReducer Hook"
featured-img: usereducer
categories: [studying]
---

### 들어가며

react hook 중에서 useState hook 말고도 useReducer hook을 사용해서 상태를 관리할 수 있다.  
useReducer를 사용하게 되면 컴포넌트의 상태 업데이트 로직을 컴포넌트에서 분리할 수 있게 된다.  
즉, 상태 업데이트 로직을 컴포넌트 바깥에 작성 할 수도 있고(reducer 함수), 심지어 다른 파일에 작성 후 불러와서 사용할 수 있게 된다.  
컴포넌트에서 일어나는 “액션”의 표현과 그 반응으로 상태가 어떻게 업데이트되어야 할지를 분리한다.(useState를 사용할 때는 컴포넌트에서 어떤 액션을 함과 동시에 그 자리에서 바로 state를 update시켜줄 값과 함께 update 함수를 호출시킨다.)  
useReducer 훅에 대해서 간단히 알아보자.

### 사용법

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- state: 컴포넌트에서 사용할 state를 가리킴. 보통 state는 객체로 표현되며 객체 안에 여러 state의 변수들이 담김
- dispatch: action을 발생시키는 함수  
  dispatch({ type: 'tick' })와 같이 발생시킬 action을 가진 object를 parameter로 넘겨주어 dispatch 함수를 호출시켜 액션을 발생시킨다.  
  action을 가지는 object의 형태는 자유이다.  
  다음 아래 코드와 같이 액션을 발생시킬 수 있다.

```javascript
{
type: 'CHANGE_EMAIL',
key: 'email',
value: 'jeonaeji@gist.ac.kr'
}
```

- reducer: 현재 상태(최신 상태)와 액션 객체를 가지고 새로운 상태를 return 해주는 함수이다.

```jsx
function reducer(state, action) {
  // 예시
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  // return nextState; 와 같이 새로운 state를 return 시켜줌
}
```

- initialState: 초기 state 값(initialization)

```jsx
const initialState = {
  count: 0,
  step: 1,
};
```

### 언제 사용하는지?

- 컴포넌트에서 관리하는 state 값이 여러 개일 때 useReducer 훅을 사용해서 state를 관리하면 편리하다.  
  또한 dispatch를 Context API를 사용해서 전역적으로 사용할 수 있게 해주면 컴포넌트에 함수(이벤트 핸들러와 같은)를 전달해줘야 하는 상황에서 코드의 구조가 훨씬 깔끔해질 수 있다.
- 이펙트의 불필요한 의존성을 제거하여 필요할 때보다 더 자주 실행되는 것을 피할 수 있도록 도와줍니다.  
  즉, useEffect의 callback 함수 안에서 어떤 상태 변수가 다른 상태 변수의 현재 값에 연관되도록 설정하려고 한다면
  두 상태 변수를 useReducer로 교체하여 이펙트의 의존성 배열에서 두 상태 변수를 제거할 수 있게 된다.  
  이펙트는 어떻게 상태를 업데이트할지 신경 쓰지 않고, 단지 무슨 일이 일어났는지 알려주게 된다.(이펙트 안에서 상태를 읽는 대신 dispatch 함수를 호출시켜 액션을 발생시킴으로써 무슨 일이 일어났는지 알려줌)  
  아래 예시들과 함께 보면 더 잘 이해할 수 있을 것이다.

  **code 1**

```jsx
// useReducer hook을 사용하지 않은 코드
function Counter() {
const [count, setCount] = useState(0);
const [step, setStep] = useState(1);
useEffect(() => {
const id = setInterval(() => {
setCount(c => c + step);
}, 1000);
return () => clearInterval(id);
}, [step]);  // step state가 반드시 의존성 배열에 포함되어야 한다.
             //그렇지 않으면 step 값이 바뀌어도 count 값의 증가량이 변하지 않는다.
// 하지만 step 값이 update 될 때마다 useEffect의 cleanup 함수가 실행되므로
// interval이 해제되고 실행되는 과정이 계속 반복됨
return (
<>
{count}
onChangeonChange={e => setStep(Number(e.target.value))} />
);
}
```

**code 2**

```jsx
// useReducer hook을 사용한 코드
// interval을 처음 설정한 후에 컴포넌트가 사라지기 전까지 interval이 해지되지 않게된다.
//컴포넌트 내부의 일부만 보여줌
[state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;
useEffect(() => {
const id = setInterval(() => {
// dispatch 함수를 호출시켜 액션을 발생시킴
dispatch({ type: 'tick' });
}, 1000);

// 의존성 배열에 dispatch 함수만 들어가있음(dispatch 함수는 항상 고정!)
// -> cleanup 함수는 해당 컴포넌트가 사라질 때만 호출됨.
// 즉, interval은 한 번 설정되고 컴포넌트가 사라지기 전까지 해지되지 않음.
return () => 들어가 있음(id);
// 의존성 배열을 빈 배열로 설정해도 상관 없음
// 상관없음 밖에서 선언된 함수이므로 의존성 배열에 넣어줌
}, [dispatch]);
const initialState = {
count: 0,
step: 1,
};
function reducer(state, action) {
const { count, step } = state;
if (action.type === 'tick') {
return { count: count + step, step };
} else if (action.type === 'step') {
return { count, step: action.step };
} else {
throw new Error();
}
}
```

#### references

"벨로퍼트와 함께하는 모던 리액트", 2021년 03월 09일 접속, https://react.vlpt.us/basic/20-useReducer.html  
"rinae's devlog", 2021년 03월 17일 접속, rinae.dev/posts/a-complete-guide-to-useeffect-ko#%EA%B7%B8%EB%9F%AC%EB%A9%B4-%ED%81%B4%EB%A6%B0%EC%97%85cleanup%EC%9D%80-%EB%AD%90%EC%A7%80>

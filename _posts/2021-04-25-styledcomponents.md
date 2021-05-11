---
layout: post
title: "styled-components 라이브러리"
featured-img: styledcomponent
categories: [studying]
---

## styled-components란?

CSS-in-JS styling을 위한 라이브러리로, 현존하는 CSS in JS 관련 리액트 라이브러리 중 가장 인기 있는 라이브러리이다.(emotion, styled-jsx...)  
css파일을 생성하지 않고 javascript 코드 내에서 일반 css로 컴포넌트의 스타일을 지정할 수 있다.

styled-components 라이브러리를 사용하기 위해서 먼저 **Tagged Template Literal**이라는 문법을 살펴보자.

Template Literal문법은 문자열 조합을 쉽게 할 수 있게 해주는 ES6 문법으로 자주 사용되는 문법이다.

```javascript
console.log(`hello ${user}`);
```

위와 같이 백틱(``)을 사용해서 문자열 안에 javascript values(variable, object, function, etc.)를 포함시킬 수 있다.
그렇다면 Tagged Template Literal 문법은 무엇일까?  
Tagged Template Literal은 Template Literal을 이용하여 함수의 인자를 parsing 하여 넘겨주는 것이다. Template Literal을 사용하면서 백틱 안에 넣어준 javascript values를 조회하고 싶을 때 Tagged Template Literal 문법을 사용할 수 있다.

예시를 살펴보자.

```javascript
const var1 = "first";
const var2 = "second";
function approachToVars(texts, ...values) {
  //파라미터의 rest 문법 사용
  console.log(texts, values); // [ 'blabla ', ' and ', ' blabla' ] [ 'first', 'second' ]
}
approachToVars`blabla ${var1} and ${var2} blabla`; // Template Literal를 이용하여
// 함수의 인자를 parsing(${} 부분 분리)하여 넘겨줌
```

```javascript
function sample(texts, ...ftns) {
  console.log(texts);
  console.log(ftns);
  ftns.forEach((ftn) => ftn());
}
//${}을 통하여 함수를 넘겨주면 해당 함수를 sample함수에서 호출시킬 수 있음
sample`
  제목: ${() => console.log("제목
  내용" >")}
  내용: ${() => console.log("내용")}
`;
// 출력:
// ["\n  제목: ", "\n  내용: ", "\n"]
// [ [Function (anonymous)], [Function (anonymous)] ]
// 제목
// 내용
```

styled-components에서는 이러한 Tagged Template Literal 문법을 사용해서 javascript values와 함께 styling할 수 있고, 다음 아래 예시 코드와 같이 컴포넌트의 props를 읽어와서 styling 가능하다.

```javascript
//component의 props를 읽어옴
const styledDev = styled`
    background: ${(props) => props.color}; 
`;
```

## styled-components 라이브러리 설치

    npm install –save styled-components

## styled-components 사용 예시

- 코드

```jsx
import React from "react";
import styled from "styled-components";

const Circle = styled.div`
  width: 10rem;
  height: 10rem;
  background: blue;
  border-radius: 50%;
`;

function App() {
  return <Circle />;
}

export default App;
```

위 코드에서처럼 javascript 파일에서 스타일을 입력함과 동시에 해당 스타일을 가진 컴포넌트를 만들 수 있고,
styled.input, styled.button과 같이 html tag들을 가지고 스타일링할 수 있다.

##### - 화면

![원](https://user-images.githubusercontent.com/59640337/115990955-042a6f00-a601-11eb-8dc7-be81b485686d.png)

## API Reference

styled-components 라이브러리에서 제공하는 여러 api들을 살펴보자.

#### 1. styled

스타일을 입힐 tagname나 component를 인자로 전달(optional)하면 일반 css코드를 포함하는 Tagged Template literal을
받아서 StyledComponent를 만들어주는 함수를 return 해 줌

- 코드

```jsx
import React from "react";
import styled from "styled-components";

// styled.button은 styled(button)의 약어
// button tag를 가지고 스타일링한 StyleComponent를 만듦
const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`;
// 위에서 만든 Button 컴포넌트를 가지고 스타일링
// 기존 Button 컴포넌트의 스타일을 새로운 스타일로 덮음
const RedButton = styled(Button)`
  background: red;
`;

function App() {
  return (
    <>
      <Button>Default Button</Button>

      <RedButton>Red Button</RedButton>
    </>
  );
}

export default App;
```

##### - 화면

![버튼](https://user-images.githubusercontent.com/59640337/115990956-055b9c00-a601-11eb-8b6c-2f7007ec1490.png)

#### 2. css

(case 1)styled 함수에서 구현한 css코드에서 ${}을 사용해서 props를 넘겨받아 스타일링하거나
(case 2)css코드를 분리하여 분리한 코드를 styled함수 내부에 ${}을 사용해서 다시 포함시킬 경우에 css function를 불러와서 사용

- example of case 1

```jsx
import styled, { css } from "styled-components";

const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  background: red;
  border-radius: 50%;
  ${(props) =>
    props.huge &&
    css`
      width: 10rem;
      height: 10rem;
    `}
`;

function App() {
  return <Circle />;
}
export default App;
```

Circle component에 props를 넘겨주어 props를 가지고 스타일링해주었다.
위와 같이 css 함수를 사용해야 그 스타일 내부에서도 다른 props를 조회할 수 있게 된다.

- example of case 2

```jsx
import styled, { css } from "styled-components";

const colorStyles = css`
  ${({ color }) => {
    return css`
      background: ${color};
    `;
  }}
`;
const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  ${colorStyles};
  border-radius: 50%;
  ${(props) =>
    props.huge &&
    css`
      width: 10rem;
      height: 10rem;
    `}
`;

function App() {
  return <Circle />;
}
export default App;
```

#### 3. ThemeProvider

styled-components에서 제공하는 테마를 위한 (helper) 컴포넌트이다. styled-components로 만드는 모든 컴포넌트에서 조회하여 사용할 수 있는 전역적인 값(theme)을 설정할 수 있다.

- 예시  
  ![1212](https://user-images.githubusercontent.com/59640337/115991297-bc0c4c00-a602-11eb-99a8-d0733a8087aa.png)

ThemeProvider 컴포넌트의 theme props로 object를 전달하면 ThemeProvider 내부에 렌더링된 styled components에서 렌더링 된 조회하여 사용할 수 theme을theme prop가 내부에 prop이 렌더링 된 컴포넌트들에게 자동으로 전달됨) \*주의
ThemeProvider 내부는 하나의 리액트 엘리먼트로 감싸져 있어야 하기 때문에 내부에 여러 components를 렌더링 시 <></> 으로 감싸주어야 한다.

- theme 조회 예시

```jsx
const StyledButton = styled.button`
/_ 크기 _/
/_ 색상 _/
${(props) => {
  const selected = props.theme.palette.blue;
  return css`
    background: ${selected};
    &:hover {
      background: ${lighten(0.1, selected)};
    }
    &:active {
      background: ${darken(0.1, selected)};
    }
  `;
}}
/_ 기타 _/
`;
```

ThemeProvider 내부는 하나의 리액트 엘리먼트로 감싸져 있어야 하기 때문에 내부에 AppBlock 과 Dialog components를 렌더링 시 <> 으로 감싸주어야 함

#### 4. keyframes

애니메이션에 대한 keyframes를 만들기 위해 사용되는 method이다.  
 keyframes를 포함하고 있는 TaggedTemplateLiteral을 인자로 받아서 Keyframes model을 return해준다.

다음 예시를 살펴보자.

```jsx
import styled from "styled-components";

const FadeInButton = styled.button`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: 5s fadeIn ease-out;
  width: 100px;
  height: 20px;
`;

function App() {
  return <FadeInButton />;
}
export default App;
```

이처럼 keyframes method를 사용하지 않고 애니메이션을 추가할 컴포넌트의 TaggedTemplateLiteral에 일반 css 코드로 keyframes를 정의해서 사용할 수 있다.  
하지만 동일한 keyframes를 다른 컴포넌트에서도 사용할 경우 중복된 코드를 작성해야 한다.

```jsx
const fadeIn = css`
  @keyframes identifier {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
const FadeInButton = styled.button`
  ${fadeIn}
  animation: 5s identifier ease-out;
  width: 100px;
  height: 20px;
`;
```

이 코드에서는 fadeIn이라는 css 코드를 만들어서 여러 컴포넌트에 포함시켜서 사용할 수 있지만 animation property에 해당 keyfremes의 identifier을 따로 명시해줘야 한다.

```jsx
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FadeInButton = styled.button`
  animation: 1s ${fadeIn} ease-out;
`;

function App() {
  return <FadeInButton />;
}
export default App;
```

이와 같이 keyframes method를 사용하게 되면 keyframes model을 여러 styled components에서 사용할 수 있고 이전 예시와 같이 keyframes의 identifier을 따로 명시해줄 필요가 없게 된다.

## 기타

styled components 안에 있는 h3, p와 같은 태그들을 스타일링할 때 따로 따로 컴포넌트를 만들어서 스타일링 하지 않고 styled-components에서 Nested CSS 문법을 사용할 수 있다.

```jsx
const Block = styled.div`
  width: 100rem;
  height: 100rem;
  //    {} 안에 styling 추가...
  h3 {
  }
  p {
  }
`;
```

## 마무리

[styled-components 사용 예제 보러가기(codesandbox)](https://codesandbox.io/s/styled-components-practice-c6x4g?file=/src){:target="\_blank"}  
(코드에 주석 달아놨습니다. 천천히 읽어보면 styled-components에 대해 잘 이해할 수 있을 겁니다.)

# references

"벨로퍼트와 함께하는 모던 리액트", 2021년 04월 25일 접속, https://react.vlpt.us/styling/03-styled-components.html  
https://styled-components.com/docs/api#primary

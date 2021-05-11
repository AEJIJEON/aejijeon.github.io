---
layout: post
title: "DFS/BFS를 이용한 완전 탐색 with 청소년 상어 문제"
featured-img: shark-3068590_1280

categories: [algorithm]
---

#### 들어가며

알고리즘 문제들을 풀다 보면 모든 경우의 수를 계산하여 완전 탐색을 수행해야 할 때가 종종 있다. 모든 조합을 구하기 위해서 주로 python의 **itertools** 라이브러리를 이용하여 **combinations** 함수를 호출하거나 **DFS/BFS**를 이용해 모든 조합을 반환하는 함수를 작성하여 문제를 해결한다. 하지만 실제로 문제를 푸는 동안에 DFS/BFS를 사용하여 완전 탐색을 수행하기가 어렵다. DFS/BFS 함수를 재귀적으로 호출할 때 parameter로 전달할 변수를 새로 정의해야 하는지, 함수를 호출할 때마다 결괏값이 어떤 방식으로 업데이트되어야 하는지, 변수를 global로 정의해야 할지 local로 정의해야 할지, deepcopy를 사용할지 등 이것저것 고려해야 할 것이 많고 실수하기가 쉽다.
하지만 combinations 함수를 사용하여 완전 탐색을 하기가 너무 복잡해서 DFS/BFS를 이용하여 완전 탐색을 해야 하는 몇몇 문제들을 접한 경험이 있고, DFS/BFS를 이용하는 경우 모든 조합을 찾는 동시에 시뮬레이션을 단계적으로 진행할 수 있다는 장점이 있기에 이 유형을 한 번 짚고 넘어가야겠다는 생각이 들었다. 간단한 시뮬레이션의 경우에는 combinations 함수를 사용해서 모든 조합을 따로 구해준 다음 각각의 경우에 대해 재귀 함수나 반복문을 통해 완전 탐색을 진행할 수 있다. 하지만 매우 복잡한 시뮬레이션의 경우 DFS/BFS를 이용하여 단계적으로 완전 탐색을 진행한다면 코드를 더 간결하게 짤 수 있게 된다.<br/>

2020년 상반기 삼성전자 기출문제인 **청소년 상어** 문제를 살펴보자.

[문제 보러 가기(Baekjoon Online Judge)](https://www.acmicpc.net/problem/19236){:target="\_blank"}

#### 문제 요약

시뮬레이션과 완전 탐색을 함께 수행해야 하는 문제이다. 1번부터 16번까지의 물고기들이 4x4 공간에 한 칸씩 차지하고 있고 청소년 상어가 이 공간에 들어가 물고기를 잡아먹는다. 처음에 청소년 상어는 (0,0) 위치에 들어가서 처음 위치에 있는 물고기를 먹고 난 다음부터 1번부터 16번의 물고기들이 차례대로 이동한다. 이동한 후에 상어는 자신이 가리키고 있는 방향으로 이동하여 여러 물고기 중에서 하나를 먹을 수 있는데 한 번에 여러 개의 칸을 이동할 수 있다. 하나를 먹고 나면 또 물고기들이 이동하고 이동이 끝난 다음에 상어는 위와 같은 방법으로 물고기를 먹을 수 있는데 상어가 이동할 수 있는 칸이 없을 때까지 이 과정이 계속 반복이 된다. 최종적으로 상어가 먹을 수 있는 물고기 번호의 합의 최댓값을 구해야 한다.<br/>

#### 문제 풀이

물고기들이 이동한 후에 상어가 이동할 수 있는 모든 위치를 찾아 각각의 경우에 대해서 시뮬레이션을 반복해서 상어가 먹는 모든 물고기 번호의 합의 최댓값을 찾아야 한다. 단계마다 상어가 이동할 수 있는 모든 칸을 직접 찾아서(4x4 공간에서는 상어의 현재 위치를 제외하면 최대 3칸이 존재) DFS를 이용하여 완전 탐색을 진행한다.<br/>

내가 짠 코드에서 완전 탐색을 위해 DFS를 사용한 부분만 가져와 보았다.  
아래 source code를 살펴보자.

[전체 source code 보러 가기](https://github.com/AEJIJEON/programming/blob/main/algorithm/%EC%B2%AD%EC%86%8C%EB%85%84%EC%83%81%EC%96%B4_1.py){:target="\_blank"}

```python
# 완전 탐색을 수행하기 위한 함수
def dfs(arr, now_x, now_y, total):
    # 결과값 global로 정의
    # 모든 단계에서 같은 변수에 대해 update가 가능
    global result
    # 각 단계에서 사용되는 arr 값 새로 정의
    # 다음 단계를 위해 dfs 함수를 호출하는 데 사용
    arr = copy.deepcopy(arr)

    # 다음 단계에서 저장해야 하는 total값 계산 후
    # local variable에 새로 정의
    total += arr[now_x][now_y][0]
    arr[now_x][now_y][0] = -1

    moveFishes(arr, now_x, now_y)

    poss = getPossOfShark(arr, now_x, now_y)

    # 상어가 이동할 곳이 없는 경우
    if len(poss) == 0:
        # 결과값 udate 후 return
        result = max(result, total)
        return
    # 상어가 이동할 수 있는 모든 경우에 대해
    # dfs 함수 호출
    for next_x, next_y in poss:
        # 각 단계에서 저장해야 하는 total값
        # parameter로 전달
        dfs(arr, next_x, next_y, total)


result = 0
dfs(arr, 0, 0, 0)
print(result)
```

각 단계에서는 다음 단계에서 사용할 array와 total 값을 계산해 주어 DFS 함수의 parameter로 전달해주었다. 그리고 결괏값을 찾기 위해서 모든 단계에서 같은 변수에 대해 갱신을 해주어야 하므로 결괏값을 담기 위한 변수를 global로 선언해주었다.

아래 두 번째 source code를 살펴보자.

[전체 source code 보러 가기](https://github.com/AEJIJEON/programming/blob/main/algorithm/%EC%B2%AD%EC%86%8C%EB%85%84%EC%83%81%EC%96%B4_1.py){:target="\_blank"}

```python
# 완전 탐색을 수행하기 위한 함수
def dfs(arr, now_x, now_y):
    # 결과값 global로 정의
    # 모든 단계에서 같은 변수에 대해 update가 가능
    global result
    global total
    # 각 단계에서 사용되는 arr 값 새로 정의
    # 다음 단계를 위해 dfs 함수를 호출하는 데 사용
    arr = copy.deepcopy(arr)


    # 상어가 먹는 물고기 번호
    num = arr[now_x][now_y][0]

    arr[now_x][now_y][0] = -1

    moveFishes(arr, now_x, now_y)

    poss = getPossOfShark(arr, now_x, now_y)

    # 상어가 이동할 곳이 없는 경우
    if len(poss) == 0:

        # 마지막으로 먹은 물고기 번호 추가
        result = max(result, total + num)
        return
    # 상어가 이동할 수 있는 모든 경우에 대해
    # dfs 함수 호출
    for next_x, next_y in poss:
        # 원래 위치에 있는 물고기 먹고
        # 다른 위치로 이동
        total += num
        dfs(arr, next_x, next_y)
        # 호출 끝나고 값 되돌려 놓기
        total -= num

# global 변수로 설정
total = 0
result = 0
dfs(arr, 0, 0)
print(result)
```

이 code에서는 total 변수와 result 변수를 global로 설정해 주었다. total 변수의 경우에는 DFS 함수 안에서 재귀적으로 호출하기 전에 total 값을 계산해 준 다음 호출이 종료된 후에 다시 원래 값으로 되돌려 놓았다. 이 경우에는 total 값을 DFS 함수의 parameter로 전달할 필요가 없게 된다.<br/>

#### 정리

DFS/BFS를 이용하여 단계적으로 시뮬레이션을 진행하며 완전 탐색을 하게 되면 훨씬 코드가 간결해진다. 하지만 아주 간단한 문제라면 실수를 줄이기 위해서 combinations 함수를 이용하여 완전 탐색을 하는 것도 괜찮겠다.

DFS/BFS를 이용하여 완전 탐색을 할 경우,

1. 마지막 단계에서 갱신해야 하는 값(예를 들면 maximum, minimum 값)을 담아야 하는 변수는 **global variable**로 선언 후 DFS를 구현하는 함수에 global로 정의해주기

2. 단계마다 다음 단계로 전달해야 하는 값을 담은 변수들은 DFS/BFS 함수 안에서 **local variable**로 새로 선언해 주고 계산 후에 함수 parameter로 전달해주기, 혹은 global variable로 선언하여 DFS/BFS 함수 안에서 재귀적으로 호출하기 전에 변수의 값 변경한 후 호출이 끝나고 다시 값을 되돌려 놓기(함수 parameter로 전달하지 않기)

단, 단계마다 **array**나 **list**의 값이 전체적으로 변경되는 경우에는 값을 다시 되돌려 놓기가 힘들기 때문에 global로 정의하지 않고 함수 안에서 **deepcopy**를 한 후에 값을 변경하여 다음 단계를 위해 DFS/BFS 함수로 전달(위의 청소년 상어 문제처럼)

이 두 가지만 주의한다면 DFS/BFS를 구현하여 **완전 탐색**을 해야 하는 문제들에 쉽게 접근할 수 있을 거란 생각이 든다.

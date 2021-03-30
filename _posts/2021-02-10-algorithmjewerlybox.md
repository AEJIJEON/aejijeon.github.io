---
layout: post
title: "Parametric Search applied to Binary Search"
featured-img: search-1013911_1920
categories: [Programming]
---

알고리즘의 이진 탐색(binary search) 유형에서 파라메트릭 서치(parametric search)를 사용하여 풀 수 있는 문제들이 자주 등장한다. 파라메트릭 서치는 최적화 문제를 결정 문제로 바꾸어 해결하는 기법으로, 주로 이진 탐색으로 결정 문제를 해결하면서 범위를 좁혀 나가는 방식을 통해 문제를 해결한다.  
이 유형의 기본 예제를 같이 살펴보자.  
오름차순으로 정렬된 리스트 list = [1, 2, 4, 6, 9, 10]에서 7보다 큰 값 중 가장 작은 값을 찾아야 한다.
7을 target으로 하고 이진 탐색을 진행하면서 중간에 있는 값이 target 값보다 큰 경우에 result 값을 갱신해주게 되면 최종적으로 7보다 큰 값 중 가장 작은 값을 찾을 수 있게 된다.



코드는 다음과 같이 작성하였다.

```python

def binary_search_opt(lst, target, start, end):
    global result

    while True:
        if start > end:
            return
    
    mid = (start + end) // 2

    # result값 update
    if target < lst[mid]:
        result = lst[mid]
        end = mid - 1
    
    else:
        start = mid + 1


result = -1
lst = [1, 2, 4, 6, 9, 10]
binary_search_opt(lst, 7, 0, 5)

# 7보다 큰 값이 없다면 result값이 update되지 않음
if result == -1:
    print("not exist")
else:
    print(result)

```
코드를 실행시킨 결과는 9가 출력된다. lst length가 n일 경우에는 O(nlogn) 시간 복잡도를 가지게 된다.

난이도가 있는 문제에서는 위의 예제와 다르게 이진 탐색과 파라메트릭 서치를 사용해서 문제를 풀어야 한다는  것을 알아채기가 힘들다. 하지만 이런 경우에는 문제를 읽고 나서 여러 예시를 적용하다 보면 이 유형을 알아챌 수 있을 것이다.   

파라메트릭 서치를 이용한 이진 탐색 유형의 보석 상자 문제를 가져와 보았다.

[보석상자 문제 보러 가기(Backjoon 2792)](https://www.acmicpc.net/problem/2792){:target="_blank"}

#### 문제 요약
학생 수(N), 보석 색상의 수(M), 그리고 1번부터 M 번 색상의 보석이 각 몇 개씩 존재하는지가 주어진다.
모든 보석을 학생들에게 나누어 주는데 보석을 받지 못하는 학생이 존재해도 된다. 단, 학생은 항상 같은 색상의 보석만 가져간다. 모든 보석을 학생들에게 나누어 주었을 때 보석을 가장 많이 받은 학생이 가지게 되는 보석 개수가 최소가 되도록 해야 한다.  
  
#### 풀이
예를 들어 학생 5명에게 2개의 색상(각 7개, 4개씩 존재)의 보석을(총 11개) 나누어 준다고 하자. 한 사람이 보석을 최대 4개를 가지게 되는 경우를 생각해보면 1번 색상의 보석은 2명에게 4개, 3개씩 각각 나누어 주고, 2번 색상의 보석은 1명에게 4개를 주게 되면 모든 보석을 나눠줄 수 있게 된다. 다음 예시로 한 사람이 보석을 최대 3개를 가지게 되는 경우를 생각해 보자. 1번 색상의 보석은 3명에게 각각 3개, 3개, 1개씩 나누어 주고, 2번 색상의 보석은 2명에게 3개, 1개를 나누어 줄 수 있게 된다. 그렇다면 한 학생에게 최대 2개씩 주는 경우도 가능할까?  1번 색상의 보석을 나누어 주는 경우에서 5명 모두가 받게 되어(각각 2개, 2개, 2개, 2개, 1개) 2번 색상의 보석이 남게 된다. 이 경우는 답이 될 수 없다. 따라서 답은 3이 된다.  
최대 1개를 가지는 경우부터 최대 7개를 가지는 경우(1번 색상을 가진 보석의 개수)까지 이진 탐색을 진행하면서 값을 바꿔주며 보석이 남지 않게끔 5명에게 나누어 줄 수 있는 경우에만 result 값을 갱신해주고, end 값을 mid 값보다 1만큼 작은 값으로 설정하여 다시 이진 탐색을 진행한다(여기서 파라미터 서치가 이용). 만약 보석이 남게 될 때는 result 값을 갱신하지 않고 start 값을 mid 값보다 1만큼 큰 값으로 설정하여 다시 이진 탐색을 진행하게 되면 최적화된 최종 결괏값을 구할 수 있게 된다.  
  
이 과정을 다음과 같이 코딩해 보았다.

```python
import sys
import math
input = sys.stdin.readline


n, m = map(int, input().split())

# 여러 보석 중에서 색이 같은 보석 개수의 쵀댓값
max_value = 0

numberOfJewerlies = []
for _ in range(m):
    num = int(input())
    numberOfJewerlies.append(num)
    max_value = max(max_value, num)

def binary_search_opt(array, start, end):
    
    
    while True:
        if start > end:
            return 
        # start, start + 1, ..., end 중 중앙값
        mid = start + (end - start) // 2
        # 보석을 각 학생에게 mid개 씩 나눠줄 때(남은 보석은 한 사람에게 다 줌)
        # 보석을 받은 학생 수 계산
        target = 0
        for num in array:
            # 한 종류의 보석에 대해 mid 개씩 나눠줄 수 있는 학생 수
            target += math.ceil(num / mid)
        
        # 보석을 다 나눠주었을 때 
        # 보석을 안 받은 학생이 존재하거나 모든 학생이 보석을 받은 경우
        if target <= n:
            # 최적화 된 값을 찾기 위해 
            # result값에 mid값 할당
            result = mid
            
            end = mid - 1
        # mid개씩 나눠줄 때 보석이 남는 경우 
        else:
            start = mid + 1

result = 0
# 1부터 max_value까지 이진 탐색을 이용하여 최적화된 값 찾기
binary_search_opt(numberOfJewerlies, 1, max_value)

print(result)
```

주어진 문제를 읽고 알고리즘의 어떤 유형의 문제인지를 바로 파악하기가 어렵다면 위의 보석상자 문제를 푼 것처럼 여러 경우를 직접 확인해 보며 답이 될 수 있는 경우들을 살펴보면 어떻게 접근해야 할지 금방 알아차릴 수 있을 것이다. 문제에서 파라미터 서치를 이용한 이진 탐색 유형을 바로 알아차리기는 어렵지만 알아차린 다음부터는 금방 코드를 짤 수 있게 된다. 이진 탐색을 구현한 부분에서 몇 가지만(결괏값을 갱신하는 등) 추가해서 문제를 해결할 수 있을 것이다. 


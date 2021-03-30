---
layout: post
title: "[백준 2457]Greedy Algorithm을 이용한 공주님의 정원 문제"
featured-img: garden
categories: [Programming]
---
백준 2457번 **공주님의 정원** 문제 입니다.  
  
[문제 보러 가기(Baekjoon Online Judge)](https://www.acmicpc.net/problem/2457){:target="_blank"}  

#### 문제 요약
input으로 n개의 꽃에 대한 정보가 들어오고, 각 꽃은 꽃이 피는 날과 지는 날 정해져 있다. 꽃이 지는 날 당일은 꽃이 피어있지 않는다. 
공주가 가장 좋아하는 계절인 3/1 ~ 11/30까지 매일 꽃이 한 가지 이상 피어 있도록 꽃들을 최소한으로 선택해야 한다.  
  
#### 접근
처음에 3/1을 포함하는 것부터 시작하게 되면 3/1에 펴있는 꽃들 중에서 선택하면 되는데 꽃이 지는 날짜가 제일 뒤에 있는 꽃을 선택해야 
최소한으로 꽃을 선택할 수 있게 된다. 따라서 이 문제는 greedy 알고리즘을 사용하여 문제를 해결하면 된다.
  
#### 풀이
현재 포함하려는 날짜(처음에 3/1부터 포함함)가 11/30을 넘어갈 때까지 꽃을 선택한다. 
그리디 알고리즘을 적용해서 현재 포함하려는 날짜에 피어있는 꽃 중에서 꽃이 지는 날짜가 가장 뒤에 있는 꽃을 선택한다. 
이 과정에서는 현재 체크하고 있는 꽃이 현재 포함할 날짜 이전에 꽃이 피고 그 이후에 꽃이 지는 경우들만 가지고 꽃이 지는 날짜의 최댓값을 찾아주면 된다. 
최댓값을 찾았으면 선택한 꽃으로 카운트를 해주고, 방금 찾은 꽃이 지는 날짜를 다음 단계에서 포함하려는 날짜로 선택한다.

코드는 다음과 같다.  
  
```python
import sys
input = sys.stdin.readline

n = int(input())

flowers = [0]*n

result = 0

# 현재 포함시키려는 날짜를 담는 변수 
# 3/1을 포함시키는 것부터 시작할것이므로 3,1로 초기화
now_month, now_day = 3, 1

# input으로 주어지는 꽃들의 정보를 tuple로 담아줌
for i in range(n):
    flowers[i] = tuple(map(int, input().split()))
    
# 꽃이 피는 날짜에 대해 오름차순으로 정렬
flowers.sort()

# 현재 체크할 꽃의 index
i = 0

# 3/1~11/30까지 매일 최소한 하나의 꽃이 필 수 있는지를 나타냄
flag = True

# 현재 포함하려는 날짜가 11/30을 넘어설 때까지 반복문을 돌려줌
while (now_month, now_day) <= (11, 30):

    # 모든 꽃들을 가지고도 매일 최소한 
    # 하나의 꽃을 피울 수 없는 경우
    if i >= n:
        flag = False
        break
    
    # 찾고자하는 꽃이 지는 날짜를 담는 변수
    next_month, next_day = now_month, now_day

    # 현재 체크하고 있는 꽃이 피기 시작하는 날이 우리가 포함하고자 하는 날짜 이전인 경우
    # 꽃이 지는 날이 우리가 포함하고자 하는 날짜 후인 경우
    # 위의 두 가지를 다 만족하는 꽃들 중에서 꽃이 지는 날의 최댓값을 찾아줌
    while i < n and (flowers[i][0], flowers[i][1]) <= (now_month, now_day):
        if (next_month, next_day) < (flowers[i][2], flowers[i][3]):
            next_month, next_day = flowers[i][2], flowers[i][3]
           
        i += 1
        
    # 해당 날짜를 포함시키지 못함 -> 불가능
    if (next_month, next_day) == (now_month, now_day):
        flag = False
        break

    # 다음으로 포함하려는 날짜 update
    now_month, now_day = next_month, next_day
    # 결과값 카운트
    result += 1

# flag변수를 이용해서 반복문이 중간에 
# break가 되지 않은 경우에만 result를 출력
print(result if flag else 0)
```

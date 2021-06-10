---
layout: post
title: "[프로그래머스 17678] [1차]셔틀버스"
categories: [ps]
---

## 이해

- 무료 셔틀버스는 다음과 같은 규칙으로 운행

  - 09:00부터 총 n회 t분 간격으로 도착하며, 하나의 셔틀에는 최대 m명의 승객이 탈 수 있다.
  - 셔틀은 도착했을 때 도착한 순간에 대기열에 선 크루까지 포함해서 대기 순서대로 태우고 바로 출발한다.

- 콘이 셔틀을 타고 사무실로 갈 수 있는 도착 시각 중 제일 늦은 시각을 구해야 한다. 단, 콘은 게으르기 때문에 같은 시각에 도착한 크루 중 대기열에서 제일 뒤에 선다. 또한, 모든 크루는 잠을 자야 하므로 23:59에 집에 돌아간다. 따라서 어떤 크루도 다음날 셔틀을 타는 일은 없다.

## 계획

- queue 자료구조를 사용하여 크루가 대기열에 도착하는 시각을 빠른 순서대로 전부 queue에 넣는다.
- 1회차 셔틀버스부터 시작해서 차례대로 크루들을 태운다.
- 모든 크루들을 셔틀버스에 태운 후 맨 마지막에 도착하는 버스가 빈 경우에는 해당 버스가 출발하는 시각을 return한다.
- 맨 마지막에 도착하는 버스가 꽉 찬 경우에는 해당 버스에 제일 마지막으로 탑승한 크루가 도착한 시각에서 1분을 뺀 시각을 return한다.

## 실행

```python
from collections import deque

# 0 <= minute
def add_minutes(time, minute):
    # "09:00" + 59분

    h, m = time.split(":")
    h = int(h)
    m = int(m)

    m = m + minute

    h = (h + m // 60) % 24
    m = m % 60

    return "{0:02d}:{1:02d}".format(h, m)


# 0 <= minute < 60
def sub_minutes(time, minute):

    h, m = time.split(":")
    h = int(h)
    m = int(m)

    m = m - minute
    if m < 0:
        h -= 1
        m += 60

    if h == -1:
        h = 23

    return "{0:02d}:{1:02d}".format(h, m)


# return true if time1 <= time2 else false
def time_comparator(time1, time2):
    h1, m1 = time1.split(":")
    h2, m2 = time2.split(":")

    h1 = int(h1)
    m1 = int(m1)
    h2 = int(h2)
    m2 = int(m2)

    return True if h1 < h2 or (h1 == h2 and m1 <= m2) else False


def solution(n, t, m, timetable):
    # sorting
    timetable.sort(key=lambda x: (int(x.split(":")[0]), int(x.split(":")[1])))
    timetable = deque(timetable)

    bus_times = [add_minutes("09:00", t * i) for i in range(n)]
    people_in_bus = [[] for _ in range(n)]

    for i, time in enumerate(bus_times):
        if not timetable:
            break
        # time_comparator 사용
        while (
            timetable
            and time_comparator(timetable[0], time)
            and len(people_in_bus[i]) < m
        ):
            people_in_bus[i].append(timetable.popleft())

    # 맨 마지막에 도착하는 버스에 크루들이 탑승한 후에도 버스가 빈 경우
    if len(people_in_bus[n - 1]) < m:
        return bus_times[n - 1]
    # 맨 마지막에 도착하는 버스에 크루들이 탑승한 후에 버스가 꽉 찬 경우
    else:
        return sub_minutes(people_in_bus[n - 1][-1], 1)
```

## 개선

- 'hh:mm' 포맷의 string을 처리하기가 굉장히 어려웠는데 다른 사람의 풀이를 보니 시간을 분으로 통일시켜서 풀었다.
- 분단위로 통일해서 풀면 시간을 더하고 빼기 위한 추가 함수를 정의할 필요 없이 간단하게 구현이 가능하다.

```python
from collections import deque

def solution(n, t, m, timetable):
    # sorting
    timetable = [int(time[:2])*60 + int(time[3:5]) for time in timetable]
    timetable.sort()
    timetable = deque(timetable)

    bus_times = [(60*9+ t * i) for i in range(n)]
    people_in_bus = [[] for _ in range(n)]

    for i, time in enumerate(bus_times):
        if not timetable:
            break
        # time_comparator 사용
        while (
            timetable
            and timetable[0] <= time
            and len(people_in_bus[i]) < m
        ):
            people_in_bus[i].append(timetable.popleft())

    # 맨 마지막에 도착하는 버스에 크루들이 탑승한 후에도 버스가 빈 경우
    if len(people_in_bus[n - 1]) < m:
        answer = bus_times[n - 1]
    # 맨 마지막에 도착하는 버스에 크루들이 탑승한 후에 버스가 꽉 찬 경우
    else:
        answer = people_in_bus[n - 1][-1] - 1
    return '%02d:%02d'%(answer//60,answer%60)
```

## 회고

- 쉬웠는데 코드가 너무 길어져서 풀고 나서 찝찝했다.
- 다른 문제에서도 시간을 분단위로 통일해서 접근하는 풀이를 접한 적이 있었는데 너무 오래돼서 이 문제를 풀면서 분단위로 계산하는 방법이 떠오르지 않았다. 다음에는 놓치지 않아야 겠다.
- 조사해보니 % 연산자를 통한 포맷팅과 내장함수 format을 통한 포맷팅을 비교했을 때 % 연산자를 통한 포맷팅이 가독성이 더 낮지만 속도가 더 빠르다고 한다. 그리고 파이썬 3.6 이상부터 지원되는 f-string이 포맷팅 방법 중 제일 빠르고 가독성도 제일 좋다. 나중에 f-string 포맷팅도 사용해봐야겠다.

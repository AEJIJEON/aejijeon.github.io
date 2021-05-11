---
layout: post
title: "binary search와 dijkstra algorithm의 만남 with 인터넷 설치 문제"
featured-img: webdesign-3411373_1920
categories: [algorithm]
---

이번에 가져온 인터넷 설치 문제는 다익스트라 알고리즘과 이진 탐색 유형이 동시에 사용되는 문제이다. 이러한 두 유형이 동시 적용이 됐을 거라고는 상상도 못 했다.  
바로 문제를 살펴보자.  
[문제 보러 가기(Backjoon 1800)](https://www.acmicpc.net/problem/1800){:target="\_blank"}

#### 문제 요약

1번 컴퓨터부터 N번 컴퓨터 사이에 P개의 쌍만이 인터넷 선으로 연결될 수 있고 서로 선을 연결하는데 가격이 다르다.
1번 컴퓨터는 인터넷 서버와 바로 연결되어 있어 인터넷이 가능하고, 우리의 목표는 1번과 N번 컴퓨터를 연결하는 것이다.
코레스코에서는 K개의 인터넷 선에 대해서는 공짜로 연결해주고 나머지 인터넷 선에 대해서는 제일 가격이 비싼 선만 내면 된다고 했다. 1번과 N번 컴퓨터를 연결하는 데에 드는 비용의 최솟값을 구해야 한다.

#### 접근

처음에는 DFS를 사용하여 1번 node부터 n번 node까지 가능한 모든 경로를 찾아 내야 하는 비용을 직접 구해서 최솟값을 찾았다. 각 탐색 단계마다 연결된 node들을 array에 담아주며 n 번째 컴퓨터에 도달한 경우에 대해서는 연결된 노드들 사이의 간선들의 weight를 다 계산하여 weight가 높은 순서로 k개의 간선을 제외하고 남은 간선들에 대해서 최댓값을 찾는 방식으로 코드를 짰었다.  
[source code 보러 가기](https://github.com/AEJIJEON/programming/blob/main/algorithm/baekjoonProblems/0206sprint/1800installInternet.py){:target="\_blank"}  
최단 경로는 고려하지 않고 모든 경로를 탐색하면서 연결된 모든 node를 다시 차례대로 탐색해야 하므로 당연히 시간제한을 초과할 수밖에 없었다.. 올바른 답이 출력됐지만 너무 비효율적인 풀이라는 생각이 들었다.  
이 문제는 binary search(with parametric search)와 Dijkstra algorithm을 이용하여 풀게 되면 훨씬 시간 복잡도를 줄이며 효율적으로 풀 수 있게 된다.

#### 풀이

이분 탐색을 진행하면서 단계마다 해당하는 mid 값에 대하여 요구하는 조건을 만족하는지 결정하는 파라메트릭 서치를 이용해서 해결하면 되고, 요구하는 조건을 만족하는지는 Dijkstra algorithm을 사용하여 판단한다. 입력받은 모든 edges를 weight에 대하여 오름차순으로 정렬한 뒤에 이분 탐색을 진행한다. 0부터 maximum of weight of edges 사이에서 탐색을 해야 하기 때문에 weight가 0인 요소를 하나 추가해준 뒤에 오름차순으로 정렬하면 된다. 각 탐색 단계에서 해당 weight보다 작은 weight를 가진 edge들은 weight 값을 0으로(해당 edge의 weight도 0으로 설정), 해당 weight보다 큰 weight를 가진 edge들은 weight 값을 1로 설정해 준 후에 Dijkstra algorithm을 이용하여 1번 node부터 n번 node까지의 최단 경로를 찾아준다. 1번 node부터 n번 node까지의 최단 경로는 실제 graph에서의 최단 경로에 포함된 edges 중에서 해당 weight보다 큰 weight를 가진 edges 수가 된다. 이 최단 경로 값이 k 이하일 때 요구하는 조건을 만족한다는 것이기 때문에 결괏값을 update 시켜주고 이 값보다 더 작은 값에서도 적절한 값이 나올 수 있는지 확인하기 위해 end 값을 mid - 1로 설정해준 뒤 다시 이분 탐색을 진행한다.

코드는 다음 아래와 같다.

```python
import sys
import heapq

input = sys.stdin.readline

INF = int(1e9)
n, p, k = map(int, input().split())

edges = []

for _ in range(p):
    edges.append(tuple(list(map(int, input().split()))))

# 비용이 0이 나오는 경우도 고려 즉, 최단 경로를 이루는 edges 수가 k 이하인 경우
edges.append((-1, -1, 0))

# edge weight에 대한 오름차순 정렬
edges.sort(key = lambda x: x[2])
length = len(edges)


def getGraph(mid):
    graph = [[] for _ in range(n+1)]
    for i in range(1, length):
        a, b, cost = edges[i]
        # 지불해야 하는 값 이하인 선
        if i <= mid:
            graph[a].append((b, 0))
            graph[b].append((a, 0))
        # 지불해야 하는 값 초과, 즉 공짜로 얻게되는 선
        else:
            graph[a].append((b, 1))
            graph[b].append((a, 1))
    return graph

def dijkstra(start, graph):
    q = []
    distances = [INF]*(n+1)
    heapq.heappush(q, (0, start))
    distances[start] = 0

    while q:
        dist, now = heapq.heappop(q)

        for adj, w in graph[now]:
            cost = dist + w
            if cost < distances[adj]:
                heapq.heappush(q, (cost, adj))
                distances[adj] = cost
    # 1부터 n까지 최단 경로
    # 실제 graph에서의 최단 경로에 포함된
    # mid값보다 큰 weight를 가진 edges 수
    return distances[n]


start = 0
end = length - 1

# n 번째 컴퓨터에 도달할 수 없는 경우로 초기화
result = -1

# binary search with parametric search
while start <= end:
    # 지불해야 하는 값
    mid = (start + end) // 2
    graph = getGraph(mid)


    numOfFreeLines = dijkstra(1, graph)


    # mid 적절한 값
    if numOfFreeLines <= k:
        result = edges[mid][2]
        end = mid - 1
    else:
        start = mid + 1

print(result)
```

graph를 다루는 문제에서 edges의 weight 값이 같지 않게 주어지고 a번 node에서 b번 node까지 이동하는 것을 다뤄야 할 때 dijkstra algorithm을 사용하는 풀이를 고려해 보아야겠다. 또한 여러 가지 유형이 동시에 적용될 수 있다는 점을 꼭 기억해 둬야겠다.

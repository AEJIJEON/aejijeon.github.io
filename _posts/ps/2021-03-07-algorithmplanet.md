---
layout: post
title: "[백준 2887]행성 터널"
featured-img: planet
categories: [ps]
---

[문제 보러 가기(Baekjoon Online Judge)](https://www.acmicpc.net/problem/2887){:target="\_blank"}

#### 문제 요약

어떤 왕국에 n개의 행성이 있고, 각 행성은 3차원 좌표 위의 한 점으로서 표현이 될 때 두 행성을 터널로 연결할 때 드는 비용은 min(|xA-xB|, |yA-yB|, |zA-zB|)으로 계산이 된다.  
터널을 총 n-1개를 건설해서 모든 행성이 서로 연결되게 하는 데에 필요한 최소 비용을 구해야 한다.

#### 문제 풀이

행성을 node로, 터널을 간선으로 보았을 때 만들어지는 그래프에서 최소 신장 트리(MST)의 weight를 찾는 문제로 보았고, MST를 찾기 위해서는 간선들의 비용을 고려해야 하는데 간선들의 개수가 총 nC2개이다. 즉, n(n-1)/2개가 존재한다.  
모든 두 행성 간의 거리를 고려하게 된다면 시간 초과가 날 것이다. (n 값이 최대 100,000이고 시간제한이 1초)  
하지만 문제에서 주어진 두 행성을 터널로 연결하는 데에 드는 비용을 min(|xA-xB|, |yA-yB|, |zA-zB|)으로 구한다는 특징을 이용하게 되면 고려할 간선의 개수를 줄일 수 있게 된다.  
각 x, y, z축에서의 인접한 노드들의 간선만 고려해서도 문제를 해결할 수 있다.
예를 들어,  
5개의 노드 좌표들이 다음과 같다고 하자.
(11 -15 -15), (14 -5 -15), (-1 -1 -5), (10 -4 -1), (19 -4 19)
여기서 x 좌표들만 가지고 와서 오름차순으로 정렬을 하게 되면  
11 14 -1 10 19 -> -1 10 11 14 19 이고, x축에서의 인접한 두 노드를 연결하는 간선의 비용은 각 11 1 3 5 가 되는데 이런 식으로 4개의 간선만 가지고 총 12개(y,z축에서도 각 4개씩)의 간선들만 고려해도 MST를 찾을 수 있게 된다.  
이 논리에 대해서 간단하게 증명하겠습니다.  
T라는 MST가 있다고 할 때, 일반성을 잃지 않고 x축에서 인접하지 않은 노드 A ,B를 연결하는 간선이 존재한다고 가정해봅시다. x축에서 고려했을 때 Ax Cx Bx와 같이 A, B 노드 사이에 C 노드가 존재하게 되는데 원래 연결되어있던 Ax~Bx 간선을 Ax ~ Cx, Cx ~ Bx로 대체하게 되면
A ~ B 간선의 비용의 값과 A ~ C, C ~ B 간선들의 비용을 더한 값이 같으므로 총비용 변화는 없게 되고 간선의 수가 1개 증가하게 되어 총 간선의 개수가 n개가 된다. 즉, 그래프에서 cycle이 발생하게 된다. cycle을 이루는 간선 중에서 아무거나 하나를 제거하게 되면 T보다 무게가 더 작은 새로운 spanning tree가 만들어지게 되는데 이것은 T가 MST라는 가정에 모순이 된다. 따라서 구하고자 하는 MST에서 연결된 노드들은 어떤 한 축에서(x, y, z축 중에) 항상 인접한다는 것을 알 수 있다.  
총 3\*(n-1)의 간선들만 고려해서 MST를 찾게 되면 문제에서 요구하는 최소 비용을 시간 초과 없이 구할 수 있게 되고, MST는 Kruskal Algorithm을 사용해서 구해주면 된다.

#### 코드

```python
# find 연산 수행
def find_parent(parent, x):
    if parent[x] != x:
        parent[x] = find_parent(parent, parent[x])
    return parent[x]


# union 연산 수행
def union_parent(parent, a, b):
    a = find_parent(parent, a)
    b = find_parent(parent, b)
    if a > b:
        parent[a] = b
    else:
        parent[b] = a


n = int(input())

parent = [0] * n
for i in range(n):
    parent[i] = i

x, y, z = [], [], []

for i in range(n):
    a, b, c = map(int, input().split())
    x.append((a, i))
    y.append((b, i))
    z.append((c, i))

x.sort()
y.sort()
z.sort()

edges = []

# x, y, z 축에서 인접한 node들의 간선 추가
for i in range(n - 1):
    edges.append((abs(x[i][0] - x[i + 1][0]), x[i][1], x[i + 1][1]))
    edges.append((abs(y[i][0] - y[i + 1][0]), y[i][1], y[i + 1][1]))
    edges.append((abs(z[i][0] - z[i + 1][0]), z[i][1], z[i + 1][1]))

# 3*(n-1)개 간선들을 정렬
edges.sort()

result = 0

for edge in edges:
    cost, a, b = edge

    # 두 node가 포함된 집합이 서로소 집합인 경우
    if find_parent(parent, a) != find_parent(parent, b):
        union_parent(parent, a, b)
        # MST에 포함
        result += cost

print(result)
```

#### 시간 복잡도

Kruskal Algorithm을 사용하였고 이 algorithm에서는 시간이 가장 오래 걸리는 부분이 간선을 정렬하는 작업이다. edges 배열에 들어있는 3\*(n-1)개의 간선들을 정렬하므로 **O(NlogN)**의 시간 복잡도를 가지게 된다.

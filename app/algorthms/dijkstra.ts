interface Edge {
  source: number;
  target: number;
  weight: number;
}

// Tìm đỉnh có khoang cách nhỏ nhất chưa thăm
function findMin(dist: number[], visited: number[], n: number): number {
  let min = 0;
  let minDist = Infinity;

  for (let u = 0; u <= n; u++) {
    if (!visited[u] && dist[u] < minDist) {
      min = u;
      minDist = dist[u];
    }
  }

  return min;
}

export function dijkstra(
  edges: Edge[],
  vertexCount: number,
  begin: number,
  end: number,
  isDirected: boolean
) {
  console.log(begin, end, edges, vertexCount);
  // Tạo ma trận kề với kích thước chính xác
  const graph: number[][] = [];
  for (let i = 0; i <= vertexCount; i++) {
    graph[i] = new Array(vertexCount + 1).fill(0);
  }

  // Dien thong tin vao ma tran ke
  edges.forEach((edge) => {
    if (edge.source <= vertexCount && edge.target <= vertexCount) {
      if (isDirected) {
        graph[edge.source][edge.target] = edge.weight;
      } else {
        graph[edge.source][edge.target] = edge.weight;
        graph[edge.target][edge.source] = edge.weight;
      }
    }
  });

  // Khoi tao cac mang
  const dist = Array(vertexCount).fill(Infinity);
  const visited = Array(vertexCount).fill(false);
  const trace = Array(vertexCount).fill(-1);

  dist[begin] = 0;

  // Duyet tu 1 den vertexCount
  for (let i = 0; i <= vertexCount; i++) {
    const u = findMin(dist, visited, vertexCount);

    if (u === end) break;
    visited[u] = true;
    // Cap nhat khoang cach cho cac dinh ke
    for (let v = 0; v <= vertexCount; v++) {
      if (!visited[v] && graph[u][v] !== 0 && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
        trace[v] = u;
      }
    }
  }

  // Neu khong tim thay duong di den end
  if (dist[end] === Infinity) {
    return {
      path: [],
      distance: Infinity,
    };
  }

  // Tao duong di tu begin den end
  const path: Edge[] = [];
  let current = end;
  // Truy vet nguoc lai
  while (current !== begin) {
    const prev = trace[current];
    path.unshift({
      source: prev,
      target: current,
      weight: graph[prev][current],
    });
    current = prev;
  }

  return {
    path,
    distance: dist[end],
  };
}


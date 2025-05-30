interface Edge {
  source: number;
  target: number;
  weight: number;
}

export function floyd(
  edges: Edge[],
  vertexCount: number,
  begin: number,
  isDirected: boolean
) {
  // Khởi tạo ma trận khoảng cách và ma trận truy vết
  const dist: number[][] = [];
  const next: number[][] = [];

  // Khởi tạo các ma trận với giá trị ban đầu
  for (let i = 0; i <= vertexCount; i++) {
    dist[i] = new Array(vertexCount + 1).fill(Infinity);
    next[i] = new Array(vertexCount + 1).fill(-1);
    dist[i][i] = 0; // Khoảng cách từ đỉnh đến chính nó = 0
  }

  // Điền thông tin cạnh vào ma trận khoảng cách
  edges.forEach((edge) => {
    dist[edge.source][edge.target] = edge.weight;
    if (!isDirected) {
      dist[edge.target][edge.source] = edge.weight;
    }
    next[edge.source][edge.target] = edge.target;
    if (isDirected) {
      next[edge.target][edge.source] = edge.source;
    }
  });

  // Thuật toán Floyd-Warshall
  for (let k = 1; k <= vertexCount; k++) {
    for (let i = 1; i <= vertexCount; i++) {
      for (let j = 1; j <= vertexCount; j++) {
        if (
          dist[i][k] !== Infinity &&
          dist[k][j] !== Infinity &&
          dist[i][k] + dist[k][j] < dist[i][j]
        ) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Tạo kết quả chứa đường đi từ begin đến mọi đỉnh
  const result: {
    paths: { [key: number]: Edge[] };
    distances: { [key: number]: number };
  } = {
    paths: {},
    distances: {},
  };

  // Tìm đường đi từ begin đến mọi đỉnh khác
  for (let end = 0; end <= vertexCount; end++) {
    if (end !== begin) {
      const path: Edge[] = [];
      let current = begin;

      // Nếu có đường đi đến đỉnh end
      if (dist[begin][end] !== Infinity) {
        // Truy vết đường đi
        while (current !== end) {
          const nextVertex = next[current][end];
          path.push({
            source: current,
            target: nextVertex,
            weight: dist[current][nextVertex],
          });
          current = nextVertex;
        }
      }

      // Lưu đường đi và khoảng cách
      result.paths[end] = path;
      result.distances[end] = dist[begin][end];
    }
  }

  const formattedPaths = Object.entries(result.paths)
    .map(([endVertex, path]) => {
      if (path.length === 0) return null;

      const source = path[0].source;
      const target = path[path.length - 1].target;
      const weight = path.reduce((total, edge) => total + edge.weight, 0);

      return { source, target, weight };
    })
    .filter(Boolean);

  console.log(formattedPaths);

  return {
    path: formattedPaths,
    distance: result.distances,
  };
}

// export function floyd(edges: Edge[], vertexCount: number, begin: number) {
//   // Khởi tạo ma trận khoảng cách và ma trận truy vết

//   const graph: number[][] = Array.from({ length: vertexCount }, () =>
//     Array(vertexCount).fill(0)
//   );
//   console.log(edges);

//   // Điền thông tin cạnh vào ma trận khoảng cách
//   edges.forEach((edge) => {
//     graph[edge.source][edge.target] = edge.weight;
//     // graph[edge.target][edge.source] = edge.weight;
//   });
//   console.log(graph);
//   const n = graph.length;
//   const dist = Array.from(Array(n), () => new Array(n).fill(0));
//   const trace = Array.from(Array(n), () => new Array(n).fill(-1));
//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       if (graph[i][j] == 0) dist[i][j] = Infinity;
//       else dist[i][j] = graph[i][j];
//       if (graph[i][j] !== 0 && i !== j) {
//         trace[i][j] = i;
//       }
//     }
//   }

//   for (let k = 0; k < n; k++) {
//     for (let i = 0; i < n; i++) {
//       for (let j = 0; j < n; j++) {
//         if (dist[i][k] + dist[k][j] < dist[i][j]) {
//           dist[i][j] = dist[i][k] + dist[k][j];
//           trace[i][j] = trace[k][j];
//         }
//       }
//     }
//   }

//   console.log(dist, trace);
//   return { dist, trace, graph };
// }

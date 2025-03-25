interface Edge {
  source: number;
  target: number;
  weight: number;
}

export function prim(edges: Edge[], vertexCount: number, begin: number) {
  // Khởi tạo ma trận kề với giá trị 0
  const graph = Array(vertexCount)
    .fill(0)
    .map(() => Array(vertexCount).fill(0));

  // Điền thông tin cạnh vào ma trận kề
  edges.forEach((edge) => {
    graph[edge.source][edge.target] = edge.weight;
    graph[edge.target][edge.source] = edge.weight; // Đồ thị vô hướng
  });
  console.log();

  // Mảng đánh dấu các đỉnh đã thêm vào MST
  const visited = Array(vertexCount).fill(false);

  // Mảng lưu trọng số nhỏ nhất để kết nối với MST
  const key = Array(vertexCount).fill(Number.MAX_VALUE);

  // Mảng lưu đỉnh cha trong MST
  const parent = Array(vertexCount).fill(-1);

  // Bắt đầu từ đỉnh 0
  key[begin] = 0;
  // Tạo danh sách cạnh của MST
  const mst: Edge[] = [];
  let totalWeight = 0;
  for (let count = 0; count < vertexCount - 1; count++) {
    // Tìm đỉnh có key nhỏ nhất trong các đỉnh chưa thăm
    let minKey = Number.MAX_VALUE;
    let minIndex = -1;

    for (let v = 0; v < vertexCount; v++) {
      if (!visited[v] && key[v] < minKey) {
        minKey = key[v];
        minIndex = v;
      }
    }

    if (minIndex === -1) continue;

    // Đánh dấu đỉnh đã chọn
    visited[minIndex] = true;

    // Cập nhật key cho các đỉnh kề chưa thăm
    for (let v = 0; v < vertexCount; v++) {
      // Nếu có cạnh nối, chưa thăm và trọng số nhỏ hơn key hiện tại
      if (
        graph[minIndex][v] > 0 &&
        !visited[v] &&
        graph[minIndex][v] < key[v]
      ) {
        parent[v] = minIndex;
        key[v] = graph[minIndex][v];
      }
    }
  }

  for (let i = 0; i < vertexCount; i++) {
    if (parent[i] !== -1) {
      const edge = {
        source: parent[i],
        target: i,
        weight: graph[i][parent[i]],
      };
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }

  console.log(mst, totalWeight);
  return {
    mst,
    totalWeight,
  };
}

interface Edge {
  source: number;
  target: number;
  weight: number;
}

/**
 * Thuật toán Chu-Liu/Edmonds để tìm cây khung có hướng tối thiểu
 * @param edges Danh sách cạnh có hướng
 * @param vertexCount Số lượng đỉnh trong đồ thị
 * @param root Đỉnh gốc của cây khung
 * @returns {mst: Edge[], totalWeight: number} - Cây khung có hướng tối thiểu và tổng trọng số
 */
export function chuLiuEdmonds(
  edges: Edge[],
  vertexCount: number,
  root: number
) {
  console.log("root", root);
  let minEdges: (Edge | null)[] = Array(vertexCount).fill(null);

  // Bước 1: Chọn cạnh có trọng số nhỏ nhất đi vào mỗi đỉnh (trừ root)
  edges.forEach((edge) => {
    if (edge.target !== root) {
      if (
        !minEdges[edge.target] ||
        edge.weight < minEdges[edge.target]!.weight
      ) {
        minEdges[edge.target] = edge;
      }
    }
  });

  // Kiểm tra nếu có đỉnh không có cạnh đi vào (trừ root)
  for (let i = 0; i < vertexCount; i++) {
    if (i !== root && !minEdges[i]) return { mst: [], totalWeight: 0 }; // Không có cây khung hợp lệ
  }

  // Bước 2: Kiểm tra chu trình
  let parent = Array(vertexCount).fill(-1);
  let visited = Array(vertexCount).fill(-1);
  let cycle: number[] = [];

  for (let i = 0; i < vertexCount; i++) {
    if (i === root || visited[i] !== -1) continue;

    let curPath: Set<number> = new Set();
    let node = i;
    while (node !== root && visited[node] === -1) {
      visited[node] = i;
      curPath.add(node);
      node = minEdges[node]!.source;
      if (curPath.has(node)) {
        cycle = [...curPath];
        break;
      }
    }
    if (cycle.length) break;
  }

  // Nếu không có chu trình, tính tổng trọng số và trả về danh sách cạnh
  if (!cycle.length) {
    let mst = minEdges.filter((edge) => edge !== null) as Edge[];
    let totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
    return { mst, totalWeight };
  }

  // Bước 3: Nén chu trình thành một siêu đỉnh
  let cycleSet = new Set(cycle);
  let newMapping: number[] = Array(vertexCount).fill(-1);
  let newId = 0;

  for (let i = 0; i < vertexCount; i++) {
    if (!cycleSet.has(i)) newMapping[i] = newId++;
  }
  let cycleNode = newId++;

  edges = edges.map((edge) => ({
    source: cycleSet.has(edge.source) ? cycleNode : newMapping[edge.source],
    target: cycleSet.has(edge.target) ? cycleNode : newMapping[edge.target],
    weight:
      edge.weight -
      (cycleSet.has(edge.target) ? minEdges[edge.target]!.weight : 0),
  }));

  // Bước 4: Tìm cây khung tối thiểu của đồ thị thu nhỏ
  let newMST = chuLiuEdmonds(edges, newId, newMapping[root]);

  if (!newMST.mst.length) return { mst: [], totalWeight: 0 };

  // Bước 5: Giải nén siêu đỉnh về cây khung ban đầu
  let finalEdges: Edge[] = [];
  for (let edge of newMST.mst) {
    if (edge.target === cycleNode) {
      for (let node of cycle) {
        if (!cycleSet.has(minEdges[node]!.source)) {
          finalEdges.push(minEdges[node]!);
          break;
        }
      }
    } else {
      finalEdges.push(edge);
    }
  }

  let totalWeight = finalEdges.reduce((sum, edge) => sum + edge.weight, 0);
  return { mst: finalEdges, totalWeight };
}

// --- Ví dụ sử dụng ---
const edges: Edge[] = [
  { source: 0, target: 1, weight: 1 },
  { source: 0, target: 2, weight: 5 },
  { source: 1, target: 2, weight: 2 },
  { source: 1, target: 3, weight: 3 },
  { source: 2, target: 3, weight: 4 },
];

const root = 0;
const result = chuLiuEdmonds(edges, 4, root);
console.log("Cây khung có hướng tối thiểu:", result.mst);
console.log("Tổng trọng số:", result.totalWeight);

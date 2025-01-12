interface Edge {
  source: number;
  target: number;
  weight: number;
}

export function bruteForce(
  edges: Edge[],
  vertexCount: number,
  startNode: number = 0
) {
  // Tạo ma trận kề với kích thước chính xác
  const graph: number[][] = [];
  for (let i = 0; i <= vertexCount; i++) {
    graph[i] = new Array(vertexCount + 1).fill(0);
  }

  // Dien thong tin vao ma tran ke
  edges.forEach((edge) => {
    if (edge.source <= vertexCount && edge.target <= vertexCount) {
      graph[edge.source][edge.target] = edge.weight;
      // graph[edge.target][edge.source] = edge.weight;   //Do thi co huong
    }
  });

  const n = vertexCount;

  const resultNodes: any[] = [];
  const resultEdges: any[] = [];

  function buildTree(
    path: number[],
    visited: Set<number>,
    currentCost: number
  ) {
    const currentNode = path[path.length - 1];
    const nodeId = `${path.join("->")}`; // Unique identifier for this state

    // Add the current node to the nodes array
    resultNodes.push({
      id: nodeId,
      node: currentNode,
      path: [...path],
      cost: currentCost,
      isLeaf: path.length === n + 1,
    });

    // If all nodes are visited, return to the start node
    if (path.length === n + 1) {
      return;
    }

    // Explore all unvisited nodes
    for (let nextNode = 0; nextNode < n; nextNode++) {
      if (!visited.has(nextNode) && graph[currentNode][nextNode] !== 0) {
        const newVisited = new Set(visited);
        newVisited.add(nextNode);
        const newPath = [...path, nextNode];
        const newCost = currentCost + graph[currentNode][nextNode];

        const childId = `${newPath.join("->")}`;

        // Add the edge to the edges array
        resultEdges.push({
          from: nodeId,
          to: childId,
          cost: graph[currentNode][nextNode],
        });

        // Recursively build the tree for the child
        buildTree(newPath, newVisited, newCost);
      }
    }

    // If all nodes are visited, return to the start node
    if (path.length === n) {
      const returnCost = graph[currentNode][startNode];
      const newPath = [...path, startNode];
      const newCost = currentCost + returnCost;

      const childId = `${newPath.join("->")}`;

      // Add the edge to return to the starting node
      resultEdges.push({
        from: nodeId,
        to: childId,
        cost: returnCost,
      });

      // Add the final node
      resultNodes.push({
        id: childId,
        node: startNode,
        path: newPath,
        cost: newCost,
        isLeaf: true,
      });
    }
  }

  // Start building the tree from the starting node
  const visited = new Set<number>();
  visited.add(startNode);
  buildTree([startNode], visited, 0);

  return { resultNodes, resultEdges };

  //   Generate all permutation of the vertices
  // const vertices = Array.from({ length: vertexCount }, (_, i) => i);
  // let minPath: number[] = [];
  // let minDistance = Infinity;

  // //   Array to store the result nodes and edge
  // const resultNode: any[] = [];
  // const resultEdges: any[] = [];

  // const permute = (arr: number[], start: number) => {
  //   if (start === arr.length - 1) {
  //     //Tinh toan tong khoan cach
  //     let currentDistance = 0;
  //     const path: number[] = [];
  //     for (let i = 0; i < arr.length; i++) {
  //       path.push(arr[i]);
  //       if (i > 0) {
  //         currentDistance += graph[arr[i - 1]][arr[i]];
  //         resultEdges.push({
  //           from: `${path.slice(0, 1).join("->")}`,
  //           to: `${path.slice(0, i + 1).join("->")}`,
  //           cost: graph[arr[i - 1]][arr[i]],
  //         });
  //       }
  //     }
  //     // add distance from last vertex back to the firs vertex
  //     currentDistance += graph[arr[arr.length - 1]][arr[0]];
  //     resultEdges.push({
  //       from: `${path.join("->")}`,
  //       to: `${path[0]}`,
  //       cost: graph[arr[arr.length - 1]][arr[0]],
  //     });

  //     // update minium distance and path if current is better
  //     if (currentDistance < minDistance) {
  //       minDistance = currentDistance;
  //       minPath = [...arr]; //Store the current best path
  //     }

  //     // add node top resultNode
  //     resultNode.push({
  //       id: `${path.join("->")}`,
  //       node: path[path[length - 1]],
  //       path: [...path],
  //       cost: currentDistance,
  //       isLeaf: true,
  //     });
  //   } else {
  //     for (let i = start; i < arr.length; i++) {
  //       [arr[start], arr[i]] = [arr[i], arr[start]]; //swap
  //       permute(arr, start + 1);
  //       [arr[start], arr[i]] = [arr[i], arr[start]];
  //     }
  //   }
  // };
  // permute(vertices, 1); // Start permutation

  // // Add the final node for the minimum path
  // if (minPath.length > 0) {
  //   resultNode.push({
  //     id: `${minPath.join("->")}`,
  //     node: minPath[minPath.length - 1],
  //     path: [...minPath],
  //     cost: minDistance,
  //     isLeaf: true,
  //   });
  // }

  // return {
  //   path: minPath,
  //   distance: minDistance,
  //   resultEdges,
  //   resultNode,
  // };
}

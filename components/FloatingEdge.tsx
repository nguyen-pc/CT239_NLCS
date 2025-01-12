import { getEdgeParams } from "@/lib/edge.util";
import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getStraightPath,
  ReactFlowState,
  useInternalNode,
  useStore,
} from "@xyflow/react";

import { FC } from "react";


export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
): string => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

// Function to create a ring path (self-loop)
export const getRingPath = (
  nodeX: number,
  nodeY: number,
  nodeSize: number,
  loopRadius: number = 40
): string => {
  const startX = nodeX + nodeSize / 2;
  const startY = nodeY;

  const endX = nodeX - nodeSize / 2;
  const endY = nodeY;

  const control1X = nodeX + loopRadius;
  const control1Y = nodeY - loopRadius;

  const control2X = nodeX - loopRadius;
  const control2Y = nodeY - loopRadius;

  return `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
};

type FloatingEdge = Edge<{
  id: string;
  source: string;
  target: string;
  markerEnd: string;
  style: object;
  label: string;
}>;

const FloatingEdge: FC<EdgeProps<FloatingEdge>> = ({
  id,
  source,
  target,
  style,
  data,
  markerEnd,
}) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    );
    return edgeExists;
  });

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
  const nodeSize = 40; // Example node size, adjust based on your design
  const isSelfLoop = source === target; // Detect if the edge is a self-loop

  let edgePath = "";
  let labelX = 0;
  let labelY = 0;

  if (isSelfLoop) {
    // Handle ring path (self-loop)
    edgePath = getRingPath(sx, sy, nodeSize);
    labelX = sx + nodeSize;
    labelY = sy - nodeSize - 10; // Adjust label position above the loop
  } else if (isBiDirectionEdge) {
    // Handle bidirectional edge
    edgePath = getSpecialPath(
      { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
      sx < tx ? 30 : -30
    );
    labelX = (sx + tx) / 2;
    labelY = (sy + ty) / 2 + (sx < tx ? 20 : -20);
  } else {
    // Handle regular edge
    [edgePath] = getStraightPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
    });
    labelX = (sx + tx) / 2 + 10;
    labelY = (sy + ty) / 2 - 15;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {data?.label && (
        <>
          <rect
            x={labelX - data.label.length * 2.5}
            y={labelY - 8}
            width={data.label.length * 7}
            height={16}
            fill="white"
            strokeWidth={0.5}
          />
          <text
            x={labelX}
            y={labelY}
            fill="#222"
            fontSize="12px"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {data.label}
          </text>
        </>
      )}
    </>
  );
};

export default FloatingEdge;

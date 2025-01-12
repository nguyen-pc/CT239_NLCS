"use client";

import { Handle, Position } from "@xyflow/react";

function CircleNode({ data }: { data: { label: string } }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #2563eb",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
      }}
    >
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default CircleNode;

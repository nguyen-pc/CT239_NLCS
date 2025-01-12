import React from "react";
import { Handle, Position } from "@xyflow/react";

const TreeNode = (props: any) => {
  const { data } = props;
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        background: "#f9f9f9",
        ...data.style,
      }}
    >
      <div>
        <p>{data.label}</p>
        {data.bound ? <p>CD: {data.bound}</p> : null}
        <strong>{data.path}</strong>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default TreeNode;

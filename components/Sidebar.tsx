"use client";

import React from "react";
import { Button } from "./ui/button";
import { ComboboxDemo } from "./Combobox";
import { Textarea } from "./ui/textarea";
import { useGraph } from "@/context/GraphContext";

const Sidebar = () => {
  const [edgesInput, setEdgesInput] = React.useState("");
  const { setEdges, setVertexCount } = useGraph();

  // Hàm xử lý danh sách cạnh đầu vào
  const handleEdgesInput = () => {
    try {
      // Tách các dòng và loại bỏ dòng trống
      const lines = edgesInput.split("\n").filter((line) => line.trim());
      const edges = [];
      let maxVertex = -1;

      for (const line of lines) {
        // Tách source, target và weight
        const [source, target, weight] = line.trim().split(/\s+/).map(Number);

        // Kiểm tra dữ liệu hợp lệ
        if (isNaN(source) || isNaN(target) || isNaN(weight)) {
          throw new Error(
            "Dữ liệu không hợp lệ: Phải là 3 số nguyên trên mỗi dòng"
          );
        }

        if (weight <= 0) {
          throw new Error("Trọng số phải là số dương");
        }

        edges.push({ source, target, weight });

        // Cập nhật số đỉnh lớn nhất
        maxVertex = Math.max(maxVertex, source, target);
      }

      // Số đỉnh = đỉnh lớn nhất + 1 (vì đỉnh bắt đầu từ 0)
      setVertexCount(maxVertex + 1);
      setEdges(edges);

      alert("Đã tạo đồ thị thành công!");
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    }
  };

  // Tạo danh sách cạnh ngẫu nhiên
  const generateRandomEdges = () => {
    const vertexCount = 5; // Số đỉnh
    const edgeCount = 7; // Số cạnh mong muốn
    const edges = [];

    // Tạo tập hợp các cạnh có thể có
    const possibleEdges = [];
    for (let i = 1; i < vertexCount; i++) {
      for (let j = i + 1; j < vertexCount; j++) {
        possibleEdges.push([i, j]);
      }
    }

    // Chọn ngẫu nhiên edgeCount cạnh từ tập possibleEdges
    for (let i = 0; i < edgeCount && possibleEdges.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * possibleEdges.length);
      const [source, target] = possibleEdges.splice(randomIndex, 1)[0];
      const weight = Math.floor(Math.random() * 9) + 1; // Trọng số từ 1-9
      edges.push(`${source} ${target} ${weight}`);
    }

    setEdgesInput(edges.join("\n"));
  };

  return (
    <div className="w-[400px] border border-red-500">
      <div>
        <h3 className="font-medium mb-2">Nhập danh sách cạnh</h3>
        <div className="space-x-2 mb-2">
          <Button onClick={generateRandomEdges}>Random</Button>
          <Button>Chọn File</Button>
        </div>
        <div>
          <Textarea
            className="h-[300px] font-mono"
            value={edgesInput}
            onChange={(e) => setEdgesInput(e.target.value)}
            placeholder="Nhập danh sách cạnh theo định dạng: source target weight
                Ví dụ:
                0 1 2
                1 2 3
                0 3 6
                1 3 8
                1 4 5
                2 4 7
                3 4 9"
          />
        </div>
        <div className="mt-2">
          <Button onClick={handleEdgesInput}>Tạo đồ thị</Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2">Chọn thuật toán</div>
        <ComboboxDemo />
      </div>
    </div>
  );
};

export default Sidebar;

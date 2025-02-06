"use client";

import React from "react";
import { Button } from "./ui/button";
import { ComboboxDemo } from "./Combobox";
import { Textarea } from "./ui/textarea";
import { useGraph } from "@/context/GraphContext";
import { Input } from "./ui/input";

import { Checkbox } from "./ui/checkbox";

const Sidebar = () => {
  const [edgesInput, setEdgesInput] = React.useState("");
  const { setEdges, setVertexCount, setIsDirected } = useGraph();

  const [directed, setDirected] = React.useState(false);

  console.log(directed)
  setIsDirected(directed)
  


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
    for (let i = 0; i < vertexCount; i++) {
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

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEdgesInput(content);
    };
    reader.readAsText(file);
  };
  return (
    <div className="w-[500px] border border-gray-400">
      <div className="ml-4 mr-4">
        <h3 className=" mt-2 mb-2 text-center font-bold text-lg ">
          Nhập danh sách cạnh 
        </h3>
        <div className="space-x-2 mb-3 flex justify-between ">
          <Button className="w-[150px] h-[40px]" onClick={generateRandomEdges}>
            Random
          </Button>

          <label className="relative cursor-pointer inline-block">
            <Button className="w-[150px] h-[40px]">Chọn File</Button>
            <Input
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="file"
              type="file"
              accept=".txt"
              onChange={handleFileInput}
            />
          </label>
        </div>
        <div>
          <Textarea
            className="h-[300px] font-mono"
            value={edgesInput}
            onChange={(e) => setEdgesInput(e.target.value)}
            placeholder={`Nhập danh sách cạnh theo định dạng: source target weight
          Ví dụ:
          0 1 2
          1 2 3
          0 3 6
          1 3 8
          1 4 5
          2 4 7
          3 4 9`}
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="terms2"
            className="text-lg font-medium mr-2"
          >
           Có hướng
          </label>
          <Checkbox checked={directed} onCheckedChange={(checked) => setDirected(checked)} />
        </div>
        <div className="mt-2">
          <Button onClick={handleEdgesInput}>Tạo đồ thị</Button>
        </div>
      </div>

      <div className="m-4">
        <div className="mb-2">Chọn thuật toán</div>
        <ComboboxDemo />
      </div>
    </div>
  );
};

export default Sidebar;

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGraph } from "@/context/GraphContext";
import { kruskal } from "@/app/algorthms/kuskal";
import { prim } from "@/app/algorthms/prim";
import { dijkstra } from "@/app/algorthms/dijkstra";
import { floyd } from "@/app/algorthms/floyd";
import { bruteForce } from "@/app/algorthms/brute-force";
import { branchAndBoundTSP } from "@/app/algorthms/branch-and-bound";
import { chuLiuEdmonds } from "@/app/algorthms/chuliu";

const frameworks = [
  {
    value: "TSP",
    label: "TSP",
    subOptions: [
      { value: "brute-force", label: "Brute Force" },
      { value: "branchAndBound", label: "Branch And Bound" },
    ],
  },
  {
    value: "tree",
    label: "Cây khung tối thiểu",
    subOptions: [
      { value: "kruskal", label: "Kruskal", requiresSource: false },
      { value: "prim", label: "Prim", requiresSource: true },
      { value: "chuliu", label: "Chuliu/Edmons", requiresSource: true },
    ],
    // requiresSource: true,
  },
  {
    value: "minium",
    label: "Tìm đường đi ngắn nhất",
    subOptions: [
      {
        value: "dijkstra",
        label: "Dijkstra",
        requireTarget: true,
        requiresSource: true,
      },
      {
        value: "floyd",
        label: "Floyd",
        requireTarget: false,
        requiresSource: true,
      },
    ],
    requiresSource: true,
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(false);
  const [openSource, setOpenSource] = React.useState(false);
  const [openTarget, setOpenTarget] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [subValue, setSubValue] = React.useState("");
  const [sourceVertex, setSourceVertex] = React.useState("");
  const [targetVertex, setTargetVertex] = React.useState("");

  // Lấy dữ liệu và functions từ context
  const {
    edges,
    vertexCount,
    isDirected,
    setAlgorithmResult,
    setAlgorithmResultDijkstra,
    setAlgorithmResultFloyd,
    setAlgorithmResultBrute,
    setAlgorithmResultBranchAndBound,
    setSource,
    setTarget,
  } = useGraph();

  console.log(isDirected);
  const selectedFramework = frameworks.find(
    (framework) => framework.value === value
  );

  // Giả sử đây là danh sách các đỉnh trong đồ thị
  const vertices = Array.from({ length: vertexCount }, (_, i) => ({
    value: `${i}`,
    label: `Đỉnh ${i}`,
  }));
  // Hàm thực hiện thuật toán
  const runAlgorithm = () => {
    if (!edges || edges.length === 0) {
      alert("Vui lòng nhập dữ liệu đồ thị trước!");
      return;
    }

    switch (subValue) {
      case "brute-force":
       
        const resultBrute = bruteForce(edges, vertexCount, 0, isDirected);
        setAlgorithmResultBrute(resultBrute);
        console.log(resultBrute);
        break;
      case "branchAndBound":

        const resultBranchAndBound = branchAndBoundTSP(edges, vertexCount, 0, isDirected);
        console.log(resultBranchAndBound);
        setAlgorithmResultBranchAndBound(resultBranchAndBound);
        break;
      case "kruskal":
        if (isDirected === true) {
          alert("Thuật toán Kruskal chỉ áp dụng cho đồ thị vô hướng!");
          return;
        }

        const resultKruskal = kruskal(
          edges,
          vertexCount,
          parseInt(sourceVertex)
        );

        setAlgorithmResult(resultKruskal);
        break;

      case "chuliu":
        if (isDirected === false) {
          alert("Thuật toán chuliu/edmon chỉ áp dụng cho đồ thị có hướng!");
          return;
        }

        const resultChuliu = chuLiuEdmonds(
          edges,
          vertexCount,
          parseInt(sourceVertex)
        );
        if (resultChuliu.mst.length === 0) {
          alert("Không tìm thấy cây khung hợp lệ!");
          return;
        }

        setAlgorithmResult(resultChuliu);
        break;

      case "prim":
        // Thêm code cho thuật toán Prim
        if (isDirected === true) {
          alert("Thuật toán Kruskal chỉ áp dụng cho đồ thị vô hướng!");
          return;
        }
        if (!sourceVertex) {
          alert("Vui lòng chọn đỉnh nguồn!");
          return;
        }
        const resultPrim = prim(edges, vertexCount, parseInt(sourceVertex));
        console.log(resultPrim);
        setAlgorithmResult(resultPrim);
        setSource(parseInt(sourceVertex));
        break;

      case "dijkstra":
        if (!sourceVertex) {
          alert("Vui lòng chọn đỉnh nguồn!");
          return;
        }
        if (!targetVertex) {
          alert("Vui lòng chọn đỉnh đích!");
          return;
        }
        console.log(sourceVertex + targetVertex);
        const resultDijkstra = dijkstra(
          edges,
          vertexCount,
          parseInt(sourceVertex),
          parseInt(targetVertex),
          isDirected
        );
        console.log(selectedFramework?.subOptions);
        console.log(resultDijkstra);
        setAlgorithmResultDijkstra(resultDijkstra);
        setSource(parseInt(sourceVertex));
        setTarget(parseInt(targetVertex));
        break;

      case "floyd":
        if (!sourceVertex) {
          alert("Vui lòng chọn đỉnh nguồn!");
          return;
        }
        const resultFloyd = floyd(edges, vertexCount, parseInt(sourceVertex), isDirected);
        console.log(resultFloyd);

        setAlgorithmResultDijkstra(resultFloyd);
        setSource(parseInt(sourceVertex));
        break;

      default:
        alert("Vui lòng chọn thuật toán!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select algorithm type..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search algorithm..." />
            <CommandList>
              <CommandEmpty>No algorithm found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setSubValue("");
                      setSourceVertex("");
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedFramework && (
        <Popover open={openSub} onOpenChange={setOpenSub}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSub}
              className="w-[200px] justify-between"
            >
              {subValue
                ? selectedFramework.subOptions.find(
                    (option) => option.value === subValue
                  )?.label
                : "Select specific algorithm..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search specific algorithm..." />
              <CommandList>
                <CommandEmpty>No algorithm found.</CommandEmpty>
                <CommandGroup>
                  {selectedFramework.subOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setSubValue(
                          currentValue === subValue ? "" : currentValue
                        );
                        setOpenSub(false);
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          subValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Combobox cho đỉnh nguồn chỉ hiển thị khi chọn "Tìm đường đi ngắn nhất" */}
      {subValue &&
        selectedFramework.subOptions.find((option) => option.value === subValue)
          ?.requiresSource && (
          <Popover open={openSource} onOpenChange={setOpenSource}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSource}
                className="w-[200px] justify-between"
              >
                {sourceVertex
                  ? `Đỉnh nguồn: ${sourceVertex}`
                  : "Chọn đỉnh nguồn..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Tìm đỉnh..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy đỉnh.</CommandEmpty>
                  <CommandGroup>
                    {vertices.map((vertex) => (
                      <CommandItem
                        key={vertex.value}
                        value={vertex.value}
                        onSelect={(currentValue) => {
                          setSourceVertex(
                            currentValue === sourceVertex ? "" : currentValue
                          );
                          setOpenSource(false);
                        }}
                      >
                        {vertex.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            sourceVertex === vertex.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

      {selectedFramework?.requiresSource &&
        subValue &&
        selectedFramework.subOptions.find((option) => option.value === subValue)
          ?.requireTarget && (
          <Popover open={openTarget} onOpenChange={setOpenTarget}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTarget}
                className="w-[200px] justify-between"
              >
                {targetVertex
                  ? `Đỉnh đích: ${targetVertex}`
                  : "Chọn đỉnh đích..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Tìm đỉnh..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy đỉnh.</CommandEmpty>
                  <CommandGroup>
                    {vertices.map((vertex) => (
                      <CommandItem
                        key={vertex.value}
                        value={vertex.value}
                        onSelect={(currentValue) => {
                          setTargetVertex(
                            currentValue === targetVertex ? "" : currentValue
                          );
                          setOpenTarget(false);
                        }}
                      >
                        {vertex.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            targetVertex === vertex.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

      <Button
        onClick={runAlgorithm}
        disabled={
          !value || !subValue
          // ||
          // (selectedFramework?.requiresSource &&
          //   (!sourceVertex || !targetVertex)
          // )
        }
      >
        Thực hiện thuật toán
      </Button>
    </div>
  );
}

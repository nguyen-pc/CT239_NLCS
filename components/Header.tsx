import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header = () => {
  return (
    <header className="items-center justify-between gap-4 p-4 sm:flex  xl:gap-7 !important">
      <Image src="/assets/logo.jpg" alt="logo" width={50} height={50} />
      <Dialog>
        <DialogTrigger>
          <Button>Thông tin</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Niên luận ngành kĩ thuật phần mềm</DialogTitle>
            <DialogDescription >
              Sinh viên thực hiện: Nguyễn Hoàng Thanh Nguyên - MSSV: B2203516
            </DialogDescription>
            <DialogDescription>
              GVHD: THS. TRƯƠNG THỊ THANH TUYỀN - BỘ MÔN CÔNG NGHỆ PHẦN MỀM
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    
    </header>
  );
};

export default Header;

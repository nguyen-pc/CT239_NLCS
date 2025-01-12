
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { GraphProvider } from "@/context/GraphContext";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <GraphProvider>
      <main className="flex h-screen">
        <section className="flex h-full flex-1 flex-col">
          <section className="flex h-full flex-1 flex-col">
            <Header />
            <div className="border-b border-red-500 "></div>
            <div className="flex">
              <Sidebar />
              <div className="main-content w-full ">{children}</div>
            </div>
          </section>
        </section>
      </main>
    </GraphProvider>
  );
};

export default Layout;

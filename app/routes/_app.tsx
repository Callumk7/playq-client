import { Container } from "@/features/layout/container";
import { Navbar } from "@/features/layout/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

export default function AppLayout() {
  return (
    <div className="block lg:grid lg:grid-cols-10">
      <div className="col-span-2 hidden h-screen lg:block">
        <Sidebar />
      </div>
      <div className="col-span-8 h-screen">
        <Navbar />
        <Container className="mt-10">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

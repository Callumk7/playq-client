import type { MetaFunction } from "@remix-run/node";
import { Container } from "./_app/layout/container";
import { Outlet } from "@remix-run/react";
import { Sidebar } from "./_app/layout/sidebar";
import { Navbar } from "./_app/layout/navigation";

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
        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

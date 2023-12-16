import { auth } from "@/features/auth/helper";
import { Container } from "@/features/layout/container";
import { Navbar } from "@/features/layout/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import { LoaderFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  return json({ session });
};


export default function AppLayout() {
  const { session} = useLoaderData<typeof loader>()
  return (
    <div className="block lg:grid lg:grid-cols-10">
      <div className="col-span-2 hidden h-screen lg:block">
        <Sidebar userId={session.id} />
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

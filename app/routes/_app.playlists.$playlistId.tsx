import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { playlistId } = params;
  const session = await auth(request);

  return json({ playlistId });
};


export default function PlaylistRoute() {
  const { playlistId } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Playlsit: {playlistId}</h1>
    </div>
  )
}

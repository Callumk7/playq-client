import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { Container } from "@/features/layout/container";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGame, IGDBGameSchemaArray } from "@/types/igdb/reponses";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const testGames = await fetchGamesFromIGDB(IGDB_BASE_URL, {
    search: "spyro",
    fields: "full",
    filters: [
      "cover.image_id != null",
      "artworks != null",
      "screenshots != null",
      "rating != null",
      "rating > 50",
      "follows > 5",
      "parent_game = null",
      "version_parent = null",
      "themes != (42)",
    ],
  });

  const parsedGames = IGDBGameSchemaArray.parse(testGames);

  return json({ parsedGames });
};

export default function GamesRoute() {
  const { parsedGames } = useLoaderData<typeof loader>();

  // State
  const [response, setResponse] = useState<string>("");

  const handleTest = async () => {
    console.log("button pressed");
    const res = await fetch(`${WORKER_URL}/games`, {
      method: "POST",
      body: JSON.stringify(parsedGames),
    });

    if (res.ok) {
      setResponse(await res.text());
    }
  };

  return (
    <Container className="mt-10">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Button onClick={handleTest}>Send to Test API</Button>
          <div className="whitespace-pre-wrap">
            {JSON.stringify(parsedGames, null, "\t")}
          </div>
        </div>
        <div>
          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>{response}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}

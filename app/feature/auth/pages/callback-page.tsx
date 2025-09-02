import type { Route } from "./+types/callback-page";
import { makeSSRClient } from "~/supa-clents";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const { client, headers } = makeSSRClient(request);
    const {  error } = await client.auth.exchangeCodeForSession(code!);
    if (error) throw error;

    return redirect("/math/elementary/1/2", { headers });
}
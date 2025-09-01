import type { Route } from "./+types/login-page";
import { makeSSRClient } from "~/supa-clents";
import { redirect } from "react-router";

const BASE_URL = process.env.BASE_URL;


export const loader = async ({ request }: Route.LoaderArgs) => {

    const redirectTo = `${BASE_URL}/callback`;
    const { client, headers } = makeSSRClient(request);

    const { data, error } = await client.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
    });

    if (data.url) return redirect(data.url, { headers });
    if (error) throw error;

}


// URL {
//     href: 'http://localhost:5173/callback?code=8db01b87-23bd-442d-8e73-df9b6d28ac66',
//         origin: 'http://localhost:5173',
//         protocol: 'http:',
//         username: '',
//         password: '',
//         host: 'localhost:5173',
//         hostname: 'localhost',
//         port: '5173',
//         pathname: '/callback',
//         search: '?code=8db01b87-23bd-442d-8e73-df9b6d28ac66',
//         searchParams: URLSearchParams { 'code' => '8db01b87-23bd-442d-8e73-df9b6d28ac66' },
//     hash: ''
// } URLLLLL
// 8db01b87-23bd-442d-8e73-df9b6d28ac66

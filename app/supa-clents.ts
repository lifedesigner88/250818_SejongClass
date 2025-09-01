import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for client, or SUPABASE_URL and SUPABASE_ANON_KEY for server.");
}

export const makeCSRClient = createBrowserClient(supabaseUrl, supabaseKey);

export function makeSSRClient(request: Request) {
    const headers: Headers = new Headers();
    const client = createServerClient(supabaseUrl!, supabaseKey!, {
        cookies: {
            getAll() {
                const parsed = parseCookieHeader(request.headers.get("Cookie") ?? "");
                return parsed?.map(({ name, value }) => ({ name, value: value ?? "" })) ?? null;
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
                });
            },
        },
    });

    return { client, headers };
}

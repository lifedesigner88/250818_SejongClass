import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export const makePublicClient = createBrowserClient(
    import.meta.env.VITE_SUPABASE_ID,
    import.meta.env.VITE_SUPABASE_PUBLIC
);

export function makeSSRClient(request: Request) {
    const headers: Headers = new Headers();
    const client = createServerClient(
        process.env.SUPABASE_ID!,
        process.env.SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    const parsed = parseCookieHeader(request.headers.get("Cookie") ?? "");
                    return parsed?.map(({ name, value }) => ({ name, value: value ?? "" })) ?? [];
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
                    });
                },
            },
        }
    );
    return { client, headers };
}

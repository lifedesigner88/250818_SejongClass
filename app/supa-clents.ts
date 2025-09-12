import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export const makePublicClient = createBrowserClient(
    "https://ierkuifrgbcadwasnkih.supabase.co",
    "sb_publishable_XsUBXVJtuRbbQ-ECXB7BQA_UkgDqpva"
);

export function makeSSRClient(request: Request) {
    const headers: Headers = new Headers();
    const client = createServerClient(
        "https://ierkuifrgbcadwasnkih.supabase.co",
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

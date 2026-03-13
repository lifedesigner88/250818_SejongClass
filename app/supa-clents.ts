import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

type PublicAppEnv = {
    demoMode: boolean;
    supabaseUrl: string;
    supabaseAnonKey: string;
};

declare global {
    interface Window {
        __APP_ENV__?: PublicAppEnv;
    }
}

const isDemoMode = () => process.env.DEMO_MODE === "true";

const getProjectRefFromUrl = (url: string) => {
    try {
        return new URL(url).hostname.split(".")[0] || null;
    } catch {
        return null;
    }
};

const resolveServerSupabaseConfig = () => {
    const useDemo = isDemoMode();
    const url = useDemo
        ? process.env.DEMO_SUPABASE_ID || process.env.SUPABASE_ID
        : process.env.SUPABASE_ID;
    const anonKey = useDemo
        ? process.env.DEMO_SUPABASE_KEY || process.env.SUPABASE_KEY
        : process.env.SUPABASE_KEY;

    if (!url || !anonKey) {
        throw new Error("Supabase server credentials are not configured.");
    }

    return { url, anonKey };
};

export const getPublicAppEnv = (): PublicAppEnv => {
    const useDemo = isDemoMode();
    const supabaseUrl = useDemo
        ? process.env.VITE_DEMO_SUPABASE_ID
        : process.env.VITE_SUPABASE_ID;
    const supabaseAnonKey = useDemo
        ? process.env.VITE_DEMO_SUPABASE_PUBLIC
        : process.env.VITE_SUPABASE_PUBLIC;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase public credentials are not configured.");
    }

    return {
        demoMode: useDemo,
        supabaseUrl,
        supabaseAnonKey,
    };
};

const getBrowserSupabaseConfig = () => {
    const appEnv = window.__APP_ENV__;
    const supabaseUrl = appEnv?.supabaseUrl || import.meta.env.VITE_SUPABASE_ID;
    const supabaseAnonKey = appEnv?.supabaseAnonKey || import.meta.env.VITE_SUPABASE_PUBLIC;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase browser credentials are not configured.");
    }

    return { supabaseUrl, supabaseAnonKey };
};

let publicClient: ReturnType<typeof createBrowserClient> | null = null;

export const makePublicClient = () => {
    if (publicClient) return publicClient;

    const { supabaseUrl, supabaseAnonKey } = getBrowserSupabaseConfig();
    publicClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return publicClient;
};

export const getActiveSupabaseProjectRef = () => {
    const { url } = resolveServerSupabaseConfig();
    return getProjectRefFromUrl(url);
};

export function makeSSRClient(request: Request) {
    const headers: Headers = new Headers();
    const { url, anonKey } = resolveServerSupabaseConfig();
    const client = createServerClient(
        url,
        anonKey,
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

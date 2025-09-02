import {
    Form,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet, redirect,
    Scripts,
    ScrollRestoration, useFetcher, useNavigate,
} from "react-router";

import { useEffect, useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import React from "react";
import { makeSSRClient } from "~/supa-clents";
import { UserStatus } from "@/components/user-status";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title></title>
            <Meta/>
            <Links/>
        </head>
        <body>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export const loader = async ({ request }: Route.LoaderArgs) => {

    const { client } = makeSSRClient(request)
    const { data: supabaseAuthData, error } = await client.auth.getUser()
    if (error) return { supabaseAuthData }

    console.log(supabaseAuthData)

    return { supabaseAuthData }
}

export const action = async ({ request }: Route.ActionArgs) => {

    const BASE_URL = process.env.BASE_URL;

    const formData = await request.formData();
    const password = formData.get('password') as string;


    const redirectTo = `${BASE_URL}/callback`;
    const { client, headers } = makeSSRClient(request);

    const { data, error } = await client.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
    });

    if (data.url) return redirect(data.url, { headers });
    if (error) throw error;

};

export default function App({ loaderData }: Route.ComponentProps) {

    const isLoggedIn = loaderData.supabaseAuthData.user !== null;
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [pendingUrlAfterLogin, setPendingUrlAfterLogin] = useState<string | null>(null);
    const navigate = useNavigate();

    //
    // // 로그인 성공 후 처리
    // useEffect(() => {
    //     if (loginFetcher.data?.success) {
    //         setIsLoggedIn(true);
    //         setShowLoginDialog(false);
    //         if (pendingthemsSlug) {
    //             navigate(`/${pendingthemsSlug}`);
    //             setPendingthemsSlug(null);
    //         }
    //         loginFetcher.data.success = false;
    //     }
    // }, [loginFetcher.data, pendingthemsSlug, isLoggedIn, navigate]);
    //


    return (
        <>
            <UserStatus
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLoginDialog(true)}
                onLogoutClick={() => navigate("/logout")}
            />

            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>
                    <Form method="post" className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </Form>
                </DialogContent>
            </Dialog>
            <Outlet context={{
                isLoggedIn,
                setShowLoginDialog,
                setPendingUrlAfterLogin,
            }}/>
        </>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
            )}
        </main>
    );
}

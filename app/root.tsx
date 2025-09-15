import {
    Form,
    isRouteErrorResponse, Link,
    Links,
    Meta,
    Outlet, redirect,
    Scripts,
    ScrollRestoration, useNavigate, useNavigation,
} from "react-router";

import { useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import React from "react";
import { makeSSRClient } from "~/supa-clents";
import { UserStatus } from "@/components/user-status";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { createPublicUserData, getPublicUserData } from "~/feature/users/quries";
import { getInAppBrowserType, isInAppBrowser, type publicUserDataType } from "~/feature/auth/useAuthUtil";

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
    // 파비콘
    { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "manifest", href: "/site.webmanifest" },
];

export const meta: Route.MetaFunction = () => {
    return [
        { title: "SejongClass - Code Your Life with Math & Physics" },
        { name: "description", content: "종이와 연필을 넘어선 새로운 학습 경험. Python으로 수학과 물리를 체험하며 코딩 리터러시를 기르세요." },

        // 기본 Open Graph
        { property: "og:title", content: "SejongClass" },
        { property: "og:description", content: "Python으로 수학과 물리를 배우는 새로운 방법" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/og-default.png" },
        { property: "og:site_name", content: "SejongClass" },
    ];
};


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
        <body className={"mt-16 h-[calc(100vh-64px)] w-screen overflow-hidden"}>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"/>
        </body>
        </html>
    );
}

// action
export const action = async ({ request }: Route.ActionArgs) => {

    const BASE_URL = process.env.BASE_URL;
    const formData = await request.formData();

    const pendingUrlAfterLogin = formData.get('pendingUrlAfterLogin') as string;
    const provider = formData.get('provider') as string;

    const redirectTo = new URL(`${BASE_URL}/callback`);

    // 로그인 이후 이동할 경로
    if (pendingUrlAfterLogin)
        redirectTo.searchParams.set('pendingUrl', pendingUrlAfterLogin);

    const { client, headers } = makeSSRClient(request);

    // 로그인
    const { data, error } = await client.auth.signInWithOAuth({
        provider: provider as 'github' | 'google' | 'kakao',
        options: { redirectTo: redirectTo.toString() },
    });

    if (data.url) return redirect(data.url, { headers });
    if (error) throw error;

};

// loader
export const loader = async ({ request }: Route.LoaderArgs) => {

    console.time("⏳ Root Loader")
    const { client } = makeSSRClient(request)
    const { data: supabaseAuthData, error } = await client.auth.getUser()
    if (error) return { supabaseAuthData }
    const user = supabaseAuthData.user;

    const loginedUuserProviderId = user.user_metadata.provider_id;
    const loginedUserDataFromProvider = user.identities?.filter(identity => identity.id === loginedUuserProviderId)[0];

    let publicUserData = await getPublicUserData(supabaseAuthData.user?.id)
    if (!publicUserData) {
        publicUserData = await createPublicUserData({
            user_id: user.id,
            email: user.email as string,
            username: user.user_metadata.user_name || user.user_metadata.preferred_username || user?.user_metadata.full_name || "anon",
            nickname: user?.user_metadata.full_name || user?.user_metadata.name || null,
            profile_url: user?.user_metadata.profile_url
                ? user.user_metadata.profile_url.replace(/=s\d+-c$/, '') // 구글의 경우 뒤에 삭제.
                : (user?.user_metadata.avatar_url || null),
        })
    }
    console.timeEnd("⏳ Root Loader")
    return {
        publicUserData: {
            ...publicUserData,
            provider: loginedUserDataFromProvider?.provider || null,
        },
    }
}


export default function App({ loaderData }: Route.ComponentProps) {
    const { publicUserData } = loaderData;
    const isLoggedIn = !!publicUserData;
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [pendingUrlAfterLogin, setPendingUrlAfterLogin] = useState<string | null>("/themes");
    const provider = publicUserData?.provider;
    const navigate = useNavigate();

    // 로딩 상태 확인
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const isLoading = navigation.state === "loading";

    // 어떤 provider가 클릭되었는지 감지
    const submittedProvider = navigation.formData?.get("provider");
    const isWebView = isInAppBrowser()

    return (
        <>
            {(isLoading || isSubmitting) && (
                <div className="fixed inset-0 z-30 flex items-center justify-center">
                    <Loader2 className="size-20 sm:size-30 animate-spin text-emerald-700"/>
                </div>
            )}

            {/* Navigation Bar - Supabase Style */}
            <nav className="fixed top-0 z-20 w-screen border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="w-full px-3 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo.svg" alt="SejongClass Logo" className="size-8"/>
                            <span className="font-bold text-xl ml-1 text-gray-900">SejongClass</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="https://www.youtube.com/@sejongclass"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Youtube
                            </a>
                            <a
                                href="http://github.com/lifedesigner88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Github
                            </a>
                            <a
                                href="https://blog.naver.com/lifedesigner88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors">
                                Blog
                            </a>
                        </div>

                        <div className="flex items-center space-x-3">
                            {isLoggedIn ?
                                <Button
                                    className={"hidden sm:block bg-gradient-to-r to-red-500 from-orange-300 bg-clip-text text-transparent "}
                                    variant="ghost" size="sm" onClick={() => navigate("/logout")}>
                                    로그아웃
                                </Button> :
                                <Button variant="ghost" size="sm" onClick={() => setShowLoginDialog(true)}>
                                    로그인
                                </Button>
                            }
                            <Link to="/themes">
                                <Button size="sm"
                                        className=" bg-emerald-600 hover:bg-emerald-700 text-white">
                                    주제보기
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 로그인한 유저 상태 */}
            <UserStatus
                isLoggedIn={isLoggedIn}
                isLoading={isLoading || isSubmitting}
                onLoginClick={() => setShowLoginDialog(true)}
                onLogoutClick={() => navigate("/logout")}
                provider={provider as 'github' | 'google' | 'kakao'}
                publicUserData={publicUserData as publicUserDataType | undefined}
            />


            {/* 로그인 다이얼로그 */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>로그인</DialogTitle>
                    </DialogHeader>
                    <Form method="post" className="space-y-4">
                        <input type="hidden" name="pendingUrlAfterLogin" value={pendingUrlAfterLogin || ''}/>

                        {/* Kakao 버튼 */}
                        <Button
                            type="submit"
                            name="provider"
                            value="kakao"
                            disabled={isSubmitting && submittedProvider !== "kakao"}
                            className="cursor-pointer w-full h-20 bg-[#FEE500] hover:bg-[#FDD000] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#3A1D1D] border-0 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100"
                        >
                            {isSubmitting && submittedProvider === "kakao" ? (
                                <>
                                    <Loader2 className="size-12 mr-3 animate-spin"/>
                                    <div className="font-medium text-base">연결 중...</div>
                                </>
                            ) : (
                                <>
                                    <RiKakaoTalkFill className="size-13 mr-3"/>
                                    <div className="font-medium text-base">KakaoTalk</div>
                                </>
                            )}
                        </Button>

                        {/* Google 버튼 */}
                        <Button
                            type="submit"
                            name="provider"
                            value="google"
                            disabled={isSubmitting && submittedProvider !== "google" || isWebView}
                            className="cursor-pointer w-full h-20 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100"
                        >
                            {isWebView ? <>
                                    <FcGoogle className="size-13 mr-3"/>
                                    <div className="font-medium text- overflow-hidden">
                                        <p>구글 로그인</p> {getInAppBrowserType()} 지원 ❌ <p> 크롬 이용 </p>
                                    </div>
                                </> :
                                <>
                                    {isSubmitting && submittedProvider === "google" ? (
                                        <>
                                            <Loader2 className="size-12 mr-3 animate-spin"/>
                                            <div className="font-medium text-base">연결 중...</div>
                                        </>
                                    ) : (
                                        <>
                                            <FcGoogle className="size-13 mr-3"/>
                                            <div className="font-medium text-base">Google</div>
                                        </>
                                    )}

                                </>
                            }

                        </Button>

                        {/* GitHub 버튼 */}
                        <Button
                            type="submit"
                            name="provider"
                            value="github"
                            disabled={isSubmitting && submittedProvider !== "github"}
                            className="cursor-pointer w-full h-20 bg-[#24292e] hover:bg-[#1a1e22] disabled:bg-gray-500 disabled:cursor-not-allowed text-white border-0 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100"
                        >
                            {isSubmitting && submittedProvider === "github" ? (
                                <>
                                    <Loader2 className="size-12 mr-3 animate-spin"/>
                                    <div className="font-medium text-base">연결 중...</div>
                                </>
                            ) : (
                                <>
                                    <FaGithub className="size-13 mr-3"/>
                                    <div className="font-medium text-base">GitHub</div>
                                </>
                            )}
                        </Button>
                    </Form>
                </DialogContent>
            </Dialog>
            <Outlet context={{
                isLoggedIn,
                publicUserData,
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

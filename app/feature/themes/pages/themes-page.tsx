import { getThemes } from "~/feature/themes/queries";
import {  useFetcher, useNavigate, useOutletContext } from "react-router";
import type { Route } from "./+types/themes-page";
import { UserStatus } from "@/components/user-status";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const loader = async () => {
    const themes = await getThemes()
    return { themes }
}

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Here you can implement actual login logic
    console.log('Login attempt:', { email, password });
    // 실제 로그인 로직을 여기에 구현
    // 예: API 호출, 데이터베이스 검증 등

    try {
        // 로그인 성공 시
        console.log("Login Success ✅")
        return { success: true };
    } catch (error) {
        // 로그인 실패 시
        return { success: false, error: "Invalid credentials" };
    }
};

export default function ThemesPage({ loaderData }: Route.ComponentProps) {
    const { themes } = loaderData;
    const baseSize = "size-50 text-5xl";
    const baseStyle = "text-white font-medium rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300";

    // slug를 첫글자 대문자로 변환하는 함수
    const capitalizeSlug = (slug: string) => {
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    };


    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [pendingthemsSlug, setPendingthemsSlug] = useState<string | null>(null);
    const navigate = useNavigate();
    const loginFetcher = useFetcher();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/themes")
    }
    const {
        isLoggedIn,
        setIsLoggedIn,
    } = useOutletContext<{
        isLoggedIn: boolean;
        setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    }>();


    // 로그인 성공 후 처리
    useEffect(() => {
        if (loginFetcher.data?.success) {
            setIsLoggedIn(true);
            setShowLoginDialog(false);
            if (pendingthemsSlug) {
                navigate(`/${pendingthemsSlug}`);
                setPendingthemsSlug(null);
            }
            loginFetcher.data.success = false;
        }
    }, [loginFetcher.data, pendingthemsSlug, isLoggedIn, navigate]);


    const handleThemeClick = (themesSlug: string) => {
        // 로그인 되고, 과목을 등록한 유저만 오픈 가능.
        if (!isLoggedIn) {
            setPendingthemsSlug(themesSlug); // 로그인 후 이동할 unit 저장
            setShowLoginDialog(true);
        } else navigate(`/${themesSlug}`);

    };

    return (
        <div className={"flex flex-col justify-center items-center min-h-screen"}>

            <UserStatus
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLoginDialog(true)}
                onLogoutClick={handleLogout}
            />

            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>
                    <loginFetcher.Form method="post" className="space-y-4">
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
                    </loginFetcher.Form>
                </DialogContent>
            </Dialog>


            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                🧮 관심있는 테마를 선택해주세요 ⚡
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {themes.map((t) => (
                    t.is_active ? (
                        <div
                            key={t.themes_id}
                            onClick={() => handleThemeClick(t.slug)}
                            className={`
                                    ${baseSize} 
                                    ${baseStyle} 
                                    ${t.class_name}
                                    ${t.hover}
                                    cursor-pointer
                                    relative group
                                `}>

                            {/* 기본 상태의 테마 이름 - 호버시 사라짐 */}
                            <span className="group-hover:opacity-0 transition-opacity duration-300">
                                    {t.name}
                                </span>

                            {/* 호버 시 나타나는 내용 */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div
                                    className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                    <div className="text-4xl mb-1 font-bold text-white">
                                        {capitalizeSlug(t.slug)}
                                    </div>
                                    <div className="text-4xl text-white/90 font-semibold">
                                        🚀
                                    </div>
                                    <div className="text-sm text-white/70 mt-2">
                                        Let's Start
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={t.themes_id}
                            className={`
                                ${baseSize} 
                                ${baseStyle} 
                                ${t.class_name}
                                ${t.hover}
                                cursor-not-allowed
                                relative group
                            `}>

                            {/* 기본 상태의 테마 이름 - 호버시 사라짐 */}
                            <span className="group-hover:opacity-0 transition-opacity duration-300">
                                {t.name}
                            </span>

                            {/* 호버 시 나타나는 내용 */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div
                                    className="text-center transform group-hover:scale-110 transition-transform duration-300">

                                    <div className="text-4xl mb-1 font-bold text-white">
                                        {capitalizeSlug(t.slug)}
                                    </div>
                                    <div className="text-4xl text-white/90 font-semibold">
                                        🔒
                                    </div>
                                    <div className="text-sm text-white/70 mt-2">
                                        Coming Soon
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
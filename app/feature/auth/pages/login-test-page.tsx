import React from "react";
import { useLocation } from "react-router";
import { GoogleLoginButton } from "~/feature/auth/google-login-button";


export default function LoginPage() {
    const location = useLocation();

    console.log(location.pathname);


    return (
        <main className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">로그인</h1>
            <p className="text-gray-600 mb-6">Google 계정으로 로그인하세요.</p>


            <GoogleLoginButton
                returnTo={location.pathname}
                className="px-4 py-2 rounded bg-black text-white"
            >
                Google로 로그인
            </GoogleLoginButton>

        </main>
    );
}

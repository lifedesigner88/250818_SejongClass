import React from "react";
import { useNavigate } from "react-router";
export function GoogleLoginButton({
                                      returnTo,
                                      className,
                                      children,
                                  }: {
    returnTo?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    const navigate = useNavigate();

    function onClick() {
        navigate("/login");
    }

    return (
        <button type="button" onClick={() => onClick()} className={className}>
            {children ?? "Sign in with Google"}
        </button>
    );
}


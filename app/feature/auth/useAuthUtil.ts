import { useOutletContext } from "react-router";

interface AuthOutletContext {
    isLoggedIn: boolean;
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    avatarUrl: string | null;
    fullName: string | null;
    provider: string | null;
    setShowLoginDialog: (show: boolean) => void;
    setPendingUrlAfterLogin: (url: string) => void;
}

export const useAuth = () => {
    return useOutletContext<AuthOutletContext>();
};


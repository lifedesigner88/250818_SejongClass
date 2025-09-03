import { useOutletContext } from "react-router";

type Provider = 'kakao' | 'google' | 'github';

export interface publicUserDataType {
    provider: Provider | undefined
    user_id: string
    email: string
    username: string
    role: "user" | "admin"
    nickname: string | null
    profile_url: string | null
    created_at: Date | null
    updated_at: Date | null
}

interface AuthOutletContext {
    isLoggedIn: boolean;
    publicUserData: publicUserDataType
    setShowLoginDialog: (show: boolean) => void;
    setPendingUrlAfterLogin: (url: string) => void;
}

export const useAuthOutletData = () => {
    return useOutletContext<AuthOutletContext>();
};


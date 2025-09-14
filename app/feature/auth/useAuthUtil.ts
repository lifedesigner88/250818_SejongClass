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

// 내장 브라우저 감지 함수
export const isInAppBrowser = (): boolean => {
    const ua = navigator.userAgent;
    if (!ua) return false;
    // 다양한 내장 브라우저 패턴들
    const inAppBrowserPatterns = [
        // 소셜미디어 앱들
        /FBAN|FBAV/i,                    // Facebook
        /Instagram/i,                    // Instagram
        /TwitterAndroid|Twitter for iPhone/i, // Twitter
        /Line/i,                         // Line
        /KAKAOTALK/i,                   // KakaoTalk
        /whale/i,                       // Naver Whale (일부 상황)

        // 모바일 WebView들
        /wv/i,                          // Android WebView
        /Version.*Chrome.*Mobile.*Safari.*wv/i, // Android WebView 추가 패턴

        // iOS WebView 감지
        /iPhone.*AppleWebKit(?!.*Safari)/i,     // iOS WebView (Safari 엔진이지만 Safari 브라우저가 아님)
        /iPad.*AppleWebKit(?!.*Safari)/i,       // iPad WebView

        // 기타 내장 브라우저들
        /; wv\)/i,                      // Android WebView 추가 패턴
        /WebView/i,                     // 일반적인 WebView
    ];

    // User Agent 기반 검사
    return inAppBrowserPatterns.some(pattern => pattern.test(ua));
};

// 추가: 특정 앱 내 브라우저 감지 함수들
export const getInAppBrowserType = (): string | null => {
    const ua = navigator.userAgent;

    if (/KAKAOTALK/i.test(ua)) return '카톡';
    if (/FBAN|FBAV/i.test(ua)) return '페북';
    if (/Instagram/i.test(ua)) return '인스타';
    if (/TwitterAndroid|Twitter for iPhone/i.test(ua)) return '트윗';
    if (/Line/i.test(ua)) return '라인';
    if (/wv/i.test(ua)) return '웹뷰';

    return null;
};

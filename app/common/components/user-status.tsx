import React, { useState } from 'react';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { publicUserDataType } from "~/feature/auth/useAuthUtil";

type Provider = 'kakao' | 'google' | 'github';

interface UserStatusProps {
    isLoggedIn: boolean;
    isLoading?: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    provider?: Provider;
    publicUserData?: publicUserDataType | undefined;
}


export function UserStatus({
                               isLoggedIn,
                               onLoginClick,
                               onLogoutClick,
                               isLoading = false,
                               provider,
                               publicUserData
                           }: UserStatusProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLoginClick = () => {
        setIsOpen(false);
        onLoginClick();
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        onLogoutClick();
    };

    // Provider별 아이콘과 색상 정의
    const getProviderConfig = (providerType?: string) => {
        switch (providerType) {
            case 'github':
                return {
                    icon: <FaGithub className="size-6 text-white"/>,
                    bgClass: 'bg-gradient-to-br from-gray-800 to-gray-900'
                };
            case 'google':
                return {
                    icon: <FcGoogle className="size-6"/>,
                    bgClass: 'bg-gradient-to-br from-white to-gray-100 border border-gray-200'
                };
            case 'kakao':
                return {
                    icon: <RiKakaoTalkFill className="size-6 text-[#3A1D1D]"/>,
                    bgClass: 'bg-gradient-to-br from-[#FEE500] to-[#FDD000]'
                };
            default:
                return {
                    icon: <User className="size-6 text-white group-hover:scale-110 transition-transform"/>,
                    bgClass: 'bg-gradient-to-br from-gray-300 to-gray-500'
                };
        }
    };

    const providerConfig = getProviderConfig(provider);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className={`
                        size-12 rounded-full
                        cursor-pointer
                        shadow-lg
                        transition-all duration-300
                        hover:scale-110 hover:shadow-xl
                        fixed bottom-4 left-4
                        z-50
                        ${providerConfig.bgClass}
                        flex items-center justify-center
                        group
                      `}>
                    {isLoading ? (
                        <Loader2 className="size-6 text-white animate-spin"/>
                    ) : isLoggedIn && provider ? (
                        providerConfig.icon
                    ) : (
                        <User className="size-6 text-white group-hover:scale-110 transition-transform"/>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-60 ml-10 mb-3 p-0" side="top">
                <div className="p-4">
                    {isLoggedIn ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src={publicUserData?.profile_url || ""}
                                        alt={
                                            publicUserData?.nickname ||
                                            publicUserData?.username ||
                                            "user"
                                        }
                                    />
                                    <AvatarFallback>
                                        {(publicUserData?.nickname ||
                                            publicUserData?.username ||
                                            "U")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {publicUserData?.nickname ||
                                            publicUserData?.username ||
                                            publicUserData?.email?.split("@")[0]}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {publicUserData?.email && (
                                            <p className="text-xs text-gray-500 truncate">
                                                {publicUserData.email}
                                            </p>
                                        )}
                                        {publicUserData?.provider && (
                                            <div
                                                className="ml-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                                                {publicUserData.provider}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                                onClick={handleLogoutClick}
                            >
                                <LogOut className="size-4 mr-2"/>
                                로그아웃
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="size-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                                    <User className="size-4 text-white"/>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Sign In Required</p>
                                    <p className="text-xs text-gray-500">
                                        로그인이 필요합니다.
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                onClick={handleLoginClick}>
                                <LogIn className="size-4 mr-2"/>
                                로그인
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, LogIn, Loader2, UserRoundCog, LibraryBig, MessageCircleMore, Bell, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { publicUserDataType } from "~/feature/auth/useAuthUtil";
import {
    Dialog,
    DialogContent, DialogDescription, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { AlertContent } from './alert-content';

type Provider = 'kakao' | 'google' | 'github';

interface UserStatusProps {
    isLoggedIn: boolean;
    isLoading?: boolean;
    onLoginClick: () => void;
    provider?: Provider;
    publicUserData?: publicUserDataType | undefined;
}


export function UserStatus({
    isLoggedIn,
    onLoginClick,
    isLoading = false,
    provider,
    publicUserData
}: UserStatusProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const notifications = publicUserData?.notifications
    const is_notifi = (notifications?.filter(e => e.is_checked == false).length ?? 0) > 0;

    const handleLoginClick = () => {
        setIsOpen(false);
        onLoginClick();
    };


    // Provider별 아이콘과 색상 정의
    const getProviderConfig = (providerType?: string) => {
        switch (providerType) {
            case 'github':
                return {
                    icon: <FaGithub className="size-6 text-white" />,
                    bgClass: 'bg-gradient-to-br from-gray-800 to-gray-900'
                };
            case 'google':
                return {
                    icon: <FcGoogle className="size-6" />,
                    bgClass: 'bg-gradient-to-br from-white to-gray-100 border border-gray-200'
                };
            case 'kakao':
                return {
                    icon: <RiKakaoTalkFill className="size-6 text-[#3A1D1D]" />,
                    bgClass: 'bg-gradient-to-br from-[#FEE500] to-[#FDD000]'
                };
            default:
                return {
                    icon: <User className="size-6 text-white group-hover:scale-110 transition-transform" />,
                    bgClass: 'bg-gradient-to-br from-gray-300 to-gray-500'
                };
        }
    };

    const providerConfig = getProviderConfig(provider);

    const [notifiOpen, setNotifiOpen] = useState(false);

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
                        <Loader2 className="size-6 text-white animate-spin" />
                    ) : isLoggedIn && provider ? <div className={"relative"}>
                        <Avatar className="size-14">
                            <AvatarImage
                                src={publicUserData?.profile_url || ""}
                                alt={
                                    publicUserData?.nickname ||
                                    publicUserData?.username ||
                                    "user"
                                }
                            />
                            <AvatarFallback>
                                {providerConfig.icon}
                            </AvatarFallback>
                        </Avatar>
                        {is_notifi ?
                            <span className="absolute top-0.5 left-0.5 block h-3 w-3 rounded-full bg-red-600" /> : null}
                    </div> : (
                        <User className="size-6 text-white group-hover:scale-110 transition-transform" />
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-60 ml-10 mb-3 p-0" side="top">
                <div className="p-4">
                    {isLoggedIn ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-emerald-50"
                                onClick={() => {
                                    navigate(`/profile/${publicUserData?.username}`)
                                    setIsOpen(false);
                                }}>
                                <Avatar className="size-11">
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
                                        <p className="text-xs text-gray-500 truncate">
                                            @{publicUserData?.username}
                                        </p>
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
                                className="w-full justify-start text-gray-600 hover:text-green-700 hover:bg-green-100"
                                onClick={() => {
                                    navigate(`/profile/${publicUserData?.username}`)
                                    setIsOpen(false);
                                }}>
                                <UserRoundCog className="size-5 mx-2" />
                                나의정보
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-blue-700 hover:bg-blue-100 "
                                onClick={() => {
                                    navigate('/textbooks')
                                    setIsOpen(false);
                                }}
                            >
                                <LibraryBig className="size-5 mx-2" />
                                강의목록
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-yellow-700 hover:bg-yellow-100"
                                onClick={() => {
                                    window.open("https://open.kakao.com/o/sMtZzoUh", "_blank", "noopener,noreferrer");
                                    setIsOpen(false);
                                }}>
                                <MessageCircleMore className="size-5 mx-2" />
                                문의사항
                            </Button>

                            {/* 🚨🚨🚨 알림 다이얼로그  */}
                            <Dialog open={notifiOpen} onOpenChange={setNotifiOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-600 hover:text-orange-600 hover:bg-orange-100 relative">
                                        
                                        <Bell className="size-5 mx-2" />
                                        {/* 빨간 점 */}
                                        {is_notifi ? <span
                                            className="absolute top-1 left-3 block h-2 w-2 rounded-full bg-red-600" /> : null}
                                        알림확인
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="p-2 sm:p-6 min-w-[320px] max-h-screen overflow-y-auto">
                                    <DialogHeader className='hidden'>
                                        <DialogTitle>알림</DialogTitle>
                                        <DialogDescription>
                                            개발중
                                        </DialogDescription>
                                    </DialogHeader>
                                    <AlertContent
                                        notifications={notifications}
                                        setNotifiOpen={setNotifiOpen}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                                onClick={() => navigate("/logout")}>
                                <LogOut className="size-5 mx-2" />
                                로그아웃
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Button
                                className="w-full justify-start hoever:text-gray-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer"

                                onClick={handleLoginClick}>
                                <LogIn className="size-4 mr-2" />
                                로그인
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

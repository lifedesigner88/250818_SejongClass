import React, { useState } from 'react';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface UserStatusProps {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    isLoading?: boolean;  // 새로 추가
}

export function UserStatus({
                               isLoggedIn,
                               onLoginClick,
                               onLogoutClick,
                               isLoading = false,  // 기본값
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
                    ${isLoggedIn
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : isLoading
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                        : 'bg-gradient-to-br from-gray-300 to-gray-500'
                }
                    flex items-center justify-center
                    group
                `}>
                    {isLoading ? (
                        <Loader2 className="size-6 text-white animate-spin"/>
                    ) : isLoggedIn ? (
                        <div className="text-white font-bold text-lg">✓</div>
                    ) : (
                        <User className="size-6 text-white group-hover:scale-110 transition-transform"/>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-60 ml-1 mb-15 p-0" side={"right"}>
                <div className="p-4">
                    {isLoggedIn ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="size-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <div className="text-white font-bold text-sm">✓</div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Signed In</p>
                                    <p className="text-xs text-gray-500">Ready to learn!</p>
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
                                    <p className="text-xs text-gray-500">Access your learning progress</p>
                                </div>
                            </div>

                            <Button
                                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                onClick={handleLoginClick}
                            >
                                <LogIn className="size-4 mr-2"/>
                                로그인
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
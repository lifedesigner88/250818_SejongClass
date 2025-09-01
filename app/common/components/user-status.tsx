import React from 'react';
import { User, LogIn, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface UserStatusProps {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    side?: 'left' | 'right' | 'top' | 'bottom';
}

const POSITION_CLASSES = {
    'bottom-left': 'absolute bottom-4 left-4',
    'bottom-right': 'absolute bottom-4 right-4',
    'top-left': 'absolute top-4 left-4',
    'top-right': 'absolute top-4 right-4',
};

export function UserStatus({
                               isLoggedIn,
                               onLoginClick,
                               onLogoutClick,
                               position = 'bottom-left',
                               side = 'right'
                           }: UserStatusProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={`
                    ${POSITION_CLASSES[position]}
                    size-12 rounded-full
                    cursor-pointer
                    shadow-lg
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl
                    ${isLoggedIn
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'bg-gradient-to-br from-gray-300 to-gray-500'
                }
                    flex items-center justify-center
                    group
                `}>
                    {isLoggedIn ? (
                        <div className="text-white font-bold text-lg">✓</div>
                    ) : (
                        <User className="size-6 text-white group-hover:scale-110 transition-transform"/>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" side={side}>
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
                                onClick={onLogoutClick}
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
                                onClick={onLoginClick}
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
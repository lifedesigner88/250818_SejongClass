import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit3, Calendar, CheckCircle, MessageCircle, Clock, User, ChartNoAxesCombined } from 'lucide-react';
import { DateTime } from 'luxon';
import { UsernameInput } from "~/feature/users/pages/username-input";
import { useFetcher, useNavigate } from 'react-router';

interface UserProfile {
    username: string;
    profile_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    nickname: string;
}

interface MyPageProps {
    userProfile: UserProfile;
    createUserDay: Date;
    profileUpdateDay: Date;
    totalUnitCount: number;
    totalUnitSecond: number;
    totalCheckListCount: number;
    totalCommentsCount: number;
    canEdit: boolean;
}

export default function profileEdit({
                                        userProfile,
                                        createUserDay,
                                        profileUpdateDay,
                                        totalUnitCount,
                                        totalUnitSecond,
                                        totalCheckListCount,
                                        totalCommentsCount,
                                        canEdit
                                    }: MyPageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState(userProfile.username);
    const [editNickname, setEditNickname] = useState(userProfile.nickname);
    const [editProfileUrl, setEditProfileUrl] = useState(userProfile.profile_url || '');
    const MAX_NICKNAME_LENGTH = 20;
    const MIN_NICKNAME_LENGTH = 3;


    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours === 0 ? "" : `${hours}시간`} ${minutes}분`;
    };


    const formatDate = (date: Date) => {
        return DateTime.fromJSDate(date).setZone('Asia/Seoul').toFormat('yyyy년 MM월 dd일');
    };

    const fetcher = useFetcher()
    const navigate = useNavigate()
    const handleSave = () => {
        void fetcher.submit({
            beforeUserName: userProfile.username,
            nickname: editNickname,
            username: editUsername,
            profileUrl: editProfileUrl
        }, {
            method: "POST",
            action: "/api/users/update-profile",
        });
        setIsEditing(false);
        navigate(`/profile/${editUsername}`)
    };

    const handleCancel = () => {
        setEditUsername(userProfile.username);
        setEditProfileUrl(userProfile.profile_url || '');
        setIsEditing(false);
    };

    const getUserInitials = (username: string) => {
        return username.substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-gray-50/50 p-4 md:p-6">
            <div className="mx-auto space-y-6">
                {/* 프로필 헤더 */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                            <Avatar className="h-20 w-20 md:h-24 md:w-24">
                                <AvatarImage src={userProfile.profile_url || undefined} alt={userProfile.nickname}/>
                                <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                                    {getUserInitials(userProfile.username)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                                    <h1 className="ml-1 text-2xl font-bold">{userProfile.nickname}</h1>
                                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                        {canEdit && <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Edit3 className="h-4 w-4"/>
                                            </Button>
                                        </DialogTrigger>
                                        }
                                        <DialogContent className="w-full sm:max-w-md max-h-screen overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>수정</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="space-y-2 mt-3">
                                                    <Label htmlFor="nickname"
                                                           className={"text-muted-foreground"}>nickname</Label>
                                                    <div className="relative ">
                                                        <Input
                                                            id="nickname"
                                                            value={editNickname}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value.length <= MAX_NICKNAME_LENGTH) {
                                                                    setEditNickname(value);
                                                                }
                                                            }}
                                                            placeholder="닉네임을 입력하세요"
                                                            className={editNickname.length >= MAX_NICKNAME_LENGTH ? 'border-yellow-500' : ''}
                                                        />
                                                        {/* 글자 수 표시 */}
                                                        <div
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                            {editNickname.length}/{MAX_NICKNAME_LENGTH}
                                                        </div>
                                                    </div>

                                                    {/* 경고 메시지 */}
                                                    {editNickname.length > MAX_NICKNAME_LENGTH && (
                                                        <p className="text-xs text-yellow-600">
                                                            최대 {MAX_NICKNAME_LENGTH}자
                                                        </p>
                                                    )}
                                                    {editNickname.length < MIN_NICKNAME_LENGTH && (
                                                        <p className="text-xs text-yellow-600">
                                                            최소 {MIN_NICKNAME_LENGTH}자 이상
                                                        </p>
                                                    )}
                                                </div>
                                                <div className={'relative mt-8'}>
                                                    <UsernameInput
                                                        value={editUsername}
                                                        onChange={setEditUsername}
                                                    />
                                                    <div
                                                        className="absolute right-4 top-18 -translate-y-1/2 text-xs text-muted-foreground">
                                                        {editUsername.length}/{MAX_NICKNAME_LENGTH}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-4">
                                                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                                                        취소
                                                    </Button>
                                                    <Button onClick={handleSave} className="flex-1">
                                                        저장
                                                    </Button>

                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <p className="ml-1 text-muted-foreground">@{userProfile.username}</p>
                                <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                                    <Badge variant="secondary" className="gap-1">
                                        <Calendar className="h-3 w-3"/>
                                        가입일: {formatDate(createUserDay)}
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <User className="h-3 w-3"/>
                                        프로필 업데이트 : {formatDate(profileUpdateDay)}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                </Card>
                <Card className="border-0 shadow-sm min-w-[250px] min-h-[150px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활동량</CardTitle>
                        <ChartNoAxesCombined className="h-4 w-4 text-red-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center text-2xl font-bold">
                            {(totalUnitSecond + totalUnitCount * 13 + totalCheckListCount * 293 + totalCommentsCount * 101).toLocaleString('ko-KR')}
                        </div>
                    </CardContent>
                </Card>
                {/* 통계 카드들 */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">학습 시간</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="flex justify-center text-2xl font-bold">{formatDuration(totalUnitSecond)}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm min-w-[250px] min-h-[150px]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">소단원</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center text-2xl font-bold">{totalUnitCount}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">성취기준</CardTitle>
                            <CheckCircle className="h-4 w-4 text-purple-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center text-2xl font-bold">{totalCheckListCount}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">댓글</CardTitle>
                            <MessageCircle className="h-4 w-4 text-orange-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center text-2xl font-bold">{totalCommentsCount}</div>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </div>
    );
}
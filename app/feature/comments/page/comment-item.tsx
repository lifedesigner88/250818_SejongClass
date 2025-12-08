import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Heart, MoreHorizontal, Reply } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateTime } from 'luxon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFetcher, useLocation, useNavigate } from 'react-router';
import { CommnetReplyFrom } from './comment-reply-form';

import type { UnitCommentsType } from "~/feature/units/pages/unit-page";
type SubCommentsType = NonNullable<UnitCommentsType>[number];
export type SubReplyUserType = SubCommentsType["comments"][number]["user"]

interface CommentItemProps {
    comment: SubCommentsType;
    loginUserId: string;
    isAdmin: boolean;
    unitId: number;
}

export const CommentItem = ({
    comment,
    loginUserId,
    isAdmin,
    unitId
}: CommentItemProps) => {

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);


    const subCommentFetcher = useFetcher()
    const location = useLocation()

    const handleReply = () => {
        if (!replyContent.trim() || !comment.comment_id) return;
        void subCommentFetcher.submit({
            content: replyContent,
            unit_id: unitId,
            type: 'reply',
            parent_comment_id: comment.comment_id,
            mentioned_user_id: comment.user.user_id,
            to_unit_url: location.pathname
        }, {
            method: 'POST',
            action: '/api/comments/create-comment',
        })
        setReplyContent('');
        setShowReplyForm(false);
        setShowReplies(true);
    }

    const likeFetcher = useFetcher()
    const handleLike = (comment_id: number, writter_id: string) => {
        likeFetcher.submit({
            comment_id,
            writter_id,
            to_unit_url: location.pathname
        }, {
            method: 'POST',
            action: '/api/comments/like-comment',
        })
    }

    const deleteFetcher = useFetcher()
    const [deleteCommentOpen, setDeleteCommentOpen] = useState<boolean>(false);
    const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
    const deleteComment = (comment_id: number) => {
        setDeleteCommentOpen(true)
        setDeleteCommentId(comment_id)
    }
    const realDeleteComment = () => {
        void deleteFetcher.submit({
            comment_id: deleteCommentId,
            type: isAdmin
        }, {
            method: 'POST',
            action: '/api/comments/delete-comment',
        })
        setDeleteCommentId(null)
        setDeleteCommentOpen(false)
    }

    const isLikeidle = likeFetcher.state === 'idle'
    const likefetcherId = likeFetcher.formData?.get('comment_id')

    const navigate = useNavigate();
    const [showReplyReplyForm, setShowReplyReplyForm] = useState<Set<number>>(new Set());

    return (
        <Card className="w-full">
            <AlertDialog open={deleteCommentOpen} onOpenChange={setDeleteCommentOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={realDeleteComment}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardContent className="p-4">
                {/* 메인 댓글 */}
                <div className="flex space-x-3">
                    <Avatar className="size-9 sm:size-11 cursor-pointer"
                        onClick={() => navigate(`/profile/${comment.user.username}`)}>
                        <AvatarImage src={comment.user.profile_url || ""} />
                        <AvatarFallback>
                            {comment.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">

                        <div className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => navigate(`/profile/${comment.user.username}`)}>
                            <span className="font-medium text-sm text-muted-foreground">{comment.user.nickname}</span>
                            <span className="text-xs text-muted-foreground">
                                {DateTime.fromJSDate(comment.updated_at!).setLocale("ko").toRelative()}
                            </span>
                        </div>

                        <div className={"text-xs text-muted-foreground/50 mb-3"}>@{comment.user.username}</div>

                        <p className="text-sm leading-relaxed whitespace-pre-line">{comment.content}</p>

                        <div className="flex items-center space-x-4">
                            <div>
                                {/* ❤️ 좋아요 버튼 */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 text-xs disabled:opacity-100`}
                                    onClick={() => handleLike(comment.comment_id, comment.user.user_id)}
                                    disabled={!isLikeidle}
                                >
                                    <Heart
                                        className={`size-4 mr-1 ${comment.likes.length > 0
                                            ? !isLikeidle && comment.comment_id === Number(likefetcherId)
                                                ? ''
                                                : 'fill-red-500 text-red-500'
                                            : !isLikeidle && Number(likefetcherId) === comment.comment_id
                                                ? 'fill-red-500 text-red-500'
                                                : ''
                                            }`}
                                    />
                                    {
                                        comment.likes.length > 0
                                            ? !isLikeidle && comment.comment_id === Number(likefetcherId)
                                                ? comment.likes_count - 1
                                                : comment.likes_count
                                            : !isLikeidle && Number(likefetcherId) === comment.comment_id
                                                ? comment.likes_count + 1
                                                : comment.likes_count
                                    }
                                </Button>

                                {/* ✅ 답글 버튼 */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                >
                                    <Reply className="w-3 h-3 mr-1" />
                                    답글
                                </Button>

                                {comment.comments && comment.comments.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-xs"
                                        onClick={() => setShowReplies(!showReplies)}
                                    >
                                        <MessageCircle className={`size-4 mr-1 fill-emerald-500 text-emerald-500`} />
                                        답글 {comment.comments.length}개 {showReplies ? '닫기' : '보기'}
                                    </Button>
                                )}

                                <DropdownMenu>

                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 px-2">
                                            <MoreHorizontal className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        {(comment.user.user_id === loginUserId && comment.comments.length === 0) || isAdmin ? <>
                                            <DropdownMenuItem className={"flex justify-center"}
                                                onClick={() => deleteComment(comment.comment_id)}>
                                                삭제
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className={"flex justify-center"}
                                                onClick={() => deleteComment(comment.comment_id)}>
                                                수정
                                            </DropdownMenuItem>
                                        </>
                                            : null
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 답글 작성 폼 */}
                {showReplyForm && (
                    <div className="mt-4 ml-11">
                        <div className="space-y-2">
                            <Textarea
                                placeholder={`to ${comment.user.nickname}(${comment.user.username})`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[80px] text-sm"
                            />
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent('');
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleReply}
                                    disabled={!replyContent.trim()}
                                >
                                    답글 작성
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🔗🔗🔗🔗🔗🔗 답글 목록 🔗🔗🔗🔗🔗🔗*/}
                {showReplies && comment.comments && comment.comments.length > 0 && (
                    <div className="mt-4 pl-11 space-y-4 bg-emerald-50 rounded-lg">
                        <Separator />
                        {comment.comments.map((reply) => {
                            return (
                                <div key={reply.comment_id} className="flex space-x-3">

                                    <Avatar className="size-9 sm:size-11 cursor-pointer"
                                        onClick={() => navigate(`/profile/${reply.user.username}`)}>
                                        <AvatarImage src={reply.user.profile_url || ""} />
                                        <AvatarFallback className="text-xs">
                                            {reply.user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 cursor-pointer"
                                            onClick={() => navigate(`/profile/${reply.user.username}`)}>
                                            <span
                                                className="font-medium text-xs text-muted-foreground">{reply.user.nickname}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {DateTime.fromJSDate(reply.updated_at!).setLocale("ko").toRelative()}
                                            </span>
                                        </div>
                                        <div
                                            className={"text-xs text-muted-foreground/50 mb-3"}>@{reply.user.username}</div>

                                        <p className="text-xs leading-relaxed whitespace-pre-line">
                                            {reply.mention ?
                                                <span
                                                    onClick={() => navigate(`/profile/${reply.mention?.username}`)}
                                                    className="inline-flex items-center rounded-md bg-sky-100 px-1.5 py-0.5 mr-1 
                                                cursor-pointer text-xs font-medium text-sky-700">
                                                    @{reply.mention?.username}
                                                </span> : null}
                                            {reply.content}

                                        </p>

                                        <div className="flex items-center space-x-3">
                                            {/* ❤️ 좋아요 버튼 */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 px-2 text-xs disabled:opacity-100`}
                                                onClick={() => handleLike(reply.comment_id, reply.user.user_id)}
                                                disabled={!isLikeidle}
                                            >
                                                <Heart
                                                    className={`size-4 mr-1 ${reply.likes.length > 0
                                                        ? !isLikeidle && reply.comment_id === Number(likefetcherId)
                                                            ? ''
                                                            : 'fill-red-500 text-red-500'
                                                        : !isLikeidle && Number(likefetcherId) === reply.comment_id
                                                            ? 'fill-red-500 text-red-500'
                                                            : ''
                                                        }`}
                                                />
                                                {
                                                    reply.likes.length > 0
                                                        ? !isLikeidle && reply.comment_id === Number(likefetcherId)
                                                            ? reply.likes_count - 1
                                                            : reply.likes_count
                                                        : !isLikeidle && Number(likefetcherId) === reply.comment_id
                                                            ? reply.likes_count + 1
                                                            : reply.likes_count
                                                }
                                            </Button>

                                            {/* ✅ 답글 버튼 */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-xs hover:bg-emerald-200"
                                                onClick={() => setShowReplyReplyForm(prev => {
                                                    const newSet = new Set(prev)
                                                    if (newSet.has(reply.comment_id))
                                                        newSet.delete(reply.comment_id)
                                                    else
                                                        newSet.add(reply.comment_id)
                                                    return newSet
                                                })}
                                            >
                                                <Reply className="w-3 h-3 mr-1" />
                                                답글
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {reply.user.user_id === loginUserId || isAdmin
                                                        ? <DropdownMenuItem
                                                            className={"flex justify-center"}
                                                            onClick={() => deleteComment(reply.comment_id)}>
                                                            삭제
                                                        </DropdownMenuItem>
                                                        : null
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </div>
                                        {showReplyReplyForm.has(reply.comment_id) ?
                                            <CommnetReplyFrom
                                                comment_id={comment.comment_id}
                                                reply_userinfo={reply.user}
                                                unit_id={unitId}
                                                reply_id={reply.comment_id}
                                                setShowReplyReplyForm={setShowReplyReplyForm}
                                            />
                                            : null}
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
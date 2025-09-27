import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Heart, MoreHorizontal, Reply } from 'lucide-react';
import type { UnitCommentsType } from "~/feature/units/pages/unit-page";
import { DateTime } from 'luxon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '#app/common/components/ui/dropdown-menu.js';
import { useNavigate, type FetcherWithComponents } from 'react-router';

type SubCommentsType = NonNullable<UnitCommentsType>[number];

interface CommentItemProps {
    comment: SubCommentsType;
    onReply: (commentId: number, content: string) => void;
    onLike: (commentId: number) => void;
    deleteComment: (commentId: number) => void;
    loginUserId: string;
    likeFetcher: FetcherWithComponents<any>
}

const CommentItem = ({
                         comment,
                         onReply,
                         onLike,
                         deleteComment,
                         loginUserId,
                         likeFetcher
                     }: CommentItemProps) => {

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = () => {
        if (replyContent.trim()) {
            onReply(comment.comment_id, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
            setShowReplies(true);
        }
    };


    const isLikeidle = likeFetcher.state === 'idle'
    const likefetcherId = likeFetcher.formData?.get('comment_id')

    const navigate = useNavigate();

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                {/* 메인 댓글 */}
                <div className="flex space-x-3">
                    <Avatar className="size-9 sm:size-11 cursor-pointer"
                            onClick={() => navigate(`/profile/${comment.user.username}`)}>
                        <AvatarImage src={comment.user.profile_url || ""}/>
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

                        <p className="text-sm leading-relaxed">{comment.content}</p>

                        <div className="flex items-center space-x-4">
                            <div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 text-xs disabled:opacity-100`}
                                    onClick={() => onLike(comment.comment_id)}
                                    disabled={!isLikeidle}
                                >
                                    <Heart
                                        className={`size-4 mr-1 ${
                                            comment.likes.length > 0
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

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                >
                                    <Reply className="w-3 h-3 mr-1"/>
                                    답글
                                </Button>

                                {comment.comments && comment.comments.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-xs"
                                        onClick={() => setShowReplies(!showReplies)}
                                    >
                                        <MessageCircle className={`size-4 mr-1 fill-emerald-500 text-emerald-500`}/>
                                        답글 {comment.comments.length}개 {showReplies ? '닫기' : '보기'}
                                    </Button>
                                )}

                                <DropdownMenu>
                                    {
                                        comment.user.user_id === loginUserId && comment.comments.length === 0 ?
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                                    <MoreHorizontal className="w-3 h-3"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            : null
                                    }
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className={"flex justify-center"}
                                                          onClick={() => deleteComment(comment.comment_id)}>삭제</DropdownMenuItem>
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
                                placeholder="답글을 작성하세요..."
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
                                    onClick={handleReplySubmit}
                                    disabled={!replyContent.trim()}
                                >
                                    답글 작성
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 답글 목록 */}
                {showReplies && comment.comments && comment.comments.length > 0 && (
                    <div className="mt-4 pl-11 space-y-4 bg-emerald-50 rounded-lg">
                        <Separator/>
                        {comment.comments.map((reply) => (
                            <div key={reply.comment_id} className="flex space-x-3">

                                <Avatar className="size-9 sm:size-11 cursor-pointer"
                                        onClick={() => navigate(`/profile/${reply.user.username}`)}>
                                    <AvatarImage src={reply.user.profile_url || ""}/>
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

                                    <p className="text-xs leading-relaxed">{reply.content}</p>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-8 px-2 text-xs disabled:opacity-100`}
                                            onClick={() => onLike(reply.comment_id)}
                                            disabled={!isLikeidle}
                                        >
                                            <Heart
                                                className={`size-4 mr-1 ${
                                                    reply.likes.length > 0
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

                                        <DropdownMenu>
                                            {reply.user.user_id === loginUserId ?
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                                        <MoreHorizontal className="w-3 h-3"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                : null
                                            }
                                            <DropdownMenuContent>
                                                <DropdownMenuItem className={"flex justify-center"}
                                                                  onClick={() => deleteComment(reply.comment_id)}>삭제</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface CommentsSectionProps {
    comments: UnitCommentsType;
    onNewComment: (content: string) => void;
    onReply: (commentId: number, content: string) => void;
    onLike: (commentId: number) => void;
    deleteComment: (commentId: number) => void;
    loginUserId: string
    likeFetcher: FetcherWithComponents<any>
}

const CommentsSection = ({
                             comments,
                             onNewComment,
                             onReply,
                             onLike,
                             deleteComment,
                             loginUserId,
                             likeFetcher
                         }: CommentsSectionProps) => {
    const [newComment, setNewComment] = useState('');

    const handleNewCommentSubmit = () => {
        if (newComment.trim()) {
            onNewComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* 새 댓글 작성 */}
            <Card className={"bg-emerald-50 text-emerald-700"}>
                <CardContent className="p-4 ">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">댓글 {comments.length}개</h3>
                        <div className="space-y-3">
                            <Textarea
                                placeholder="댓글을 작성하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleNewCommentSubmit}
                                    disabled={!newComment.trim()}
                                >
                                    댓글 작성
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 댓글 목록 */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.comment_id}
                        comment={comment}
                        onReply={onReply}
                        onLike={onLike}
                        deleteComment={deleteComment}
                        loginUserId={loginUserId}
                        likeFetcher={likeFetcher}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
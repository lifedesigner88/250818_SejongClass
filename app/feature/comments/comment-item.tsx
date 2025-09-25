import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Heart, MoreHorizontal, Reply } from 'lucide-react';
import type { UnitCommentsType } from "~/feature/units/pages/unit-page";
import { DateTime } from 'luxon';
type SubCommentsType = NonNullable<UnitCommentsType>[number];

interface CommentItemProps {
    comment: SubCommentsType;
    onReply: (commentId: number, content: string) => void;
    onLike: (commentId: number) => void;
}

const CommentItem = ({
                         comment,
                         onReply,
                         onLike,
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

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                {/* 메인 댓글 */}
                <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.user.profile_url || ""}/>
                        <AvatarFallback>
                            {comment.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{comment.user.username}</span>
                            <span className="text-xs text-muted-foreground">
                            {DateTime.fromJSDate(comment.updated_at!).setLocale("ko").toRelative()}
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed">{comment.content}</p>

                        {/* 액션 버튼들 */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => onLike(comment.comment_id)}
                            >
                                <Heart
                                    className={`w-3 h-3 mr-1 ${
                                        comment.likes.length > 0 ? 'fill-red-500 text-red-500' : ''
                                    }`}
                                />
                                {comment.likes_count > 0 && comment.likes_count}
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
                                    <MessageCircle className="w-3 h-3 mr-1"/>
                                    답글 {comment.comments.length}개 {showReplies ? '숨기기' : '보기'}
                                </Button>
                            )}

                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                <MoreHorizontal className="w-3 h-3"/>
                            </Button>
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
                    <div className="mt-4 ml-11 space-y-4">
                        <Separator/>
                        {comment.comments.map((reply) => (
                            <div key={reply.comment_id} className="flex space-x-3">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={reply.user.profile_url || ""}/>
                                    <AvatarFallback className="text-xs">
                                        {reply.user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-xs">{reply.user.username}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {DateTime.fromJSDate(reply.updated_at!).setLocale("ko").toRelative()}
                                        </span>
                                    </div>

                                    <p className="text-xs leading-relaxed">{reply.content}</p>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onLike(reply.comment_id)}
                                        >
                                            <Heart
                                                className={`w-3 h-3 mr-1 ${
                                                    reply.likes.length > 0 ? 'fill-red-500 text-red-500' : ''
                                                }`}
                                            />
                                            {reply.likes_count > 0 && reply.likes_count}
                                        </Button>

                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                            <MoreHorizontal className="w-3 h-3"/>
                                        </Button>
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
}

const CommentsSection = ({
                             comments,
                             onNewComment,
                             onReply,
                             onLike,
                         }: CommentsSectionProps) => {
    const [newComment, setNewComment] = useState('');

    const handleNewCommentSubmit = () => {
        if (newComment.trim()) {
            onNewComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="w-full mx-auto space-y-6">
            {/* 새 댓글 작성 */}
            <Card>
                <CardContent className="p-4">
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
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
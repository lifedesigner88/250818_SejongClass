import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Heart, MoreHorizontal, Reply } from 'lucide-react';

interface Comment {
    id: string;
    author: {
        name: string;
        avatar?: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
    replies?: Reply[];
}

interface Reply {
    id: string;
    author: {
        name: string;
        avatar?: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
}

interface CommentItemProps {
    comment: Comment;
    onReply: (commentId: string, content: string) => void;
    onLike: (commentId: string) => void;
    onReplyLike: (commentId: string, replyId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     onReply,
                                                     onLike,
                                                     onReplyLike,
                                                 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = () => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
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
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                            {comment.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                {comment.timestamp}
              </span>
                        </div>

                        <p className="text-sm leading-relaxed">{comment.content}</p>

                        {/* 액션 버튼들 */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => onLike(comment.id)}
                            >
                                <Heart
                                    className={`w-3 h-3 mr-1 ${
                                        comment.isLiked ? 'fill-red-500 text-red-500' : ''
                                    }`}
                                />
                                {comment.likes > 0 && comment.likes}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <Reply className="w-3 h-3 mr-1" />
                                답글
                            </Button>

                            {comment.replies && comment.replies.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => setShowReplies(!showReplies)}
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    답글 {comment.replies.length}개 {showReplies ? '숨기기' : '보기'}
                                </Button>
                            )}

                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                <MoreHorizontal className="w-3 h-3" />
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
                {showReplies && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-11 space-y-4">
                        <Separator />
                        {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={reply.author.avatar} />
                                    <AvatarFallback className="text-xs">
                                        {reply.author.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-xs">{reply.author.name}</span>
                                        <span className="text-xs text-muted-foreground">
                      {reply.timestamp}
                    </span>
                                    </div>

                                    <p className="text-xs leading-relaxed">{reply.content}</p>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onReplyLike(comment.id, reply.id)}
                                        >
                                            <Heart
                                                className={`w-3 h-3 mr-1 ${
                                                    reply.isLiked ? 'fill-red-500 text-red-500' : ''
                                                }`}
                                            />
                                            {reply.likes > 0 && reply.likes}
                                        </Button>

                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                            <MoreHorizontal className="w-3 h-3" />
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
    comments: Comment[];
    onNewComment: (content: string) => void;
    onReply: (commentId: string, content: string) => void;
    onLike: (commentId: string) => void;
    onReplyLike: (commentId: string, replyId: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
                                                             comments,
                                                             onNewComment,
                                                             onReply,
                                                             onLike,
                                                             onReplyLike,
                                                         }) => {
    const [newComment, setNewComment] = useState('');

    const handleNewCommentSubmit = () => {
        if (newComment.trim()) {
            onNewComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* 새 댓글 작성 */}
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-4">
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
                        key={comment.id}
                        comment={comment}
                        onReply={onReply}
                        onLike={onLike}
                        onReplyLike={onReplyLike}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
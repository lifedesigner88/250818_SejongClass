import React, { useState } from 'react';
import CommentsSection from "~/feature/comments/comment-item";

// 타입 정의 추가
interface Author {
    name: string;
    avatar?: string;
}

interface Reply {
    id: string;
    author: Author;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
}

interface Comment {
    id: string;
    author: Author;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
    replies: Reply[];
}

// 예시 데이터
const initialComments: Comment[] = [
    {
        id: '1',
        author: {
            name: '김철수',
            avatar: '/avatar1.jpg',
        },
        content: '정말 유용한 정보네요! 감사합니다.',
        timestamp: '2시간 전',
        likes: 5,
        isLiked: false,
        replies: [
            {
                id: '1-1',
                author: {
                    name: '이영희',
                },
                content: '저도 같은 생각이에요.',
                timestamp: '1시간 전',
                likes: 2,
                isLiked: true,
            },
        ],
    },
    {
        id: '2',
        author: {
            name: '박민수',
        },
        content: '혹시 더 자세한 설명이 있을까요?',
        timestamp: '30분 전',
        likes: 1,
        isLiked: true,
        replies: [],
    },
];

const ExamplePage = () => {
    const [comments, setComments] = useState<Comment[]>(initialComments);

    const handleNewComment = (content: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            author: {
                name: '현재 사용자',
                avatar: '/current-user-avatar.jpg',
            },
            content,
            timestamp: '방금 전',
            likes: 0,
            isLiked: false,
            replies: [],
        };
        setComments([newComment, ...comments]);
    };

    const handleReply = (commentId: string, content: string) => {
        const newReply: Reply = {
            id: `${commentId}-${Date.now()}`,
            author: {
                name: '현재 사용자',
                avatar: '/current-user-avatar.jpg',
            },
            content,
            timestamp: '방금 전',
            likes: 0,
            isLiked: false,
        };

        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, replies: [...comment.replies, newReply] }
                    : comment
            )
        );
    };

    const handleLike = (commentId: string) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    }
                    : comment
            )
        );
    };

    const handleReplyLike = (commentId: string, replyId: string) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply.id === replyId
                                ? {
                                    ...reply,
                                    isLiked: !reply.isLiked,
                                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                                }
                                : reply
                        ),
                    }
                    : comment
            )
        );
    };

    return (
        <div className="container mx-auto py-8">
            <CommentsSection
                comments={comments}
                onNewComment={handleNewComment}
                onReply={handleReply}
                onLike={handleLike}
                onReplyLike={handleReplyLike}
            />
        </div>
    );
};

export default ExamplePage;
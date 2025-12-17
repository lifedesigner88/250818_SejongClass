import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { UnitCommentsType } from "~/feature/units/pages/unit-page";
import { useFetcher } from 'react-router';
import { CommentItem } from './comment-item';
interface CommentsSectionProps {
    comments: UnitCommentsType;
    loginUserId: string
    isAdmin: boolean
    unitId: number
}

const CommentsSection = ({
    comments,
    loginUserId,
    isAdmin,
    unitId
}: CommentsSectionProps) => {
    const [newComment, setNewComment] = useState('');

    const commentFetcher = useFetcher()

    const handleNewComment = () => {
        if (newComment.trim()) {
            void commentFetcher.submit({
                content: newComment,
                unit_id: unitId,
                type: 'comment',
                isAdmin
            }, {
                method: 'POST',
                action: '/api/comments/create-comment',
            })
            setNewComment('');
        }
    }

    return (
        <div className="w-full space-y-6">
            {/* 새 댓글 작성 */}
            <Card className={"bg-emerald-50 text-emerald-700"}>
                <CardContent className="p-4 ">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">댓글 {comments.length}개</h3>
                        <div className="space-y-3">
                            <Textarea
                                id={`${unitId}-text`}
                                placeholder="댓글을 작성하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleNewComment}
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
                        loginUserId={loginUserId}
                        isAdmin={isAdmin}
                        unitId={unitId}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
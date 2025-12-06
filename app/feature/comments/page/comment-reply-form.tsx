
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useFetcher } from 'react-router';
import type { SubReplyUserType } from './comment-item';


interface CommnetReplyFromProps {
    comment_id: number,
    unit_id: number,
    reply_id: number,
    reply_userinfo: SubReplyUserType,
    setShowReplyReplyForm: React.Dispatch<React.SetStateAction<Set<number>>>
}

export const CommnetReplyFrom = ({ comment_id, unit_id, reply_id, reply_userinfo, setShowReplyReplyForm }: CommnetReplyFromProps) => {

    const [replyReplyContent, setReplyReplyContent] = useState('');

    const subCommentFetcher = useFetcher()
    const reset = () => {
        setReplyReplyContent('')
        setShowReplyReplyForm(prev => {
            const newSet = new Set(prev)
            if (newSet.has(reply_id))
                newSet.delete(reply_id)
            else
                newSet.add(reply_id)
            return newSet
        })
    }
    
    const handleReplyReply = () => {
        if (!replyReplyContent.trim() || !comment_id) return;
        void subCommentFetcher.submit({
            content: replyReplyContent,
            unit_id,
            type: 'reply',
            parent_comment_id: comment_id,
            mentioned_user_id: reply_userinfo.user_id
        }, {
            method: 'POST',
            action: '/api/comments/create-comment',
        })
        reset()
    }

    return (
        <div className="mt-3 pb-4 pr-3">
            <div className="space-y-2">
                <Textarea
                    placeholder={`to ${reply_userinfo?.nickname}(${reply_userinfo?.username})`}
                    value={replyReplyContent}
                    onChange={(e) => setReplyReplyContent(e.target.value)}
                    className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={reset}
                    >
                        취소
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleReplyReply}
                        disabled={!replyReplyContent.trim()}
                    >
                        답글 작성
                    </Button>
                </div>
            </div>
        </div>
    )
}


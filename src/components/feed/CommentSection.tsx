import { useState, useEffect, useRef, useCallback } from 'react';
import { getComments, createComment } from '@/api/feed';
import type { CommentResponse } from '@/api/types';
import { useAuthStore } from '@/store/authStore';
import CommentItem from './CommentItem';

/* ---------- Props ---------- */

interface CommentSectionProps {
  feedId: number;
}

/* ---------- Component ---------- */

export default function CommentSection({ feedId }: CommentSectionProps) {
  const currentUserId = useAuthStore((s) => s.user?.userId);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fetchedRef = useRef<number | null>(null);

  // 댓글 목록 로드
  useEffect(() => {
    if (fetchedRef.current === feedId) return;
    fetchedRef.current = feedId;

    setLoading(true);
    getComments(feedId)
      .then((res) => setComments(res.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [feedId]);

  // 대댓글 추가 콜백
  const handleReplyAdded = useCallback((parentId: number, reply: CommentResponse) => {
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === parentId
          ? { ...c, replies: [...c.replies, reply] }
          : c,
      ),
    );
  }, []);

  // 새 댓글 작성
  const handleSubmit = async () => {
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const created = await createComment(feedId, { content: newText });
      setComments((prev) => [...prev, created]);
      setNewText('');
    } catch {
      /* 무시 */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-stroke pt-4">
      <h3 className="mb-3 text-sm font-semibold text-high-emphasis">댓글</h3>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-stroke border-t-accent" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-2 text-sm text-low-emphasis">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.commentId}
              comment={c}
              feedId={feedId}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}

      {/* 새 댓글 입력 */}
      {currentUserId && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 rounded-control bg-input px-3 py-2 text-sm text-high-emphasis placeholder:text-low-emphasis focus:outline-none focus:ring-1 focus:ring-accent"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-control bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            게시
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { toggleCommentLike, createComment } from '@/api/feed';
import type { CommentResponse } from '@/api/types';
import { useAuthStore } from '@/store/authStore';

/* ---------- Icons ---------- */

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ---------- Props ---------- */

interface CommentItemProps {
  comment: CommentResponse;
  feedId: number;
  depth?: number;
  onReplyAdded: (parentId: number, reply: CommentResponse) => void;
}

/* ---------- Component ---------- */

export default function CommentItem({ comment, feedId, depth = 0, onReplyAdded }: CommentItemProps) {
  const currentUserId = useAuthStore((s) => s.user?.userId);

  const [liked, setLiked] = useState(comment.isLikedByMe);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleToggleLike = async () => {
    const prev = liked;
    setLiked(!liked);
    setLikeCount((c) => c + (liked ? -1 : 1));
    try {
      await toggleCommentLike(comment.commentId);
    } catch {
      setLiked(prev);
      setLikeCount((c) => c + (prev ? 1 : -1));
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const reply = await createComment(feedId, {
        content: replyText,
        parentCommentId: comment.commentId,
      });
      onReplyAdded(reply.parentCommentId ?? comment.commentId, reply);
      setReplyText('');
      setShowReplyInput(false);
    } catch {
      /* 무시 */
    } finally {
      setSubmitting(false);
    }
  };

  const timeLabel = formatTime(comment.createdAt);

  return (
    <div className={depth > 0 ? 'ml-8 mt-2' : ''}>
      <div className="flex gap-2">
        {/* 프로필 이미지 */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface">
          {comment.profileImageUrl ? (
            <img
              src={comment.profileImageUrl}
              alt={comment.nickname}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-caption">{comment.nickname.charAt(0)}</span>
          )}
        </div>

        {/* 내용 */}
        <div className="min-w-0 flex-1">
          <div className="text-sm">
            <span className="font-medium text-high-emphasis">{comment.nickname}</span>{' '}
            <span className="text-high-emphasis">{comment.content}</span>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-1 flex items-center gap-3 text-xs text-low-emphasis">
            <span>{timeLabel}</span>

            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-0.5 transition-colors ${liked ? 'text-red-500' : 'hover:text-high-emphasis'}`}
            >
              <HeartIcon filled={liked} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {currentUserId && (
              <button
                onClick={() => {
                  const opening = !showReplyInput;
                  setShowReplyInput(opening);
                  if (opening && comment.userId !== currentUserId) {
                    setReplyText(`@${comment.nickname} `);
                  }
                }}
                className="transition-colors hover:text-high-emphasis"
              >
                답글
              </button>
            )}
          </div>

          {/* 답글 입력 */}
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="flex-1 rounded-control bg-input px-2.5 py-1.5 text-xs text-high-emphasis placeholder:text-low-emphasis focus:outline-none focus:ring-1 focus:ring-accent"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                autoFocus
              />
              <button
                onClick={handleSubmitReply}
                disabled={submitting}
                className="rounded-control bg-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                게시
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 렌더링 */}
      {comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              feedId={feedId}
              depth={1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helper ---------- */

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(isoString).toLocaleDateString('ko-KR');
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleCommentLike, createComment, updateComment, deleteComment } from '@/api/feed';
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

function MoreIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

/* ---------- Props ---------- */

interface CommentItemProps {
  comment: CommentResponse;
  feedId: number;
  depth?: number;
  onReplyAdded: (parentId: number, reply: CommentResponse) => void;
  onCommentUpdated: (commentId: number, newContent: string) => void;
  onCommentDeleted: (commentId: number, parentId: number | null) => void;
}

/* ---------- Component ---------- */

export default function CommentItem({ comment, feedId, depth = 0, onReplyAdded, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const isOwner = currentUserId === comment.userId;

  const [liked, setLiked] = useState(comment.isLikedByMe);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 더보기 메뉴
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 수정 모드
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // 삭제 확인
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

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

  const handleEdit = async () => {
    if (!editText.trim() || editSubmitting) return;
    setEditSubmitting(true);
    try {
      await updateComment(comment.commentId, { content: editText });
      onCommentUpdated(comment.commentId, editText);
      setEditing(false);
    } catch {
      /* 무시 */
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteComment(comment.commentId);
      onCommentDeleted(comment.commentId, comment.parentCommentId);
      setShowDeleteConfirm(false);
    } catch {
      /* 무시 */
    } finally {
      setDeleting(false);
    }
  };

  const timeLabel = formatTime(comment.createdAt, t, i18n.language);

  return (
    <div className={depth > 0 ? 'ml-8 mt-2' : ''}>
      <div className="flex gap-2">
        {/* 프로필 이미지 */}
        <div
          className="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-surface"
          onClick={() => navigate(`/feed?userId=${comment.userId}`)}
        >
          <span className="text-xs text-caption">{comment.nickname.charAt(0)}</span>
          {comment.profileImageUrl && (
            <img
              src={comment.profileImageUrl}
              alt={comment.nickname}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>

        {/* 내용 */}
        <div className="min-w-0 flex-1">
          {editing ? (
            /* 인라인 수정 모드 */
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 rounded-control bg-input px-2.5 py-1.5 text-sm text-high-emphasis focus:outline-none focus:ring-1 focus:ring-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEdit();
                  if (e.key === 'Escape') { setEditing(false); setEditText(comment.content); }
                }}
                autoFocus
              />
              <button
                onClick={handleEdit}
                disabled={editSubmitting}
                className="rounded-control bg-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {t('common.save')}
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.content); }}
                className="rounded-control px-3 py-1.5 text-xs font-medium text-caption transition-colors hover:text-high-emphasis"
              >
                {t('common.cancel')}
              </button>
            </div>
          ) : (
            /* 일반 표시 모드 */
            <div className="flex items-start justify-between gap-1">
              <div className="text-sm">
                <span
                  className="cursor-pointer font-medium text-high-emphasis hover:underline"
                  onClick={() => navigate(`/feed?userId=${comment.userId}`)}
                >{comment.nickname}</span>{' '}
                <span className="text-high-emphasis">{comment.content}</span>
              </div>

              {/* 더보기 메뉴 (본인 댓글만) */}
              {isOwner && (
                <div ref={menuRef} className="relative shrink-0">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="rounded p-0.5 text-low-emphasis transition-colors hover:text-high-emphasis"
                  >
                    <MoreIcon />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-24 rounded-lg bg-white py-1 shadow-lg ring-1 ring-stroke">
                      <button
                        onClick={() => { setEditing(true); setShowMenu(false); }}
                        className="w-full px-3 py-1.5 text-left text-xs text-high-emphasis transition-colors hover:bg-input"
                      >
                        {t('comment.edit')}
                      </button>
                      <button
                        onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                        className="w-full px-3 py-1.5 text-left text-xs text-red-500 transition-colors hover:bg-input"
                      >
                        {t('comment.delete')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                {t('comment.reply')}
              </button>
            )}
          </div>

          {/* 삭제 확인 */}
          {showDeleteConfirm && (
            <div className="mt-2 flex items-center gap-2 rounded-control bg-red-50 px-3 py-2">
              <span className="flex-1 text-xs text-red-600">{t('comment.deleteConfirm')}</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-control bg-red-500 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {t('comment.delete')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-control px-3 py-1 text-xs font-medium text-caption transition-colors hover:text-high-emphasis"
              >
                {t('common.cancel')}
              </button>
            </div>
          )}

          {/* 답글 입력 */}
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('comment.replyPlaceholder')}
                className="flex-1 rounded-control bg-input px-2.5 py-1.5 text-xs text-high-emphasis placeholder:text-low-emphasis focus:outline-none focus:ring-1 focus:ring-accent"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                autoFocus
              />
              <button
                onClick={handleSubmitReply}
                disabled={submitting}
                className="rounded-control bg-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {t('comment.post')}
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
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helper ---------- */

function formatTime(isoString: string, t: (key: string) => string, lang: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t('comment.justNow');
  if (minutes < 60) return `${minutes}${t('comment.minutesAgo')}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${t('comment.hoursAgo')}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}${t('comment.daysAgo')}`;
  return new Date(isoString).toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US');
}

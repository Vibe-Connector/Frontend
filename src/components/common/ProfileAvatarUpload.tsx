import { useRef, useState } from 'react';
import { uploadProfileImage } from '@/api/user';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface ProfileAvatarUploadProps {
  currentImageUrl: string | null;
  displayName: string;
  onUpload: (newUrl: string) => void;
}

export default function ProfileAvatarUpload({
  currentImageUrl,
  displayName,
  onUpload,
}: ProfileAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset input so the same file can be re-selected
    e.target.value = '';

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP만 가능합니다.');
      return;
    }

    if (file.size > MAX_SIZE) {
      alert('파일 크기가 5MB를 초과합니다.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadProfileImage(file);
      onUpload(res.profileImageUrl);
    } catch {
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full bg-disabled"
      onClick={handleClick}
    >
      {currentImageUrl && (
        <img
          src={currentImageUrl}
          alt={displayName}
          className="h-full w-full object-cover"
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {uploading ? (
          <svg
            className="h-5 w-5 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
      </div>

      {/* Uploading: always show overlay */}
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <svg
            className="h-5 w-5 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

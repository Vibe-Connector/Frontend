import { useEffect, type ReactNode } from "react";

export interface AlertProps {
  open: boolean;
  onClose: () => void;
  /** 왼쪽 아이콘 (이모지 문자열 또는 ReactNode) */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** "Learn More" 등 링크 텍스트 */
  linkText?: string;
  onLinkClick?: () => void;
  /** 자동 닫힘 시간 (ms). 0이면 자동 닫힘 없음 (기본: 4000) */
  duration?: number;
  /** 표시 위치 (기본: "bottom-center") */
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
}

const positionClasses: Record<NonNullable<AlertProps["position"]>, string> = {
  "top-center": "top-6 left-1/2 -translate-x-1/2",
  "top-right": "top-6 right-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-6 right-6",
};

function Alert({
  open,
  onClose,
  icon,
  title,
  description,
  linkText,
  onLinkClick,
  duration = 4000,
  position = "bottom-center",
}: AlertProps) {
  useEffect(() => {
    if (!open || duration === 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      role="alert"
      className={`fixed z-50 ${positionClasses[position]} animate-fade-in font-pretendard`}
    >
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-card bg-white p-6 shadow-card">
        {/* Close button */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-low-emphasis transition-colors hover:bg-input hover:text-high-emphasis"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708Z" />
          </svg>
        </button>

        <div className="flex gap-4 pr-6">
          {/* Icon */}
          {icon && (
            <div className="shrink-0">
              {typeof icon === "string" ? (
                <span className="text-[40px] leading-none">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Title — Modal과 동일한 Headline2 스타일 */}
            <h3 className="text-[18px] font-bold leading-auto tracking-[-1px] text-high-emphasis">
              {title}
            </h3>

            {/* Description — Modal과 동일한 Body3 스타일 */}
            {description && (
              <p className="mt-2 text-[14px] leading-[21px] font-normal tracking-[-1px] text-caption">
                {description}
              </p>
            )}

            {/* Link */}
            {linkText && (
              <button
                type="button"
                onClick={onLinkClick}
                className="mt-2 text-[14px] font-bold leading-[21px] tracking-[-1px] text-high-emphasis hover:underline cursor-pointer"
              >
                {linkText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alert;

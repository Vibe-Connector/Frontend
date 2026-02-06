import { useEffect, useRef, type ReactNode } from "react";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "filled" | "outline";
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 상단 아이콘/이미지 영역 (이모지 문자열, 이미지 URL, 또는 ReactNode) */
  icon?: ReactNode;
  /** 상단 이미지 URL (카드 상단에 꽉 차는 이미지) */
  image?: string;
  title: string;
  description?: string;
  /** 버튼 영역 위 자유 콘텐츠 (input, checkbox, 긴 텍스트 등) */
  children?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /** X 닫기 버튼 표시 여부 (기본: true) */
  showCloseButton?: boolean;
}

function Modal({
  open,
  onClose,
  icon,
  image,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  showCloseButton = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-pretendard"
    >
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-card bg-white shadow-card">
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-low-emphasis transition-colors hover:bg-input hover:text-high-emphasis"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708Z" />
            </svg>
          </button>
        )}

        {/* Top image (full-width) */}
        {image && (
          <div className="w-full overflow-hidden">
            <img src={image} alt="" className="h-48 w-full object-cover" />
          </div>
        )}

        <div className="p-6">
          {/* Icon */}
          {icon && (
            <div className="mb-4 flex justify-center">
              {typeof icon === "string" ? (
                <span className="text-[48px] leading-none">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}

          {/* Title */}
          <h2
            id="modal-title"
            className={`text-[18px] font-bold leading-auto tracking-[-1px] text-high-emphasis ${icon || image ? "text-center" : ""}`}
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p
              className={`mt-2 text-[14px] leading-[21px] font-normal tracking-[-1px] text-caption ${icon || image ? "text-center" : ""}`}
            >
              {description}
            </p>
          )}

          {/* Custom content */}
          {children && <div className="mt-4">{children}</div>}

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className={`mt-6 flex gap-3 ${icon || image ? "justify-center" : "justify-end"}`}>
              {secondaryAction && (
                <ActionButton action={secondaryAction} variant={secondaryAction.variant ?? "outline"} />
              )}
              {primaryAction && (
                <ActionButton action={primaryAction} variant={primaryAction.variant ?? "filled"} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  action,
  variant,
}: {
  action: ModalAction;
  variant: "filled" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] leading-[21px] font-bold tracking-[-1px] transition-opacity duration-150 cursor-pointer";

  const styles =
    variant === "filled"
      ? `${base} bg-default text-white hover:opacity-80`
      : `${base} border border-stroke bg-white text-high-emphasis hover:bg-input`;

  return (
    <button type="button" onClick={action.onClick} className={styles}>
      {action.label}
    </button>
  );
}

export default Modal;

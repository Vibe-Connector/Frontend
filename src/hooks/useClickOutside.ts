import { useEffect, type RefObject } from 'react';

/**
 * 지정된 요소 바깥 클릭을 감지하여 handler를 실행하는 커스텀 훅.
 * Dropdown, ProfileDropdown 등 팝오버 UI에서 공통으로 사용합니다.
 *
 * @param ref      - 감지 대상 요소의 ref
 * @param handler  - 바깥 클릭 시 실행할 콜백
 * @param enabled  - 감지 활성화 여부 (기본 true)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, enabled]);
}

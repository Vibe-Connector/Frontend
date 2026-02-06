import { useState, useRef, useEffect, useId } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Selected Option",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full font-pretendard">
      {label && (
        <label
          id={`${id}-label`}
          className="mb-1 block text-[13px] font-light tracking-[-1px] text-caption"
        >
          {label}
        </label>
      )}

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-labelledby={label ? `${id}-label` : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between rounded-control border border-stroke px-4 py-3 text-[16px] leading-[24px] font-normal tracking-[-1px] outline-none transition-[border-color] duration-150 ${
          disabled
            ? "cursor-not-allowed bg-disabled text-low-emphasis"
            : isOpen
              ? "ring-2 ring-text-primary bg-white text-high-emphasis"
              : "bg-white text-high-emphasis hover:border-default"
        }`}
      >
        <span className={!selectedOption ? "text-low-emphasis" : ""}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-caption transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-control bg-white py-1 shadow-card"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-3 text-[16px] leading-[24px] font-normal tracking-[-1px] transition-colors duration-100 ${
                  isSelected
                    ? "text-text-primary hover:bg-input"
                    : "text-high-emphasis hover:bg-input"
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;

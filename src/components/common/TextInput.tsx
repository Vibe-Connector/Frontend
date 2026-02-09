import { useId } from "react";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function TextInput({
  label,
  className = "",
  id: externalId,
  ...rest
}: TextInputProps) {
  const autoId = useId();
  const inputId = externalId ?? autoId;

  return (
    <div className="w-full font-pretendard">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-[13px] font-medium tracking-[-1px] text-high-emphasis"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`w-full rounded-control border border-stroke bg-input px-4 py-3 text-[16px] leading-[24px] font-normal tracking-[-1px] text-high-emphasis outline-none transition-[border-color] duration-150 placeholder:text-low-emphasis focus:border-transparent focus:bg-white focus:ring-2 focus:ring-text-primary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-low-emphasis ${className}`}
        {...rest}
      />
    </div>
  );
}

export default TextInput;

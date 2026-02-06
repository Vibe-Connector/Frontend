export interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: "pill" | "rect";
}

function ButtonPrimary({
  shape = "pill",
  className = "",
  children,
  ...rest
}: ButtonPrimaryProps) {
  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-control";

  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center px-6 py-3 ${shapeClass} bg-primary text-white text-[16px] leading-[24px] font-medium tracking-[-1px] transition-opacity duration-150 hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-pretendard ${className}`}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;

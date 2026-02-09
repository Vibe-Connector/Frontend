interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1200px] px-[var(--spacing-page-x)] py-8${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}

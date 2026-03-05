interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-300 px--spacing-page-x py-8${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}

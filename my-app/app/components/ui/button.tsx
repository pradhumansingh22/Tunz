export const Button = ({
  type,
  className,
  children,
  onClick,
  variant,
  size,
}: {
  type: "submit";
  className: string;
  children: React.ReactNode;
  onClick: () => void;
  variant: string;
  size: string;
}) => {
  return (
      <button type={type} className={className} onClick={onClick}>
          {children}
    </button>
  );
};

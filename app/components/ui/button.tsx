"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
export const Button = ({
  type,
  className,
  children,
  onClick,
  variant,
  size,
  disabled,
  onKeyDown
}: {
  type?: "submit";
  className: string;
  children: React.ReactNode;
    onClick: () => void; 
    onKeyDown?: () => void;
  variant?: string;
    size?: string;
    disabled?: boolean;
}) => {
  return (
      <button type={type} className={className} onClick={onClick}>
          {children}
    </button>
  );
};
/* eslint-enable @typescript-eslint/no-unused-vars */

export const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  onKeyDown
}: {
  type?: string;
  placeholder: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (e: any) => void;
    onKeyDown?:(e: any) => void;
  className: string;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={
        onChange
      }
      onKeyDown={onKeyDown}
      className={className}
    />
  );
};
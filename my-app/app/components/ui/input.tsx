export const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}: {
  type: string,
  placeholder: string,
  value: string,
  onChange: (e:any)=>void,
  className: string,
}) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={() => {
          onChange;
        }}
        className={className}
      />
    );
};
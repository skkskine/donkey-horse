export default function Input({
  className = "",
  ...rest
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input className={`${className} border-b outline-0 w-full`} {...rest} />
  );
}

import type { ReactNode } from "react";

interface Prop extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  styleType?: "default" | "danger";
  className?: string;
}

export default function Button({
  children,
  styleType = "default",
  className = "",
  ...rest
}: Prop) {
  const baseStyle = "border p-2 rounded-md m-1 hover:cursor-pointer ";
  const defaultStyle = "hover:bg-white hover:text-black";
  const dangerStyle =
    " border-red-400 text-red-400 hover:bg-red-500 hover:text-white";
  return (
    <button
      className={`${className} ${baseStyle} ${
        styleType === "default" ? defaultStyle : dangerStyle
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

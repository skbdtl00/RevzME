import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    variant === "ghost"
      ? "px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
      : "btn-primary";
  return <button className={cn(base, className)} {...props} />;
}

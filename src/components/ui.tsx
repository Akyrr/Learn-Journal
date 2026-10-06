import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const base =
  "m3-label-large inline-flex items-center justify-center gap-2 transition-[opacity,background-color,box-shadow] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none";

const variants = {
  filled: "bg-primary text-on-primary rounded-full h-10 px-6 hover:opacity-90 active:opacity-80",
  tonal: "bg-secondary-container text-on-secondary-container rounded-full h-10 px-6 hover:opacity-90",
  outlined:
    "border border-outline text-primary rounded-full h-10 px-6 hover:bg-primary/8 active:bg-primary/12",
  text: "text-primary rounded-full h-10 px-3 hover:bg-primary/8 active:bg-primary/12",
  error: "bg-error-container text-on-error-container rounded-full h-10 px-6 hover:opacity-90",
} as const;

export type ButtonVariant = keyof typeof variants;

export function Button({
  variant = "filled",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TextField({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="m3-label-medium mb-1.5 block text-on-surface-variant">{label}</span>
      <input
        className={`m3-body-large w-full rounded-s border border-outline bg-surface px-4 py-3 text-on-surface outline-none transition-shadow placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/50 ${className}`}
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="m3-label-medium mb-1.5 block text-on-surface-variant">{label}</span>
      <textarea
        className={`m3-body-large w-full rounded-m border border-outline bg-surface px-4 py-3 text-on-surface outline-none transition-shadow placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/50 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-m bg-surface-container p-5 ${className}`}>{children}</div>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const styles =
    variant === 'primary'
      ? 'bg-rose-500 text-white shadow-sm hover:bg-rose-600'
      : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  disabled = false,
  onClick,
  type = 'button',
}) {
  const base = 'inline-flex items-center justify-center gap-sm rounded-full font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-secondary-container text-on-secondary-container hover:brightness-95 shadow-sm',
    dark:    'bg-primary text-on-primary hover:bg-primary/90',
    outline: 'border border-primary text-primary hover:bg-surface-container',
    ghost:   'text-primary hover:bg-surface-container',
    surface: 'bg-surface-container-high text-on-surface hover:bg-surface-dim',
  };

  const sizes = {
    sm: 'px-sm py-1 text-sm',
    md: 'px-md py-2.5 text-sm',
    lg: 'px-xl py-md text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
}

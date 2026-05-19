export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-container text-on-surface-variant',
    primary: 'bg-secondary-container text-on-secondary-container',
    success: 'bg-primary/5 text-primary border border-primary/10',
    error:   'bg-error-container text-on-error-container',
    outline: 'border border-primary text-primary',
    lime:    'bg-secondary-container text-on-secondary-container',
    dark:    'bg-primary text-on-primary',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-sm py-1 rounded-full font-bold text-caption font-caption ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

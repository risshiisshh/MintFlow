// eslint-disable-next-line no-unused-vars
export default function StepperItem({ number, title, subtitle, status = 'pending' }) {
  // status: 'complete' | 'active' | 'pending'
  const nodeStyles = {
    complete: 'bg-primary text-on-primary',
    active:   'bg-secondary-container text-on-secondary-container step-active-pulse',
    pending:  'bg-surface-container-high text-on-surface-variant',
  };
  const titleStyles = {
    complete: 'text-on-surface',
    active:   'text-primary',
    pending:  'text-on-surface-variant/50',
  };
  const subStyles = {
    complete: 'text-on-surface-variant',
    active:   'text-on-surface-variant',
    pending:  'text-on-surface-variant/50',
  };

  return (
    <div className="flex gap-md relative">
      <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${nodeStyles[status]}`}>
        {status === 'complete' ? (
          <span className="material-symbols-outlined text-[20px]">check</span>
        ) : status === 'active' ? (
          <span className="material-symbols-outlined animate-spin" style={{ animationDuration: '3s' }}>sync</span>
        ) : (
          <span className="material-symbols-outlined text-[20px]">pending</span>
        )}
      </div>
      <div className="pt-1">
        <h3 className={`font-heading-lg text-heading-lg ${titleStyles[status]}`}>{title}</h3>
        {subtitle && <p className={`font-body-md text-body-md ${subStyles[status]}`}>{subtitle}</p>}
      </div>
    </div>
  );
}

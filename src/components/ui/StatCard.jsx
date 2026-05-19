export default function StatCard({ label, value, sub, icon, variant = 'light' }) {
  const base = 'p-xl rounded-xl flex flex-col justify-between min-h-[200px]';
  const variants = {
    light:  `${base} bg-surface-container-low border border-outline-variant/30`,
    dark:   `${base} bg-primary text-on-primary`,
    lime:   `${base} bg-secondary-container text-on-secondary-container`,
    surface:`${base} bg-surface-container-highest border border-outline-variant/50`,
  };
  const labelColor = {
    light: 'text-on-surface-variant',
    dark:  'text-on-primary-container',
    lime:  'text-on-secondary-fixed-variant/60',
    surface:'text-on-surface-variant',
  };
  const valueColor = {
    light: 'text-primary',
    dark:  'text-on-primary',
    lime:  'text-on-secondary-container',
    surface:'text-on-surface',
  };

  return (
    <div className={variants[variant]}>
      <span className={`font-caption text-caption uppercase tracking-widest ${labelColor[variant]}`}>{label}</span>
      <div>
        <div className={`font-display-md text-display-md ${valueColor[variant]}`}>{value}</div>
        {sub && <p className={`font-caption text-caption mt-xs opacity-60 ${labelColor[variant]}`}>{sub}</p>}
        {icon && (
          <div className="mt-sm">
            <div className="w-full bg-outline-variant h-1 rounded-full">
              <div className="bg-secondary h-1 rounded-full" style={{ width: icon }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

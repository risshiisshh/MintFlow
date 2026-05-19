export default function NFTCard({ image, title, subtitle, badge, meta }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative aspect-[0.75] w-full bg-surface-container flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container to-surface-bright opacity-50" />
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="material-symbols-outlined text-[80px] text-on-surface-variant/30 relative z-10">token</span>
        )}
      </div>
      <div className="p-md flex flex-col gap-sm flex-grow">
        <div className="flex justify-between items-start gap-sm">
          <h3 className="font-heading-lg text-[20px] text-on-surface leading-tight">{title}</h3>
          {badge && (
            <span className="bg-primary-fixed-dim text-on-primary-fixed rounded-full px-sm py-[2px] font-caption text-caption flex items-center gap-xs flex-shrink-0">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{subtitle}</p>}
        {meta && (
          <div className="mt-auto pt-sm flex justify-between items-center text-on-surface-variant">
            {meta.map((m, i) => (
              <span key={i} className="font-caption text-caption">{m}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

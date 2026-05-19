import { useState } from 'react';

export default function Accordion({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-surface-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full flex justify-between items-center p-6 bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h3 className="font-heading-lg text-[20px] text-primary pr-4">{question}</h3>
        <span
          className="material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="bg-surface px-6 pb-6 pt-2 border-t border-surface-variant">
          <p className="font-body-md text-body-md text-on-surface-variant">{answer}</p>
        </div>
      )}
    </div>
  );
}

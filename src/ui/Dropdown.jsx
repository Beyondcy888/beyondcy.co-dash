// A pill dropdown from the mock ("Ads result  Leads ⌄"): opens a list, picks a value.
import { useCallback, useId, useRef, useState } from 'react';
import { IconCheck, IconChevronDown } from './icons.jsx';
import { useDismiss } from './useDismiss.js';

export function Dropdown({ label, options, value, onChange, width = 220, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, btnRef);
  return (
    <div className={`b360-dd ${className}`} ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="b360-dd-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
      >
        {label && <span className="dd-label">{label}</span>}
        {value}
        <IconChevronDown size={12} strokeWidth={2.4} />
      </button>
      {open && (
        <div id={id} className="b360-pop is-list" role="listbox" aria-label={label} style={{ width }}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className="b360-option"
              onClick={() => {
                onChange(o);
                close();
                btnRef.current?.focus();
              }}
            >
              {o}
              {o === value && <IconCheck />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** The mock's "Ads result" dropdown (look and choice only; the numbers stay as in the mock). */
export function AdsResultDropdown() {
  const [value, setValue] = useState('Leads');
  return <Dropdown label="Ads result" options={['Leads', 'Messages', 'Purchases', 'New followers']} value={value} onChange={setValue} />;
}

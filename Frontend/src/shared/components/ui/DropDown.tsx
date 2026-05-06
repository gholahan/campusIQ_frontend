import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fieldClass } from '@/shared/lib/fieldClass';

type Props = {
  label: string;
  value: string;
  options: string[];
  error?: string;
  touched?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function Dropdown({
  label,
  value,
  options,
  error,
  touched,
  placeholder = 'Select an option',
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="mb-4 relative">
      <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={fieldClass(touched, error)}
      >
        <span>{value || placeholder}</span>

        <ChevronDown size={16} className="ml-auto text-[var(--text3)]" />
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute left-0 right-0 mt-2
          rounded-xl border shadow-xl z-50
          bg-[var(--bg2)] border-[var(--border)]
          transition-all duration-150 origin-top
          ${open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              onChange(opt);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg3)]"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
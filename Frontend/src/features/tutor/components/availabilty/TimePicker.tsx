import { useState, useRef, useEffect } from "react";
import { ALL_TIMES } from "../../constants/times";

interface TimePickerProps {
  value?: string;
  onSelect: (time: string) => void;
  disabled?: boolean;
  excludedTimes?: string[];
  placeholder?: string;
}

export function TimePicker({
  value,
  onSelect,
  disabled = false,
  excludedTimes = [],
  placeholder = "Select",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full px-2.5 py-[7px] text-[13px]
          border border-border-secondary rounded-md
          flex items-center justify-between gap-1.5
          whitespace-nowrap text-left font-sans
          transition
          ${
            disabled
              ? "bg-background-secondary text-text-tertiary cursor-not-allowed"
              : value
              ? "bg-background-primary text-text-primary cursor-pointer"
              : "bg-background-primary text-text-tertiary cursor-pointer"
          }
        `}
      >
        <span className="truncate">{value || placeholder}</span>

        <i
          className={`ti ti-chevron-${open ? "up" : "down"} text-[11px] opacity-50`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="
            absolute top-full left-0 mt-1 z-20 w-[120px]
            max-h-[220px] overflow-y-auto p-1.5
            flex flex-col gap-[2px]
            rounded-xl border border-border-secondary
            bg-white
            shadow-lg
          "
        >
          {ALL_TIMES.map((time) => {
            const excluded = excludedTimes.includes(time);
            const active = value === time;

            return (
              <button
                key={time}
                type="button"
                disabled={excluded}
                onClick={() => {
                  onSelect(time);
                  setOpen(false);
                }}
                className={`
                  w-full px-2.5 py-2 text-left text-[13px]
                  rounded-md font-sans transition
                  ${
                    excluded
                      ? "cursor-not-allowed opacity-40 text-gray-400"
                      : active
                      ? "bg-[#EEEDFE] text-[#3C3489]"
                      : "text-gray-800 hover:bg-black/5"
                  }
                `}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
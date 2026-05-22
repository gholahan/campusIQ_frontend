import { STEP_LABELS } from "../constants/days";

interface StepHeaderProps {
  step: number;
  canNext: boolean[];
  onGoToStep: (s: number) => void;
}

export function StepHeader({ step, onGoToStep }: StepHeaderProps) {
  return (
    <div className="mb-7">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-full bg-[#EEEDFE] flex items-center justify-center shrink-0" />

        <div>
          <p className="text-base font-medium text-[var(--color-text-primary)]">
            Tutor profile
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Complete all steps to publish your profile
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex gap-1">
        {STEP_LABELS.map((label, i) => {
          const isActive = i === step;
          const isDone = i < step;

          return (
            <button
              key={label}
              onClick={() => onGoToStep(i)}
              className={`
                flex flex-1 items-center justify-center gap-1
                rounded-md px-2 py-1.5 text-xs font-medium
                transition-all duration-150

                ${
                  isActive
                    ? "bg-[#EEEDFE] border border-[#AFA9EC] text-[#3C3489]"
                    : "bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] text-[var(--color-text-secondary)] hover:border-[#AFA9EC]"
                }
              `}
            >
              {isDone && (
                <i className="ti ti-check text-[12px] text-[#0F6E56]" />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
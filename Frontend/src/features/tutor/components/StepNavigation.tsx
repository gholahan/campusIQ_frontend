interface StepNavigationProps {
  step: number;
  totalSteps: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;

}

export function StepNavigation({
  step,
  totalSteps,
  canGoNext,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: StepNavigationProps) {
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="mt-6 flex items-center justify-between">
      {/* Back */}
      <button
        onClick={onBack}
        className={`
          rounded-md border border-[var(--color-border-secondary)]
          px-5 py-2.5 text-sm font-medium
          text-[var(--color-text-secondary)]
          transition-all duration-150
          hover:bg-[var(--color-background-secondary)]
          ${step === 0 ? "invisible" : "visible"}
        `}
      >
        ← Back
      </button>

      {/* Next / Submit */}
      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            rounded-md bg-[#534AB7]
            px-5 py-2.5
            text-sm font-medium text-[#EEEDFE]
            transition-all duration-150
            hover:opacity-90
            active:scale-[0.99]
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? "Saving…" : "Save profile →"}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            rounded-lg bg-[#534AB7]
            px-5 py-2.5
            text-sm font-medium text-[#EEEDFE]
            transition-all duration-150
            active:scale-[0.99]

            ${
              canGoNext
                ? "cursor-pointer hover:opacity-90"
                : "cursor-not-allowed opacity-45"
            }
          `}
        >
          Continue →
        </button>
      )}
    </div>
  );
}
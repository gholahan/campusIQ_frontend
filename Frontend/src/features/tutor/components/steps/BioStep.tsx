import { FieldError } from "@/shared/components/ui";
import { fieldClass } from "@/shared/lib/fieldClass";
import { RATE_PRESETS } from "../../constants/courses";
import { Card } from "../../shared/Card";
import { FieldLabel } from "../../shared/SectionTitle";

interface BioStepProps {
  name: string;
  title: string;
  bio: string;
  rate: number;
  onNameChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onRateChange: (v: number) => void;
  onNameBlur: () => void;
  onTitleBlur: () => void;
  onBioBlur: () => void;
  onRateBlur: () => void;
  errors: {
    name?: string;
    title?: string;
    bio?: string;
    hourly_rate?: string;
  };
  touched: {
    name?: boolean;
    title?: boolean;
    bio?: boolean;
    hourly_rate?: boolean;
  };
}

export function BioStep({
  name,
  title,
  bio,
  rate,
  onNameChange,
  onTitleChange,
  onBioChange,
  onRateChange,
  onNameBlur,
  onTitleBlur,
  onBioBlur,
  onRateBlur,
  errors,
  touched,
}: BioStepProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Personal info */}
      <Card>
        <p className="mb-4 text-sm font-medium">
          Personal info
        </p>

        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5">
            <FieldLabel htmlFor="tutor-name">
              Full name
            </FieldLabel>

            <input
              id="tutor-name"
              className={fieldClass(touched.name, errors.name)}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={onNameBlur}
              placeholder="Your full name"
            />
            <FieldError message={errors.name} />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <FieldLabel htmlFor="tutor-title">
              Title
            </FieldLabel>

            <input
              id="tutor-title"
              className={fieldClass(touched.title, errors.title)}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={onTitleBlur}
              placeholder="e.g. Frontend Tutor"
            />
            <FieldError message={errors.title} />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="tutor-bio">
            Bio
          </FieldLabel>

          <textarea
            id="tutor-bio"
            rows={5}
            className={`${fieldClass(touched.bio, errors.bio)} resize-none leading-7`}
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            onBlur={onBioBlur}
            placeholder="Tell students about your experience, teaching style, and expertise..."
          />
          <FieldError message={errors.bio} />

          <p className="text-[11px] text-[var(--color-text-tertiary)]">
            {bio.length} / 500 characters
          </p>
        </div>
      </Card>

      {/* Hourly rate */}
      <Card>
        <p className="mb-4 text-sm font-medium">
          Hourly rate
        </p>

        <div className="flex items-center gap-3">
          {/* Rate input */}
          <div className="flex overflow-hidden rounded-md border border-[var(--color-border-secondary)] focus-within:border-[#7C72E8] focus-within:ring-2 focus-within:ring-[#EEEDFE]">
            <span className="flex items-center bg-[var(--color-background-secondary)] px-3 text-sm text-[var(--color-text-secondary)]">
              $
            </span>

            <input
              id="tutor-rate"
              type="number"
              min={1}
              value={rate}
              onChange={(e) =>
                onRateChange(Number(e.target.value))
              }
              onBlur={onRateBlur}
              className="w-28 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <FieldError message={errors.hourly_rate} />

          <span className="text-sm text-[var(--color-text-secondary)]">
            per hour
          </span>
        </div>

        {/* Presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          {RATE_PRESETS.map((v) => {
            const active = rate === v;

            return (
              <button
                key={v}
                onClick={() => onRateChange(v)}
                className={`
                  rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150
                  ${
                    active
                      ? "border-[#AFA9EC] bg-[#EEEDFE] text-[#3C3489]"
                      : "border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]"
                  }
                `}
              >
                ${v}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
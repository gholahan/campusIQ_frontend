import { FieldError } from "@/shared/components/ui";
import { PRESET_COURSES } from "../../constants/courses";
import { Card } from "../../shared/Card";
import { fieldClass } from "@/shared/lib";

interface CoursesStepProps {
  courses: string[];
  courseInput: string;
  onCourseInputChange: (v: string) => void;
  onToggleCourse: (c: string) => void;
  onAddCustomCourse: () => void;
  onRemoveCourse: (c: string) => void;
  error?: string;
  touched?: boolean;
}

export function CoursesStep({
  courses,
  courseInput,
  onCourseInputChange,
  onToggleCourse,
  onAddCustomCourse,
  onRemoveCourse,
  error,
  touched,
}: CoursesStepProps) {
  const customCourses = courses.filter(
    (c) => !PRESET_COURSES.includes(c)
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Preset Courses */}
      <Card>
        <div className="mb-5">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Course catalogue
          </p>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Select from presets or add your own.
          </p>
        </div>

        {/* Preset chips */}
        <div className="mb-6 max-h-52 overflow-y-auto rounded-xl border border-[var(--color-border-secondary)] p-3 flex flex-wrap gap-2">
          {PRESET_COURSES.map((c) => {
            const active = courses.includes(c);

            return (
              <button
                key={c}
                type="button"
                onClick={() => onToggleCourse(c)}
                className={`
                  inline-flex items-center gap-1.5 rounded-full border px-3 py-2
                  text-sm transition-all duration-200

                  ${
                    active
                      ? "border-emerald-400/40 bg-emerald-100 text-emerald-800 shadow-sm"
                      : "border-indigo-200/60 bg-indigo-50/40 text-[var(--color-text-secondary)] hover:border-indigo-300 hover:bg-indigo-100/60"
                  }

                  active:scale-[0.98]
                `}
              >
                {active && (
                  <i
                    className="ti ti-check text-[13px]"
                    aria-hidden="true"
                  />
                )}

                <span>{c}</span>
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            Add custom course
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={courseInput}
              onChange={(e) => onCourseInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddCustomCourse();
                }
              }}
              placeholder="e.g. Computer Networks"
              className={fieldClass(touched)}
            />

            <button
              type="button"
              onClick={onAddCustomCourse}
              className="
                rounded-lg bg-[#534AB7]
                px-5 py-2.5 text-sm font-medium
                text-[#EEEDFE]
                transition-opacity hover:opacity-90
                sm:w-auto
              "
            >
              Add
            </button>
          </div>
        </div>
      </Card>

      {/* Custom Courses */}
      {customCourses.length > 0 && (
        <Card>
          <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
            Custom courses
          </p>

          <div className="flex flex-wrap gap-2">
            {customCourses.map((c) => (
              <div
                key={c}
                className="
                  inline-flex items-center gap-2 rounded-full
                  border border-emerald-400/40 bg-emerald-100 text-emerald-800
                  px-3 py-1.5 text-sm 
                "
              >
                <span>{c}</span>

                <button
                  type="button"
                  onClick={() => onRemoveCourse(c)}
                  aria-label={`Remove ${c}`}
                  className="
                    text-base leading-none text-[#5DCAA5]
                    transition-opacity hover:opacity-70
                  "
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Summary */}
      <div
        className="
          flex items-center gap-3 rounded-md
          bg-[var(--color-background-secondary)]
          px-4 py-3
        "
      >
        <i
          className="ti ti-book text-lg text-[var(--color-text-secondary)]"
          aria-hidden="true"
        />

        <span className="text-sm text-[var(--color-text-secondary)]">
          {courses.length} course
          {courses.length !== 1 ? "s" : ""} selected
        </span>
      </div>
      <FieldError message={touched ? error : undefined} />
    </div>
  );
}
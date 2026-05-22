import { useGetProfile } from "@/features/auth/hooks/useAuthApi";
import { initialValues, profileFormValidation } from "@/shared/lib/validation/profileOnboarding";
import { useFormik } from "formik";
import { useState } from "react";
import { useCreateTutorProfile } from "@/features/tutor/hooks/useTutorApi";
import { buildPayload } from "../../features/tutor/utils/payload";
import { StepHeader } from "../../features/tutor/components/StepHeader";
import { StepNavigation } from "../../features/tutor/components/StepNavigation";
import { AvailabilityStep } from "../../features/tutor/components/steps/AvailabilityStep";
import { BioStep } from "../../features/tutor/components/steps/BioStep";
import { CoursesStep } from "../../features/tutor/components/steps/CourseStep";
import { ReviewStep } from "../../features/tutor/components/steps/ReviewStep";
import { useTutorProfileForm } from "../../features/tutor/hooks/useTutorProfile";
import type { TutorProfileFormValues } from "../../features/tutor/types";

const TOTAL_STEPS = 4;

export default function TutorProfileForm() {
  const { user } = useGetProfile();
  const { createTutorAsync, isPending, isError, error: mutationError } = useCreateTutorProfile();

  const [courseInput, setCourseInput] = useState("");

  const formik = useFormik<TutorProfileFormValues>({
    initialValues: initialValues(user),
    enableReinitialize: true,
    validationSchema: profileFormValidation,
    onSubmit: async (values) => {
      const payload = buildPayload({
        name: values.name,
        title: values.title,
        bio: values.bio,
        rate: values.hourly_rate,
        availability: values.availability,
        courses: values.courses,
      });
      console.log("Final payload:", payload);
      try {
        await createTutorAsync(payload);
      } catch {
        // error surfaced via mutationError
      }
    },
  });

  const form = useTutorProfileForm(formik);

  const nameError = formik.touched.name ? (formik.errors.name as string | undefined) : undefined;
  const titleError = formik.touched.title ? (formik.errors.title as string | undefined) : undefined;
  const bioError = formik.touched.bio ? (formik.errors.bio as string | undefined) : undefined;
  const rateError = formik.touched.hourly_rate ? (formik.errors.hourly_rate as string | undefined) : undefined;
  const coursesError = formik.touched.courses ? (formik.errors.courses as string | undefined) : undefined;
  return (
    <div
      style={{
        padding: "1.5rem 0",
        maxWidth: 640,
        fontFamily: "var(--font-sans)",
      }}
    >
      <StepHeader
        step={form.step}
        canNext={form.canNext}
        onGoToStep={form.goToStep}
      />

      {/* STEP 1 */}
      {form.step === 0 && (
        <BioStep
          name={form.name}
          title={form.title}
          bio={form.bio}
          rate={form.rate}
          onNameChange={form.setName}
          onNameBlur={() => formik.setFieldTouched("name", true)}
          onTitleChange={form.setTitle}
          onTitleBlur={() => formik.setFieldTouched("title", true)}
          onBioChange={form.setBio}
          onBioBlur={() => formik.setFieldTouched("bio", true)}
          onRateChange={form.setRate}
          onRateBlur={() => formik.setFieldTouched("hourly_rate", true)}
          errors={{
            name: nameError,
            title: titleError,
            bio: bioError,
            hourly_rate: rateError,
          }}
          touched={{
            name: Boolean(formik.touched.name),
            title: Boolean(formik.touched.title),
            bio: Boolean(formik.touched.bio),
            hourly_rate: Boolean(formik.touched.hourly_rate),
          }}
        />
      )}

      {/* STEP 2 — FIXED */}
      {form.step === 1 && (
        <AvailabilityStep
          availability={formik.values.availability}
          onDayChange={(day, val) => {
            formik.setFieldTouched(`availability.${day}`, true);
            formik.setFieldValue(`availability.${day}`, val);
          }}
          error={formik.errors.availability as any}
          touched={formik.touched.availability as any}
        />
      )}

      {/* STEP 3 */}
      {form.step === 2 && (
        <CoursesStep
          courses={form.courses}
          courseInput={courseInput}
          onCourseInputChange={setCourseInput}
          onToggleCourse={form.toggleCourse}
          onAddCustomCourse={() => {
            form.addCustomCourse(courseInput);
            setCourseInput("");
          }}
          onRemoveCourse={form.removeCourse}
          error={coursesError}
          touched={Boolean(formik.touched.courses)}
        />
      )}

      {/* STEP 4 */}
      {form.step === 3 && (
        <ReviewStep
          name={form.name}
          title={form.title}
          bio={form.bio}
          rate={form.rate}
          availability={formik.values.availability}
          courses={form.courses}
        />
      )}

      {isError && (
        <p style={{ fontSize: 13, color: "#F87171", marginTop: "0.75rem" }}>
          {(mutationError as any)?.response?.data?.message ?? "Something went wrong. Please try again."}
        </p>
      )}

      <StepNavigation
        step={form.step}
        totalSteps={TOTAL_STEPS}
        canGoNext={form.canNext[form.step]}
        onBack={form.goBack}
        onNext={form.goNext}
        onSubmit={form.handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
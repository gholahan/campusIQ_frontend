import { useState, useCallback, useMemo } from "react";
import { TutorProfileFormValues  } from "../types";
import { FormikProps } from "formik";
import { buildPayload } from "../utils/payload";
import { PRESET_COURSES } from "../constants/courses";

export function useTutorProfileForm(formik: FormikProps<TutorProfileFormValues >) {
  const {
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    submitForm,
  } = formik;

  const [step, setStep] = useState(0);

  // -----------------------
  // FIELD ALIASES
  // -----------------------
  const name         = values.name;
  const title        = values.title;
  const bio          = values.bio;
  const rate         = values.hourly_rate;
  const courses      = values.courses      ?? [];
  const availability = values.availability ?? {};

  // -----------------------
  // STEP VALIDATION
  // -----------------------
  const canNext = useMemo<boolean[]>(() => {
    return [
      // step 0 — bio & rate: no errors on these fields
      !errors.name && !errors.bio && !errors.hourly_rate,

      // step 1 — availability: no errors on availability
      !errors.availability,

      // step 2 — courses: no errors on courses
      !errors.courses,

      // step 3 — review: always can submit
      true,
    ];
  }, [errors]);

  const markStepTouched = useCallback(
    (currentStep: number) => {
      if (currentStep === 0) {
        setFieldTouched("name", true);
        setFieldTouched("title", true);
        setFieldTouched("bio", true);
        setFieldTouched("hourly_rate", true);
      }

      if (currentStep === 1) {
        setFieldTouched("availability", true);
        ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].forEach((d) =>
          setFieldTouched(`availability.${d}`, true)
        );
      }

      if (currentStep === 2) {
        setFieldTouched("courses", true);
      }
    },
    [setFieldTouched]
  );

  // -----------------------
  // STEP NAVIGATION
  // -----------------------
  const goNext = useCallback(() => {
    markStepTouched(step);
    if (!canNext[step]) return;
    setStep((s) => Math.min(s + 1, 3));
  }, [step, canNext, markStepTouched]);

  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const goToStep = useCallback(
    (s: number) => {
      markStepTouched(step);
      if (s <= step || canNext[step]) setStep(s);
    },
    [step, canNext, markStepTouched]
  );

  // -----------------------
  // FORM FIELD UPDATERS
  // -----------------------
  const setName  = (v: string) => setFieldValue("name", v);
  const setTitle = (v: string) => setFieldValue("title", v);
  const setBio   = (v: string) => setFieldValue("bio", v);
  const setRate  = (v: number) => setFieldValue("hourly_rate", v);

  // -----------------------
  // COURSES
  // -----------------------
  const toggleCourse = useCallback(
    (c: string) => {
      setFieldTouched("courses", true);
      const updated = courses.includes(c)
        ? courses.filter((x: string) => x !== c)
        : [...courses, c];
      setFieldValue("courses", updated);
    },
    [courses, setFieldValue, setFieldTouched]
  );

  const addCustomCourse = useCallback(
    (c: string) => {
      const val = c.trim();
      if (!val) return;
      const preset = PRESET_COURSES.find((p) => p.toLowerCase() === val.toLowerCase());
      const canonical = preset ?? val;
      if (!courses.some((x: string) => x.toLowerCase() === canonical.toLowerCase())) {
        setFieldTouched("courses", true);
        setFieldValue("courses", [...courses, canonical]);
      }
    },
    [courses, setFieldValue, setFieldTouched]
  );

  const removeCourse = useCallback(
    (c: string) => {
      setFieldTouched("courses", true);
      setFieldValue("courses", courses.filter((x: string) => x !== c));
    },
    [courses, setFieldValue, setFieldTouched]
  );

  // -----------------------
  // PAYLOAD
  // -----------------------
  const payload = useMemo(
    () => buildPayload({ name, title, bio, rate, availability, courses }),
    [name, title, bio, rate, availability, courses]
  );

  // -----------------------
  // SUBMIT / RESET
  // -----------------------
  const handleSubmit = useCallback(() => {
    markStepTouched(0);
    markStepTouched(1);
    markStepTouched(2);
    submitForm();
  }, [markStepTouched, submitForm]);

  const handleReset = useCallback(() => {
    resetForm();
    setStep(0);
  }, [resetForm]);

  return {
    step,
    canNext,
    goNext,
    goBack,
    goToStep,
    name,
    title,
    bio,
    rate,
    setName,
    setTitle,
    setBio,
    setRate,
    courses,
    toggleCourse,
    addCustomCourse,
    removeCourse,
    payload,
    handleSubmit,
    handleReset,
  };
}
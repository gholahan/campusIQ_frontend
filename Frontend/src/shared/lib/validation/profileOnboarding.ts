import { User } from "@/features/auth/types";
import * as Yup from "yup";

const TIME_REGEX =
  /^([01]\d|2[0-3]):(00|30)$/;

const daySchema = Yup.object({
  enabled: Yup.boolean().required(),

  start: Yup.string().when("enabled", {
    is: true,

    then: (schema) =>
      schema
        .required("Start time required")
        .matches(TIME_REGEX, "Invalid time"),

    otherwise: (schema) => schema.optional(),
  }),

  end: Yup.string().when("enabled", {
    is: true,

    then: (schema) =>
      schema
        .required("End time required")
        .matches(TIME_REGEX, "Invalid time"),

    otherwise: (schema) => schema.optional(),
  }),
}).test(
  "is-valid-range",
  "End time must be after start time",
  (value) => {
    // disabled day = valid
    if (!value?.enabled) return true;

    // enabled but incomplete = invalid
    if (!value.start || !value.end) {
      return false;
    }

    // HH:mm string comparison works
    return value.end > value.start;
  }
);

const availabilitySchema = Yup.object({
  mon: daySchema,
  tue: daySchema,
  wed: daySchema,
  thu: daySchema,
  fri: daySchema,
  sat: daySchema,
  sun: daySchema,
}).test(
  "at-least-one-day",
  "Set availability for at least one day",
  (value) => {
    if (!value) return false;
    return Object.values(value).some(
      (d: any) => d?.enabled && d.start && d.end && d.end > d.start
    );
  }
);

export const profileFormValidation = Yup.object({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  title: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!"),

  bio: Yup.string()
    .min(10, "Bio too short")
    .required("Bio is required"),

  hourly_rate: Yup.number()
    .typeError("Hourly rate must be a number")
    .required("Hourly rate is required")
    .min(1, "Hourly rate must be greater than 0"),

  availability: availabilitySchema,

  courses: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one course"),
});

export const initialValues = (
  user: User | undefined
) => ({
  name: `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),

  title: "",

  bio: "",

  hourly_rate: 0,

  availability: {
    mon: {
      enabled: false,
      start: "",
      end: "",
    },

    tue: {
      enabled: false,
      start: "",
      end: "",
    },

    wed: {
      enabled: false,
      start: "",
      end: "",
    },

    thu: {
      enabled: false,
      start: "",
      end: "",
    },

    fri: {
      enabled: false,
      start: "",
      end: "",
    },

    sat: {
      enabled: false,
      start: "",
      end: "",
    },

    sun: {
      enabled: false,
      start: "",
      end: "",
    },
  },

  courses: [],
});
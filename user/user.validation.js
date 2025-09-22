const { z } = require("zod");

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .transform((s) => s.trim()),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .transform((s) => s.trim()),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

module.exports = {
  signupSchema,
  loginSchema,
};

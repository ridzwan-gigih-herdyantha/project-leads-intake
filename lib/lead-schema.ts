import { z } from "zod";

export const SERVICE_OPTIONS = [
  "AI Development & Integration",
  "AI Automation",
  "SaaS & Web Development",
  "Mobile App Development",
  "Marketplace Development",
  "Maintenance & Support",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email"),
  company: z
    .string()
    .trim()
    .max(160, "Company name is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  website: z
    .string()
    .trim()
    .max(200, "Website is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  service: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: "Pick a service" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(4000, "Message is too long"),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

// schema.ts
import { z } from 'zod';

export const formSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address.' })
    .min(5, { message: 'Email must be at least 5 characters long.' })
    .max(100, { message: 'Email must be at most 100 characters long.' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(20, { message: 'Password must be at most 20 characters long.' }),

    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
        code: z.ZodIssueCode.custom,
      });
    }
  });
export type FormSchema = typeof formSchema;

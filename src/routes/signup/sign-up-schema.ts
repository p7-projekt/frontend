// schema.ts
import { z } from 'zod';
const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
const capitalRegex = /[A-Z]/;
const digitRegex = /\d/;

export const formSchema = z
	.object({
		email: z
			.string()
			.email({ message: 'Please enter a valid email address.' })
			.min(5, { message: 'Email must be at least 5 characters long.' })
			.max(100, { message: 'Email must be at most 100 characters long.' }),

		name: z
			.string()
			.min(5, { message: 'Name must be at least 5 characters' })
			.max(100, { message: 'Name must be at most 100 characters long.' }),

		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long.' })
			.max(20, { message: 'Password must be at most 20 characters long.' })
			.regex(passwordRegex, { message: 'Password must contain at least one special character.' })
			.regex(capitalRegex, { message: 'Password must contain at least one uppercase letter.' })
			.regex(digitRegex, { message: 'Password must contain at least one digit.' }),

		confirmPassword: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long.' })
			.regex(digitRegex, { message: 'Password must contain at least one digit.' })
			.regex(capitalRegex, { message: 'Password must contain at least one uppercase letter.' })
			.regex(passwordRegex, { message: 'Password must contain at least one special character.' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				path: ['confirmPassword'],
				message: 'Passwords do not match.',
				code: z.ZodIssueCode.custom
			});
		}
	});
export type FormSchema = typeof formSchema;

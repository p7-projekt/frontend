import { z } from 'zod';

export const joinAnonSchema = z.object({
	code: z
		.string()
		.length(6, { message: 'Session code must be exactly 6 characters' })
		.regex(/^[A-Z]{2}\d{4}$/, {
			message: 'Session code must start with 2 uppercase letters followed by 4 digits'
		})
		.refine(
			(value) => {
				// Check if the last 4 digits are between 1000 and 9999
				const numberPart = parseInt(value.slice(2), 10);
				return numberPart >= 1000 && numberPart <= 9999;
			},
			{ message: 'The last 4 digits must be a number between 1000 and 9999' }
		),
	name: z
		.string()
		.min(5, { message: 'Nickname must be at least 5 characters long' })
		.max(100, { message: 'Nickname must be at most 100 characters long' })
		.optional()
});

export const joinStudentSchema = z.object({
	code: z
		.string()
		.length(6, { message: 'Session code must be exactly 6 characters' })
		.regex(/^(?:\d{4}[A-Z]{2}|[A-Z]{2}\d{4})$/, {
			message:
				'join code must start with 4 digits followed by 2 uppercase letters, or 2 uppercase letters followed by 4 digits'
		})
});

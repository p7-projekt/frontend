import { z } from 'zod';

export const formSchema = z.object({
	title: z
		.string()
		.min(1, 'The title must consist of at least one character')
		.max(35, 'The title must be no longer than 35 characters'),
	description: z.string().optional(), // Assuming description is optional
	expiresInHours: z.number().min(1, 'You must pick an expiration time!'),
	exerciseIds: z.number().array().nonempty('You must select at least one exercise!'),
	languageIds: z.number().array().nonempty('You must pick at least one programming language!')
});

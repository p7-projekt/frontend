import { z } from 'zod';

export const formSchema = z.object({
	codeText: z
		.string()
		.min(1, 'You must create a solution')
		.max(10000, 'Solution must max consist of 10000 characters'),
	selectedLanguage: z.object({
		languageId: z.number(),
		language: z.string().min(1, 'You must select a code solution language')
	})
});

export type FormSchema = typeof formSchema;

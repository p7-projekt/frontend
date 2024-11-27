import { z } from 'zod';

export const formSchema = z.object({
	title: z
		.string()
		.min(1, 'Title must at least consist of one character')
		.max(100, 'Title must at least consist of max 100 characters'),
	description: z
		.string()
		.min(1, 'Description must at least consist of one character')
		.max(1000, 'Description must at least consist of max 1000 characters'),
	codeText: z
		.string()
		.min(1, 'You must create a solution')
		.max(100000, 'Solution must max consist of 100000 characters'),
	testCases: z.array(z.any()).min(1, 'At least one test case is required'),
	selectedLanguage: z.object({
		languageId: z.number(),
		language: z.string().min(1, 'You must select a code solution language')
	}),
});

export type FormSchema = typeof formSchema;

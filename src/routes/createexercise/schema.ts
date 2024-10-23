import { z } from 'zod';

export const formSchema = z.object({
	//temp random validation #esbenlove
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(1000),
	codeText: z.string().min(1).max(10000),
	testCases: z.array(z.any()).min(1, "At least one test case is required")
});

export type FormSchema = typeof formSchema;

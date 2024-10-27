import { z } from 'zod';

export const formSchema = z.object({
    codeText: z.string().min(1, 'You must create a solution').max(10000, 'Solution must max consist of 10000 characters'),
});

export type FormSchema = typeof formSchema;

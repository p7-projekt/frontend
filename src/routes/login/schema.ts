import { message } from 'sveltekit-superforms';
import { z } from 'zod';

export const formSchema = z.object({
	//temp random validation #esbenlove
	email: z.string().email('Please enter a valid email address.').min(5, {message: 'Your email must be at least 5 characters'}).max(50, {message: 'Your email can not be longer than 50 characters'}),
	password: z.string().min(1, {message: 'Your password must be longer than one character'}).max(100, {message: 'Your password can not be longer than 100 characters'})
});

export type FormSchema = typeof formSchema;

import { z } from "zod";

export const formSchema = z.object({
//temp random validation #esbenlove
  email: z.string().email("Invalid email").min(5).max(50),
  password: z.string().max(100),
});

export type FormSchema = typeof formSchema;

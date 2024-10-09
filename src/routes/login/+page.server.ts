import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema.js";
import { zod } from "sveltekit-superforms/adapters";
 
export const load = async () => {
 return {
  form: await superValidate(zod(formSchema)),
 };
};
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { setError,superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
 
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const load: PageServerLoad = async () => {
 return {
  form: await superValidate(zod(formSchema)),
 };
};
 
export const actions: Actions = {
    default: async (event) => {
      const form = await superValidate(event, zod(formSchema));
      if (!form.valid) {
        return fail(400, { form });
      }
  
      // Extract the email and password 
      const { email, password } = form.data;
  
      console.log('email', email);

      // Make a POST request to backend
      const response = await fetch(backendUrl+'/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });
  
      // Handle the response
      if (response.ok) {
        const data = await response.json(); 
        return setError(form, 'email', data?.detail || 'Ja det virkede det er bare dejligt');

      } else { 
        const error = await response.json();
        return setError(form, 'email', error?.detail || 'Login failed');
      }
    },
  };
  
// +page.server.ts
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './sign-up-schema';
import { ok } from 'assert';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  signUp: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password, confirmPassword, name } = form.data;

    // Make request for signup to backend
    const response = await fetch(backendUrl + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword, name }),
    });

    if (response.ok) {
      return ok ({ 
        form
      });
    } else {
      const error = await response.json();
      return setError(form, 'confirmPassword', error?.errors?.Password.join('\n') || "Signup failed");
    }
  },
};

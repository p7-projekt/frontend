import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define a Zod schema for the session code
const sessionCodeSchema = z.object({
	sessionCode: z
		.string()
		.length(6, { message: 'Session code must be exactly 6 characters' })
		.regex(/^[A-Z]{2}\d{4}$/, {
			message: 'Session code must start with 2 uppercase letters followed by 4 digits'
		})
		.refine(
			(value) => {
				// Check if the last 4 digits are between 1000 and 9999
				const numberPart = parseInt(value.slice(2), 10);
				return numberPart >= 1000 && numberPart <= 9999;
			},
			{ message: 'The last 4 digits must be a number between 1000 and 9999' }
		)
});

export const actions = {
	join: async ({ request, cookies }) => {
		const form = await request.formData();
		const access_token = cookies.get('access_token');

		const sessionCode = form.get('sessionCode');
		const validation = sessionCodeSchema.safeParse({ sessionCode });
		if (!validation.success) {
			// Return the first validation error message if validation fails
			return fail(400, { error: validation.error.errors[0].message });
		}

		const joinCode = {
			SessionCode: sessionCode
		};

		try {
			const response = await fetch(`${backendUrl}/join`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify(joinCode)
			});

			const responseData = await response.json();
			if (!response.ok) {
				return fail(400, { error: responseData.errors?.SessionCode?.[0] || 'Invalid code' });
			}
			const token = responseData.token;
			if (!token) {
				return fail(500, { message: 'Server error. Please try again later.' });
			}
			const token_expiration = responseData.expiresAt;
			console.log(responseData);

			const expires_at: Date = new Date(token_expiration);
			cookies.set('anon_token', token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: expires_at
			});
		} catch (error) {
			console.error('Error joining Session:', error);
			return fail(500, { message: 'Server error. Please try again later.' });
		}
		throw redirect(303, '/session');
	}
};

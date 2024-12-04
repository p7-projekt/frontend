import { fail, redirect } from '@sveltejs/kit';
import { joinAnonSchema, joinStudentSchema } from './schema';
import { debugJoin } from '$lib/debug';
import { fetchStudentJoin } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define a Zod schema for the session code and nickname

export async function load({ parent }) {
	const { user } = await parent();
	return { user };
}

export const actions = {
	joinAnon: async ({ request, cookies }) => {
		const form = await request.formData();

		const nickname = form.get('nickname');
		const sessionCode = form.get('join-code');

		const joinCode = {
			code: sessionCode,
			name: nickname || 'Anonymous'
		};

		const validation = joinAnonSchema.safeParse(joinCode);

		if (!validation.success) {
			// Return the first validation error message if validation fails
			return fail(400, { error: validation.error.errors[0].message });
		}

		debugJoin('Validation successful:', validation.data);

		const response = await fetch(`${backendUrl}/join`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(joinCode)
		});

		if (response.ok) {
			const responseData = await response.json();

			const token_expiration = responseData.expiresAt;
			const token = responseData.token;

			const expires_at: Date = new Date(token_expiration);
			cookies.set('anon_token', token, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				expires: expires_at
			});
			throw redirect(303, '/session');
		} else {
			const responseBody = await response.json(); // Read the response as text
			debugJoin('responseBody:', responseBody);
			return fail(500, { message: 'Server error. Please try again later' });
		}
	},
	joinStudent: async ({ request, cookies }) => {
		const form = await request.formData();
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

		const sessionCode = form.get('join-code');

		const joinCode = {
			code: sessionCode
		};

		const validation = joinStudentSchema.safeParse(joinCode);

		if (!validation.success) {
			// Return the first validation error message if validation fails
			return fail(400, { error: validation.error.errors[0].message });
		}

		debugJoin('Validation successful:', validation.data);

		const response = await handleAuthenticatedRequest(
			(token) => fetchStudentJoin(backendUrl, token, joinCode),
			access_token,
			refresh_token,
			cookies
		);
		const responseData = await response.json();

		if (response.ok) {
			if (responseData.joinedType === 2) {
				throw redirect(303, `/classroom/${responseData.joinedId}`);
			} else throw redirect(303, '/session');
		} else if (response.status === 400) {
			return fail(400, { error: 'The classroom is not open for join' });
		} else return fail(500, { error: 'Server Error. Please try again later' });
	}
};

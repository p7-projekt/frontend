import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Internal API endpoint to log the user out
export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });

	throw redirect(303, '/');
};

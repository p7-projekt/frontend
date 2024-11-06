import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Internal API endpoint to log the user out
export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete('access_token', { path: '/', secure: false });
	cookies.delete('refresh_token', { path: '/', secure: false });

	return json({ message: 'User successfully logged out' }, { status: 200 });
};

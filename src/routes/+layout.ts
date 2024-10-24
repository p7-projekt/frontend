import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Redirect to the home page, if the a logged in user access the /login endpoint
export const load: LayoutLoad = ({ data, url }) => {
	const { user } = data || {};
	if (user && url.pathname === '/login') {
		throw redirect(307, '/');
	}
	if (!user && url.pathname === '/create-session') {
		throw redirect(307, '/login');
	}
	if (!user && url.pathname === '/createexercise') {
		throw redirect(307, '/login');
	}

	return {
		user
	};
};

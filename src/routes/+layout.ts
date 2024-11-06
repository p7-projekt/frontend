import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Redirect to the home page, if the a logged in user access the /login endpoint
export const load: LayoutLoad = ({ data, url }) => {
	const { user } = data || {};
	const urlp = url.pathname;
	if (user && urlp === '/login') {
		throw redirect(303, urlp);
	}

	if (
		!user &&
		urlp !== '/join' &&
		!urlp.startsWith('/session') &&
		urlp !== '/login' &&
		urlp !== '/' &&
		urlp !== '/exercise'
	) {
		throw redirect(303, '/');
	}

	return {
		user
	};
};

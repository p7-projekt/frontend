import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Redirect to the home page, if the a logged in user access the /login endpoint
export const load: LayoutLoad = ({ data, url }) => {
	const { user } = data || {};

	_validate_url_path(user, url.pathname);

	return {
		user
	};
};

export function _validate_url_path(user: { name: string, role: string } | null, urlp: string) {
	if (user && urlp === '/login') {
		throw redirect(303, '/');
	}

	if (
		!user &&
		urlp !== '/join' &&
		!urlp.startsWith('/session') &&
		urlp !== '/login' &&
		urlp !== '/' &&
		urlp !== '/exercise' &&
		urlp !== '/signup'
	) {
		throw redirect(303, '/');
	}
	else if (
		user?.role === "student" &&
		urlp !== '/join' &&
		!urlp.startsWith('/session') &&
		urlp !== '/' &&
		urlp !== '/exercise'
	) {
		throw redirect(303, '/')
	}
	else if (
		user?.role === "instructor" &&
		urlp === 'signup' ||
		urlp === 'login'
	) {
		throw redirect(303, '/')
	}
}

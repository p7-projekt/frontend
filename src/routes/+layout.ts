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
	const allowedAnonRoutes = [
		'/join', '/login', '/', '/signup', '/exercise', '/session'
	];
	const allowedStudentRoutes = [
		'/join', '/exercise', '/session', '/'
	];
	const allowedInstructorRoutes = [
		'/join', '/exercise', '/', '/session', '/create-session', '/createexercise'
	];
	
	if (user && urlp === '/login') {
		throw redirect(303, '/');
	}

	if (!user || user.role === 'AnonymousUser') {
		if (!allowedAnonRoutes.includes(urlp) && !urlp.startsWith('/session')) {
			throw redirect(303, '/');
		}
	}
	else if (user.role === 'Student') {
		if (!allowedStudentRoutes.includes(urlp) && !urlp.startsWith('/session')) {
			throw redirect(303, '/');
		}
	}
	else if (user.role === 'Instructor') {
		if (!allowedInstructorRoutes.includes(urlp)) {
			throw redirect(303, '/');
		}
	}
}

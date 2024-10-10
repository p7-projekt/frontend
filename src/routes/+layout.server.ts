import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	// const token = cookies.get('token');
	cookies.get('token');
	const token = true;
	// Get user from token (Not implemented)
	// role: 1: (admin), 2: (instructor) and 3: (guest)
	const user = { name: 'Kristian', id: 1, role: 3 };

	return {
		user: token ? user : null
	};
};

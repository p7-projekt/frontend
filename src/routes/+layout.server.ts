import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	// const real_token = cookies.get('token');
	// console.log(real_token);
	const token = true;
	// Get user from token (Not implemented)
	// role: 1: (admin), 2: (instructor) and 3: (guest)
	const user = {
		name: 'Kristian',
		id: 1,
		role: 3
	};

	return {
		user: token ? user : null
	};
};

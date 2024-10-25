import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: PageServerLoad = async ({ cookies }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	if (!access_token) {
		throw redirect(303, '/');
	}

	const instructor_exercises = [
		{
			id: 1,
			title: 'Create Hello World Function'
		},
		{
			id: 2,
			title: 'Add two numbers'
		},
		{
			id: 3,
			title: 'Counter'
		},
		{
			id: 4,
			title: 'Counter 2'
		},
		{
			id: 5,
			title: 'Simple calculator'
		},
		{
			id: 6,
			title: 'Simple calculator 2'
		},
		{
			id: 7,
			title: 'Simple calculator 3'
		},
		{
			id: 8,
			title: 'Binary tree'
		},
		{
			id: 9,
			title: 'Binary tree 2'
		},
		{
			id: 10,
			title: 'Linked list'
		},
		{
			id: 11,
			title: 'Linked list'
		},
		{
			id: 12,
			title: 'Linked list'
		},
		{
			id: 13,
			title: 'Linked list'
		},
		{
			id: 14,
			title: 'Linked list'
		},
		{
			id: 15,
			title: 'Linked list'
		}
	];

	const response = await fetch(`${backendUrl}${api_version}/sessions`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	let sessions;
	if (response.ok) {
		sessions = await response.json();
	}
	return {
		instructor_exercises: instructor_exercises,
		sessions: sessions && sessions.length > 0 ? sessions : null
	};
};

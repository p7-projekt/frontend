import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

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

	let sessions;
	if (access_token) {
		const response = await fetch(`${backendUrl}${api_version}/sessions`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});

		if (response.ok) {
			// if response fails, probably due to invalid access token, use redirect token if redirect token exist
			// else log user out
			if (response.status === 401 && refresh_token) {
				const response = await fetch('/api/refresh', { method: 'POST' });
				if (response.ok) {
					throw redirect(303, '/');
				}
			}
			sessions = await response.json();
		}
	}
	return {
		instructor_exercises: instructor_exercises,
		sessions: sessions && sessions.length > 0 ? sessions : null
	};
};

import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { invalidateAll } from '$app/navigation';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: PageServerLoad = () => {
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
		}
	];
	return { instructor_exercises };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const session_title = form.get('session-title');
		const session_description = form.get('session-description');
		const added_exercise_list = form.get('added-exercise-list');
		const datetime = form.get('selected_datetime');
		const access_token = cookies.get('access_token');

		// Parse the JSON strings back into arrays
		let added_exercises: { id: number; title: string }[] = [];
		let date_time = {};

		try {
			added_exercises = added_exercise_list ? JSON.parse(added_exercise_list.toString()) : [];
		} catch (error) {
			console.error('Error parsing exercise lists:', error);
		}

		const added_exercise_ids = added_exercises ? added_exercises.map(({ id }) => id) : [];

		try {
			date_time = datetime ? JSON.parse(datetime.toString()) : {};
		} catch (error) {
			console.log('Error parsing selected date and time', error);
		}

		// Extract values and create the date string in a parseable format
		const { year, month, day } = date_time.date;
		const time = date_time.time;

		// Construct date string in UTC format
		let [timeValue] = time.split(' ');
		let [hours, minutes] = timeValue.split(':').map(Number);
		const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`;

		const targetDate = new Date(dateString);
		// Check if targetDate is in the future and calculate the difference in hours
		const now = new Date();
		const hoursDifference = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// Check if targetDate is later than now
		if (!(hoursDifference > 0)) {
			return fail(400, { datetimeInThePast: true });
		}

		// If title is not provided
		if (!session_title) {
			return fail(400, { sessionTitleMissing: true, session_description });
		}

		// convert UTC hours to local time
		const local_hours = hoursDifference - 2;

		const new_session = {
			title: session_title,
			description: session_description,
			expiresInHours: local_hours,
			exerciseIds: added_exercise_ids
		};

		console.log(new_session);

		// Make request to backend API with data (Not implemented)
		const response = await fetch(`${backendUrl}${api_version}/sessions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}` // Add auth token if required
			},
			body: JSON.stringify({ new_session })
		});

		// console.log(response);
		if (!response.ok) {
			if (response.status === 401) {
				throw redirect(303, '/create-session');
			}
			return fail(response.status, { error: 'Failed to post to external API' });
		}

		// Success: Process the response data
		const responseData = await response.json();

		console.log(responseData);

		throw redirect(303, '/');
	}
};

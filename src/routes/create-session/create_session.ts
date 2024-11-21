import type { ActionData } from './$types';
import { debugCreateSession } from '$lib/debug';

export function getExerciseIds(exercise_list: FormDataEntryValue | null) {
	try {
		const added_exercises = exercise_list ? JSON.parse(exercise_list as string) : [];
		// Ensure `added_exercises` is an array and map over it
		return Array.isArray(added_exercises) ? added_exercises.map(({ id }) => id) : [];
	} catch (error) {
		debugCreateSession('Error processing exercise list', error);
		return [];
	}
}

export function getProgrammingLanguages(lang_ids_str: FormDataEntryValue | null) {
	try {
		return lang_ids_str ? JSON.parse(lang_ids_str as string) : [];
	} catch (error) {
		debugCreateSession('Error parsing  added programming languages:', error);
		return [];
	}
}

export function displayValidationErrors(form: ActionData) {
	const errors = {
		errorInTitle: { message: '' },
		errorInAddedExercises: { message: '' },
		errorInExpiration: { message: '' },
		errorInLanguages: { message: '' }
	};

	if (form?.errors) {
		form.errors.forEach((error) => {
			switch (error.path[0]) {
				case 'title':
					errors.errorInTitle = { message: error.message };
					break;
				case 'added_exercise_ids':
					errors.errorInAddedExercises = { message: error.message };
					break;
				case 'expires_in_hours':
					errors.errorInExpiration = { message: error.message };
					break;
				case 'programming_language':
					errors.errorInLanguages = { message: error.message };
					break;
				default:
			}
		});
	}

	return errors;
}

import type { ActionData } from './$types';

export function getExerciseIds(exercise_list: FormDataEntryValue | null) {
	try {
		const added_exercises = exercise_list ? JSON.parse(exercise_list as string) : [];
		// Ensure `added_exercises` is an array and map over it
		return Array.isArray(added_exercises) ? added_exercises.map(({ id }) => id) : [];
	} catch (error) {
		console.error('Error processing exercise list:', error);
		return [];
	}
}

export function getProgrammingLanguages(lang_list: FormDataEntryValue | null) {
	try {
		return lang_list ? JSON.parse(lang_list as string) : [];
	} catch (error) {
		console.error('Error parsing  added programming languages:', error);
		return [];
	}
}

export function displayValidationErrors(form: ActionData) {
	const errors = {
		errorInTitle: false,
		errorInAddedExercises: false,
		errorInExpiration: false,
		errorInLanguages: false
	};
	if (form?.errors) {
		form?.errors.forEach((error) => {
			switch (error.path[0]) {
				case 'title':
					errors.errorInTitle = true;
					break;
				case 'added_exercise_ids':
					errors.errorInAddedExercises = true;
					break;
				case 'expires_in_hours':
					errors.errorInExpiration = true;
					break;
				case 'programming_language':
					errors.errorInLanguages = true;
					break;
				default:
			}
		});
	}
	return errors;
}

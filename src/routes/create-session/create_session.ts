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
				case 'exerciseIds':
					errors.errorInAddedExercises = { message: error.message };
					break;
				case 'expiresInHours':
					errors.errorInExpiration = { message: error.message };
					break;
				case 'languageIds':
					errors.errorInLanguages = { message: error.message };
					break;
				default:
			}
		});
	}

	return errors;
}

export function getEditAddedExercises(
	exercise_list: { exerciseId: number; exerciseTitle: string; solved: boolean }[]
): { id: number; content: string }[] {
	// Map the exercise_list to match the desired format
	return exercise_list.map((exercise) => ({
		id: exercise.exerciseId,
		content: exercise.exerciseTitle
	}));
}

export function getEditRemainingExercises(
	author_exercises: { id: number; name: string }[],
	exercise_list: { exerciseId: number; exerciseTitle: string; solved: boolean }[]
): { id: number; content: string }[] {
	// Extract exercise IDs from exercise_list
	const exerciseListIds = exercise_list.map((exercise) => exercise.exerciseId);

	// Filter and map the author_exercises to return exercises not included in exercise_list
	return author_exercises
		.filter((exercise) => !exerciseListIds.includes(exercise.id))
		.map((exercise) => ({
			id: exercise.id,
			content: exercise.name
		}));
}

export function getEditLanguages(
	editLanguageIds: number[],
	languages: { languageId: number; language: string }[]
): { value: number; label: string }[] {
	// Filter and map the languages to return in the desired format for the Select component
	return languages
		.filter((language) => editLanguageIds.includes(language.languageId))
		.map((language) => ({
			value: language.languageId,
			label: language.language
		}));
}

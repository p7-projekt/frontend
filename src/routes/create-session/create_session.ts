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

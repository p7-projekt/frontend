export async function _deleteExercise(
	selected_exercise_id: number | null,
	instructor_exercises: { id: number; content: string }[]
) {
	const response = await fetch('/api/delete-exercise', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ exercise_id: selected_exercise_id })
	});

	if (response.ok) {
		instructor_exercises = instructor_exercises.filter(
			(exercise) => exercise.id !== selected_exercise_id
		);

		return {
			instructor_exercises: instructor_exercises,
			isDialogOpen: false,
			selected_exercise_id: null,
			selected_exercise_title: null
		};
	}
}

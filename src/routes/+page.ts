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

export async function _deleteSession(
	sessionId: number | null,
	sessions: {
		id: number;
		title: string;
		expiresInSeconds: number;
	}[]
) {
	const response = await fetch('/api/delete-session', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ session_id: sessionId })
	});

	if (response.ok) {
		sessions = sessions.filter((session) => session.id !== sessionId);

		return {
			sessions,
			isDialogOpen: false,
			selected_session_id: null,
			selected_session_title: null
		};
	}
}
export async function _deleteClassroom(
	classroomID: number | null,
	classrooms: {
		id: number;
		title: string;
	}[]
) {
	const response = await fetch('/api/delete-classroom', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ classroom_id: classroomID })
	});

	if (response.ok) {
		classrooms = classrooms.filter((classroom) => classroom.id !== classroomID);

		return {
			classroom_list: classrooms,
			isDialogOpen: false,
			selected_classroom_id: null,
			selected_classroom_title: null
		};
	}
}

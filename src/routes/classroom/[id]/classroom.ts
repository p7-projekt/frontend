export async function _deleteClassroomSession(
	sessionId: number | null,
	classroom: {
		id: number;
		title: string;
		description: string;
		roomcode: string;
		isOpen: boolean;
		sessions: { id: number; title: string; active: boolean }[];
	}
) {
	const response = await fetch('/api/delete-session', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ session_id: sessionId })
	});

	if (response.ok) {
		classroom.sessions = classroom.sessions.filter((session) => session.id !== sessionId);

		return {
			classroom,
			isDialogOpen: false
		};
	}
}

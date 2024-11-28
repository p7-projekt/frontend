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

export async function _updateSessionActivationStatus(
	sessionId: number | null,
	classroom: {
		id: number;
		title: string;
		description: string;
		roomcode: string;
		isOpen: boolean;
		sessions: { id: number; title: string; active: boolean }[];
	},
	activationStatus: boolean
) {
	const response = await fetch('/api/update-session-status', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			classroom_id: classroom.id,
			session_id: sessionId,
			activation_status: activationStatus
		})
	});

	if (response.ok) {
		// Update the session.active property on the client side to avoid reloading page
		const updatedClassroom = {
			...classroom,
			sessions: classroom.sessions.map((session) =>
				session.id === sessionId ? { ...session, active: activationStatus } : session
			)
		};

		return {
			classroom: updatedClassroom
		};
	}
}
export async function _updateClassroom(
	classroomId: number | null,
	classroom: {
		id: number;
		title: string;
		description: string;
		roomcode: string;
		isOpen: boolean;
		sessions: { id: number; title: string; active: boolean }[];
	},
	openStatus: boolean
) {
	const response = await fetch('/api/update-classroom', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			classroom_id: classroom.id,
			classroom_title: classroom.title,
			classroom_description: classroom.description,
			open_status: openStatus
		})
	});

	if (response.ok) {
		// Update the session.active property on the client side to avoid reloading page
		classroom.isOpen = openStatus;

		return {
			classroom: classroom
		};
	}
}

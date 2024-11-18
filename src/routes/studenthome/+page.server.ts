import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const classroomData = [
        { id: 1, title: 'Math 101'},
        { id: 2, title: 'Science 202' },
        { id: 3, title: 'History 303'}
    ];

    const sessionData = [
        { id: 1, title: 'Session A', expiresInSeconds: 1800 },
        { id: 2, title: 'Session B', expiresInSeconds: 3600 },
        { id: 3, title: 'Session C', expiresInSeconds: 5400 }
    ];

    return {
        classroomData,
        sessionData
    };
};
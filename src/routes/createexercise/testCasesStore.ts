import { writable } from 'svelte/store';

export const testCasesStore = writable<{ idCounter: number; testCases: any[] }>({
	idCounter: 0,
	testCases: []
});

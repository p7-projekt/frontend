import { writable } from 'svelte/store';
import type { PageLoad } from './$types';

const testCasesStore = writable<{ idCounter: number; testCases: any[] }>({
	idCounter: 0,
	testCases: []
});



export const load: PageLoad = (form) => {
	return { testCasesStore, form };
};

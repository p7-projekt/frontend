
import { writable } from 'svelte/store';

const testCasesStore = writable<{ idCounter: number, testCases: any[] }>({
    idCounter: 0,
    testCases: []
});

export { testCasesStore };
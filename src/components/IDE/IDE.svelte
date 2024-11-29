<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { StreamLanguage } from '@codemirror/language';
	import { haskell } from '@codemirror/legacy-modes/mode/haskell';
	import { python } from '@codemirror/legacy-modes/mode/python';

	export let codeSolutionText: string = '';
	export let solutionLanguage: { languageId: number; language: string };
	export let editable: boolean = true;
	let previousSolutionLanguage: { languageId: number; language: string };
	let unique = {};

	function restart() {
		unique = {};
	}

	function deepEqual(obj1, obj2) {
		return JSON.stringify(obj1) === JSON.stringify(obj2);
	}

	$: {
		if (!deepEqual(solutionLanguage, previousSolutionLanguage)) {
			console.log('solution language i ide' + solutionLanguage.language);
			getExtension();
			restart();
			previousSolutionLanguage = solutionLanguage;
		}
	}

	const haskellExtension = [StreamLanguage.define(haskell)];
	const pythonExtension = [StreamLanguage.define(python)];

	function getExtension() {
		switch (solutionLanguage.language.toLowerCase()) {
			case 'haskell':
				return haskellExtension;
			case 'python':
				return pythonExtension;
			default:
				return [];
		}
	}
</script>

{#if solutionLanguage != undefined}
	{#key unique}
		<CodeMirror
			{editable}
			class="w-full h-full"
			bind:value={codeSolutionText}
			extensions={getExtension()}
		/>
	{/key}
{/if}

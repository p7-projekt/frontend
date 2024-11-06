<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { StreamLanguage } from '@codemirror/language';
	import { haskell } from '@codemirror/legacy-modes/mode/haskell';

	export let codeSolutionText: string = '';
	export let solutionLanguage: string = 'haskell';
	export let editable: boolean = true;

	const haskellExtension = [StreamLanguage.define(haskell)];

	function getExtension() {
		switch (solutionLanguage) {
			case 'haskell':
				return haskellExtension;
			default:
				return [];
		}
	}
</script>

<CodeMirror
	{editable}
	class="w-full h-full"
	bind:value={codeSolutionText}
	extensions={getExtension()}
/>

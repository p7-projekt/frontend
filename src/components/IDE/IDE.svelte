<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { StreamLanguage } from '@codemirror/language';
	import { haskell } from '@codemirror/legacy-modes/mode/haskell';

	export let codeSolutionText: string = '';
	export let editable: boolean = true;

	const extensions = [StreamLanguage.define(haskell)];
</script>

<CodeMirror {editable} class="w-full h-full" bind:value={codeSolutionText} {extensions} />

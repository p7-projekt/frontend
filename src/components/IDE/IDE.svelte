<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { StreamLanguage } from '@codemirror/language';
	import { haskell } from '@codemirror/legacy-modes/mode/haskell';

	export let codeSolutionText: string = '';

	const extensions = [StreamLanguage.define(haskell)];
</script>

<CodeMirror class="w-full h-full" bind:value={codeSolutionText} {extensions} />

<script lang="ts">
	import { toast } from 'svelte-sonner';
	export let textToCopy = '';

	function copyToClipboard() {
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				toast('Copied to clipboard!');
			})
			.catch((error) => {
				console.error('Failed to copy text: ', error);
			});
	}
</script>

<div class="p-2 pr-12 border rounded-md bg-gray-100 flex items-center relative">
	<span class="break-all"> {textToCopy}</span>
	<button
		class="hover:bg-[#dbdcdd] p-2 rounded-md absolute right-2 top-2"
		on:click={copyToClipboard}
	>
		<div>
			<svg
				aria-hidden="true"
				height="16"
				viewBox="0 0 16 16"
				version="1.1"
				width="16"
				data-view-component="true"
				class="octicon octicon-copy js-clipboard-copy-icon"
			>
				<path
					d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
				></path>
				<path
					d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
				></path>
			</svg>
		</div>
	</button>
</div>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	export let textToCopy = '';

	function copyToClipboard() {
		const input = document.createElement('input');
		input.value = textToCopy;

		// Append the input to the body, select its content, and copy it
		document.body.appendChild(input);
		input.select();
		const successful = document.execCommand('copy');
		document.body.removeChild(input);

		if (successful) {
			toast('Copied to clipboard!');
		} else {
			console.error('Failed to copy text');
		}
	}
</script>

<div class="p-2 border rounded-md bg-gray-100 flex justify-between min-w-[7.75rem] max-w-max">
	<span class="break-all flex items-center">
		{textToCopy}
	</span>
	<div class="flex items-start">
		<button class="hover:bg-[#dbdcdd] p-2 rounded-md right-0 top-0" on:click={copyToClipboard}>
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
</div>

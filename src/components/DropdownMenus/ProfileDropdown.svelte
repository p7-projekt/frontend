<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		><svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="#1f2937"
			class="size-7 icon"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
			/>
		</svg></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="bg-[#fff]">
		<DropdownMenu.Group>
			<DropdownMenu.Item
				class="cursor-pointer"
				on:click={async () => {
					const response = await fetch('/api/logout', { method: 'POST' });
					if (response.ok) {
						invalidateAll();
						goto('/join');
					}
				}}>Log out</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

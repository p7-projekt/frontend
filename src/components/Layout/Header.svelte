<script lang="ts">
	import ProfileDropdown from '$components/DropdownMenus/ProfileDropdown.svelte';
	export let user;
</script>

<!-- 
 - Font sizes (px)
10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98

 e.g. SPACING SYSTEM (px)
2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 
-->
<header
	class="py-4 px-4 sm:px-5 bg-white min-h-[70px] tracking-wide relative z-50 text-[#333] font-medium"
>
	<div class="grid grid-cols-3 justify-between gap-4 w-full">
		<div>
			<a href="/" class="inline-block font-medium text-[18px]">Home</a>
		</div>

		<div class="text-center">
			<a href="/session" class=" font-medium text-[18px]">Session</a>
		</div>

		{#if user.role === 3}
			<div class="flex items-center ml-auto space-x-6">
				<div
					class="text-[18px] px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
				>
					<a href="/login">Login</a>
				</div>
				<!-- <div class="flex items-center ml-auto space-x-6">
				<div class="font-medium text-[18px] border-none outline-none">
					<a href="/login">Login</a>
				</div>
				<a
					href="/signup"
					class="text-[18px] px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
					>Sign up</a
				> -->
			</div>
		{:else}
			<div class="flex items-center ml-auto space-x-6">
				<p>Hello {user.name}</p>
				<ProfileDropdown />
			</div>
		{/if}
	</div>
</header>

<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$components/Layout/Header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen bg-[#fcfdfd]">
	<Header user={data.user} />
	<main>
		<Toaster />
		<slot />
	</main>
</div>

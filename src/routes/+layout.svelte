<script lang="ts">
	import '../app.css';
	import { invalidateAll } from '$app/navigation';
	import Header from '$components/Layout/Header.svelte';
	import Footer from '$components/Layout/Footer.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
	<Header user={data.user} />
	<main>
		<slot />
	</main>
	<Footer />
</div>

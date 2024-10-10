<script lang="ts">
	import '../app.css';
	import Header from '$components/Layout/Header.svelte';
	import Footer from '$components/Layout/Footer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.user);
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
	<Header user={data.user} />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<script>
	import '../app.css';
	import Header from '$components/Layout/Header.svelte';
	import Footer from '$components/Layout/Footer.svelte';
	export let data;
	console.log(data.user);
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
	<Header user={data.user} />
	<main>
		<slot />
	</main>
	<Footer />
</div>

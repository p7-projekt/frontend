<script>
	import '../app.css';
	import Header from '$components/Layout/Header.svelte';
	import Footer from '$components/Layout/Footer.svelte';
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>

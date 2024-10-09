<script>
	import '../app.css';
	import Header from '$components/Layout/Header.svelte';
	import Footer from '$components/Layout/Footer.svelte';
</script>

<div class="grid grid-rows-[1fr_auto] min-h-screen">
	<Header />
	<slot />
	<Footer />
</div>

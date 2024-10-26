<script lang="ts">
	import { onMount } from 'svelte';

	export let seconds_remaining: number;

	let remaining_time = seconds_remaining;

	function startTimer() {
		const interval = setInterval(() => {
			if (remaining_time > 0) {
				remaining_time--;
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}

	onMount(() => {
		startTimer();
		return () => clearInterval(interval); // Clear interval if the component is destroyed
	});

	$: hours = Math.floor(remaining_time / 3600);
	$: minutes = Math.floor((remaining_time % 3600) / 60);
	$: seconds = remaining_time % 60;
</script>

<p>
	{hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
</p>

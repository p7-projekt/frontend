<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	export let description_title: string = '';
	export let description_name: string = '';
	export let value: string = '';
	export let customClass: string = '';
	export let placeholder: string = 'Type your message here.';
</script>

<div class="grid gap-1.5">
	<Label class="text-base pl-1" for="message">{description_title} Description</Label>
	<Textarea name={description_name} {placeholder} id="message" bind:value class={customClass} />
</div>

<style>
</style>

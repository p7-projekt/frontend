<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	export const description_name = '';
</script>

<div class="grid gap-1.5 pl-6">
	<Label class="text-base" for="message">{description_name} Description</Label>
	<Textarea class="w-4/5" placeholder="Type your message here." id="message" />
</div>

<style>
</style>

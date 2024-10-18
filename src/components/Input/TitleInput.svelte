<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	export let input_title: string = '';
	export let input_name: string = '';
	export let value: string = '';
</script>

<div class="grid gap-1.5">
	<Label class="text-base pl-1" for="message">{input_title} Title</Label>
	<Input name={input_name} {value} />
</div>

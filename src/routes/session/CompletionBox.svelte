<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	export let isCompleted = false;
</script>

<Checkbox checked={isCompleted} />

<script>
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
</script>

<div class="grid grid-cols-2 text-[#333] mt-3">
	<div class="grid grid-cols-1 gap-y-6 pl-6 w-4/5">
		<h1 class="text-2xl font-semibold">Create Session</h1>
		<TitleInput />
		<DescriptionBox />
	</div>
</div>

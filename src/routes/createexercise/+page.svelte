<script lang="ts">
	import TestCase from '$components/Tests/TestCase.svelte';
	import TestCaseList from '$components/Tests/TestCaseList.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData; 
     
</script>

<main>
    <TestCase/>
    <TestCaseList />
</main>

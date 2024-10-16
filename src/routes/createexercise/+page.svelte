<script lang="ts">
	import TestCase from '$components/Tests/TestCase.svelte';
	import TestCaseList from '$components/Tests/TestCaseList.svelte';
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import type { PageData } from './$types';
    
    export let data: PageData; 
     
</script>

<main> 
    <Resizable.PaneGroup direction="horizontal" class="max-w max-h rounded-lg border"> 
        <Resizable.Pane defaultSize={50}>
          <div class="flex h-[200px] items-center justify-center p-6">
            <span class="font-semibold">Titel, description osv osv</span>
          </div>

          <TestCaseList />
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={50}>  
            <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">IDE</span>
            </div> 
        </Resizable.Pane>
      </Resizable.PaneGroup>

</main>

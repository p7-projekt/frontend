<script lang="ts">
	import TitleInput from '$components/Input/TitleInput.svelte';
import TestCase from '$components/Tests/TestCase.svelte';
	import TestCaseList from '$components/Tests/TestCaseList.svelte';
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import type { PageData } from './$types';
    
    export let data: PageData; 
     
</script>

<main> 
    <Resizable.PaneGroup direction="horizontal" class="max-w max-h rounded-lg border"> 
        <Resizable.Pane defaultSize={50}> 
          <div class="m-8">
          
          <TitleInput/>
          <DescriptionBox/> 
          <TestCaseList />

        </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={50}>  
            <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">IDE</span>
            </div> 
        </Resizable.Pane>
      </Resizable.PaneGroup>

</main>

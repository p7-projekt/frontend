<script lang="ts">
  import TitleInput from '$components/Input/TitleInput.svelte';
  import TestCaseList from '$components/Tests/TestCaseList.svelte';
  import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
  import { Button } from "$lib/components/ui/button/index.js"; 
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
          <div class="flex flex-col h-full items-center justify-center p-6 space-y-4">
              <span class="font-semibold">IDE</span>
              <div class="flex space-x-4">
                  <Button variant="default">Validate</Button>
                  <Button variant="default">Confirm</Button>
              </div>
          </div> 
      </Resizable.Pane>
  </Resizable.PaneGroup>
</main>
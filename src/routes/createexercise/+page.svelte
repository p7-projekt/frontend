<script lang="ts">
    import Ide from '$components/IDE/IDE.svelte';
    import TitleInput from '$components/Input/TitleInput.svelte';
    import TestCaseList from '$components/Tests/TestCaseList.svelte';
    import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
    import { Button } from "$lib/components/ui/button/index.js"; 
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import type { PageData } from './$types';
    
    export let data: PageData; 
</script>
  
<style>
    html, body {
        height: 100%;
        margin: 0;
    }
    main {
        height: 80vh;
        display: flex;
        flex-direction: column;
    }
    .pane-group {
        flex: 1;
        overflow: hidden;
    }
    .pane {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .content {
        flex: 1;
        overflow: hidden;
    }
    .ide-container {
        flex: 1;
        overflow: auto;
    }
</style>
  
<main> 
    <Resizable.PaneGroup direction="horizontal" class="pane-group max-w max-h rounded-lg border"> 
        <Resizable.Pane defaultSize={50} class="pane"> 
            <Resizable.PaneGroup direction="vertical">


                <Resizable.Pane defaultSize={25}>
            <div class="m-8 content">
                    
                    <TitleInput/>
                <DescriptionBox/> 

            </div>

                  </Resizable.Pane>
                  <Resizable.Handle />
                  <Resizable.Pane defaultSize={75}>
            <div class="m-8 content">
                   
                <TestCaseList />
            </div>
                    

                  </Resizable.Pane>





            </Resizable.PaneGroup>
                
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={50} class="pane">  
            <div class="flex flex-col h-full items-center justify-center p-6 space-y-4 content">
                <div class="ide-container w-full h-full">
                    <Ide/>
                </div>
                <div class="flex space-x-4">
                    <Button variant="default">Validate</Button>
                    <Button variant="default">Confirm</Button>
                </div>
            </div> 
        </Resizable.Pane>
    </Resizable.PaneGroup>
</main>
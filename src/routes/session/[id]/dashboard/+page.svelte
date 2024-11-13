<script lang="ts">
    import type { PageData } from './$types';
    import * as Accordion from "$lib/components/ui/accordion";
    export let data: PageData;
</script>


    <div
    class="container m-auto grid grid-cols-4"
    >
    <div class="tile col-span-2">
        <h1 class="text-2xl font-medium col-span-full text-center ">Exercises</h1>
    </div>
    <div class="tile">
        <h1 class="text-2xl font-medium col-span-full text-center">Solved</h1>
    </div>
    <div class="tile">
        <h1 class="text-2xl font-medium col-span-full text-center">Attempted</h1>
    </div>
    <div class="tile col-span-2">
        <Accordion.Root>
            <Accordion.Item value="item-1">
            <Accordion.Trigger>Exercise 1</Accordion.Trigger>
            <Accordion.Content>
                Hej Esben.
            </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    </div>
    <div class="tile flex items-center justify-center">
        <h1 class="tile-marker">1/10</h1>
    </div>
    <div class="tile flex items-center justify-center">
        <h1 class="tile-marker">5/10</h1>
    </div> 
</div>

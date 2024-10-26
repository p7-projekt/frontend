<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Button } from '$lib/components/ui/button/index.js'; 

    export let open: boolean = false;
    const dispatch = createEventDispatcher();

    function confirm() {
        dispatch('confirm');
        open = false;
    }

    function cancel() {
        dispatch('cancel');
        open = false;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Confirm Update</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            If you update your test template/schema, all current tests will be deleted. Do you want to proceed?
        </Dialog.Description>
        <Dialog.Footer class="flex justify-between">
            <Button variant="outline" on:click={cancel}>Cancel</Button>
            <Button variant="destructive" on:click={confirm}>Confirm</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
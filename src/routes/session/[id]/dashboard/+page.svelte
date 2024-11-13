<script lang="ts">
    import type { PageData } from './$types';
    import * as Accordion from '$lib/components/ui/accordion';
    import * as Dialog from '$lib/components/ui/dialog';
    import Ide from '$components/IDE/IDE.svelte';
    export let data: PageData;

    let openDialog = false;
    let selectedCode = '';
    let selectedLanguage = 'haskell';

    function handleSubmissionClick(submission: { name: string; solution: string; language: string }) {
        selectedCode = submission.solution;
        selectedLanguage = submission.language;
        openDialog = true;
    }
</script>

<div class="container m-auto grid grid-cols-4">
    <div class="tile col-span-2">
        <h1 class="text-2xl font-medium col-span-full text-center">Exercises</h1>
    </div>
    <div class="tile">
        <h1 class="text-2xl font-medium col-span-full text-center">Solved</h1>
    </div>
    <div class="tile">
        <h1 class="text-2xl font-medium col-span-full text-center">Attempted</h1>
    </div>

    {#each data.testData.exercises as exercise}
        <div class="tile col-span-2">
            <Accordion.Root>
                <Accordion.Item value={`item-${exercise.exerciseId}`}>
                    <Accordion.Trigger>{exercise.title}</Accordion.Trigger>
                    <Accordion.Content>
                        <div class="container m-auto grid grid-cols-4">
                            {#each exercise.submissions as submission}
                                <div class="tile flex items-center justify-center">
                                    <h1 class="tile-marker cursor-pointer" on:click={() => handleSubmissionClick(submission)}>
                                        {submission.name}
                                    </h1>
                                </div>
                            {/each}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
        <div class="tile flex items-center justify-center">
            <h1 class="tile-marker">{exercise.completedCount}/{data.testData.totalStudents}</h1>
        </div>
        <div class="tile flex items-center justify-center">
            <h1 class="tile-marker">{exercise.attemptedCount}/{data.testData.totalStudents}</h1>
        </div>
    {/each}
</div>

<Dialog.Root bind:open={openDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>View Submission</Dialog.Title>
        </Dialog.Header>
        <Ide bind:codeSolutionText={selectedCode} solutionLanguage={selectedLanguage} />
    </Dialog.Content>
</Dialog.Root>
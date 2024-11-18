<script lang="ts">
    import { goto } from '$app/navigation';
    import StudentClassroomDisplay from '$components/Student/StudentClassroomDisplay.svelte';
    import StudentSessionDisplay from '$components/Student/StudentSessionDisplay.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="container pl-6 w-full text-[#333] grid grid-cols-1 gap-y-8">
    <h1 class="text-2xl font-semibold col-span-full">Student Home</h1>
    <div class="flex gap-x-12 h-full">
        <main class="flex flex-1 flex-col w-1/2 h-[35.5rem]">
            {#if !data.classroomData || data.classroomData.length === 0}
                <div
                    class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                >
                    <div class="flex flex-col items-center gap-1 text-center">
                        <h3 class="text-2xl font-bold tracking-tight">You are not a part of any Classrooms</h3>
                        <p class="text-muted-foreground text-sm">
                            You can start coding as soon as you join a classroom.
                        </p>
                        <button
                            class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-5 px-10 mt-8"
                            on:click={() => goto('/join')}>Join Classroom</button
                        >
                    </div>
                </div>
            {:else}
                <StudentClassroomDisplay classroomData={data.classroomData} />
            {/if}
        </main>
        <main class="flex flex-1 flex-col w-1/2 h-[35.5rem]">
            {#if !data.sessionData || data.sessionData.length === 0}
                <div
                    class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                >
                    <div class="flex flex-col items-center gap-1 text-center">
                        <h3 class="text-2xl font-bold tracking-tight">You are not a part of any Sessions</h3>
                        <p class="text-muted-foreground text-sm">
                            You can start coding as soon as you join a session.
                        </p>
                        <button
                            class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-5 px-10 mt-8"
                            on:click={() => goto('/join')}>Join Session</button
                        >
                    </div>
                </div>
            {:else}
                <StudentSessionDisplay sessionData={data.sessionData} />
            {/if}
        </main>
    </div>
</div>
<script lang="ts">
    import type { PageData } from './$types';
    import * as Resizable from '$lib/components/ui/resizable/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { zodClient } from 'sveltekit-superforms/adapters';
    export { formSchema as form };
    import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
    import { formSchema, type FormSchema } from './schema';
     
    export let data: PageData;
    export let superFormData: SuperValidated<Infer<FormSchema>> = data.form;

    const form = superForm(superFormData, {
        validators: zodClient(formSchema),
        dataType: "json",
        } 
    );

    const { form: formData, enhance, errors } = form;
</script>

<main>
    <form method="GET" use:enhance class="max-w max-h">
        <Resizable.PaneGroup direction="horizontal" class="pane-group max-w max-h rounded-lg border">
            <Resizable.Pane defaultSize={50} class="pane">
                <Resizable.PaneGroup direction="vertical">
                    <Resizable.Pane defaultSize={60}>
                        <div class="m-8 content">
                            <!-- Your content here -->
                        </div>
                    </Resizable.Pane>
                    <Resizable.Handle />
                    <Resizable.Pane defaultSize={40}>
                        <div class="m-8 content">
                            <!-- Your content here -->
                        </div>
                    </Resizable.Pane>
                </Resizable.PaneGroup>
            </Resizable.Pane>
            <Resizable.Handle />
            <Resizable.Pane defaultSize={50} class="pane">
                <div class="flex flex-col h-full items-center justify-center p-6 space-y-4 content">
                    <!-- Your content here -->
                </div>
            </Resizable.Pane>
        </Resizable.PaneGroup>
    </form>
</main>
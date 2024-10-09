<script lang="ts">
    import type { PageData } from "./$types.js";
    import SettingsForm from "./login-form.svelte";
    export let data: PageData;
   </script>
    
   <SettingsForm data={data.form} />
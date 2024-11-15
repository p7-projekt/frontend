<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { debugLanguageSelector } from "$lib/debug";

    export let languages: string[] = ["Python", "Haskell"];
    export let selected: string = '';
    
    function selectLanguage(language: string) { 
        selected = language;
    }
</script>



<Select.Root portal={null}>
    <Select.Trigger class="w-[180px]">
      <Select.Value placeholder="Select a language" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label>Language</Select.Label>
        {#each languages as language}
          <Select.Item on:click={() => selectLanguage(language)} value={language} label={language}
            >{language}</Select.Item
          >
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="language" />
  </Select.Root>
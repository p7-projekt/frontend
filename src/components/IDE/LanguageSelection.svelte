<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js"; 

    export let languages: { languageId: number; language: string }[] = [];
    export let selected;
    
    function selectLanguage(language: { languageId: number; language: string }) { 
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
          <Select.Item on:click={() => selectLanguage(language)} value={language.languageId} label={language.language}
            >{language.language}</Select.Item
          >
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="language" />
  </Select.Root>
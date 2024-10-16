<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";  
  import { StreamLanguage } from "@codemirror/language";
  import { haskell } from "@codemirror/legacy-modes/mode/haskell"; 

  let value = "";

  const extensions = [ 
    StreamLanguage.define(haskell) 
  ];
</script>

<CodeMirror bind:value={value} extensions={extensions} />
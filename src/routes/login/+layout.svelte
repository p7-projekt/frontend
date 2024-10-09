<script lang="ts">
    import PrimaryButton from "$components/Buttons/PrimaryButton.svelte";
import * as Dialog from "$lib/components/ui/dialog";
   </script>
    
   <Dialog.Root>
    <Dialog.Trigger>  
        <PrimaryButton text="Login"></PrimaryButton> 
     </Dialog.Trigger>
    <Dialog.Content>
     <Dialog.Header>
      <Dialog.Title>Login</Dialog.Title>
       <slot />
     </Dialog.Header>
    </Dialog.Content>
   </Dialog.Root>


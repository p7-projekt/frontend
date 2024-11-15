<script lang="ts">
	import type { PageData } from './$types.js';
	import SignupForm from './sign-up-form.svelte';
	export let data: PageData;
  </script>
  
  <SignupForm data={data.form} signupSuccess={data.signupSuccess}/>
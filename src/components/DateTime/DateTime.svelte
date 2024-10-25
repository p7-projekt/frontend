<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import Timepicker from './Timepicker.svelte';
	import Datepicker from './Datepicker.svelte';
	import { type DateValue } from '@internationalized/date';
	import { createEventDispatcher } from 'svelte';

	let time_selected: string = '';
	let date_selected: DateValue;
	const dispatch = createEventDispatcher();

	function timeSelected(event) {
		time_selected = event.detail;
	}

	function dateSelected(event) {
		date_selected = event.detail;
	}

	$: if (time_selected && date_selected)
		dispatch('selectedDateTime', { date: date_selected, time: time_selected });
</script>

<div class="grid gap-1.5">
	<Label class="text-base pl-1" for="message">Pick an expiration time</Label>
	<div class="flex items-center">
		<Datepicker on:selectedDate={dateSelected} />
		<Timepicker on:selectedTime={timeSelected} />
	</div>
</div>

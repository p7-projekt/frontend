<script lang="ts">
	import { onMount } from 'svelte';

	let timeOptions: { hour: string; minute: string; period: string }[] = [];
	let selectedTime: string = '';
	let isTimepickerOpen: boolean = false;
	let timepickerContainer: HTMLDivElement;
	let timepickerInput: HTMLDivElement;

	// Generate time options with an interval (e.g., 30 minutes)
	function generateTimeOptions(interval: number) {
		const options = [];
		const startTime = new Date();
		startTime.setHours(0, 0, 0, 0);
		for (let i = 0; i < 24 * 60; i += interval) {
			const time = new Date(startTime.getTime() + i * 60000);
			let hour = time.getHours() % 12 || 12; // Convert to 12-hour format
			const minute = time.getMinutes().toString().padStart(2, '0');
			const period = time.getHours() < 12 ? 'AM' : 'PM';
			options.push({ hour: hour.toString().padStart(2, '0'), minute, period });
		}
		return options;
	}

	// Populate the time options when the component is mounted
	onMount(() => {
		timeOptions = generateTimeOptions(30); // 30-minute intervals
	});

	// Select time and close the timepicker
	function selectTime(option: { hour: string; minute: string; period: string }) {
		selectedTime = `${option.hour}:${option.minute} ${option.period}`;
		isTimepickerOpen = false;
	}

	// Toggle timepicker visibility
	function toggleTimepicker() {
		isTimepickerOpen = !isTimepickerOpen;
	}

	// Close timepicker when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (
			timepickerContainer &&
			!timepickerContainer.contains(event.target as Node) &&
			timepickerInput !== event.target
		) {
			isTimepickerOpen = false;
		}
	}

	// Add event listener for clicking outside
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative">
	<!-- Wrap everything in a button element -->
	<button type="button" class="flex items-center w-full" on:click={toggleTimepicker}>
		<div
			bind:this={timepickerInput}
			class="justify-between ring-offset-background focus-visible:ring-ring inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-accent hover:text-accent-foreground border h-10 px-4 py-2 w-[280px] justify-start text-left font-normal text-muted-foreground"
			placeholder="Select a time"
		>
			<!-- Make sure this div takes full width of the button -->
			<div class="grid grid-cols-2 w-1/4 pointer-events-none">
				<svg
					class="fill-current pointer-events-none"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_3185_947)">
						<path
							d="M10.4687 10.3125V5.28125C10.4687 4.90625 10.1562 4.59375 9.78125 4.59375C9.40625 4.59375 9.09375 4.90625 9.09375 5.28125V10.5937C9.09375 10.7812 9.15625 10.9687 9.28125 11.0937L12.75 14.625C12.875 14.75 13.0625 14.8437 13.25 14.8437C13.4375 14.8437 13.5937 14.7812 13.75 14.6562C14.0312 14.375 14.0312 13.9375 13.75 13.6562L10.4687 10.3125Z"
							fill=""
						/>
						<path
							d="M10 0.46875C4.78125 0.46875 0.5625 4.75 0.5625 10C0.5625 15.25 4.8125 19.5312 10 19.5312C15.1875 19.5312 19.4375 15.25 19.4375 10C19.4375 4.75 15.2188 0.46875 10 0.46875ZM10 18.125C5.5625 18.125 1.9375 14.4688 1.9375 10C1.9375 5.53125 5.5625 1.875 10 1.875C14.4375 1.875 18.0625 5.53125 18.0625 10C18.0625 14.4688 14.4375 18.125 10 18.125Z"
							fill=""
						/>
					</g>
					<defs>
						<clipPath id="clip0_3185_947">
							<rect width="20" height="20" fill="white" />
						</clipPath>
					</defs>
				</svg>
				{#if !selectedTime}
					<span class="pointer-events-none">Select time</span>
				{:else}
					{selectedTime}
				{/if}
			</div>
			<svg
				class="fill-current stroke-current pointer-events-none"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.29635 5.15354L2.29632 5.15357L2.30055 5.1577L7.65055 10.3827L8.00157 10.7255L8.35095 10.381L13.701 5.10603L13.701 5.10604L13.7035 5.10354C13.722 5.08499 13.7385 5.08124 13.7499 5.08124C13.7613 5.08124 13.7778 5.08499 13.7963 5.10354C13.8149 5.12209 13.8187 5.13859 13.8187 5.14999C13.8187 5.1612 13.815 5.17734 13.7973 5.19552L8.04946 10.8433L8.04945 10.8433L8.04635 10.8464C8.01594 10.8768 7.99586 10.8921 7.98509 10.8992C7.97746 10.8983 7.97257 10.8968 7.96852 10.8952C7.96226 10.8929 7.94944 10.887 7.92872 10.8721L2.20253 5.2455C2.18478 5.22733 2.18115 5.2112 2.18115 5.19999C2.18115 5.18859 2.18491 5.17209 2.20346 5.15354C2.222 5.13499 2.2385 5.13124 2.2499 5.13124C2.2613 5.13124 2.2778 5.13499 2.29635 5.15354Z"
					fill=""
					stroke=""
				/>
			</svg>
		</div>
		<input class="hidden" bind:value={selectedTime} />
	</button>

	{#if isTimepickerOpen}
		<div
			bind:this={timepickerContainer}
			class="absolute right-0 w-[162px] h-[262px] overflow-hidden overflow-y-auto mt-2 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-md shadow-datepicker p-2 no-scrollbar"
		>
			<!-- Time Options -->
			{#each timeOptions as option (option.hour + option.minute + option.period)}
				<button
					type="button"
					class="py-1 px-2 hover:bg-gray-200 dark:hover:bg-dark-3"
					on:click={() => selectTime(option)}
				>
					{option.hour}:{option.minute}
					{option.period}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Chrome, Safari and Opera */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>

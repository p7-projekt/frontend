<div class="container grid grid-cols-1 gap-y-8 w-full text-[#333] mt-3">
	<h1 class=" text-3xl font-semibold col-span-full">Random Classroom title</h1>

	<div>
		<h2 class="text-2xl font-semibold col-span-full mb-3">Description</h2>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit eligendi eius, maxime culpa
			nemo fugit magnam quod placeat recusandae unde. Ipsa, magni odio sunt a deserunt molestias
			dolorem eveniet placeat!
		</p>
	</div>
	<section>
		<h2 class="text-2xl font-semibold col-span-full mb-3">Sessions</h2>
		<!-- <div class=" border-[1.5px]">
			<FlexTable>
				<FlexTable.Header nr_cols={3}>
					<FlexTable.Column>Title</FlexTable.Column>
					<FlexTable.Column>Completed</FlexTable.Column>
					<FlexTable.Column />
				</FlexTable.Header>
				<FlexTable.Body>
					{#each session.exercises as exercise (exercise.id)}
						<FlexTable.Row nr_cols={3}>
							<FlexTable.Column>{exercise.name}</FlexTable.Column>
							<FlexTable.Column>
								<Checkbox
									checked={exercise.solved}
									disabled
									style="cursor: default !important; opacity: 1;"
								/>
							</FlexTable.Column>
							<FlexTable.Column>
								<button
									on:click={() => goto(`/exercise?exerciseid=${exercise.id}&seshid=${sessionId}`)}
									class="text-[1.125rem] px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] hover:bg-transparent hover:text-[#1f2937]"
								>
									Code
								</button>
							</FlexTable.Column>
						</FlexTable.Row>
					{/each}
				</FlexTable.Body>
			</FlexTable>
		</div> -->
	</section>
</div>

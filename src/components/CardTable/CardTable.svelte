<script>
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';

	export let session_title = 'My session';
</script>

<Card.Header>
	<Card.Title>Sessions</Card.Title>
	<Card.Description>Manage your sessions.</Card.Description>
</Card.Header>
<Card.Content>
	<Table.Root>
		<Table.Header>
			<Table.Row class="w-full">
				<Table.Head class="text-left">Title</Table.Head>
				<!-- <Table.Head>Status</Table.Head> -->
				<Table.Head colspan={6}></Table.Head>
				<Table.Head>Created at</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="font-medium">{session_title}</Table.Cell>
				<Table.Cell colspan={6}></Table.Cell>
				<Table.Cell><button>Edit</button></Table.Cell>
				<Table.Cell><button>Delete</button></Table.Cell>
				<Table.Cell class="hidden md:table-cell">2023-07-12 10:42 AM</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</Card.Content>
<!-- <Card.Footer>
	<div class="text-muted-foreground text-xs">
		Showing <strong>1-10</strong> of <strong>32</strong> products
	</div>
</Card.Footer> -->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Equipment</h1>
			<p class="mt-1 text-muted-foreground">
				Manage equipment required for movements (Barbell, Dumbbell, Kettlebell, etc.)
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Add Equipment
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Equipment List</Card.Title>
			<Card.Description>All available equipment for movements</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<p>No equipment yet</p>
				<p class="text-sm mt-2">Add equipment to assign to movements</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

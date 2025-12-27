<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Movement Patterns</h1>
			<p class="mt-1 text-muted-foreground">
				Manage the 10-point movement taxonomy (Squat, Hinge, Lunge, Push, Pull, etc.)
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Add Pattern
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Movement Patterns</Card.Title>
			<Card.Description>The core biomechanical movement classifications</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<p>No movement patterns yet</p>
				<p class="text-sm mt-2">Run the seed script to populate the 10 core patterns</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

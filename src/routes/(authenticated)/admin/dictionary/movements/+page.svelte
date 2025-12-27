<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { getAllModalities } from '$lib/remote/index.remote';
	import { Plus } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Movements</h1>
			<p class="mt-1 text-muted-foreground">
				Manage movements and their associated patterns, modalities, and equipment. This is the
				primary taxonomy for workouts, and will be the connective tissue for programming.
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Add Movement
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>All Movements</Card.Title>
			<Card.Description>Browse and manage movement definitions</Card.Description>
		</Card.Header>
		<Card.Content>
			{#each await getAllModalities() as modality}
				<p>{modality.code} - {modality.name}</p>
			{/each}
			<div class="text-center py-12 text-muted-foreground">
				<p>No movements yet</p>
				<p class="text-sm mt-2">Create your first movement to get started</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

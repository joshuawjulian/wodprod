<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Modalities</h1>
			<p class="mt-1 text-muted-foreground">
				Manage movement modalities: Monostructural (M), Gymnastics (G), Weightlifting (W)
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Add Modality
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Modalities</Card.Title>
			<Card.Description>
				Differentiation logic for exercises with different physiological intents
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<p>No modalities yet</p>
				<p class="text-sm mt-2">Run the seed script to populate M, G, and W modalities</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

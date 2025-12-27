<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Gym Management</h1>
			<p class="mt-1 text-muted-foreground">
				Manage gyms, memberships, and permissions
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Create Gym
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>All Gyms</Card.Title>
			<Card.Description>Browse and manage gym locations and memberships</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<p>No gyms yet</p>
				<p class="text-sm mt-2">Create your first gym to get started</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<script lang="ts">
	import MovementForm from '$lib/components/movement-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import ResponsiveModal from '$lib/components/ui/responsive-modal.svelte';
	import { deleteMovementItem, getMovements } from '$lib/remote/index.remote';
	import type { MovementWithRelationsType } from '$lib/types';
	import { Pencil, Plus, Trash2 } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let refreshKey = $state(0);
	let modalOpen = $state(false);
	let selectedMovement = $state<MovementWithRelationsType | undefined>(undefined);
	let deleteConfirmId = $state<string | null>(null);

	function openCreateModal() {
		selectedMovement = undefined;
		modalOpen = true;
	}

	function openEditModal(movement: MovementWithRelationsType) {
		selectedMovement = movement;
		modalOpen = true;
	}

	async function handleDelete(id: string) {
		const result = await deleteMovementItem(id);
		if (result.success) {
			toast.success('Movement deleted successfully');
			getMovements().refresh();
		} else {
			toast.error(result.error ?? 'Failed to delete movement');
		}
		deleteConfirmId = null;
	}

	function handleFormSuccess() {
		modalOpen = false;
		getMovements().refresh();
	}

	// Helper to get modality badge color
	function getModalityColor(code: string): string {
		switch (code) {
			case 'M':
				return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
			case 'G':
				return 'bg-green-500/10 text-green-500 border-green-500/20';
			case 'W':
				return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
			default:
				return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
		}
	}
</script>

<Toaster position="bottom-center" />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Movements</h1>
			<p class="mt-1 text-muted-foreground">
				Manage movements and their associated patterns, modalities, and equipment
			</p>
		</div>
		<Button class="gap-2" onclick={openCreateModal}>
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
			<svelte:boundary>
				{#each await getMovements() as movement}
					<div class="flex items-start justify-between border-b py-3 last:border-0">
						<div class="flex-1 space-y-1">
							<div class="flex items-center gap-2">
								<p class="font-medium">{movement.name}</p>
								<Badge variant="outline" class={getModalityColor(movement.modality.code)}>
									{movement.modality.code}
								</Badge>
							</div>
							<p class="text-sm text-muted-foreground line-clamp-1">
								{movement.standards}
							</p>
							<div class="flex flex-wrap gap-1 text-xs">
								{#if movement.patterns && movement.patterns.length > 0}
									<span class="text-muted-foreground">Patterns:</span>
									{#each movement.patterns as pattern, idx}
										<span class="text-muted-foreground">
											{pattern.name}
											<span class="font-medium">
												({pattern.dominance === 'Primary' ? 'P' : 'S'})
											</span>{idx < movement.patterns.length - 1 ? ',' : ''}
										</span>
									{/each}
								{/if}
							</div>
							{#if movement.equipment && movement.equipment.length > 0}
								<div class="flex flex-wrap gap-1 text-xs text-muted-foreground">
									<span>Equipment:</span>
									{#each movement.equipment as equipment, idx}
										<span>
											{equipment.name}{idx < movement.equipment.length - 1 ? ',' : ''}
										</span>
									{/each}
								</div>
							{/if}
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="gap-2"
								onclick={() => openEditModal(movement)}
							>
								<Pencil class="h-4 w-4" />
								Edit
							</Button>
							{#if deleteConfirmId === movement.id}
								<Button variant="destructive" size="sm" onclick={() => handleDelete(movement.id)}>
									Confirm Delete
								</Button>
								<Button variant="outline" size="sm" onclick={() => (deleteConfirmId = null)}>
									Cancel
								</Button>
							{:else}
								<Button
									variant="destructive"
									size="sm"
									class="gap-2"
									onclick={() => (deleteConfirmId = movement.id)}
								>
									<Trash2 class="h-4 w-4" />
									Delete
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</svelte:boundary>
		</Card.Content>
	</Card.Root>
</div>

<!-- Create/Edit Modal -->
<ResponsiveModal
	bind:open={modalOpen}
	title={selectedMovement ? 'Edit Movement' : 'Create Movement'}
	description={selectedMovement
		? 'Update the movement details and associations'
		: 'Add a new movement to your exercise library'}
>
	<MovementForm
		movement={selectedMovement}
		onSuccess={handleFormSuccess}
		onCancel={() => (modalOpen = false)}
	/>
</ResponsiveModal>

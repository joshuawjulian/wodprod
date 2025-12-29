<script lang="ts">
	import MovementPatternForm from '$lib/components/movement-pattern-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ResponsiveModal from '$lib/components/ui/responsive-modal.svelte';
	import { deletePattern, getMovementPatterns } from '$lib/remote/index.remote';
	import type { MovementPatternType } from '$lib/types';
	import { Pencil, Plus, Trash2 } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let refreshKey = $state(0);
	let modalOpen = $state(false);
	let selectedPattern = $state<MovementPatternType | undefined>(undefined);
	let deleteConfirmId = $state<string | null>(null);

	function openCreateModal() {
		selectedPattern = undefined;
		modalOpen = true;
	}

	function openEditModal(pattern: MovementPatternType) {
		selectedPattern = pattern;
		modalOpen = true;
	}

	async function handleDelete(id: string) {
		const result = await deletePattern(id);
		if (result.success) {
			toast.success('Pattern deleted successfully');
			getMovementPatterns().refresh();
		} else {
			toast.error(result.error ?? 'Failed to delete pattern');
		}
		deleteConfirmId = null;
	}

	function handleFormSuccess() {
		modalOpen = false;
		getMovementPatterns().refresh();
	}
</script>

<Toaster position="bottom-center" />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Movement Patterns</h1>
			<p class="mt-1 text-muted-foreground">
				Manage the 10-point movement taxonomy (Squat, Hinge, Lunge, Push, Pull, etc.)
			</p>
		</div>
		<Button class="gap-2" onclick={openCreateModal}>
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
			<svelte:boundary>
				{#each await getMovementPatterns() as pattern}
					<div class="flex items-center justify-between border-b py-2 last:border-0">
						<div>
							<p class="font-medium">{pattern.name}</p>
							<p class="text-sm text-muted-foreground">{pattern.description}</p>
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="gap-2"
								onclick={() => openEditModal(pattern)}
							>
								<Pencil class="h-4 w-4" />
								Edit
							</Button>
							{#if deleteConfirmId === pattern.id}
								<Button variant="destructive" size="sm" onclick={() => handleDelete(pattern.id)}>
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
									onclick={() => (deleteConfirmId = pattern.id)}
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
	title={selectedPattern ? 'Edit Movement Pattern' : 'Create Movement Pattern'}
	description={selectedPattern
		? 'Update the movement pattern details'
		: 'Add a new movement pattern to your taxonomy'}
>
	<MovementPatternForm
		pattern={selectedPattern}
		onSuccess={handleFormSuccess}
		onCancel={() => (modalOpen = false)}
	/>
</ResponsiveModal>

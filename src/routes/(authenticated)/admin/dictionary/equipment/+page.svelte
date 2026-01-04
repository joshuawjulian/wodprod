<script lang="ts">
	import EquipmentForm from '$lib/components/equipment-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ResponsiveModal from '$lib/components/ui/responsive-modal.svelte';
	import { deleteEquipmentItem, getEquipment } from '$lib/remote/index.remote';
	import type { EquipmentType } from '$lib/types';
	import { Pencil, Plus, Trash2 } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let refreshKey = $state(0);
	let modalOpen = $state(false);
	let selectedEquipment = $state<EquipmentType | undefined>(undefined);
	let deleteConfirmId = $state<string | null>(null);

	function openCreateModal() {
		selectedEquipment = undefined;
		modalOpen = true;
	}

	function openEditModal(equipment: EquipmentType) {
		selectedEquipment = equipment;
		modalOpen = true;
	}

	async function handleDelete(id: string) {
		const result = await deleteEquipmentItem(id);
		if (result.success) {
			toast.success('Equipment deleted successfully');
			getEquipment().refresh();
		} else {
			toast.error(result.error ?? 'Failed to delete equipment');
		}
		deleteConfirmId = null;
	}

	function handleFormSuccess() {
		modalOpen = false;
		getEquipment().refresh();
	}
</script>

<Toaster position="bottom-center" />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Equipment</h1>
			<p class="mt-1 text-muted-foreground">
				Manage training equipment used in movements and workouts
			</p>
		</div>
		<Button class="gap-2" onclick={openCreateModal}>
			<Plus class="h-4 w-4" />
			Add Equipment
		</Button>
	</div>

	<!-- Content -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Equipment</Card.Title>
			<Card.Description>Training tools and equipment inventory</Card.Description>
		</Card.Header>
		<Card.Content>
			<svelte:boundary>
				{#each await getEquipment() as equipment}
					<div class="flex items-center justify-between border-b py-2 last:border-0">
						<div>
							<p class="font-medium">{equipment.name}</p>
							<p class="text-sm text-muted-foreground">{equipment.description}</p>
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="gap-2"
								onclick={() => openEditModal(equipment)}
							>
								<Pencil class="h-4 w-4" />
								Edit
							</Button>
							{#if deleteConfirmId === equipment.id}
								<Button variant="destructive" size="sm" onclick={() => handleDelete(equipment.id)}>
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
									onclick={() => (deleteConfirmId = equipment.id)}
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
	title={selectedEquipment ? 'Edit Equipment' : 'Create Equipment'}
	description={selectedEquipment
		? 'Update the equipment details'
		: 'Add new equipment to your inventory'}
>
	<EquipmentForm
		equipment={selectedEquipment}
		onSuccess={handleFormSuccess}
		onCancel={() => (modalOpen = false)}
	/>
</ResponsiveModal>

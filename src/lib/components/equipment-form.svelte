<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldGroup, FieldLabel, FieldError } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { createEquipmentItem, updateEquipmentItem } from '$lib/remote/index.remote';
	import { EquipmentFormSchema } from '$lib/types';
	import type { EquipmentType } from '$lib/types';
	import { toast } from 'svelte-sonner';

	type Props = {
		equipment?: EquipmentType;
		onSuccess: () => void;
		onCancel: () => void;
	};

	let { equipment, onSuccess, onCancel }: Props = $props();

	let name = $derived(equipment?.name ?? '');
	let description = $derived(equipment?.description ?? '');
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errors = {};

		// Validate form data
		const validation = EquipmentFormSchema.safeParse({ name, description });

		if (!validation.success) {
			const fieldErrors = validation.error.flatten().fieldErrors;
			errors = {
				name: fieldErrors.name?.[0] ?? '',
				description: fieldErrors.description?.[0] ?? ''
			};
			loading = false;
			return;
		}

		// Call appropriate remote function
		const result = equipment
			? await updateEquipmentItem({ id: equipment.id, name, description })
			: await createEquipmentItem(validation.data);

		loading = false;

		if (!result.success) {
			toast.error(result.error ?? 'An error occurred');
			return;
		}

		toast.success(equipment ? 'Equipment updated successfully' : 'Equipment created successfully');
		onSuccess();
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<FieldGroup>
		<Field>
			<FieldLabel for="name">Name</FieldLabel>
			<Input
				id="name"
				bind:value={name}
				placeholder="e.g., Barbell, Dumbbells, Kettlebell"
				required
				aria-invalid={!!errors.name}
			/>
			{#if errors.name}
				<FieldError>{errors.name}</FieldError>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="description">Description</FieldLabel>
			<Textarea
				id="description"
				bind:value={description}
				placeholder="Describe the equipment..."
				rows={4}
				required
				aria-invalid={!!errors.description}
			/>
			{#if errors.description}
				<FieldError>{errors.description}</FieldError>
			{/if}
		</Field>
	</FieldGroup>

	<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
		<Button type="button" variant="outline" onclick={onCancel} disabled={loading}>Cancel</Button>
		<Button type="submit" disabled={loading}>
			{loading ? 'Saving...' : equipment ? 'Update Equipment' : 'Create Equipment'}
		</Button>
	</div>
</form>

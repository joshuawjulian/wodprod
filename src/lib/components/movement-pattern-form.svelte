<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldGroup, FieldLabel, FieldError } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { createPattern, updatePattern } from '$lib/remote/index.remote';
	import { MovementPatternFormSchema } from '$lib/types';
	import type { MovementPatternType } from '$lib/types';
	import { toast } from 'svelte-sonner';

	type Props = {
		pattern?: MovementPatternType;
		onSuccess: () => void;
		onCancel: () => void;
	};

	let { pattern, onSuccess, onCancel }: Props = $props();

	let name = $state(pattern?.name ?? '');
	let description = $state(pattern?.description ?? '');
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errors = {};

		// Validate form data
		const validation = MovementPatternFormSchema.safeParse({ name, description });

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
		const result = pattern
			? await updatePattern({ id: pattern.id, name, description })
			: await createPattern(validation.data);

		loading = false;

		if (!result.success) {
			toast.error(result.error ?? 'An error occurred');
			return;
		}

		toast.success(pattern ? 'Pattern updated successfully' : 'Pattern created successfully');
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
				placeholder="e.g., Squat, Hinge, Lunge"
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
				placeholder="Describe the movement pattern..."
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
		<Button type="button" variant="outline" onclick={onCancel} disabled={loading}>
			Cancel
		</Button>
		<Button type="submit" disabled={loading}>
			{loading ? 'Saving...' : pattern ? 'Update Pattern' : 'Create Pattern'}
		</Button>
	</div>
</form>

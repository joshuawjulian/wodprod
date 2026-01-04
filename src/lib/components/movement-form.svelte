<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		createMovementItem,
		getAllModalities,
		getEquipment,
		getMovementPatterns,
		getMovements,
		updateMovementItem
	} from '$lib/remote/index.remote';
	import type { MovementWithRelationsType } from '$lib/types';
	import { MovementFormSchema } from '$lib/types';
	import { toast } from 'svelte-sonner';

	type Props = {
		movement?: MovementWithRelationsType;
		onSuccess: () => void;
		onCancel: () => void;
	};

	let { movement, onSuccess, onCancel }: Props = $props();

	// Form fields - using $derived to properly track movement changes
	let name = $state(movement?.name ?? '');
	let standards = $state(movement?.standards ?? '');
	let videoUrl = $state(movement?.videoUrl ?? '');
	let modalityId = $state(movement?.modalityId ?? '');
	let parentMovementId = $state(movement?.parentMovementId ?? '');

	// Pattern selections with dominance
	let selectedPatterns = $state<Map<string, 'Primary' | 'Secondary'>>(
		new Map(movement?.patterns?.map((p) => [p.id, p.dominance]) ?? [])
	);

	// Equipment selections
	let selectedEquipmentIds = $state<Set<string>>(
		new Set(movement?.equipment?.map((e) => e.id) ?? [])
	);

	// Derived values for select components
	let modalities = $state<any[]>([]);
	let movements = $state<any[]>([]);

	$effect(() => {
		getAllModalities().then((m) => (modalities = m));
		getMovements().then((m) => (movements = m));
	});

	const modalityLabel = $derived(
		modalities.find((m) => m.id === modalityId)
			? `${modalities.find((m) => m.id === modalityId).code} - ${modalities.find((m) => m.id === modalityId).name}`
			: 'Select modality'
	);

	const parentMovementLabel = $derived(
		movements.find((m) => m.id === parentMovementId)?.name ??
			'Select parent movement for progressions'
	);

	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	function togglePattern(patternId: string) {
		const newMap = new Map(selectedPatterns);
		if (newMap.has(patternId)) {
			newMap.delete(patternId);
		} else {
			newMap.set(patternId, 'Primary');
		}
		selectedPatterns = newMap;
	}

	function setPatternDominance(patternId: string, dominance: 'Primary' | 'Secondary') {
		const newMap = new Map(selectedPatterns);
		newMap.set(patternId, dominance);
		selectedPatterns = newMap;
	}

	function toggleEquipment(equipmentId: string) {
		const newSet = new Set(selectedEquipmentIds);
		if (newSet.has(equipmentId)) {
			newSet.delete(equipmentId);
		} else {
			newSet.add(equipmentId);
		}
		selectedEquipmentIds = newSet;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errors = {};

		// Convert selectedPatterns Map to array of {id, dominance}
		const patterns = Array.from(selectedPatterns.entries()).map(([id, dominance]) => ({
			id,
			dominance
		}));

		// Convert selectedEquipmentIds Set to array
		const equipmentIds = Array.from(selectedEquipmentIds);

		// Validate form data
		const validation = MovementFormSchema.safeParse({
			name,
			standards,
			videoUrl: videoUrl || undefined,
			modalityId,
			patterns,
			equipmentIds,
			parentMovementId: parentMovementId || undefined
		});

		if (!validation.success) {
			const fieldErrors = validation.error.flatten().fieldErrors;
			errors = {
				name: fieldErrors.name?.[0] ?? '',
				standards: fieldErrors.standards?.[0] ?? '',
				videoUrl: fieldErrors.videoUrl?.[0] ?? '',
				modalityId: fieldErrors.modalityId?.[0] ?? '',
				patterns: fieldErrors.patterns?.[0] ?? '',
				equipmentIds: fieldErrors.equipmentIds?.[0] ?? '',
				parentMovementId: fieldErrors.parentMovementId?.[0] ?? ''
			};
			loading = false;
			return;
		}

		// Call appropriate remote function
		const result = movement
			? await updateMovementItem({ id: movement.id, ...validation.data })
			: await createMovementItem(validation.data);

		loading = false;

		if (!result.success) {
			toast.error(result.error ?? 'An error occurred');
			return;
		}

		toast.success(movement ? 'Movement updated successfully' : 'Movement created successfully');
		onSuccess();
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<FieldGroup>
		<!-- Name -->
		<Field>
			<FieldLabel for="name">Name</FieldLabel>
			<Input
				id="name"
				bind:value={name}
				placeholder="e.g., Back Squat, Deadlift, Pull-up"
				required
				aria-invalid={!!errors.name}
			/>
			{#if errors.name}
				<FieldError>{errors.name}</FieldError>
			{/if}
		</Field>

		<!-- Standards -->
		<Field>
			<FieldLabel for="standards">Standards / Form Cues</FieldLabel>
			<Textarea
				id="standards"
				bind:value={standards}
				placeholder="Describe proper form and performance standards..."
				rows={4}
				required
				aria-invalid={!!errors.standards}
			/>
			{#if errors.standards}
				<FieldError>{errors.standards}</FieldError>
			{/if}
		</Field>

		<!-- Video URL -->
		<Field>
			<FieldLabel for="videoUrl">Video URL (optional)</FieldLabel>
			<Input
				id="videoUrl"
				type="url"
				bind:value={videoUrl}
				placeholder="https://..."
				aria-invalid={!!errors.videoUrl}
			/>
			{#if errors.videoUrl}
				<FieldError>{errors.videoUrl}</FieldError>
			{/if}
		</Field>

		<!-- Modality -->
		<Field>
			<FieldLabel for="modality">Modality</FieldLabel>
			<Select.Root type="single" bind:value={modalityId}>
				<Select.Trigger id="modality" aria-invalid={!!errors.modalityId} class="w-full">
					{modalityLabel}
				</Select.Trigger>
				<Select.Content>
					{#each modalities as modality}
						<Select.Item value={modality.id} label="{modality.code} - {modality.name}">
							{modality.code} - {modality.name}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			{#if errors.modalityId}
				<FieldError>{errors.modalityId}</FieldError>
			{/if}
		</Field>

		<!-- Movement Patterns with Dominance -->
		<Field>
			<FieldLabel>Movement Patterns</FieldLabel>
			<div class="space-y-2">
				{#each await getMovementPatterns() as pattern}
					<div class="flex items-center justify-between rounded border p-3">
						<div class="flex items-center gap-2">
							<Checkbox
								id="pattern-{pattern.id}"
								checked={selectedPatterns.has(pattern.id)}
								onCheckedChange={() => togglePattern(pattern.id)}
							/>
							<Label for="pattern-{pattern.id}" class="cursor-pointer font-normal">
								{pattern.name}
							</Label>
						</div>
						{#if selectedPatterns.has(pattern.id)}
							<RadioGroup.Root
								value={selectedPatterns.get(pattern.id)}
								onValueChange={(value) => setPatternDominance(pattern.id, value)}
								class="flex gap-4"
							>
								<div class="flex items-center gap-1">
									<RadioGroup.Item value="Primary" id="primary-{pattern.id}" />
									<Label for="primary-{pattern.id}" class="cursor-pointer text-sm font-normal">
										Primary
									</Label>
								</div>
								<div class="flex items-center gap-1">
									<RadioGroup.Item value="Secondary" id="secondary-{pattern.id}" />
									<Label for="secondary-{pattern.id}" class="cursor-pointer text-sm font-normal">
										Secondary
									</Label>
								</div>
							</RadioGroup.Root>
						{/if}
					</div>
				{/each}
			</div>
			{#if errors.patterns}
				<FieldError>{errors.patterns}</FieldError>
			{/if}
		</Field>

		<!-- Equipment -->
		<Field>
			<FieldLabel>Equipment (optional)</FieldLabel>
			<div class="grid grid-cols-2 gap-2">
				{#each await getEquipment() as equipment}
					<div class="flex items-center gap-2">
						<Checkbox
							id="equipment-{equipment.id}"
							checked={selectedEquipmentIds.has(equipment.id)}
							onCheckedChange={() => toggleEquipment(equipment.id)}
						/>
						<Label for="equipment-{equipment.id}" class="cursor-pointer font-normal">
							{equipment.name}
						</Label>
					</div>
				{/each}
			</div>
			{#if errors.equipmentIds}
				<FieldError>{errors.equipmentIds}</FieldError>
			{/if}
		</Field>

		<!-- Parent Movement -->
		<Field>
			<FieldLabel for="parentMovement">Parent Movement (optional)</FieldLabel>
			<Select.Root
				selected={{ value: parentMovementId, label: '' }}
				onSelectedChange={(v) => (parentMovementId = v?.value ?? '')}
			>
				<Select.Trigger id="parentMovement">
					<Select.Value placeholder="Select parent movement for progressions" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="" label="None">None</Select.Item>
					{#each await getMovements() as mov}
						{#if !movement || mov.id !== movement.id}
							<Select.Item value={mov.id} label={mov.name}>
								{mov.name}
							</Select.Item>
						{/if}
					{/each}
				</Select.Content>
			</Select.Root>
			{#if errors.parentMovementId}
				<FieldError>{errors.parentMovementId}</FieldError>
			{/if}
		</Field>
	</FieldGroup>

	<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
		<Button type="button" variant="outline" onclick={onCancel} disabled={loading}>Cancel</Button>
		<Button type="submit" disabled={loading}>
			{loading ? 'Saving...' : movement ? 'Update Movement' : 'Create Movement'}
		</Button>
	</div>
</form>

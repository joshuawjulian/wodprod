<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { browser } from '$app/environment';

	type Props = {
		open: boolean;
		onOpenChange?: (open: boolean) => void;
		title: string;
		description?: string;
		children: import('svelte').Snippet;
	};

	let { open = $bindable(false), onOpenChange, title, description, children }: Props = $props();

	// Use a simple media query check
	let isDesktop = $state(browser ? window.matchMedia('(min-width: 768px)').matches : true);

	$effect(() => {
		if (!browser) return;
		const mediaQuery = window.matchMedia('(min-width: 768px)');
		const handler = (e: MediaQueryListEvent) => {
			isDesktop = e.matches;
		};
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});
</script>

{#if isDesktop}
	<Dialog.Root
		bind:open
		onOpenChange={(o) => {
			open = o;
			onOpenChange?.(o);
		}}
	>
		<Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				{#if description}
					<Dialog.Description>{description}</Dialog.Description>
				{/if}
			</Dialog.Header>
			{@render children()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root
		bind:open
		onOpenChange={(o) => {
			open = o;
			onOpenChange?.(o);
		}}
	>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>{title}</Drawer.Title>
				{#if description}
					<Drawer.Description>{description}</Drawer.Description>
				{/if}
			</Drawer.Header>
			<div class="px-4 pb-4">
				{@render children()}
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}

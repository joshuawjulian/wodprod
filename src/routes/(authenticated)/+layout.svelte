<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/client';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Box,
		Building2,
		Dumbbell,
		Home,
		ListChecks,
		LogOut,
		Menu,
		Settings,
		ShieldCheck,
		Target,
		User,
		X
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let sidebarOpen = $state(true);

	type NavItem = {
		href: string;
		label: string;
		icon: ComponentType;
	};

	const navItems: NavItem[] = [
		{ href: '/dashboard', label: 'Dashboard', icon: Home },
		{ href: '/workouts', label: 'Workouts', icon: ListChecks },
		{ href: '/movements', label: 'Movements', icon: Dumbbell },
		{ href: '/profile', label: 'Profile', icon: User },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];

	const adminNavItems: NavItem[] = [
		{ href: '/admin/dictionary/movements', label: 'Movements', icon: Dumbbell },
		{ href: '/admin/dictionary/movement-patterns', label: 'Movement Patterns', icon: Target },
		{ href: '/admin/dictionary/modalities', label: 'Modalities', icon: ShieldCheck },
		{ href: '/admin/dictionary/equipment', label: 'Equipment', icon: Box },
		{ href: '/admin/gyms', label: 'Gyms', icon: Building2 }
	];

	// Check if user is admin or super
	const isAdmin = $derived(
		data.user?.websiteRole === 'admin' || data.user?.websiteRole === 'super'
	);

	function isActive(href: string) {
		return $page.url.pathname === href;
	}

	async function handleSignOut() {
		await authClient.signOut();
		goto('/');
	}
</script>

<div class="flex h-screen overflow-hidden bg-background">
	<!-- Sidebar -->
	<aside
		class="flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 {sidebarOpen
			? 'w-64'
			: 'w-16'}"
	>
		<!-- Header -->
		<div class="flex h-16 items-center justify-between px-4">
			{#if sidebarOpen}
				<div class="flex flex-col">
					<h1 class="text-xl font-bold text-sidebar-foreground">User Panel</h1>
					<p class="text-sm text-sidebar-foreground">{data.user?.email}</p>
				</div>
			{/if}
			<button
				onclick={() => (sidebarOpen = !sidebarOpen)}
				class="rounded-md p-2 hover:bg-sidebar-accent"
				aria-label="Toggle sidebar"
			>
				{#if sidebarOpen}
					<X class="h-5 w-5 text-sidebar-foreground" />
				{:else}
					<Menu class="h-5 w-5 text-sidebar-foreground" />
				{/if}
			</button>
		</div>

		<Separator class="bg-sidebar-border" />

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 p-3">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {isActive(
						item.href
					)
						? 'bg-sidebar-primary text-sidebar-primary-foreground'
						: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}"
				>
					<item.icon class="h-5 w-5 shrink-0" />
					{#if sidebarOpen}
						<span>{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>
		{#if isAdmin}
			<nav class="flex-4 space-y-1 p-3">
				<Separator class="my-2 bg-sidebar-border" />
				<div class="flex h-16 items-center justify-between px-4">
					{#if sidebarOpen}
						<h1 class="text-xl font-bold text-sidebar-foreground">Admin Panel</h1>
					{/if}
				</div>
				<Separator class="my-2 bg-sidebar-border" />
				{#each adminNavItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {isActive(
							item.href
						)
							? 'bg-sidebar-primary text-sidebar-primary-foreground'
							: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}"
					>
						<item.icon class="h-5 w-5 shrink-0" />
						{#if sidebarOpen}
							<span>{item.label}</span>
						{/if}
					</a>
				{/each}
			</nav>
		{/if}

		<Separator class="bg-sidebar-border" />

		<!-- User section -->
		<div class="p-3">
			<button
				onclick={handleSignOut}
				class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
			>
				<LogOut class="h-5 w-5 shrink-0" />
				{#if sidebarOpen}
					<span>Sign Out</span>
				{/if}
			</button>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="container mx-auto p-6">
			{@render children()}
		</div>
	</main>
</div>

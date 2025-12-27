<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Database, Building2, ShieldCheck } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-foreground">Admin Dashboard</h1>
		<p class="mt-1 text-muted-foreground">
			Manage dictionary tables and gym memberships
		</p>
	</div>

	<!-- Quick Access Cards -->
	<div class="grid gap-4 md:grid-cols-2">
		<a href="/admin/dictionary/movements">
			<Card.Root class="transition-colors hover:bg-accent cursor-pointer">
				<Card.Header>
					<div class="flex items-center gap-3">
						<Database class="h-8 w-8 text-primary" />
						<div>
							<Card.Title>Dictionary Management</Card.Title>
							<Card.Description>
								Manage movements, patterns, modalities, and equipment
							</Card.Description>
						</div>
					</div>
				</Card.Header>
			</Card.Root>
		</a>

		<a href="/admin/gyms">
			<Card.Root class="transition-colors hover:bg-accent cursor-pointer">
				<Card.Header>
					<div class="flex items-center gap-3">
						<Building2 class="h-8 w-8 text-primary" />
						<div>
							<Card.Title>Gym Management</Card.Title>
							<Card.Description>
								Manage gyms, memberships, and user permissions
							</Card.Description>
						</div>
					</div>
				</Card.Header>
			</Card.Root>
		</a>
	</div>

	<!-- Info -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-3">
				<ShieldCheck class="h-6 w-6 text-muted-foreground" />
				<div>
					<Card.Title>Admin Access</Card.Title>
					<Card.Description>
						You have super user or admin privileges
					</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">
				This panel is only accessible to users with 'super' or 'admin' roles. Use the
				navigation menu to manage dictionary tables and gym memberships.
			</p>
		</Card.Content>
	</Card.Root>
</div>

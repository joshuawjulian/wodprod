<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus, TrendingUp, Activity, Calendar } from 'lucide-svelte';

	// Placeholder data - will be replaced with real data later
	const stats = [
		{
			title: 'Total Workouts',
			value: '24',
			description: 'This month',
			icon: Activity,
			trend: '+12%'
		},
		{
			title: 'Movement Patterns',
			value: '10',
			description: 'Fully balanced',
			icon: TrendingUp,
			trend: '100%'
		},
		{
			title: 'This Week',
			value: '5',
			description: 'Workouts completed',
			icon: Calendar,
			trend: '+2'
		}
	];
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
			<p class="mt-1 text-muted-foreground">
				Welcome back! Track your biomechanical workout progress.
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			New Workout
		</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 md:grid-cols-3">
		{#each stats as stat}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">{stat.title}</Card.Title>
					<stat.icon class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{stat.value}</div>
					<p class="text-xs text-muted-foreground">
						{stat.description}
						<span class="text-primary">{stat.trend}</span>
					</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- Recent Activity -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Recent Activity</Card.Title>
			<Card.Description>Your latest workout sessions and progress</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<Activity class="mx-auto h-12 w-12 mb-4 opacity-50" />
				<p>No recent activity yet</p>
				<p class="text-sm mt-2">Start by creating your first workout</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Movement Pattern Balance -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Movement Pattern Balance</Card.Title>
			<Card.Description>
				Distribution of the 10 core movement patterns in your training
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-12 text-muted-foreground">
				<TrendingUp class="mx-auto h-12 w-12 mb-4 opacity-50" />
				<p>No movement data yet</p>
				<p class="text-sm mt-2">Complete workouts to see your pattern balance</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>

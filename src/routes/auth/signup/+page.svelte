<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Description, Field, FieldGroup, Label } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { toast, Toaster } from 'svelte-sonner';

	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let loading = $state(false);

	async function handleSignup() {
		if (password !== passwordConfirm) {
			toast.error('Passwords do not match');
			return;
		}

		loading = true;
		const { error } = await authClient.signUp.email({
			email,
			password,
			name: email.split('@')[0]
		});

		loading = false;

		if (error && error.message) {
			console.error(error.message);
			toast.error(error.message);
		} else {
			goto('/dashboard');
		}
	}
</script>

<Toaster position="bottom-center" />
<div class="flex min-h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Create Account</Card.Title>
			<Card.Description>Enter your information to get started</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSignup();
				}}
			>
				<FieldGroup>
					<Field>
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							bind:value={email}
							name="email"
							required
						/>
						<Description>We'll never share your email with anyone else.</Description>
					</Field>
					<Field>
						<Label for="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							bind:value={password}
							required
						/>
						<Description>Must be at least 8 characters long.</Description>
					</Field>
					<Field>
						<Label for="confirm-password">Confirm Password</Label>
						<Input
							id="confirm-password"
							type="password"
							name="passwordConfirm"
							bind:value={passwordConfirm}
							required
						/>
					</Field>
					<Field>
						<Button type="submit" class="w-full" disabled={loading}>
							{loading ? 'Creating Account...' : 'Sign Up'}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/auth/signin" class="underline"> Sign in </a>
			</div>
		</Card.Content>
	</Card.Root>
</div>

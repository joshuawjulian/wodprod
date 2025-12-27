<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { toast, Toaster } from 'svelte-sonner';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleSignin() {
		loading = true;
		const { data, error } = await authClient.signIn.email({
			email,
			password
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
			<Card.Title class="text-2xl">Sign In</Card.Title>
			<Card.Description>Enter your email and password to access your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSignin();
				}}
			>
				<FieldGroup>
					<Field>
						<FieldLabel for="email">Email</FieldLabel>
						<Input
							id="email"
							type="email"
							bind:value={email}
							placeholder="you@example.com"
							name="email"
							required
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password">Password</FieldLabel>
							<a href="##" class="ms-auto inline-block text-sm underline">
								Forgot password?
							</a>
						</div>
						<Input
							id="password"
							bind:value={password}
							name="password"
							type="password"
							required
						/>
					</Field>
					<Field>
						<Button type="submit" class="w-full" disabled={loading}>
							{loading ? 'Signing in...' : 'Sign In'}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="/auth/signup" class="underline"> Sign up </a>
			</div>
		</Card.Content>
	</Card.Root>
</div>

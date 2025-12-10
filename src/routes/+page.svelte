<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Description, Field, FieldGroup, FieldLabel, Label } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs/';
	import { toast, Toaster } from 'svelte-sonner';
	import type { PageProps } from './$types';
	const session = authClient.useSession();

	let { data }: PageProps = $props();
	const emails = $derived(data.users.map((user) => user.email));

	let email = $state('');
	let password = $state('');
	let password_confirm = $state('');
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
			// Redirect on success
			goto('/dashboard');
		}
	}

	async function handleSignup() {
		loading = true;
		const { data, error } = await authClient.signUp.email({
			email,
			password,
			name: 'test'
		});

		loading = false;

		if (error && error.message) {
			console.error(error.message);
			toast.error(error.message);
		} else {
			// Success: Auto-login occurs by default unless email verification is required
			goto('/dashboard');
		}
	}
</script>

<Toaster position="bottom-center" />
<div class="flex flex-col h-screen w-full items-center justify-center px-4">
	<Tabs.Root value="login" class="w-[400px]">
		<Tabs.List>
			<Tabs.Trigger value="login">Login</Tabs.Trigger>
			<Tabs.Trigger value="register">Register</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<Card.Root class="mx-auto w-full max-w-sm">
				<Card.Header>
					<Card.Title class="text-2xl">Login</Card.Title>
					<Card.Description>Enter your email below to login to your account</Card.Description>
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
									placeholder="m@example.com"
									name="email"
									required
								/>
							</Field>
							<Field>
								<div class="flex items-center">
									<FieldLabel for="password">Password</FieldLabel>
									<a href="##" class="ms-auto inline-block text-sm underline">
										Forgot your password?
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
								<Button type="submit" class="w-full" disabled={loading}
									>{loading ? 'Signing in...' : 'Login'}</Button
								>
							</Field>
						</FieldGroup>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="register">
			<Card.Root>
				<Card.Header>
					<Card.Title>Create an account</Card.Title>
					<Card.Description>Enter your information below to create your account</Card.Description>
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
									placeholder="m@example.com"
									bind:value={email}
									name="email"
									required
								/>
								<Description>
									We'll use this to contact you. We will not share your email with anyone else.
								</Description>
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
									name="password_confirm"
									bind:value={password_confirm}
									required
								/>
								<Description>Please confirm your password.</Description>
							</Field>
							<FieldGroup>
								<Field>
									<Button type="submit" disabled={loading}
										>{loading ? 'Creating Account...' : 'Sign Up'}</Button
									>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
	<div>
		<pre>Emails: {emails}</pre>
	</div>
	<div>
		{#if $session.data}
			<div>
				<p>
					{$session.data.user.email}
				</p>
				<button
					onclick={async () => {
						await authClient.signOut();
					}}
				>
					Sign Out
				</button>
			</div>
		{:else}
			Not logged in
		{/if}
	</div>
</div>

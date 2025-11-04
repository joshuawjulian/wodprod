<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
</script>

<div class="flex h-screen w-screen items-center justify-center bg-accent">
	<div class="flex h-[80vh] w-[80vh] items-center justify-center shadow-lg">
		<div class="flex flex-col">
			<h1 class="self-center text-4xl">Register/Login Test page</h1>

			<form method="POST" action="?/login">
				<label for="email">Email</label>
				<Input type="email" id="email" name="email" required />
				<label for="password">Password</label>
				<Input type="password" id="password" name="password" required />
				<Button type="submit" class="w-100 px-4 py-2">Login</Button>
				<Button type="submit" class="w-100 px-4 py-2" formaction="?/register"
					>Register</Button>
			</form>
		</div>
	</div>
</div>

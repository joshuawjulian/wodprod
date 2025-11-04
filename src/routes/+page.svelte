<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<h1>Login Test page</h1>

<form method="POST" action="/login">
	<label for="email">Email:</label>
	<input type="email" id="email" name="email" required />
	<br />
	<label for="password">Password:</label>
	<input type="password" id="password" name="password" required />
	<br />
	<Button
		type="submit"
		class="rounded bg-background px-4 py-2 text-foreground hover:bg-secondary/40"
		>Login</Button
	>
</form>

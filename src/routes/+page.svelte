<script lang="ts">
	import LoginForm from "$lib/components/login-form.svelte";
	import SignupForm from "$lib/components/signup-form.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<script lang="ts">
 import * as Tabs from "$lib/components/ui/tabs/index.js";
	</script>

	<Tabs.Root value="login" class="w-[400px]">
		<Tabs.List>
			<Tabs.Trigger value="login">Login</Tabs.Trigger>
			<Tabs.Trigger value="register">Register</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<LoginForm action="?/login" />
		</Tabs.Content>
		<Tabs.Content value="register">
			<SignupForm action="?/signup" />
		</Tabs.Content>
	</Tabs.Root>
</div>

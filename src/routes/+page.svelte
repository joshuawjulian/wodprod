<script lang="ts">
	import LoginSignup from '../components/LoginSignup.svelte';
	import ThemeSelector from '../components/ThemeSelector.svelte';
</script>

<div class="absolute left-0 top-0"><ThemeSelector /></div>
<div class="h-screen flex items-center w-full justify-center">
	<div class="h-96">
		<LoginSignup />
	</div>
</div>

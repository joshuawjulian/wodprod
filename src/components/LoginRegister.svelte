<script lang="ts">
	// This component is used for login and signup forms.
	// It uses tabs to switch between login and signup forms.
	// The forms are styled with Tailwind CSS classes.
	const { loginAction, registerAction } = $props();
</script>

<div class="tabs tabs-border min-w-96">
	<input
		type="radio"
		name="login_register_tabs"
		class="tab"
		checked
		aria-label="Login"
	/>
	<div
		class="tab-content shadow-base-300 shadow border-base-300 bg-base-100 p-10"
	>
		<form method="POST" action={loginAction}>
			<label class="floating-label">
				<span class="label">Email</span>
				<input
					type="email"
					placeholder="Email"
					class="input input-bordered"
					name="email"
				/>
			</label>
			<label class="floating-label py-2">
				<span class="label">Password</span>
				<input
					type="password"
					placeholder="Password"
					class="input input-bordered"
					name="password"
				/>
			</label>
			<div class="form-control w-full">
				<button class="btn btn-primary w-full">Login</button>
			</div>
		</form>
	</div>

	<input
		type="radio"
		name="login_register_tabs"
		class="tab"
		aria-label="Register"
	/>
	<div
		class="tab-content shadow-base-300 shadow border-base-300 bg-base-100 p-10"
	>
		<form method="POST" action={registerAction}>
			<label class="floating-label">
				<span class="label">Email</span>
				<input
					type="email"
					placeholder="Email"
					class="input input-bordered"
					name="email"
				/>
			</label>
			<label class="floating-label pt-2">
				<span class="label">Password</span>
				<input
					type="password"
					placeholder="Password"
					class="input input-bordered"
					name="password"
				/>
			</label>
			<label class="floating-label pt-2">
				<span class="label">Confirm Password</span>
				<input
					type="password"
					placeholder="Confirm Password"
					class="input input-bordered"
					name="confirmPassword"
				/>
			</label>
			<div class="form-control w-full pt-2">
				<button class="btn btn-primary w-full">Signup</button>
			</div>
		</form>
	</div>
</div>

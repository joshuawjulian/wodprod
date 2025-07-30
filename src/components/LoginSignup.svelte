<div class="tabs tabs-border min-w-96">
	<input
		type="radio"
		name="login_signup_tabs"
		class="tab"
		checked
		aria-label="Login"
	/>
	<div
		class="tab-content shadow-base-300 shadow border-base-300 bg-base-100 p-10"
	>
		<form>
			<label class="floating-label">
				<span class="label">Email</span>
				<input type="email" placeholder="Email" class="input input-bordered" />
			</label>
			<label class="floating-label py-2">
				<span class="label">Password</span>
				<input
					type="password"
					placeholder="Password"
					class="input input-bordered"
				/>
			</label>
			<div class="form-control w-full">
				<button class="btn btn-secondary w-full">Login</button>
			</div>
		</form>
	</div>

	<input
		type="radio"
		name="login_signup_tabs"
		class="tab"
		aria-label="Signup"
	/>
	<div
		class="tab-content shadow-base-300 shadow border-base-300 bg-base-100 p-10"
	>
		<form>
			<label class="floating-label">
				<span class="label">Email</span>
				<input type="email" placeholder="Email" class="input input-bordered" />
			</label>
			<label class="floating-label pt-2">
				<span class="label">Password</span>
				<input
					type="password"
					placeholder="Password"
					class="input input-bordered"
				/>
			</label>
			<label class="floating-label pt-2">
				<span class="label">Password Again</span>
				<input
					type="password"
					placeholder="Password"
					class="input input-bordered"
				/>
			</label>
			<div class="form-control w-full pt-2">
				<button class="btn btn-primary w-full">Signup</button>
			</div>
		</form>
	</div>
</div>

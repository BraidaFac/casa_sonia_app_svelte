<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Logo from '../../lib/components/Logo.svelte';
	export let form: ActionData;
	let loading = false;
</script>

<div class="mt-10">
	<div class="bg-form flex flex-row justify-center items-center">
		{#if !loading}
			<div class="p-4 rounded-lg">
				<form
					method="POST"
					class="flex flex-col w-96 gap-1 items-center"
					use:enhance={() => {
						loading = true;
						return ({ update }) => {
							loading = false;
							update();
						};
					}}
				>
					<input
						class="input variant-filled-surface"
						title="Usuario"
						type="text"
						aria-label="User"
						placeholder="Usuario"
						value={form?.user ?? ''}
						name="username"
					/>
					<input
						class="input variant-filled-surface"
						title="Password"
						type="password"
						placeholder="Contrasena"
						aria-label="Password"
						name="password"
					/>
					{#if form?.message}
						<span class="error">Credenciales incorrectas</span>
					{/if}
					<button type="submit" class="btn variant-outline w-24">Ingresar</button>
				</form>
			</div>
		{:else}
			<p>Loading</p>
		{/if}
		<div class="logo">
			<Logo --logo-size="20rem" />
		</div>
	</div>
</div>

<style>
	.error {
		font-size: small;
		color: red;
		position: relative;
		display: inline-block;
		margin: 0;
		align-self: self-start;
	}
</style>

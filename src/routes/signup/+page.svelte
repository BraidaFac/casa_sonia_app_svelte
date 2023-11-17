<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Logo from '../../lib/components/Logo.svelte';
	export let form;
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
						class={form?.errors?.username
							? 'input variant-filled-error'
							: 'input variant-filled-surface'}
						title="Usuario"
						type="text"
						placeholder="Usuario"
						value={form?.data?.user ?? ''}
						name="username"
					/>
					{#if form?.errors?.username}
						<span class="error">{form?.errors?.username[0]}</span>
					{/if}
					<input
						class={form?.errors?.password || form?.errors?.confirmPassword
							? 'variant-filled-error input'
							: 'input variant-filled-surface'}
						title="Password"
						type="password"
						placeholder="Contrasena"
						value={form?.data?.password ?? ''}
						name="password"
					/>
					{#if form?.errors?.password}
						<span class="error">{form?.errors?.password[0]}</span>
					{/if}
					<input
						class={form?.errors?.confirmPassword
							? 'variant-filled-error input'
							: 'input variant-filled-surface'}
						title="Password"
						type="password"
						placeholder="Confirmar contrasena"
						aria-label="Password"
						value={form?.data?.confirmPassword ?? ''}
						name="confirmPassword"
					/>
					{#if form?.errors?.confirmPassword}
						<span class="error">{form?.errors?.confirmPassword[0]}</span>
					{/if}
					{#if form?.message}
						<span class="error">{form?.message}</span>
					{/if}
					<button type="submit" class="btn variant-outline w-24">Registrar</button>
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

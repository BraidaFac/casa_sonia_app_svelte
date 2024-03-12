<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Logo from '../../lib/components/Logo.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { set } from 'zod';
	export let form: ActionData;
	let loading = false;
</script>

<div class="">
	<div class="bg-form flex flex-col p-2 md:flex-row md:justify-center md:items-center">
		{#if !loading}
			<div class="logo">
				<Logo --logo-size="20rem" />
			</div>
			<div class=" rounded-lg">
				<form
					method="POST"
					class="flex flex-col md:w-96 gap-1 items-center"
					use:enhance={() => {
						loading = true;

						return ({ update, result }) => {
							update();
							setTimeout(() => {
								loading = false;
							}, 1000);
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
						<span class="error">{form?.message}</span>
					{/if}
					<button type="submit" class="btn variant-outline w-24">Ingresar</button>
				</form>
			</div>
		{:else}
			<ProgressRadial
				value={undefined}
				class="self-center"
				stroke={20}
				meter="stroke-tertiary-500"
				track="stroke-tertiary-500/30"
			/>
		{/if}
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

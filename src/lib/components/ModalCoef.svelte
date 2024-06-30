<script lang="ts">
	import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	let case_form: HTMLFormElement;
	let loading = false;
	let response_state: number | undefined;

	const coeficients = $page.data.coeficients;
	console.log(coeficients);

	let coef_3 = coeficients.find((coef) => coef.name === 'coef_3')?.value ?? 1;
	let coef_6 = coeficients.find((coef) => coef.name === 'coef_6')?.value ?? 1;
	let coef_efect = coeficients.find((coef) => coef.name === 'coef_efect')?.value ?? 1;
	const modalStore = getModalStore();

	async function onFormSubmit() {
		try {
			loading = true;
			const form = new FormData(case_form);
			const data = Object.fromEntries(form.entries());
			const response = await fetch('/api/coeficient', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			await invalidate('app:layout');
			loading = false;
			response_state = response.status;
		} catch (error) {
			loading = false;
			response_state = 500;
		}
	}

	// Base Classes
	const cBase = 'card p-4 lg:w-1/3 shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold text-center';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token flex flex-col items-center';
</script>

<div class="modal-example-form {cBase}">
	{#if !response_state}
		<header class={cHeader}>Coeficientes</header>
		{#if loading}
			<div class="h-22 flex flex-row justify-center">
				<ProgressRadial width="w-14" />
			</div>
		{:else}
			<form class="modal-form {cForm}" bind:this={case_form}>
				<label class="label">
					<span class="mr-5">Coeficiente efectivo</span>
					<input
						class="input inline w-20 lg:w-32"
						name="coef_efect"
						type="text"
						bind:value={coef_efect}
					/>
				</label>
				<label class="label">
					<span class="mr-5">Coeficiente 3 cuotas</span>
					<input class="input inline w-20 lg:w-32" name="coef_3" type="text" bind:value={coef_3} />
				</label>
				<label class="label">
					<span class="mr-5">Coeficiente 6 cuotas</span>
					<input class="input inline w-20 lg:w-32" name="coef_6" type="text" bind:value={coef_6} />
				</label>
				<button class="variant-filled-success btn text-center" on:click={onFormSubmit}
					>Guardar</button
				>
			</form>
		{/if}
	{:else if response_state === 200}
		<div>
			<p class="text-center text-green-600">Se modifico el valor correctamente</p>
		</div>
		<div class="flex flex-row justify-center">
			<button
				class="variant-filled-success btn"
				on:click={() => {
					modalStore.close();
				}}>Salir</button
			>
		</div>
	{:else}
		<p class="text-center text-red-600">Hubo un error. Intente nuevamente</p>
		<div class="flex flex-row justify-center gap-3">
			<button
				class="variant-filled-error btn"
				on:click={() => {
					response_state = undefined;
				}}>Reintentar</button
			>
			<button
				class="variant-filled-warning btn"
				on:click={() => {
					modalStore.close();
				}}>Salir</button
			>
		</div>
	{/if}
</div>

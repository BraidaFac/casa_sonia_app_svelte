<script lang="ts">
	import { submit, loading } from '$lib/utils/excel_methods';

	$: file = '';
</script>

{#if !$loading}
	<div class="flex flex-col items-center gap-2 mt-10">
		<h1 class="text-3xl">Cargar excel</h1>
		<form
			class="flex flex-col gap-3 w-1/2"
			on:submit|preventDefault={async (event) => {
				const res = await submit(event);
			}}
		>
			<input
				class="input"
				bind:value={file}
				type="file"
				name="file"
				id="file"
				accept=".xlsx, .xls,"
			/>
			<div class="flex flex-row justify-center">
				<button
					class="btn disabled:variant-filled-error variant-filled-tertiary"
					disabled={!file ||
						!(file.split('.').reverse()[0] === 'xlsx' || file.split('.').reverse()[0] === 'xls')}
					type="submit">Agregar</button
				>
			</div>
		</form>
	</div>
{:else}
	<div class="overlay" />
	<div class="spinner">
		<p>loader</p>
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}
	.files-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.spinner {
		z-index: 1000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>

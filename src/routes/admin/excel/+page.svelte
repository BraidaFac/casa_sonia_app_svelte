<script lang="ts">
	import { submit, loading } from '$lib/utils/excel_methods';

	$: file = null;
</script>

{#if !$loading}
	<div class="files-form">
		<h1>Files</h1>
		<form
			on:submit|preventDefault={async (event) => {
				const res = await submit(event);
				console.log(await res?.text());
			}}
		>
			<label for="file">Archivo</label>
			<input bind:value={file} type="file" name="file" id="file" accept=".xlsx, .xls, .csv" />
			<div>
				<button disabled={!file} type="submit">Agregar</button>
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

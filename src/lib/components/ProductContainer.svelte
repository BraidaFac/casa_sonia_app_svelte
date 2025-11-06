<script lang="ts">
	import { gsrStore } from '$lib/stores/articles.store';
	import { searchStore } from '$lib/stores/filter.svelte';
	import { untrack } from 'svelte';

	let props = $props();
	let articulos = props.articulos;
	let coeficients = props.coeficients;

	const coef_3 = coeficients.find((coef) => coef.name === 'coef_3')?.value ?? 1;
	const coef_6 = coeficients.find((coef) => coef.name === 'coef_6')?.value ?? 1;
	const coef_efect = coeficients.find((coef) => coef.name === 'coef_efect')?.value ?? 1;

	// Effect para cargar datos solo cuando articulos cambie
	$effect(() => {
		// Usamos untrack para evitar que el effect se vuelva a ejecutar
		// cuando el store cambie
		untrack(() => {
			searchStore.setData(articulos);
		});
	});

	function addThousandSeparator(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	function truncarACentena(numero) {
		return Math.round(numero / 100) * 100;
	}
</script>

<div class="md:w-1/2 md:mx-auto px-3">
	<label class="text-center text-lg mb-3" for="">Ingrese codigo o descripción del articulo</label>
	<input
		type="search"
		class="input"
		placeholder="Buscar"
		bind:value={$searchStore.search}
		oninput={(e: Event) => searchStore.setSearch((e.target as HTMLInputElement).value)}
	/>
</div>
{#if $searchStore.filtered.length === 0 && $searchStore.search?.length === 0}
	<div class="px-3 mt-5">
		<p class="text-2xl text-center mb-4">Sugerencias</p>
		<ul class="flex flex-col flex-wrap h-32 gap-1">
			{#each $gsrStore as gsr}
				<li class="text-center">
					<a
						href="/"
						onclick={() => {
							searchStore.setSearch(gsr.descripcion);
						}}>{gsr.descripcion}</a
					>
				</li>
			{/each}
		</ul>
	</div>
{/if}
<div class="table-container md:p-4 p-2">
	{#if $searchStore.filtered.length !== 0}
		<table class="table table-fixed">
			<thead>
				<tr>
					<th>Descripcion</th>
					<th>Marca</th>
					<th>Precio Efectivo</th>
					<th>Precio Tarjeta</th>
					<th>Talles</th>
					<th>Rubro</th>
					<th>3 cuotas de</th>
					<th>6 cuotas de</th>
					<th>Codigo</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchStore.filtered as prod}
					<tr>
						<td>{prod.NOMBRE}</td>
						<td>{prod.DESCRIPCION_MARCA}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOVENTA * coef_efect))}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOVENTA))}</td>
						<td>{prod.TALLES}</td>
						<td>{prod.DESCRIPCIONRUBRO}</td>
						<td
							>${addThousandSeparator(
								truncarACentena(((+prod.PRECIOVENTA * coef_3) / 3).toFixed(0))
							)}</td
						>
						<td
							>${addThousandSeparator(
								truncarACentena(((+prod.PRECIOVENTA * coef_6) / 6).toFixed(0))
							)}</td
						>
						<td>{prod.CODIGO_PRODUCTO}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.table {
		width: 400%;
	}
	@media (min-width: 768px) {
		.table {
			width: 100%;
		}
	}

	td:nth-child(3),
	td:nth-child(4) {
		font-weight: bold;
	}

	@media (max-width: 768px) {
		td:nth-child(1) {
			width: 8% !important;
			white-space: nowrap;
			overflow: auto;
			text-align: left;
		}
		td:nth-child(2) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(3) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(4) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(5) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(6) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(7) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(8) {
			width: 10% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(9) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(1) {
			width: 8% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(2) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(3) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(4) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(5) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}

		th:nth-child(6) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(7) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(8) {
			width: 7% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(9) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
	}

	@media (max-width: 768px) {
		.table thead tr {
			text-align: center;
		}
		.table tbody tr td {
			text-align: center !important;
		}
		.table tbody tr td {
			font-size: small !important;
		}
	}
</style>

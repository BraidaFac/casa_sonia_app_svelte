<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	// Componentes
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import ScannerButton from '$lib/components/ScannerButton.svelte';
	// Hooks personalizados
	import { createArticlesHook } from '$lib/hooks/useArticles.svelte';
	import { createScannerHook } from '$lib/hooks/useScanner.svelte';
	// Stores
	import { loadingStore } from '$lib/stores/loadingStore';
	// Tipos
	import type { Article } from '$lib/types/article.types';

	// Inicializar hooks
	const scannerHook = createScannerHook();
	const articlesHook = createArticlesHook();

	// Datos reactivos de la página
	let pageData = $derived(page.data);
	let token = $derived(pageData.token);
	let initialArticles = $derived(pageData.articulos as Article[]);
	let coeficients = $derived(pageData.coeficients || []);

	// Estados del componente
	let globalLoading = $state(false);
	let globalLoadingValue = $state(0);
	let refreshKey = $state(0);

	// Suscripción al store de loading global
	$effect(() => {
		const unsubscribe = loadingStore.subscribe((loading) => {
			globalLoading = loading;
		});
		return unsubscribe;
	});

	// Computed values
	const shouldShowArticles = $derived(
		(articlesHook.hasArticles() || initialArticles?.length > 0) &&
			!articlesHook.isLoading &&
			!globalLoading
	);

	const currentArticles = $derived(
		articlesHook.hasArticles() ? articlesHook.articles : initialArticles
	);

	const isAnyLoading = $derived(articlesHook.isLoading || globalLoading);

	const currentLoadingProgress = $derived(
		articlesHook.isLoading ? articlesHook.loadingProgress : globalLoadingValue
	);

	// Inicialización del componente
	onMount(async () => {
		await initializeComponents();
		await loadInitialArticles();
	});

	/**
	 * Inicializa los componentes necesarios
	 */
	async function initializeComponents(): Promise<void> {
		await scannerHook.initializeScanner();
	}

	/**
	 * Carga artículos iniciales si no están disponibles
	 */
	async function loadInitialArticles(): Promise<void> {
		if (!initialArticles || initialArticles.length === 0) {
			await articlesHook.loadArticles(token);
			refreshKey += 1; // Forzar re-render del ProductContainer
		}
	}

	/**
	 * Maneja el toggle del scanner
	 */
	async function handleToggleScanning(): Promise<void> {
		await scannerHook.toggleScanning();
		refreshKey += 1; // Forzar re-render cuando cambia el filtro
	}
</script>

<div class="main-container">
	<div class="scanner-section">
		<!-- Vista de captura del scanner (oculta por defecto) -->
		<div class="hidden fixed top-0 right-0 w-full h-full" id="data-capture-view"></div>

		<!-- Botón del scanner -->
		<ScannerButton
			isScanning={scannerHook.isScanning}
			isLoading={isAnyLoading}
			onToggleScanning={handleToggleScanning}
		/>
	</div>

	<!-- Contenido principal -->
	{#if shouldShowArticles}
		{#key currentArticles || refreshKey || coeficients}
			<ProductContainer articulos={currentArticles} {coeficients} />
		{/key}
	{:else if isAnyLoading}
		<LoadingIndicator progress={currentLoadingProgress} />
	{/if}
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.scanner-section {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		padding: 0.75rem;
		margin-top: 1.5rem;
	}
</style>

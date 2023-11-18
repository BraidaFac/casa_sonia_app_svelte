<script lang="ts">
	import CardContainer from '../../lib/components/CardContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const { super_categories } = data;
</script>

<CardContainer card_data={super_categories} />

<script lang="ts">
	import Card from './Card.svelte';

	export let card_data: any[];
	console.log(card_data);
</script>

<div class="mt-3 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-x-5 md:gap-y-10 p-4">
	{#each card_data as card}
		<Card name={card.descripcion}></Card>
	{/each}
</div>

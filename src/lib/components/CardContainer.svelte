<script lang="ts">
	import Card from './Card.svelte';

	export let card_data;

	const deta = [
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' },
		{ name: 'test', src_img: 'test', url: 'test' }
	];
</script>

<div class="grid grid-cols-1 md:grid-cols-4 md:gap-x-5 md:gap-y-10 p-4">
	{#each deta as d}
		<Card {...d}></Card>
	{/each}
</div>

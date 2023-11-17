<script lang="ts">
	import Logo from './Logo.svelte';
	export let name: string;
	export let src_img: string;
	export let url: string;
</script>

<a href="/{url}" class="card p-4 shadow-md shadow-white">
	<header class="card-header text-center"><p class="text-4xl text-black">{name}</p></header>
	<section class="p-4"></section>
</a>

<style>
	.card {
		background-color: #ddd9d9 !important;
	}
</style>

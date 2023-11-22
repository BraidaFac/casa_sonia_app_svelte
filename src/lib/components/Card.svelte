<script lang="ts">

	export let name: string;

	function completeName(name: string) {
		switch (name.toUpperCase()) {
			case 'HO':
				return 'Hombre';
			case 'MU':
				return 'Mujer';
			case 'LB':
				return 'Linea Blanco';
			case 'UN':
				return 'Uniformes';
			default:
				return name;
		}
	}
</script>

<a href="/{name}" class="card p-4  shadow-md ">
	<section class="card-section text-center"><p class="text-4xl">{completeName(name)}</p></section>
</a>

<style>
	
</style>

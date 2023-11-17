<script>
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Nav from '../lib/components/Nav.svelte';
</script>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<Nav></Nav>
	</svelte:fragment>
	<slot />
</AppShell>

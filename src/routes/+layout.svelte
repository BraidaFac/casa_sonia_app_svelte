<script>
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Nav from '../lib/components/Nav.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<Nav></Nav>
	</svelte:fragment>
	<slot />
</AppShell>

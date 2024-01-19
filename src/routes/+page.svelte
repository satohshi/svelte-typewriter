<script lang="ts">
	import TypeWriter from '$lib/TypeWriter.svelte'

	const texts = ['lorem ipsum', 'dolor sit amet', 'consectetur adipiscing elit']
</script>

<div>
	<TypeWriter {texts} />
</div>

<style>
	div {
		display: flex;
		font-size: 3rem;
		justify-content: center;
		align-items: center;
		height: 100dvh;
	}
</style>

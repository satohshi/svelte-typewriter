<script lang="ts">
	import TypeWriter from '$lib/TypeWriter.svelte'

	const lorem = [
		['lorem ipsum', 'dolor sit amet', 'consectetur adipiscing elit'],
		['Alias mollitia', 'dolore molestias recusandae', 'ullam voluptates dolor voluptatum'],
		['voluptas ratione', 'nostrum veniam', 'deleniti possimus'],
		['sequi ipsam', 'architecto delectus', 'ipsum aliquam odit'],
	]

	let index = 0
	let texts = $state(lorem[index])!

	const changeTexts = () => {
		index = (index + 1) % lorem.length
		texts = lorem[index]!
	}
</script>

<div>
	<button onclick={changeTexts}>Change Texts</button>
	<TypeWriter {texts} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 3rem;
		justify-content: center;
		align-items: center;
		height: 100dvh;
	}
</style>

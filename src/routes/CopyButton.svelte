<script lang="ts">
	import { onDestroy } from 'svelte'

	interface Props {
		text: string
	}

	const { text }: Props = $props()

	let copied = $state(false)
	let timeout: ReturnType<typeof setTimeout>

	const copyToClipboard = () => {
		clearTimeout(timeout)
		copied = true
		navigator.clipboard.writeText(text)
		timeout = setTimeout(() => {
			copied = false
		}, 1500)
	}

	onDestroy(() => {
		clearTimeout(timeout)
	})
</script>

<button
	onclick={copyToClipboard}
	class="mx-auto grid cursor-pointer rounded-md bg-black px-6 py-2 font-medium text-gray-100 transition-colors hover:bg-gray-900"
>
	<span class:opacity-0={copied} class="col-[1] row-[1] transition-opacity">Copy Options</span>
	<span class:opacity-0={!copied} class="col-[1] row-[1] transition-opacity">Copied!</span>
</button>

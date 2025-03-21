<script lang="ts" generics="T extends keyof EndState">
	import type { EndState } from '$lib/TypeWriter.svelte'

	interface Props {
		type: T
		value: EndState[T]
	}

	let { type, value = $bindable() }: Props = $props()

	const OPTIONS = {
		text: ['typed', 'deleted'],
		caret: ['visible', 'hidden', 'blink'],
	} as const
</script>

<fieldset class="space-y-2">
	<legend class="font-medium text-gray-600 capitalize">{type}</legend>
	<div class="flex gap-4">
		{#each OPTIONS[type] as option}
			<label class="flex cursor-pointer items-center gap-1.5">
				<input type="radio" value={option} bind:group={value} class="size-4" />
				<span class="text-sm text-gray-800 capitalize">{option}</span>
			</label>
		{/each}
	</div>
</fieldset>

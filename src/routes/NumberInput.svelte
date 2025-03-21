<script lang="ts">
	interface Props {
		id: string
		value: number
		min?: number
		max?: number
		step?: number
		unit: string
	}

	let { id, value = $bindable(), min, max, step = 1, unit }: Props = $props()
</script>

<div class="flex items-center gap-2">
	<input
		{id}
		type="number"
		bind:value
		{min}
		{max}
		{step}
		class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
	/>
	<span class="font-mono text-gray-800">{unit}</span>
</div>

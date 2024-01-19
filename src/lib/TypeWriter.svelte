<script lang="ts">
	let {
		texts,
		repeat = 0,
		typeSpeed = 60,
		deleteSpeed = 40,
		blinkDuration = 300,
		blinkCount = 3,
		waitBetweenTexts = 150,
		blinksBetweenTexts = 0,
	} = $props<{
		texts: string[] // Array of strings to be displayed
		repeat?: number // Set to 0 for infinite loop.
		typeSpeed?: number // How fast the text is typed (in ms/char)
		deleteSpeed?: number // How fast the text is deleted (in ms/char)
		blinkDuration?: number // How long the pipe is displayed each "blink" (in ms)
		blinkCount?: number // How many times the pipe is displayed after the text is typed
		waitBetweenTexts?: number // How long to wait before starting to type the next text (in ms)
		blinksBetweenTexts?: number // How many times the pipe is displayed between texts
	}>()

	let textDisplayed = $state('|')
	let span = $state<HTMLSpanElement>()

	// Current timeout to be cleared when the component is destroyed
	let timeout: ReturnType<typeof setTimeout>

	$effect(() => {
		typewriter(texts, repeat)
		return () => clearTimeout(timeout)
	})

	const sleep = (ms: number) => {
		return new Promise((resolve) => {
			timeout = setTimeout(resolve, ms)
		})
	}

	const blink = async (count: number) => {
		// Prevents the span from shrinking when the pipe is removed.
		span!.style.width = `${span!.clientWidth + 1}px` // Don't question the + 1. It sometimes works without it, but sometimes doesn't.

		await sleep(blinkDuration / 2)

		for (let i = 0; i < count; i++) {
			textDisplayed = textDisplayed.slice(0, -1)
			await sleep(blinkDuration)

			// Prevents the last iteration from adding a pipe
			if (i === count - 1) break

			textDisplayed += '|'
			await sleep(blinkDuration)
		}

		span!.style.width = 'auto'
	}

	async function typewriter(textArr: string[], iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (let j = 0; j < textArr.length; j++) {
				const text = textArr[j]!

				// Type text
				for (let k = 1; k <= text.length; k++) {
					textDisplayed = text.slice(0, k) + '|'
					await sleep(typeSpeed)
				}

				// Blink for a while before deleting text
				await blink(blinkCount)

				// Delete text
				for (let k = 1; k <= text.length; k++) {
					textDisplayed = text.slice(0, text.length - k) + '|'
					await sleep(deleteSpeed)
				}

				if (!blinksBetweenTexts) {
					await sleep(waitBetweenTexts)
				} else {
					await blink(blinksBetweenTexts)
				}
			}
		}
	}
</script>

<span bind:this={span}>{textDisplayed}</span>

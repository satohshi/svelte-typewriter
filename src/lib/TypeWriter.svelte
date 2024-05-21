<script lang="ts">
	type Props = {
		texts: string[] // Array of strings to be displayed
		repeat?: number // Set to 0 for infinite loop.
		typeSpeed?: number // How fast the text is typed (in ms/char)
		deleteSpeed?: number // How fast the text is deleted (in ms/char)
		blinkDuration?: number // How long the pipe is displayed each "blink" (in ms)
		blinkCount?: number // How many times the pipe is displayed after the text is typed
	} & (
		| {
				waitBetweenTexts?: number // How long to wait before starting to type the next text (in ms)
				blinksBetweenTexts?: never
		  }
		| {
				waitBetweenTexts?: never
				blinksBetweenTexts: number // How many times the pipe is displayed between texts
		  }
	)

	let {
		texts,
		repeat = 0,
		typeSpeed = 60,
		deleteSpeed = 40,
		blinkDuration = 600,
		blinkCount = 3,
		waitBetweenTexts = 150,
		blinksBetweenTexts = 0,
	}: Props = $props()

	let textDisplayed = $state(' ')
	let blinking = $state(false)

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
		await sleep(blinkDuration / 4)
		blinking = true
		await sleep(blinkDuration * (count - 0.5)) // 0.5 so the pipe is transparent at the end
		blinking = false
	}

	async function typewriter(textArr: string[], iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (const text of textArr) {
				// Type text
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, k)
					await sleep(typeSpeed)
				}

				// Blink for specified duration
				await blink(blinkCount)

				// Delete text
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, text.length - k)
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

<span>{textDisplayed}<span class:blinking style="--blink-duration: {blinkDuration}ms">|</span></span
>

<style>
	.blinking {
		animation: blink var(--blink-duration) step-start infinite;
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>

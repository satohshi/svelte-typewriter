<script module lang="ts">
	/**
	 * Configuration for the final state after all iterations complete.  \
	 * Required when `repeat > 0`.
	 * @example
	 * // Keep last text visible with blinking caret
	 * endState: { text: 'typed', caret: 'blink' }
	 *
	 * @example
	 * // Delete last text and hide caret
	 * endState: { text: 'deleted', caret: 'hidden' }
	 */
	export interface EndState {
		/**
		 * The final state of the text after all iterations are complete.
		 * - 'typed': The last text will remain visible
		 * - 'deleted': The last text will be deleted
		 */
		text: 'typed' | 'deleted'
		/**
		 * The final state of the caret after all iterations are complete.
		 * - 'visible': The caret will remain visible
		 * - 'hidden': The caret will be hidden
		 * - 'blink': The caret will continue blinking indefinitely
		 */
		caret: 'visible' | 'hidden' | 'blink'
	}

	/**
	 * Controls caret behavior after text is fully typed and before deletion starts.  \
	 * Choose between two modes:
	 * 1. Blink mode: Caret blinks n times
	 * ```ts
	 * afterTyped: { blink: 3 } // Blink 3 times then start deleting
	 * ```
	 * 2. Wait mode: Pause for n milliseconds
	 * ```ts
	 * afterTyped: { wait: 150 } // Wait 150 milliseconds then start deleting
	 * ```
	 * @defaultValue { blink: 2.5 }
	 */
	export type AfterTyped =
		| {
				/** Milliseconds to wait before deletion starts */
				wait: number
				blink?: never
		  }
		| {
				/** Number of times to blink before deletion starts */
				blink: number
				wait?: never
		  }

	/**
	 * Controls caret behavior after text is fully deleted and before typing the next text.  \
	 * Choose between two modes:
	 * 1. Blink mode: Caret blinks n times
	 * ```ts
	 * afterDeleted: { blink: 3 } // Blink 3 times then start deleting
	 * ```
	 * 2. Wait mode: Pause for n milliseconds
	 * ```ts
	 * afterDeleted: { wait: 150 } // Wait 150 milliseconds then start deleting
	 * ```
	 * @defaultValue { wait: 150 }
	 */
	export type AfterDeleted =
		| {
				/** Milliseconds to wait before typing next text */
				wait: number
				blink?: never
		  }
		| {
				/** Number of times to blink before typing next text */
				blink: number
				wait?: never
		  }
</script>

<script lang="ts" generics="Texts extends readonly string[], Repeat extends number">
	type Index = {
		[K in keyof Texts]: number extends K
			? // Text is array
				number
			: // Text is tuple
				K extends `${infer N extends number}`
				? N
				: never
	}[number]

	type Props = {
		/**
		 * Array of strings to be displayed in sequence.
		 */
		texts: Texts

		/**
		 * Number of times to iterate through the texts.
		 * - Set to `0` for infinite repetition
		 * - Set to a positive number (n) to repeat n times
		 * - When set to a positive number, `endState` prop becomes required
		 * @defaultValue 0
		 */
		repeat?: Repeat

		/**
		 * Speed of typing animation in milliseconds per character.
		 * @defaultValue 60
		 */
		typeSpeed?: number

		/**
		 * Speed of deleting animation in milliseconds per character.
		 * @defaultValue 40
		 */
		deleteSpeed?: number

		/**
		 * Duration of one complete caret blink cycle in milliseconds.
		 * @defaultValue 600
		 */
		blinkDuration?: number

		/**
		 * Controls caret behavior after text is fully typed and before deletion starts.  \
		 * Choose between two modes:
		 * 1. Blink mode: Caret blinks n times
		 * ```ts
		 * afterTyped: { blink: 3 } // Blink 3 times then start deleting
		 * ```
		 * 2. Wait mode: Pause for n milliseconds
		 * ```ts
		 * afterTyped: { wait: 150 } // Wait 150 milliseconds then start deleting
		 * ```
		 * @defaultValue { blink: 2.5 }
		 */
		afterTyped?: AfterTyped

		/**
		 * Controls caret behavior after text is fully deleted and before typing the next text.  \
		 * Choose between two modes:
		 * 1. Blink mode: Caret blinks n times
		 * ```ts
		 * afterDeleted: { blink: 3 } // Blink 3 times then start deleting
		 * ```
		 * 2. Wait mode: Pause for n milliseconds
		 * ```ts
		 * afterDeleted: { wait: 150 } // Wait 150 milliseconds then start deleting
		 * ```
		 * @defaultValue { wait: 150 }
		 */
		afterDeleted?: AfterDeleted

		/**
		 * Callback fired when typing animation begins for each text.
		 * @param index - Zero-based index of the text being typed
		 */
		ontypestart?: (index: Index) => void

		/**
		 * Callback fired when typing animation completes for each text.
		 * @param index - Zero-based index of the text that was typed
		 */
		ontypeend?: (index: Index) => void

		/**
		 * Callback fired when deletion animation begins for each text.
		 * @param index - Zero-based index of the text being deleted
		 */
		ondeletestart?: (index: Index) => void

		/**
		 * Callback fired when deletion animation completes for each text.
		 * @param index - Zero-based index of the text that was deleted
		 */
		ondeleteend?: (index: Index) => void
	} & (0 extends Repeat
		? {
				endState?: never
			}
		: {
				/**
				 * Configuration for the final state after all iterations complete.  \
				 * Required when `repeat > 0`.
				 * @example
				 * // Keep last text visible with blinking caret
				 * endState: { text: 'typed', caret: 'blink' }
				 *
				 * @example
				 * // Delete last text and hide caret
				 * endState: { text: 'deleted', caret: 'hidden' }
				 */
				endState: EndState
			})

	let {
		texts,
		repeat,
		endState,
		typeSpeed = 60,
		deleteSpeed = 40,
		blinkDuration = 600,
		afterTyped = { blink: 2.5 },
		afterDeleted = { wait: 150 },
		ontypestart,
		ontypeend,
		ondeletestart,
		ondeleteend,
	}: Props = $props()

	let caret: HTMLSpanElement
	let textDisplayed = $state(' ')
	let abortController: AbortController

	$effect(() => {
		abortController = new AbortController()

		typewriter(texts, repeat ?? 0).catch((e: unknown) => {
			// Ignore abort errors that are thrown during the cleanup
			if (e instanceof DOMException && e.name === 'AbortError') return
			console.error(e)
		})

		return () => abortController.abort()
	})

	const sleep = (ms: number) => {
		return new Promise<void>((resolve, reject) => {
			let timeout: ReturnType<typeof setTimeout>

			const abortHandler = () => {
				clearTimeout(timeout)
				reject(new DOMException('', 'AbortError'))
			}

			abortController.signal.addEventListener('abort', abortHandler)

			timeout = setTimeout(() => {
				abortController.signal.removeEventListener('abort', abortHandler)
				resolve()
			}, ms)
		})
	}

	const blink = (iterations: number) => {
		const animation = caret.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
			iterations,
			duration: blinkDuration,
			delay: blinkDuration / 4,
			easing: 'steps(2)',
		})

		const abortHandler = () => animation.cancel()

		abortController.signal.addEventListener('abort', abortHandler)

		animation.addEventListener('finish', () => {
			abortController.signal.removeEventListener('abort', abortHandler)
		})

		return animation.finished
	}

	const handleEnd = (caretOption: EndState['caret']) => {
		if (caretOption === 'blink') {
			blink(Infinity)
		} else {
			caret.style.opacity = caretOption === 'visible' ? '1' : '0'
		}
	}

	async function typewriter(textArr: Texts, iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (let j = 0; j < textArr.length; j++) {
				const isLast = i === iterations - 1 && j === textArr.length - 1
				const text = textArr[j]!

				// Type text
				ontypestart?.(j)
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, k)
					await sleep(typeSpeed)
				}
				ontypeend?.(j)

				// Finish the last iteration with text typed out
				if (isLast && endState!.text === 'typed') {
					handleEnd(endState!.caret)
					return
				}

				// before deleting the text
				if ('blink' in afterTyped) {
					await blink(afterTyped.blink!)
				} else {
					await sleep(afterTyped.wait)
				}

				// Delete text
				ondeletestart?.(j)
				for (let k = text.length; k >= 0; k--) {
					textDisplayed = text.slice(0, k)
					await sleep(deleteSpeed)
				}
				ondeleteend?.(j)

				// Finish the last iteration with text deleted
				if (isLast) {
					handleEnd(endState!.caret)
					return
				}

				// Wait before typing the next text
				if ('blink' in afterDeleted) {
					await blink(afterDeleted.blink!)
				} else {
					await sleep(afterDeleted.wait)
				}
			}
		}
	}
</script>

<!--
@component
TypeWriter component for Svelte

### Basic usage

```svelte
<TypeWriter texts={['lorem ipsum', 'dolor sit amet']} />
```

[Docs](https://github.com/satohshi/svelte-typewriter)
-->

<span>{textDisplayed}<span bind:this={caret}>|</span></span>

# Svelte Typewriter

Typewriter component for Svelte that actually "types" one character at a time instead of just moving the caret at linear speed.

![demo](https://github.com/user-attachments/assets/eac207c9-2c1f-47f5-9661-f601983c4950)

## Installation

```shell
npm i svelte-typewrite // without an "r" at the end

pnpm add svelte-typewrite
```

## Usage

```svelte
<script>
    import { TypeWriter } from 'svelte-typewrite'
</script>

<TypeWriter texts={['lorem ipsum', 'dolor sit amet']} />
```

## Props

### Required

| Name    |    Type    | Description                      |
| ------- | :--------: | -------------------------------- |
| `texts` | `string[]` | Array of strings to be displayed |

### Options

| Name            |      Type      |     Default      | Description                                                                  |
| --------------- | :------------: | :--------------: | ---------------------------------------------------------------------------- |
| `repeat`        |    `number`    |       `0`        | Number of times to iterate through the texts (`0` for indefinitely)          |
| `endState`      |   `EndState`   |   `undefined`    | What to do after typing the very last text<br>**_Required_** if `repeat > 0` |
| `typeSpeed`     |    `number`    |       `60`       | How fast the text is typed (in `ms/char`)                                    |
| `deleteSpeed`   |    `number`    |       `40`       | How fast the text is deleted (in `ms/char`)                                  |
| `blinkDuration` |    `number`    |      `600`       | Duration of each "blink" of caret (in `ms`)                                  |
| `afterTyped`    |  `AfterTyped`  | `{ blink: 2.5 }` | What caret should do after typing and before deleting the text               |
| `afterDeleted`  | `AfterDeleted` | `{ wait: 150 }`  | What caret should do after deleting the text and before typing the next text |

```ts
type AfterTyped =
    | {
          /** How long to wait before starting to delete the text (in `ms`) */
          wait: number
      }
    | {
          /** How many times the caret should blink before starting to delete the text */
          blink: number
      }

type AfterDeleted =
    | {
          /** How long to wait before starting to type the next text (in `ms`) */
          wait: number
      }
    | {
          /** How many times the caret should blink before starting to type the next text */
          blink: number
      }

interface EndState {
    /** Whether to leave the last text typed or deleted */
    text: 'typed' | 'deleted'

    /** Whether to leave the caret visible, hidden, or blinking */
    caret: 'visible' | 'hidden' | 'blink'
}
```

### Callbacks

| Name            |           Type            | Description                                                                                |
| --------------- | :-----------------------: | ------------------------------------------------------------------------------------------ |
| `ontypestart`   | `(index: number) => void` | Runs when typing animation starts.<br>Receives the index of the text being typed           |
| `ontypeend`     | `(index: number) => void` | Runs when typing animation ends.<br>Receives the index of the text that was just typed     |
| `ondeletestart` | `(index: number) => void` | Runs when deleting animation starts.<br>Receives the index of the text being deleted       |
| `ondeleteend`   | `(index: number) => void` | Runs when deleting animation ends.<br>Receives the index of the text that was just deleted |

> [!TIP]
> Type of `index` parameter will properly be "narrowed down" if `texts` is a tuple (i.e. defined with `as const`).  
> Useful if you have `noUncheckedIndexedAccess` set to `true` in your `tsconfig.json`.

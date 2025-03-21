# svelte-typewrite

## 3.0.0

### Major Changes

- 69095d1: change options format and defaults

### Patch Changes

- 5ce5d5a: fix insufficient cleanup

## 2.0.2

### Patch Changes

- b093344: update dependencies

## 2.0.1

### Patch Changes

- 6d6ba22: better docs
- 7ac0bc6: update dependencies
- 666ffa8: export EndState interface

## 2.0.0

### Major Changes

- 9252aa5: added option for how the last iteration should end

### Patch Changes

- cce1dc2: added doc string for props
- 42cd76f: refactor
- 9353ea8: better typing for callback params

## 1.3.2

### Patch Changes

- 85007eb: fix: previous texts are still in memory after changing texts property

## 1.3.1

### Patch Changes

- f6ab284: handle all animations in js to avoid defining otherwise unnecessary variables
- 1c5e843: Stop animation errors from bubbling up

## 1.3.0

### Minor Changes

- ea15807: Add callbacks: `ontypestart`, `ontypeend`, `ondeletestart`, `ondeleteend`

## 1.2.2

### Patch Changes

- 6cc2b3a: use getAnimations instead of setTimeout for better sync

## 1.2.1

### Patch Changes

- 3bc6c8d: update deps and refactor

## 1.2.0

### Minor Changes

- 2a037d8: `blinkDuration` now refers to the entire duration of the blink animation

### Patch Changes

- c2d3f4f: Blink using CSS animation instead of JS

## 1.1.2

### Patch Changes

- 3b5cfb8: prevent bad props at type level

## 1.1.1

### Patch Changes

- bb79d85: fixed dependencies

## 1.1.0

### Minor Changes

- 7b9c2e2: Added option to blink between texts

---
name: write-unit-tests
description: Write and run unit tests for this React + TypeScript + Recoil project with Vitest + React Testing Library. Use when adding tests, setting up the test framework (none configured yet), or verifying logic in hooks, stores, and components.
---

# Unit Testing (SkyDuel)

No test framework is configured yet. The Vite + React + TS stack pairs naturally with **Vitest** + **React Testing Library**. Set it up the first time, then follow the patterns below.

## First-time setup

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

`vite.config.ts` — add the test block (Vitest reads the Vite config):
```ts
/// <reference types="vitest" />
export default defineConfig({
  // ...existing plugins
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

## What to test (priority order)

1. **Pure logic & store handlers** — highest value, easiest. e.g. `modalStateHandler` mutual exclusivity, color-update reducers, any util in `src/utils/`.
2. **Custom hooks** (`useContainer`) — via `renderHook`.
3. **Component behavior** — render, user interaction, resulting DOM. Test what the user sees/does, not implementation details.
4. **Skip** Three.js scene internals (WebGL doesn't run in jsdom) — extract any testable math/state out of the scene effect and test that in isolation.

## Conventions

- Co-locate tests: `useContainer.test.tsx` next to `useContainer.tsx`.
- Wrap anything touching Recoil in `<RecoilRoot>`. Provide a reusable wrapper:

```tsx
import { RecoilRoot } from 'recoil'
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
)
```

## Example: testing the container hook

```tsx
import { renderHook, act } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import useContainer from './useContainer'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
)

describe('useContainer', () => {
  it('opening a modal closes the others', () => {
    const { result } = renderHook(() => useContainer(), { wrapper })

    act(() => result.current.modalStateHandler('colorPicker'))
    expect(result.current.modalOpenState.colorPicker).toBe(true)

    act(() => result.current.modalStateHandler('createLobby'))
    expect(result.current.modalOpenState.colorPicker).toBe(false)
    expect(result.current.modalOpenState.createLobby).toBe(true)
  })

  it('handleColorClick updates the selected body part color', () => {
    const { result } = renderHook(() => useContainer(), { wrapper })
    act(() => result.current.handleColorClick('#ff006e', 'Body'))
    expect(result.current.bodyPartColor.Body).toBe('#ff006e')
    expect(result.current.selectedPart).toBe('Body')
  })
})
```

## Example: testing a component

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('fires onClick when pressed', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Play</Button>)
  await userEvent.click(screen.getByRole('button', { name: /play/i }))
  expect(onClick).toHaveBeenCalledOnce()
})
```

## Principles

- Arrange–Act–Assert; one behavior per test; descriptive names ("closes other modals", not "test1").
- Query by role/label/text (accessible queries), not test IDs or classNames, unless there's no alternative.
- Mock at boundaries only (network, `three`); never mock the thing under test.
- A test that can't fail is worse than none — make sure each assertion can break.
- Run `yarn test:run` before declaring done; tests must pass and type-check.

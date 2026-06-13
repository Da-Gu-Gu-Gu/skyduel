---
name: clean-components
description: Write clean, reusable React + TypeScript components and keep code DRY and readable in this project. Use when creating new UI, refactoring duplicated markup, extracting shared components, or reviewing component design.
---

# Clean Code & Reusable Components (SkyDuel)

Goal: every component is small, typed, single-purpose, and reused instead of copy-pasted. Mirror the existing `src/components/` library (`Button`, `IconButton`, `Modal`, `Background`, `LoadingSpinner`, `Line`, `Sparkle`, `EmoteCircle`).

## When to extract a component

Extract the moment you hit **any** of:
- The same markup block appears twice.
- A className string is duplicated across files.
- A piece of JSX has its own clear responsibility and name.
- A component file exceeds ~150 lines or nests JSX more than ~4 levels.

Reuse first: before writing new UI, check `src/components/` — a `Button`/`Modal`/`IconButton` probably already fits.

## Anatomy of a clean component

```tsx
type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  disabled?: boolean
}

const Button = ({ children, onClick, variant = 'primary', disabled }: ButtonProps) => {
  const base = 'rounded-xl px-5 py-2 font-luckiest transition'
  const styles = {
    primary: 'bg-primary text-white hover:opacity-90',
    ghost: 'bg-transparent text-primary',
  }[variant]

  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
```

Rules embodied above:
- Explicit `Props` type, every prop named.
- Sensible defaults via destructuring defaults, not `||` chains.
- Variants are a typed union mapped to styles — no boolean soup (`isPrimary`, `isGhost`).
- Presentation only; no business logic, no Recoil reads. Pull state/handlers from the parent or a `useContainer`.

## Reusability principles

- **Props over duplication.** If two components differ by a string/color/icon, make it one component with a prop. Theme colors come from `src/utils/theme/color.ts` / Tailwind tokens — pass tokens, not raw hex.
- **Composition over configuration.** Prefer `children` and slot props to a growing list of boolean flags. A `Modal` takes `children`; it doesn't take `showHeader`/`showFooter`/`showX`.
- **One responsibility per file.** A component does one visual/interactive job. Container hooks do logic. Stores do state.
- **Stable, predictable API.** Event props as `onX`; controlled via `value`/`onChange`. Don't leak internal state upward.

## Naming & structure

- Components `PascalCase`, hooks `useX`, files match the export.
- Co-locate: component + its `useContainer.tsx` + (later) `*.test.tsx` in one folder.
- Order inside a component: hooks → derived values → handlers → `return (JSX)`. No logic buried in JSX beyond a ternary.

## Clean code checklist

- [ ] Could this be expressed by passing a prop to an existing component instead?
- [ ] Is every prop typed and necessary (no unused, no `any`)?
- [ ] Zero duplicated markup/className across the change?
- [ ] Presentation separated from logic (container hook / store)?
- [ ] Self-documenting names — no comment needed to explain *what* it does?
- [ ] `yarn lint` + `yarn build` clean?

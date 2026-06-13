---
name: senior-frontend
description: Apply senior-level React + TypeScript + Recoil + Tailwind engineering judgment for this project. Use when building features, refactoring components, structuring state, reviewing PRs, or making architecture/trade-off decisions on the frontend.
---

# Senior Frontend Engineering (SkyDuel)

Operate like a senior engineer who owns this codebase: optimize for readability, correctness, and the next person who touches the file. Match the surrounding code's idioms — don't import your own conventions.

## Container / presenter split (this project's core pattern)

Pages with logic use a co-located `useContainer.tsx`. The hook owns state + handlers; the component renders. Keep components dumb.

- `MainLayout`, `HomeScene`, and `Lobby` all consume `useContainer` from `src/pages/Home/useContainer.tsx`.
- New stateful pages get their own `useContainer.tsx`. Return a single object of values + handlers.
- A component file should read top-to-bottom as markup; if you see `useState`/`useEffect`/business logic crowding the JSX, lift it into the container hook.

## State management with Recoil

- All atoms live in `src/pages/Home/store/home.store.ts`. New domain state goes in a co-located `*.store.ts`, not scattered `useState`.
- One concern per atom. Derive, don't duplicate — prefer `selector` over syncing two atoms.
- Mutual-exclusivity / enum-ish UI state (like `homeModalOpenState`) is updated through a single handler in the container, never by callers flipping booleans ad hoc.
- Typed atoms: export the TS type alongside the atom (see `BodyPart`, `ModalOpenState`).

## TypeScript discipline

- No `any`. Prefer precise unions and `keyof` over loose strings (`keyof ModalOpenState`, not `string`).
- Type props with an explicit `Props` interface/type per component.
- Let inference work for locals; annotate boundaries (props, return shapes, atom types).
- `yarn build` runs `tsc -b` — a feature isn't done until it type-checks.

## React correctness

- Effects: every external resource (listeners, RAF, timers, subscriptions, WebGL) must be cleaned up. Get deps right; don't silence `react-hooks/exhaustive-deps` without a reason in a comment.
- Keys: stable, identity-based — never array index for dynamic lists.
- Derive during render instead of mirroring props into state.
- Memoize (`useMemo`/`useCallback`) only where it changes behavior (referential stability for deps) or fixes a measured cost — not reflexively.

## Tailwind & theming

- Brand colors come from `src/utils/theme/color.ts` and `tailwind.config.js` (primary accent `#ff006e`). Use the configured tokens, not raw hex in className.
- Extract a component when a className string repeats or a markup block appears 2+ times — see `Button`, `IconButton`, `Modal`.

## Decision-making

- Recommend one path, state the trade-off in a sentence, then proceed — don't enumerate every option.
- Smallest change that fully solves it. Reuse existing components (`components/`) before writing new ones.
- Flag, don't silently fix, anything that contradicts how the code was described.

## Before declaring done

- [ ] `yarn lint` clean
- [ ] `yarn build` type-checks
- [ ] No new `any`, no dead code, no commented-out experiments left behind
- [ ] Logic in the container hook, markup in the component
- [ ] Reused existing components/atoms where they fit

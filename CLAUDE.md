# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server (exposed on all network interfaces via --host)
yarn build      # Type-check + Vite production build
yarn lint       # ESLint
yarn preview    # Preview production build
```

No test framework is configured.

## Architecture

**HookDuel** is a 2-player browser dueling game — React + TypeScript + Vite, Three.js for 3D rendering, Recoil for global state, Tailwind CSS for styling.

### Page flow

`App.tsx` renders one page at a time (others are commented out during development):

| Page | Path | Purpose |
|------|------|---------|
| `Home` | `src/pages/Home/` | Character customization before entering a lobby |
| `Lobby` | `src/pages/Lobby/Lobby.tsx` | Pre-game lobby showing both players' characters |
| `Battle` | `src/pages/Battle/` | Active battle scene |

### Component patterns

- **Pages with business logic** use a co-located `useContainer.tsx` hook (container/presenter split). `HomeScene` and `Lobby` both consume `useContainer` from `src/pages/Home/useContainer.tsx`.
- **Three.js scenes** (`HomeScene`, `BattleScene`) are self-contained: they set up the renderer, camera, controls, lights, and animation loop inside a single `useEffect`, and tear everything down on unmount.
- **`MainLayout`** (`src/layout/Main.tsx`) wraps Home and Lobby: it composes `Background`, `Header`, modal overlays (ColorPicker, CreateLobby, JoinLobby), the bottom icon toolbar, and `HomeScene` (the 3D character viewer). It consumes `useContainer` for modal state.
- **`GlobalProvider`** (`src/Provider/GlobalProvider.tsx`) wraps the app with `RecoilRoot` and sets `w-screen h-screen` on the root div.

### State management

All Recoil atoms live in `src/pages/Home/store/home.store.ts`:

- `bodyPartColors` — hex colors for each character body part (Body, Face, Eye, Ear)
- `bodyPart` — currently selected body part for the color picker
- `homeModalOpenState` — which modal is open (only one at a time; `modalStateHandler` in `useContainer` enforces mutual exclusivity)

### 3D characters

- GLB model: `public/hero.glb` (also duplicated at `src/pages/Home/hero.glb`)
- Mesh names in the model that are targeted for color changes: `body`, `face`, `ear-l`, `ear-r`, `eye-l`, `eye-r`
- `HomeScene` renders the player model (left, x=-1) and opponent model (right, x=+1) when `inLobby=true`; only the player model when `inLobby=false`

### Theme

Brand colors are in `src/utils/theme/color.ts`. The primary accent is `#ff006e` (pink). Tailwind is configured with these custom values via `tailwind.config.js`. The custom font (Luckiest Guy) is in `src/assets/fonts/`.

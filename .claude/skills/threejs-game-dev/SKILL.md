---
name: threejs-game-dev
description: Build and review 3D game features in this project using Three.js (r0.172) + React + TypeScript. Use when adding/editing 3D scenes, GLB models, cameras, lights, controls, animation loops, or anything under HomeScene/BattleScene or *.glb assets.
---

# Three.js Game Development (SkyDuel)

You are building a 2-player browser dueling game. Three.js powers all 3D; React owns the DOM and lifecycle. Follow the patterns already established in `HomeScene.tsx` and `BattleScene.tsx`.

## Scene lifecycle — the golden rule

A Three.js scene is a **self-contained `useEffect`** mounted into a `ref`'d container `<div>`. Set up renderer, scene, camera, controls, lights, and the animation loop inside the effect; tear **everything** down in the cleanup.

```tsx
const mountRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const mount = mountRef.current
  if (!mount) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(mount.clientWidth, mount.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // cap DPR — perf on retina
  mount.appendChild(renderer.domElement)

  let frameId = 0
  const clock = new THREE.Clock()
  const animate = () => {
    const delta = clock.getDelta()
    // update mixers / controls here using `delta`, never a hardcoded step
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  animate()

  const onResize = () => {
    camera.aspect = mount.clientWidth / mount.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(mount.clientWidth, mount.clientHeight)
  }
  window.addEventListener('resize', onResize)

  return () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
    mount.removeChild(renderer.domElement)
    // dispose geometries, materials, textures you created (see Memory section)
  }
}, [/* deps that should rebuild the scene, e.g. inLobby */])
```

## Memory: dispose what you create

WebGL resources are **not** garbage-collected by React. Every `Geometry`, `Material`, and `Texture` you `new` must be `.dispose()`d in cleanup, and GLB scenes must be traversed:

```ts
model.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.dispose()
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    mats.forEach((m) => m.dispose())
  }
})
renderer.dispose()
```
Leaking these is the #1 cause of FPS decay when navigating Home ↔ Lobby ↔ Battle.

## Loading GLB models

- Player model lives at `public/hero.glb` (served from root: load via `/hero.glb`).
- Use `GLTFLoader` from `three/examples/jsm/loaders/GLTFLoader.js`.
- Targetable meshes for color: `body`, `face`, `ear-l`, `ear-r`, `eye-l`, `eye-r`. Recolor by finding the mesh and cloning/setting its material color from `bodyPartColors`.
- `HomeScene` convention: player model at `x = -1`; opponent at `x = +1`, rendered only when `inLobby === true`.

```ts
const loader = new GLTFLoader()
loader.load('/hero.glb', (gltf) => {
  const model = gltf.scene
  model.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.name === 'body') {
      (obj.material as THREE.MeshStandardMaterial).color.set(bodyPartColors.Body)
    }
  })
  scene.add(model)
})
```

## Animation

- Drive skeletal animation with `THREE.AnimationMixer`; update it with `mixer.update(delta)` inside the loop using `clock.getDelta()` — never a fixed number.
- Use `gsap` (already a dependency) for tweening transforms, camera moves, and one-shot UI-driven motion. Kill tweens in cleanup (`gsap.killTweensOf(target)`).

## Reactive bridge: Recoil → Three.js

The scene effect runs once; Recoil values captured inside it are stale. To react to state (color changes, `inLobby`):
- Put state that should **rebuild** the scene in the effect deps.
- For per-frame reactive values, store them in a `useRef` updated by a small separate effect, and read `ref.current` inside `animate()`.

## Checklist before finishing a 3D change

- [ ] `requestAnimationFrame` cancelled in cleanup
- [ ] All created geometries/materials/textures + renderer disposed
- [ ] `resize` listener added and removed
- [ ] `delta`-based animation (frame-rate independent)
- [ ] `setPixelRatio` capped at 2
- [ ] No stale Recoil values read inside the long-lived loop
- [ ] `yarn build` type-checks clean

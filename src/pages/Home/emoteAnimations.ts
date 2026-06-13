import { gsap } from "gsap";
import * as THREE from "three";
import type { EmoteType } from "./emotes";

/** Resting Y position of the character on its platform. Shared with HomeScene. */
export const CHARACTER_BASE_Y = -0.4;
/** Uniform scale the model is loaded at. */
export const CHARACTER_BASE_SCALE = 0.4;

interface BaseTransform {
  x: number;
  y: number;
  rotZ: number;
  rotY: number;
  scale: number;
}

/**
 * Play a procedural emote animation on the (rig-less) character model and resolve to its
 * resting transform so the idle loop can resume cleanly. Returns the timeline so callers can
 * kill it if a new emote interrupts.
 */
export const playEmoteAnimation = (
  model: THREE.Object3D,
  type: EmoteType,
  onComplete: () => void
): gsap.core.Timeline => {
  const base: BaseTransform = {
    x: model.position.x,
    y: CHARACTER_BASE_Y,
    rotZ: Math.PI,
    rotY: model.rotation.y,
    scale: CHARACTER_BASE_SCALE,
  };

  // Snap to a known resting state before animating so we never start mid-idle-bounce.
  model.position.set(base.x, base.y, model.position.z);
  model.rotation.z = base.rotZ;

  const tl = gsap.timeline({ onComplete });

  switch (type) {
    case "happy": // gentle anticipation, then bounces of decreasing height + soft nod
      tl.to(model.position, { y: base.y - 0.08, duration: 0.25, ease: "sine.inOut" })
        .to(model.position, { y: base.y + 0.3, duration: 0.35, ease: "power2.out" })
        .to(model.rotation, { z: base.rotZ + 0.08, duration: 0.35, ease: "sine.inOut" }, "<")
        .to(model.position, { y: base.y, duration: 0.45, ease: "bounce.out" })
        .to(model.rotation, { z: base.rotZ, duration: 0.45, ease: "sine.inOut" }, "<")
        .to(model.position, { y: base.y + 0.16, duration: 0.3, ease: "power2.out" })
        .to(model.position, { y: base.y, duration: 0.45, ease: "bounce.out" });
      break;

    case "love": // slow swell, soft pulse beats + sway, elastic settle
      tl.to(model.scale, { x: base.scale * 1.2, y: base.scale * 1.2, z: base.scale * 1.2, duration: 0.45, ease: "back.out(2)" })
        .to(model.position, { y: base.y + 0.22, duration: 0.45, ease: "power2.out" }, "<")
        .to(model.rotation, { z: base.rotZ - 0.07, duration: 0.45, ease: "sine.inOut" }, "<")
        .to(model.scale, { x: base.scale * 1.06, y: base.scale * 1.06, z: base.scale * 1.06, duration: 0.35, ease: "sine.inOut" })
        .to(model.rotation, { z: base.rotZ + 0.07, duration: 0.5, ease: "sine.inOut" }, "<")
        .to(model.scale, { x: base.scale * 1.18, y: base.scale * 1.18, z: base.scale * 1.18, duration: 0.35, ease: "sine.inOut" })
        .to(model.rotation, { z: base.rotZ, duration: 0.55, ease: "sine.inOut" }, "<")
        .to(model.scale, { x: base.scale, y: base.scale, z: base.scale, duration: 0.6, ease: "elastic.out(1, 0.5)" })
        .to(model.position, { y: base.y, duration: 0.6, ease: "bounce.out" }, "<");
      break;

    case "cool": // anticipation lean, slow full spin, settle bob
      tl.to(model.rotation, { y: base.rotY - 0.4, duration: 0.4, ease: "power2.out" })
        .to(model.rotation, { y: base.rotY + Math.PI * 2, duration: 1.3, ease: "power2.inOut" })
        .set(model.rotation, { y: base.rotY })
        .to(model.position, { y: base.y + 0.12, duration: 0.25, ease: "power2.out" })
        .to(model.position, { y: base.y, duration: 0.5, ease: "bounce.out" });
      break;

    case "laugh": { // decaying side-to-side wobble + tiny bob
      const amps = [0.32, 0.32, 0.26, 0.26, 0.18, 0.18, 0.1, 0.1];
      tl.to(model.position, { y: base.y + 0.1, duration: 0.3, ease: "sine.out" });
      amps.forEach((amp, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        tl.to(model.rotation, { z: base.rotZ + amp * dir, duration: 0.16, ease: "sine.inOut" });
      });
      tl.to(model.rotation, { z: base.rotZ, duration: 0.18, ease: "sine.inOut" })
        .to(model.position, { y: base.y, duration: 0.4, ease: "bounce.out" }, "<");
      break;
    }

    case "angry": { // wind-up, decaying shake + forward lean, ease out
      const amps = [0.16, 0.16, 0.13, 0.13, 0.1, 0.1, 0.06, 0.06, 0.03];
      tl.to(model.position, { x: base.x - 0.1, duration: 0.25, ease: "power2.out" })
        .to(model.rotation, { z: base.rotZ + 0.12, duration: 0.25, ease: "sine.inOut" }, "<");
      amps.forEach((amp, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        tl.to(model.position, { x: base.x + amp * dir, duration: 0.08, ease: "sine.inOut" });
      });
      tl.to(model.position, { x: base.x, duration: 0.2, ease: "sine.inOut" })
        .to(model.rotation, { z: base.rotZ, duration: 0.4, ease: "power2.out" }, "<");
      break;
    }

    case "surprised": // deep anticipation squash, high stretched jump, soft elastic landing
      tl.to(model.scale, { y: base.scale * 0.65, x: base.scale * 1.3, z: base.scale * 1.3, duration: 0.3, ease: "power2.out" })
        .to(model.position, { y: base.y - 0.06, duration: 0.3, ease: "power2.out" }, "<")
        .to(model.scale, { y: base.scale * 1.3, x: base.scale * 0.82, z: base.scale * 0.82, duration: 0.35, ease: "power2.out" })
        .to(model.position, { y: base.y + 0.65, duration: 0.45, ease: "power2.out" }, "<")
        .to(model.position, { y: base.y, duration: 0.5, ease: "power1.in" })
        .to(model.scale, { y: base.scale * 0.78, x: base.scale * 1.2, z: base.scale * 1.2, duration: 0.5, ease: "power1.in" }, "<")
        .to(model.scale, { x: base.scale, y: base.scale, z: base.scale, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      break;

    case "sad": // slow sink + tilt, sigh bob at the bottom, slow rise
      tl.to(model.position, { y: base.y - 0.2, duration: 0.9, ease: "power2.inOut" })
        .to(model.rotation, { z: base.rotZ + 0.2, duration: 0.9, ease: "power2.inOut" }, "<")
        .to(model.position, { y: base.y - 0.13, duration: 0.4, ease: "sine.inOut" })
        .to(model.position, { y: base.y - 0.2, duration: 0.4, ease: "sine.inOut" })
        .to(model.position, { y: base.y, duration: 0.9, ease: "power2.inOut" })
        .to(model.rotation, { z: base.rotZ, duration: 0.9, ease: "power2.inOut" }, "<");
      break;

    case "think": // smooth tilt in, subtle head-bob while held, smooth tilt out
      tl.to(model.rotation, { z: base.rotZ + 0.28, duration: 0.6, ease: "power2.out" })
        .to(model.position, { y: base.y + 0.05, duration: 0.55, ease: "sine.inOut" })
        .to(model.position, { y: base.y - 0.03, duration: 0.55, ease: "sine.inOut" })
        .to(model.position, { y: base.y + 0.05, duration: 0.55, ease: "sine.inOut" })
        .to(model.position, { y: base.y, duration: 0.45, ease: "sine.inOut" })
        .to(model.rotation, { z: base.rotZ, duration: 0.6, ease: "power2.inOut" }, "<");
      break;
  }

  // Guarantee an exact resting state for the idle loop to take back over.
  tl.set(model.position, { x: base.x, y: base.y });
  tl.set(model.rotation, { y: base.rotY, z: base.rotZ });
  tl.set(model.scale, { x: base.scale, y: base.scale, z: base.scale });

  return tl;
};

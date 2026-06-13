import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import useContainer from "./useContainer";
import { playEmoteAnimation, CHARACTER_BASE_Y } from "./emoteAnimations";
import { EMOTE_EMOJI } from "./emotes";

const HomeScene = ({ inLobby = true }) => {
  const { bodyPartColor, selectedPart, activeEmote } = useContainer();
  const [emoteBubble, setEmoteBubble] = useState<{ emoji: string; nonce: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mount = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const modelRefs = useRef<{ player: THREE.Object3D | null; otherPlayer: THREE.Object3D | null }>({
    player: null,
    otherPlayer: null,
  });
  const cylinderRefs = useRef<THREE.Mesh[]>([]);
  const entryDone = useRef<{ player: boolean; otherPlayer: boolean }>({ player: false, otherPlayer: false });
  const isEmoting = useRef(false);
  const emoteTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const container = containerRef.current;
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, (container?.clientWidth ?? 1) / (container?.clientHeight ?? 1), 1, 1000);
    camera.position.set(0, 0.5, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    renderer.setSize(container?.clientWidth!, container?.clientHeight!);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount?.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableRotate = !inLobby;

    // Base floor cylinders
    cylinderRefs.current = [];
    const createCylinder = (xPosition: number) => {
      const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32);
      const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xff006e });
      const cylinder = new THREE.Mesh(cylinderGeo, cylinderMaterial);
      cylinder.position.set(xPosition, -1.2, 0);
      cylinder.receiveShadow = true;
      scene.add(cylinder);
      cylinderRefs.current.push(cylinder);
    };

    if (inLobby) {
      createCylinder(-1);
      createCylinder(1);
    } else {
      createCylinder(0);
    }

    // Load character models
    const loader = new GLTFLoader();
    const loadCharacter = (xPosition: number, rotationY: number, isPlayer: boolean) => {
      loader.load(
        "./hero.glb",
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.4, 0.4, 0.4);
          model.rotation.z = Math.PI;
          model.rotation.y = rotationY;
          const finalX = inLobby ? xPosition : 0;
          model.position.set(finalX, -2, 0.03);
          scene.add(model);
          if (isPlayer) {
            modelRefs.current.player = model;
          } else {
            modelRefs.current.otherPlayer = model;
          }
          // Entry jump: character leaps up from below onto platform
          gsap.to(model.position, {
            y: CHARACTER_BASE_Y,
            duration: 0.7,
            ease: "back.out(1.5)",
            delay: isPlayer ? 0 : 0.2,
            onComplete: () => {
              if (isPlayer) entryDone.current.player = true;
              else entryDone.current.otherPlayer = true;
            },
          });
        },
        undefined,
        (error) => {
          console.error("Error loading model", error);
        },
      );
    };

    loadCharacter(-1, Math.PI / 2, true);
    if (inLobby) loadCharacter(1, Math.PI / 2, false);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();

      const time = Date.now() * 0.001;
      const { player, otherPlayer } = modelRefs.current;

      // Idle bounce and sway — only after entry, and paused while an emote plays (GSAP owns the transform then)
      if (player && entryDone.current.player && !isEmoting.current) {
        player.position.y = CHARACTER_BASE_Y + Math.sin(time * 2.5) * 0.08;
        player.rotation.z = Math.PI + Math.sin(time * 1.5) * 0.03;
      }
      if (otherPlayer && entryDone.current.otherPlayer) {
        otherPlayer.position.y = CHARACTER_BASE_Y + Math.sin(time * 2.5 + Math.PI * 0.7) * 0.08;
        otherPlayer.rotation.z = Math.PI + Math.sin(time * 1.5 + Math.PI * 0.7) * 0.03;
      }

      // Platform pulse
      cylinderRefs.current.forEach((cyl, i) => {
        const pulse = 1 + Math.sin(time * 3 + i * Math.PI) * 0.025;
        cyl.scale.set(pulse, 1, pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const handleResize = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const width = container?.clientWidth!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const height = container?.clientHeight!;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId.current!);
      window.removeEventListener("resize", handleResize);
      mount?.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const highlightBody = (mesh: THREE.Mesh, scale = 1.2) => {
      const originalScale = mesh.scale.clone();
      const highlightScale = originalScale.clone().multiplyScalar(scale);
      const duration = 300;
      const startTime = performance.now();

      const animateHighlight = (time: number) => {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);
        mesh.scale.lerpVectors(originalScale, highlightScale, t);

        if (elapsed < duration) {
          requestAnimationFrame(animateHighlight);
        } else {
          const reverseStartTime = performance.now();
          const animateReverse = (reverseTime: number) => {
            const reverseElapsed = reverseTime - reverseStartTime;
            const reverseT = Math.min(reverseElapsed / duration, 1);
            mesh.scale.lerpVectors(highlightScale, originalScale, reverseT);
            if (reverseElapsed < duration) {
              requestAnimationFrame(animateReverse);
            }
          };
          requestAnimationFrame(animateReverse);
        }
      };

      requestAnimationFrame(animateHighlight);
    };

    const playerModal = modelRefs.current["player"];
    if (playerModal) {
      playerModal.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          if (child.name === "body") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Body);
            if (selectedPart === "Body") highlightBody(child as THREE.Mesh, 1.02);
          }
          if (child.name === "face") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Face);
            if (selectedPart === "Face") highlightBody(child as THREE.Mesh, 1.03);
          }
          if (child.name === "ear-l" || child.name === "ear-r") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Ear);
            if (selectedPart === "Ear") highlightBody(child as THREE.Mesh);
          }
          if (child.name === "eye-l" || child.name === "eye-r") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Eye);
            if (selectedPart === "Eye") highlightBody(child as THREE.Mesh);
          }
        }
      });
    }
  }, [bodyPartColor, selectedPart]);

  useEffect(() => {
    if (!activeEmote) return;
    const player = modelRefs.current.player;
    if (!player) return;

    // Interrupt any in-flight emote and take control away from the idle loop.
    emoteTimeline.current?.kill();
    isEmoting.current = true;
    emoteTimeline.current = playEmoteAnimation(player, activeEmote.type, () => {
      isEmoting.current = false;
      emoteTimeline.current = null;
    });

    setEmoteBubble({ emoji: EMOTE_EMOJI[activeEmote.type], nonce: activeEmote.nonce });
    const bubbleTimer = window.setTimeout(() => setEmoteBubble(null), 2800);

    return () => window.clearTimeout(bubbleTimer);
  }, [activeEmote]);

  return (
    <div ref={containerRef} className="w-screen z-10 h-screen flex justify-center">
      <div ref={mount} />
      {emoteBubble && (
        <span key={emoteBubble.nonce} className="emote-bubble pointer-events-none absolute left-1/2 top-1/3 z-30 -translate-x-1/2 text-5xl">
          {emoteBubble.emoji}
        </span>
      )}
    </div>
  );
};

export default HomeScene;

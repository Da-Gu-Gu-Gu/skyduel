import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import useContainer from "./useContainer";

const HomeScene = ({ inLobby = false }) => {
  const { bodyPartColor, selectedPart } = useContainer();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mount = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const modelRefs = useRef<{ player: THREE.Object3D | null; otherPlayer: THREE.Object3D | null }>({
    player: null,
    otherPlayer: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeModel, setActiveModel] = useState<"player" | "otherPlayer">("player");

  useEffect(() => {
    const scene = new THREE.Scene();
    const container = containerRef.current;
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75,
      (container?.clientWidth ?? 1) / (container?.clientHeight ?? 1),
      1,
      1000
    );
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
    const createCylinder = (xPosition: number) => {
      const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32);
      const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xff006e });
      const cylinder = new THREE.Mesh(cylinderGeo, cylinderMaterial);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      inLobby ? cylinder.position.set(xPosition, -1.05, 0) : cylinder.position.set(0, -1.05, 0);
      cylinder.receiveShadow = true;
      scene.add(cylinder);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !inLobby && createCylinder(-1);

    // Load character models
    const loader = new GLTFLoader();
    const loadCharacter = (xPosition: number, rotationY: number, isPlayer: boolean) => {
      loader.load(
        "./hero.glb",
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.4, 0.4, 0.4);
          model.rotation.z = Math.PI
          model.rotation.y = rotationY
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          inLobby ? model.position.set(xPosition, -0.4, 0.03) : model.position.set(0, -0.4, 0.03);
          scene.add(model);
          if (isPlayer) {
            modelRefs.current.player = model;
          } else {
            modelRefs.current.otherPlayer = model;
          }

        },
        undefined,
        (error) => {
          console.error("Error loading model", error);
        }
      );
    };

    loadCharacter(-1, Math.PI / 2, true);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inLobby && loadCharacter(1, Math.PI / 2, false); //other player modal obj

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
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

    const playerModal = modelRefs.current['player'];
    if (playerModal) {
      playerModal.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          if (child.name === "body") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Body);
            if (selectedPart === 'Body') highlightBody(child as THREE.Mesh, 1.02)
          }
          if (child.name === "face") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Face);
            if (selectedPart === 'Face') highlightBody(child as THREE.Mesh, 1.03)
          }
          if (child.name === "ear-l" || child.name === "ear-r") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Ear);
            if (selectedPart === 'Ear') highlightBody(child as THREE.Mesh)
          }
          if (child.name === "eye-l" || child.name === "eye-r") {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(bodyPartColor.Eye);
            if (selectedPart === 'Eye') highlightBody(child as THREE.Mesh)
          }
        }
      });
    }

  }, [bodyPartColor, selectedPart, activeModel]);

  return (
    <div ref={containerRef} className="w-screen z-10 h-screen flex justify-center">
      <div ref={mount} />
    </div>
  );
};

export default HomeScene;

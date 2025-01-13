import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const HomeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mount = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

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
    camera.position.set(0, 0.5, 1.5);

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
    //for rotate only on X axis
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    // base floor
    const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      color: 0xff006e,
    });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMaterial);
    cylinder.position.y = -0.02;
    cylinder.receiveShadow = true;
    cylinder.position.set(0, -1.05, 0);
    scene.add(cylinder);

    // character
    const loader = new GLTFLoader();
    loader.load(
      "./character.glb",
      (gltf) => {
        modelRef.current = gltf.scene;
        modelRef.current.scale.set(0.08, 0.08, 0.08);
        modelRef.current.position.z = 0.2;
        modelRef.current.position.set(0, -0.8, 0.2);
        camera.lookAt(modelRef.current.position);
        scene.add(gltf.scene);

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      },
      undefined,
      (error) => {
        console.error("err", error);
      }
    );

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
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

  return (
    <div
      ref={containerRef}
      className="w-screen z-10 h-screen flex justify-center"
    >
      <div ref={mount} />
    </div>
  );
};

export default HomeScene;

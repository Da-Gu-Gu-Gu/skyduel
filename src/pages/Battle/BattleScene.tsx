import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const BattleScene = ({ inLobby = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mount = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const scene = new THREE.Scene();

  useEffect(() => {
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

    // Load character models
    // createPlane();
    // / Load water texture
    const loader = new THREE.TextureLoader();
    const waterTexture = loader.load("https://threejs.org/examples/textures/water.jpg"); // or your own texture
    waterTexture.wrapS = THREE.RepeatWrapping;
    waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(1, 5); // Stretch vertically

    // River shape (vertical from top to bottom)
    const riverShape = new THREE.Shape();
    const x = 0,
      y = 0;
    riverShape.moveTo(x, y);
    riverShape.bezierCurveTo(x - 1, y - 5, x + 2, y - 10, x, y - 15);
    riverShape.bezierCurveTo(x - 2, y - 18, x + 1, y - 22, x - 1, y - 25);
    riverShape.bezierCurveTo(x + 1.5, y - 28, x - 2, y - 32, x, y - 35);
    riverShape.bezierCurveTo(x - 1.5, y - 38, x + 2.5, y - 42, x, y - 45);

    // Wider right side
    riverShape.lineTo(x + 5, y - 45);
    riverShape.bezierCurveTo(x + 6.5, y - 42, x + 2, y - 38, x + 6, y - 35);
    riverShape.bezierCurveTo(x + 1.5, y - 32, x + 6, y - 28, x + 4.5, y - 25);
    riverShape.bezierCurveTo(x + 6, y - 22, x + 2, y - 18, x + 5, y - 15);
    riverShape.bezierCurveTo(x + 1, y - 10, x + 6, y - 5, x + 5, y);
    riverShape.lineTo(x, y); // Close shape

    // Create mesh
    const geometry = new THREE.ShapeGeometry(riverShape);
    const material = new THREE.MeshPhongMaterial({
      map: waterTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const riverMesh = new THREE.Mesh(geometry, material);
    // riverMesh.rotation.x = -Math.PI / 2; // Lay flat like a riverbed
    riverMesh.position.set(0, 0.01, 0); // Slightly above ground
    scene.add(riverMesh);

    // Add lights
    scene.add(new THREE.AmbientLight(0x404040));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Ground (optional)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshLambertMaterial({ color: 0x336633 }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
      waterTexture.offset.y -= 0.01;
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

  return (
    <div ref={containerRef} className="w-screen z-10 h-screen flex justify-center">
      <div ref={mount} />
    </div>
  );
};

export default BattleScene;

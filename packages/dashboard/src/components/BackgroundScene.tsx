import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundScene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
    if (linesRef.current) {
      linesRef.current.rotation.x = -clock.getElapsedTime() * 0.02;
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0e27']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 20]} intensity={0.3} color="#3b82f6" />
      <pointLight position={[-20, -20, 20]} intensity={0.2} color="#8b5cf6" />

      {/* Floating icosahedron */}
      <mesh ref={meshRef} position={[5, 3, -15]} scale={3}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhongMaterial
          color="#1e293b"
          wireframe={false}
          metalness={0.3}
          roughness={0.6}
          opacity={0.1}
          transparent
        />
      </mesh>

      {/* Wireframe backdrop */}
      <mesh position={[-8, -2, -20]} scale={5}>
        <octahedronGeometry args={[1, 2]} />
        <meshPhongMaterial
          color="#475569"
          wireframe={true}
          opacity={0.05}
          transparent
        />
      </mesh>

      {/* Subtle grid */}
      <gridHelper args={[50, 50]} position={[0, -10, -20]} />
    </>
  );
};

export default BackgroundScene;

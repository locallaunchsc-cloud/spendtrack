import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FloatingLabelProps {
  position: [number, number, number];
  text: string;
  color?: string;
}

export default function FloatingLabel({ position, text, color = 'white' }: FloatingLabelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.002;
      groupRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

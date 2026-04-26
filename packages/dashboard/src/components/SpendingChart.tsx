import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SpendingChartProps {
  data: Record<string, number>;
}

const Bar = ({ position, height, color }: any) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.z = Math.sin(clock.getElapsedTime() + position[0]) * 0.3;
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={[0.6, height, 0.6]} />
      <meshPhongMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        shininess={100}
      />
    </mesh>
  );
};

export default function SpendingChart({ data }: SpendingChartProps) {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, v]) => v));
  const colors = [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#4facfe',
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#667eea" />

      {entries.map(([name, value], i) => (
        <group key={name}>
          <Bar
            position={[i * 2 - 3, (value / maxValue) * 2, 0]}
            height={(value / maxValue) * 4}
            color={colors[i % colors.length]}
          />
          <text
            position={[i * 2 - 3, -1, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
          >
            ${value.toFixed(0)}
          </text>
        </group>
      ))}

      <gridHelper args={[10, 10]} position={[0, -2.5, 0]} />
    </>
  );
}

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AdvancedChartProps {
  data: Record<string, number>;
}

const AnimatedBar = ({ position, height, color, delay }: any) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * 0.5 + delay) * 0.3;
      ref.current.rotation.x += 0.001;
      (ref.current.material as THREE.MeshPhongMaterial).emissiveIntensity =
        0.4 + Math.sin(t * 2 + delay) * 0.2;
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
        metalness={0.3}
        roughness={0.4}
      />
      <meshNormalMaterial wireframe opacity={0.1} />
    </mesh>
  );
};

export default function AdvancedSpendingChart({ data }: AdvancedChartProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([_, v]) => v));
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={1.2} castShadow color="#667eea" />
      <pointLight position={[-15, 10, 5]} intensity={0.8} color="#f093fb" />
      <pointLight position={[0, -10, 10]} intensity={0.5} color="#4facfe" />

      {entries.map(([name, value], i) => (
        <group key={name}>
          <AnimatedBar
            position={[i * 2.5 - 5, (value / maxValue) * 2.5, 0]}
            height={(value / maxValue) * 5}
            color={colors[i % colors.length]}
            delay={i * 0.2}
          />
        </group>
      ))}

      <gridHelper args={[15, 15]} position={[0, -3, 0]} />
    </>
  );
}

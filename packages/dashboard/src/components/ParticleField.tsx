import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 20;

      vel[i] = (Math.random() - 0.5) * 0.02;
      vel[i + 1] = (Math.random() - 0.5) * 0.02;
      vel[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i];
      pos[i + 1] += velocities[i + 1];
      pos[i + 2] += velocities[i + 2];

      // Bounce off boundaries
      if (Math.abs(pos[i]) > 10) velocities[i] *= -1;
      if (Math.abs(pos[i + 1]) > 10) velocities[i + 1] *= -1;
      if (Math.abs(pos[i + 2]) > 10) velocities[i + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#667eea" sizeAttenuation transparent opacity={0.3} />
    </points>
  );
}

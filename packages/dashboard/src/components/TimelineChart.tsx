import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TimelineChart = () => {
  const lineRef = useRef<THREE.Line>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.rotation.z += 0.0005;
    }
  });

  // Generate sample timeline data
  const points = [];
  for (let i = 0; i < 30; i++) {
    const x = i * 0.6 - 9;
    const y = Math.sin(i * 0.3) * 2 + Math.random() * 1;
    const z = Math.cos(i * 0.2) * 1;
    points.push(x, y, z);
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#764ba2" />

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={new Float32Array(points)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#667eea" linewidth={2} />
      </line>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={new Float32Array(points)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#f093fb"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      <gridHelper args={[20, 10]} position={[0, -3, 0]} />
    </>
  );
};

export default TimelineChart;

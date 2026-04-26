import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OrbField = () => {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    const items = [];
    for (let i = 0; i < 8; i++) {
      items.push({
        position: [
          Math.cos((i / 8) * Math.PI * 2) * 4,
          Math.sin((i / 8) * Math.PI * 2) * 1.5,
          Math.sin((i / 8) * Math.PI * 2) * 4,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        speed: 0.5 + Math.random() * 0.5,
        color: i % 3 === 0 ? '#667eea' : i % 3 === 1 ? '#764ba2' : '#f093fb',
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} delay={i * 0.3} />
      ))}
    </group>
  );
};

const Orb = ({ position, scale, speed, color, delay }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * speed + delay) * 0.5;
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = t * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhongMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        shininess={150}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const CenterCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.3;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -clock.getElapsedTime() * 0.3;
      wireRef.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} scale={1.2}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhongMaterial
          color="#667eea"
          emissive="#667eea"
          emissiveIntensity={0.8}
          shininess={200}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#764ba2"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

const ParticleSwarm = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a78bfa"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
};

export default function HeroScene() {
  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 8, 20]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#667eea" />
      <pointLight position={[-10, -10, 5]} intensity={1} color="#f093fb" />
      <pointLight position={[0, 5, 10]} intensity={0.8} color="#764ba2" />

      <CenterCore />
      <OrbField />
      <ParticleSwarm />
    </>
  );
}

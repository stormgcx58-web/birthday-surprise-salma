import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const COUNT = 1200;

function HeartParticles({ beating }: { beating: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const onVisibility = () => {
      isVisible.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = 0.85 + Math.random() * 0.15;
      const x = r * 16 * Math.pow(Math.sin(t), 3);
      const y = r * (13 * Math.cos(t) - 5 * Math.cos(2*t)
                    - 2 * Math.cos(3*t) - Math.cos(4*t));
      const z = (Math.random() - 0.5) * 4;
      positions[i*3]   = x * 0.07;
      positions[i*3+1] = y * 0.07;
      positions[i*3+2] = z * 0.3;

      // ألوان بنفسجية بدل الوردية
      const rand = Math.random();
      if (rand < 0.5) {
        // بنفسجي فاتح
        colors[i*3]   = 0.69 + Math.random() * 0.2;
        colors[i*3+1] = 0.41 + Math.random() * 0.2;
        colors[i*3+2] = 1;
      } else if (rand < 0.8) {
        // بنفسجي غامق
        colors[i*3]   = 0.55 + Math.random() * 0.2;
        colors[i*3+1] = 0.23;
        colors[i*3+2] = 0.91 + Math.random() * 0.09;
      } else {
        // لافندر فاتح
        colors[i*3]   = 0.88 + Math.random() * 0.12;
        colors[i*3+1] = 0.67 + Math.random() * 0.2;
        colors[i*3+2] = 1;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !isVisible.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = time * 0.4;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    if (beating) {
      const beat = 1 + Math.sin(time*4)*0.08 + Math.sin(time*8)*0.04;
      meshRef.current.scale.setScalar(beat);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function AmbientGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t) * 0.05);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.08 + Math.sin(t*2) * 0.03;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 8, 8]} />
      <meshBasicMaterial
        color="#b06aff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function HeartFallback({ beating, height }: { beating?: boolean; height?: string }) {
  return (
    <div style={{
      width: '100%',
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        style={{
          fontSize: '12rem',
          filter: 'drop-shadow(0 0 40px rgba(176,106,255,0.9))',
          userSelect: 'none',
        }}
        animate={beating
          ? { scale: [1, 1.15, 1, 1.1, 1] }
          : { scale: [1, 1.08, 1] }
        }
        transition={{
          duration: beating ? 0.6 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        💜
      </motion.div>
    </div>
  );
}

export default function HeartCanvas({ beating = false, height = '400px' }) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ||
                 canvas.getContext('webgl') ||
                 canvas.getContext('experimental-webgl');
      setWebglAvailable(!!gl);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  if (webglAvailable === null || !webglAvailable)
    return <HeartFallback beating={beating} height={height} />;

  return (
    <div style={{
      width: '100%',
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 90 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} color="#b06aff" intensity={2} />
        <pointLight position={[-2, -2, 2]} color="#da70d6" intensity={1.5} />
        <HeartParticles beating={beating} />
        <AmbientGlow />
      </Canvas>
    </div>
  );
}
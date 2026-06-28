import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// خارج المكوّن — لا تُعاد الإنشاء في كل Render
const COUNT = 1200; // كان 3000
const EMOJIS = ['❤️', '💕', '✨', '💖', '🌸'];

function HeartParticles({ beating }: { beating: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const isVisible = useRef(true);

  // إيقاف التحريك عند إخفاء الصفحة — يوفّر بطارية كبيرة
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
      const rand = Math.random();
      if (rand < 0.5) {
        colors[i*3]=1; colors[i*3+1]=0.41+Math.random()*0.3;
        colors[i*3+2]=0.7+Math.random()*0.3;
      } else if (rand < 0.8) {
        colors[i*3]=0.85+Math.random()*0.15;
        colors[i*3+1]=0.44; colors[i*3+2]=0.84;
      } else {
        colors[i*3]=1; colors[i*3+1]=0.84; colors[i*3+2]=0;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !isVisible.current) return; // توقف عند الإخفاء
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
        size={0.06} vertexColors transparent opacity={0.9}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  );
}

// AmbientGlow مبسّطة — كانت sphereGeometry(1.5, 32, 32)
function AmbientGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t) * 0.05);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.06 + Math.sin(t*2) * 0.02;
  });
  return (
    <mesh ref={ref}>
      {/* 8,8 بدل 32,32 — نفس المظهر، أداء أفضل بكثير */}
      <sphereGeometry args={[1.5, 8, 8]} />
      <meshBasicMaterial
        color="#ff69b4" transparent opacity={0.06}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function HeartFallback({ beating, height }: { beating?: boolean; height?: string }) {
  return (
    <div style={{ width:'100%', height, display:'flex',
                  alignItems:'center', justifyContent:'center' }}>
      <motion.div
        style={{ fontSize:'10rem',
                 filter:'drop-shadow(0 0 30px rgba(255,105,180,0.8))' }}
        animate={beating ? { scale:[1,1.15,1,1.1,1] } : { scale:[1,1.05,1] }}
        transition={{ duration:beating?0.6:2, repeat:Infinity, ease:'easeInOut' }}
      >❤️</motion.div>
    </div>
  );
}

export default function HeartCanvas({ beating=false, height='400px' }) {
  const [webglAvailable, setWebglAvailable] = useState<boolean|null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ||
                 canvas.getContext('webgl') ||
                 canvas.getContext('experimental-webgl');
      setWebglAvailable(!!gl);
    } catch { setWebglAvailable(false); }
  }, []);

  if (webglAvailable === null || !webglAvailable)
    return <HeartFallback beating={beating} height={height} />;

  return (
    <div style={{ width:'100%', height }}>
      <Canvas
        camera={{ position:[0,0,5], fov:60 }}
        gl={{
          antialias: false,      // كان true — وفّر موارد كبيرة
          alpha: true,
          powerPreference: 'low-power', // مهم جداً للبطارية
        }}
        style={{ background:'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2,2,2]} color="#ff69b4" intensity={2} />
        <pointLight position={[-2,-2,2]} color="#da70d6" intensity={1.5} />
        <HeartParticles beating={beating} />
        <AmbientGlow />
      </Canvas>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import Button from '@mui/material/Button';
import StarryBackground from './StarryBackground';
import { config } from '../config';

interface Balloon {
  id: number;
  x: number;
  size: number;
  delay: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
}

const COLORS = ['#b06aff', '#da70d6', '#e0aaff', '#9b4dff', '#e040fb', '#c77dff'];

export default function FinalScene() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [windowSize, setWindowSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const fwIdRef = useRef(0);

  useEffect(() => {
    setBalloons(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 28 + Math.random() * 16,
      delay: Math.random() * 3,
    })));

    const spawnFw = () => {
      const newFw: Firework[] = Array.from({ length: 3 }, () => ({
        id: fwIdRef.current++,
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 45,
      }));
      setFireworks(fw => [...fw, ...newFw]);
      setTimeout(() => {
        setFireworks(fw => fw.filter(f => !newFw.find(n => n.id === f.id)));
      }, 1400);
    };

    for (let i = 0; i < 6; i++) setTimeout(spawnFw, i * 600);
    const interval = setInterval(spawnFw, 3000);

    const onResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <StarryBackground />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(176,106,255,0.2) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <ReactConfetti
        width={windowSize.w}
        height={windowSize.h}
        recycle={false}
        numberOfPieces={120}
        colors={COLORS}
        style={{ zIndex: 30, pointerEvents: 'none' }}
      />

      {fireworks.map(fw => (
        <motion.div
          key={fw.id}
          className="fixed pointer-events-none"
          style={{ left: `${fw.x}%`, top: `${fw.y}%`, zIndex: 25 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: COLORS[i % COLORS.length],
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 70,
                y: Math.sin((i / 6) * Math.PI * 2) * 70,
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      ))}

      {balloons.map(b => (
        <motion.div
          key={b.id}
          className="fixed pointer-events-none select-none"
          style={{ left: `${b.x}%`, bottom: 0, fontSize: b.size, zIndex: 20 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -(windowSize.h + 80), opacity: [0, 1, 1, 0] }}
          transition={{ duration: 10 + Math.random() * 4, delay: b.delay, ease: 'linear' }}
        >
          🎈
        </motion.div>
      ))}

      <div
        className="relative flex flex-col items-center gap-4 text-center px-6"
        style={{ zIndex: 10 }}
      >
        <motion.div
          className="text-7xl md:text-8xl"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
        >
          🎂
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Happy Birthday بخط عادي */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 7vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #b06aff, #e0aaff, #da70d6)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
              fontFamily: '"Dancing Script", cursive',
              letterSpacing: '0.02em',
            }}
          >
            Happy Birthday
          </h1>

          {/* اسم سلمى مميز جداً */}
          <motion.div
            style={{ position: 'relative', display: 'inline-block' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* توهج خلف الاسم */}
            <div style={{
              position: 'absolute',
              inset: '-15px -25px',
              background: 'radial-gradient(ellipse, rgba(176,106,255,0.35) 0%, transparent 70%)',
              filter: 'blur(12px)',
              borderRadius: '50%',
            }} />

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                fontWeight: 700,
                fontFamily: '"Dancing Script", cursive',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0aaff 35%, #b06aff 65%, #e0aaff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
                letterSpacing: '0.05em',
                position: 'relative',
                margin: 0,
              }}
            >
              {config.recipientName} ✨
            </h2>
          </motion.div>
        </motion.div>

        {/* إيموجي */}
        <motion.div
          className="flex gap-3 text-2xl flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {['🎊', '✨', '💜', '🌟', '🎉', '💕', '🌸'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* الكارد */}
        <motion.div
          className="glass rounded-3xl px-6 py-5 max-w-sm w-full"
          style={{ boxShadow: '0 0 40px rgba(176,106,255,0.25)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p
            className="text-white/90 text-base leading-relaxed"
            style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.1rem' }}
          >
            Stay happy always, Salma. 💜<br />
            You deserve every beautiful thing in this world.
          </p>
          <p className="text-purple-300 text-sm mt-3 italic">— {config.senderName}</p>
        </motion.div>

        {/* زر Replay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: 'rgba(176,106,255,0.5)',
              color: '#e0aaff',
              px: 5,
              py: 1.2,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': {
                borderColor: '#b06aff',
                background: 'rgba(176,106,255,0.1)',
                boxShadow: '0 0 20px rgba(176,106,255,0.3)',
              },
            }}
          >
            🔄 Replay
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
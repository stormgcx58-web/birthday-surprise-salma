import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import Button from '@mui/material/Button';
import StarryBackground from './StarryBackground';
import { config } from '../config';

interface Balloon {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  emoji: string;
}

interface Firework {
  id: number;
  x: number;
  y: number;
}

const BALLOON_COLORS = ['#b06aff', '#da70d6', '#e0aaff', '#9b4dff', '#e040fb', '#c77dff'];
const BALLOON_EMOJIS = ['🎈', '🎈', '🎈', '🎀', '🎊', '🎉'];

export default function FinalScene() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const fwIdRef = useRef(0);

  useEffect(() => {
    const newBalloons: Balloon[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      size: 32 + Math.random() * 24,
      delay: Math.random() * 3,
      emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
    }));
    setBalloons(newBalloons);

    const spawnFw = () => {
      const count = 4;
      const newFw: Firework[] = Array.from({ length: count }, () => ({
        id: fwIdRef.current++,
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 50,
      }));
      setFireworks(fw => [...fw, ...newFw]);
      setTimeout(() => setFireworks(fw => fw.filter(f => !newFw.find(n => n.id === f.id))), 1500);
    };

    for (let i = 0; i < 12; i++) setTimeout(spawnFw, i * 500);
    const interval = setInterval(spawnFw, 2000);
    return () => clearInterval(interval);
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
          background: 'radial-gradient(ellipse at 50% 50%, rgba(176,106,255,0.25) 0%, rgba(218,112,214,0.15) 40%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={true}
        numberOfPieces={200}
        colors={['#b06aff', '#e0aaff', '#da70d6', '#c77dff', '#e040fb', '#fff', '#9b4dff']}
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
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
                boxShadow: '0 0 6px currentColor',
              }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * (80 + Math.random() * 60),
                y: Math.sin((i / 8) * Math.PI * 2) * (80 + Math.random() * 60),
                scale: 0,
                opacity: [1, 0],
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
          animate={{ y: -(window.innerHeight + 100), opacity: [0, 1, 1, 0] }}
          transition={{ duration: 8 + Math.random() * 6, delay: b.delay, ease: 'easeOut' }}
        >
          {b.emoji}
        </motion.div>
      ))}

      <div className="relative flex flex-col items-center gap-6 text-center px-6" style={{ zIndex: 10 }}>
        <motion.div
          className="text-8xl md:text-9xl heartbeat"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
        >
          🎂
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <h1
            className="font-bold"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #b06aff, #e0aaff, #da70d6, #b06aff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Happy Birthday
          </h1>
          <motion.h2
            className="text-white/90 font-light"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              textShadow: '0 0 30px rgba(176,106,255,0.8), 0 0 60px rgba(176,106,255,0.4)',
            }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {config.recipientName} 💜
          </motion.h2>
        </motion.div>

        <motion.div
          className="flex gap-4 text-3xl flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {['🎊', '✨', '💜', '🌟', '🎉', '💕', '🌸', '🎁'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="glass rounded-3xl px-8 py-6 max-w-md"
          style={{ boxShadow: '0 0 40px rgba(176,106,255,0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p
            className="text-white/90 text-lg leading-relaxed"
            style={{ textShadow: '0 0 10px rgba(176,106,255,0.3)' }}
          >
            Stay happy always, Salma. 💜<br />
            You deserve every beautiful thing in this world.
          </p>
          <p className="text-purple-300 text-sm mt-3 italic">— {config.senderName}</p>
        </motion.div>

        {/* Replay button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: 'rgba(176,106,255,0.5)',
              color: '#e0aaff',
              px: 5,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)',
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
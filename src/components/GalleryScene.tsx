import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion';
import Button from '@mui/material/Button';
import { config } from '../config';
import StarryBackground from './StarryBackground';

type Transition = 'fade' | 'zoom' | 'slide' | 'blur' | 'rotate';

function getRandomTransition(): Transition {
  const all: Transition[] = ['fade', 'zoom', 'slide', 'blur', 'rotate'];
  return all[Math.floor(Math.random() * all.length)];
}

interface VariantEntry {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

const variantMap: Record<Transition, VariantEntry> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.15 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  slide: {
    initial: { opacity: 0, x: '30%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-30%' },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(20px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(20px)' },
  },
  rotate: {
    initial: { opacity: 0, rotate: 5, scale: 0.95 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: -5, scale: 0.95 },
  },
};

interface FloatingHeart {
  id: number;
  x: number;
  emoji: string;
}

interface GallerySceneProps {
  onNext: () => void;
}

export default function GalleryScene({ onNext }: GallerySceneProps) {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState<Transition>('fade');
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const heartId = useRef(0);
  const touchStart = useRef<number | null>(null);

  const advance = useCallback((dir: 1 | -1 = 1) => {
    setTransition(getRandomTransition());
    setIndex(i => (i + dir * 1 + config.photos.length) % config.photos.length);
    // Spawn floating hearts
    const newHearts = Array.from({ length: 5 }, () => ({
      id: heartId.current++,
      x: 10 + Math.random() * 80,
      emoji: ['❤️', '💕', '💖', '🌸', '✨'][Math.floor(Math.random() * 5)],
    }));
    setHearts(h => [...h, ...newHearts]);
    setTimeout(() => {
      setHearts(h => h.filter(fh => !newHearts.find(n => n.id === fh.id)));
    }, 3000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => advance(1), config.galleryInterval);
    return () => clearInterval(timer);
  }, [advance]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) advance(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const v = variantMap[transition];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <StarryBackground />

      {/* Full-screen image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src={config.photos[index]}
            alt={`Memory ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,0,16,0.3), rgba(10,0,16,0.6))' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating hearts */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.span
            key={h.id}
            className="fixed text-2xl pointer-events-none select-none"
            style={{ left: `${h.x}%`, bottom: 0, zIndex: 20 }}
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -window.innerHeight * 0.7, opacity: 0, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            {h.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* UI overlay */}
      <div className="relative w-full h-full flex flex-col items-center justify-between py-8 px-4" style={{ zIndex: 10 }}>
        {/* Title */}
        <motion.div
          className="glass-dark rounded-2xl px-6 py-3 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="shimmer-text text-2xl font-bold">Our Memories ❤️</p>
          <p className="text-white/50 text-xs mt-1 tracking-widest uppercase">
            Swipe or tap to explore
          </p>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-auto">
          {config.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTransition(getRandomTransition()); setIndex(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                background: i === index ? '#ff69b4' : 'rgba(255,255,255,0.3)',
                boxShadow: i === index ? '0 0 8px rgba(255,105,180,0.8)' : 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="contained"
            onClick={onNext}
            sx={{
              background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
              px: 4,
              py: 1.2,
              boxShadow: '0 0 20px rgba(255,105,180,0.5)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff9ed2, #e090e8)',
                boxShadow: '0 0 30px rgba(255,105,180,0.8)',
              },
            }}
          >
            🎂 See the Cake
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

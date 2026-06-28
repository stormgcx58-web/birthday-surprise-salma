import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import HeartCanvas from './HeartCanvas';
import StarryBackground from './StarryBackground';

interface IntroSceneProps {
  onOpen: () => void;
  beating: boolean;
}

export default function IntroScene({ onOpen, beating }: IntroSceneProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 1 }}
    >
      <StarryBackground />

      {/* Gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255,105,180,0.1) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6" style={{ zIndex: 2 }}>
        {/* 3D Heart */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, type: 'spring' }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <HeartCanvas beating={beating} height="360px" />
        </motion.div>

        {/* Subtitle text */}
        <motion.p
          className="text-white/80 text-lg md:text-xl text-center px-6"
          style={{ fontStyle: 'italic', textShadow: '0 0 20px rgba(255,105,180,0.6)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          I have something special for you...
        </motion.p>

        {/* Glow button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onOpen}
            className="pulse-glow"
            sx={{
              background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
              px: 5,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              boxShadow: '0 0 30px rgba(255,105,180,0.5), 0 0 60px rgba(255,105,180,0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff9ed2, #e090e8)',
                boxShadow: '0 0 50px rgba(255,105,180,0.8), 0 0 100px rgba(255,105,180,0.4)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🎁 Open Your Gift
          </Button>
        </motion.div>

        {/* Floating mini hearts around button */}
        {['❤️', '💕', '✨', '💖', '🌸'].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-lg pointer-events-none select-none"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '-20px',
            }}
            animate={{
              y: [0, -60, -120],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

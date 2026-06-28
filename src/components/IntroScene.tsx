import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '@mui/material/Button';
import HeartCanvas from './HeartCanvas';
import StarryBackground from './StarryBackground';

const EMOJIS = ['💜', '💕', '✨', '💖', '🌸'];

interface IntroSceneProps {
  onOpen: () => void;
  beating: boolean;
}

export default memo(function IntroScene({ onOpen, beating }: IntroSceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <StarryBackground />

      {/* Aurora glow — بنفسجي بدل وردي */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(176,106,255,0.15) 0%, rgba(138,43,226,0.05) 50%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div
        className="relative flex flex-col items-center gap-8 w-full px-4"
        style={{ zIndex: 2 }}
      >
        {/* القلب الـ 3D — أكبر وفي المنتصف */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, type: 'spring', stiffness: 80 }}
          style={{
            width: '100%',
            maxWidth: 380,
            filter: 'drop-shadow(0 0 40px rgba(176,106,255,0.5))',
          }}
        >
          <HeartCanvas beating={beating} height="320px" />
        </motion.div>

        {/* النص */}
        <motion.p
          className="text-white/90 text-xl md:text-2xl text-center"
          style={{
            fontStyle: 'italic',
            textShadow: '0 0 30px rgba(176,106,255,0.8), 0 0 60px rgba(176,106,255,0.3)',
            letterSpacing: '0.02em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          I have something special for you...
        </motion.p>

        {/* الزر */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onOpen}
            sx={{
              background: 'linear-gradient(135deg, #b06aff, #7c3aed)',
              px: 6,
              py: 2,
              fontSize: '1.15rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              borderRadius: '50px',
              boxShadow: '0 0 30px rgba(176,106,255,0.6), 0 0 60px rgba(176,106,255,0.2)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #c77dff, #9b4dff)',
                boxShadow: '0 0 50px rgba(176,106,255,0.9), 0 0 100px rgba(176,106,255,0.4)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🎁 Open Your Gift
          </Button>

          {/* قلوب تطير حول الزر */}
          {EMOJIS.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none select-none"
              style={{
                left: `${10 + i * 18}%`,
                bottom: '-10px',
              }}
              animate={reduceMotion ? {} : {
                y: [0, -50, -100],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeOut',
                repeatDelay: 1,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});
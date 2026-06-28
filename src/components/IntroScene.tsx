import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '@mui/material/Button';
import StarryBackground from './StarryBackground';

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

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(176,106,255,0.15) 0%, rgba(138,43,226,0.05) 50%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div
        className="relative flex flex-col items-center w-full"
        style={{ zIndex: 2, gap: '16px' }}
      >

        {/* الوردة */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.8, type: 'spring', stiffness: 80 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={reduceMotion ? {} : { rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'relative', width: 260, height: 260 }}
          >
            {/* توهج خلف الوردة */}
            <div style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(176,106,255,0.4) 0%, rgba(218,112,214,0.2) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }} />

            {/* بتلات الوردة الخارجية */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 80,
                  height: 110,
                  marginLeft: -40,
                  marginTop: -55,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  background: `linear-gradient(160deg, 
                    rgba(224,170,255,0.9) 0%, 
                    rgba(176,106,255,0.8) 40%, 
                    rgba(124,58,237,0.7) 100%)`,
                  transformOrigin: '50% 100%',
                  transform: `rotate(${i * 45}deg) translateY(-45px)`,
                  boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2), 0 0 15px rgba(176,106,255,0.3)',
                }}
                animate={beating ? { scaleY: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* بتلات الوردة الداخلية */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 55,
                  height: 75,
                  marginLeft: -27,
                  marginTop: -37,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  background: `linear-gradient(160deg, 
                    rgba(255,255,255,0.9) 0%, 
                    rgba(224,170,255,0.9) 30%, 
                    rgba(176,106,255,0.8) 100%)`,
                  transformOrigin: '50% 100%',
                  transform: `rotate(${i * 60}deg) translateY(-28px)`,
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.4)',
                }}
              />
            ))}

            {/* مركز الوردة */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #fff 0%, #e0aaff 30%, #b06aff 70%, #7c3aed 100%)',
              boxShadow: '0 0 20px rgba(176,106,255,0.8), inset 0 0 10px rgba(255,255,255,0.5)',
            }} />

            {/* نقاط لامعة حول الوردة */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#e0aaff' : '#fff',
                  transform: `rotate(${i * 30}deg) translateY(-135px)`,
                  marginLeft: -2,
                  marginTop: -2,
                  boxShadow: '0 0 6px rgba(224,170,255,0.8)',
                }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* النص */}
        <motion.p
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
            fontStyle: 'italic',
            textShadow: '0 0 30px rgba(176,106,255,0.8)',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.95)',
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            textAlign: 'center',
            padding: '0 20px',
            margin: 0,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          ✨ I have something special for you... ✨
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
              background: 'linear-gradient(135deg, #b06aff 0%, #7c3aed 50%, #5b21b6 100%)',
              px: 7,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: '"Dancing Script", cursive',
              letterSpacing: '0.05em',
              borderRadius: '50px',
              textTransform: 'none',
              border: '1px solid rgba(224,170,255,0.3)',
              boxShadow: `
                0 0 30px rgba(176,106,255,0.6),
                0 0 60px rgba(176,106,255,0.2),
                inset 0 1px 0 rgba(255,255,255,0.2)
              `,
              '&:hover': {
                background: 'linear-gradient(135deg, #c77dff 0%, #9b4dff 50%, #7c3aed 100%)',
                boxShadow: `
                  0 0 50px rgba(176,106,255,0.9),
                  0 0 100px rgba(176,106,255,0.4),
                  inset 0 1px 0 rgba(255,255,255,0.3)
                `,
                transform: 'scale(1.06)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🎁 Open Your Gift
          </Button>

          {['🌸', '✨', '💜', '✨', '🌸'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute pointer-events-none select-none"
              style={{
                left: `${5 + i * 22}%`,
                bottom: '-8px',
                fontSize: '1rem',
              }}
              animate={reduceMotion ? {} : {
                y: [0, -40, -80],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
                repeatDelay: 1.5,
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
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import Button from '@mui/material/Button';
import { config } from '../config';
import StarryBackground from './StarryBackground';

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

const FIREWORK_COLORS = ['#b06aff', '#e0aaff', '#da70d6', '#c77dff', '#9b4dff', '#e040fb'];

interface CakeSceneProps {
  onNext: () => void;
}

export default function CakeScene({ onNext }: CakeSceneProps) {
  const [blown, setBlown] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const fwId = useRef(0);

  const blowCandles = () => {
    if (blown) return;
    setBlown(true);
    setCelebrating(true);
    setShowConfetti(true);

    const spawn = () => {
      const count = 3 + Math.floor(Math.random() * 3);
      const newFw: Firework[] = Array.from({ length: count }, () => ({
        id: fwId.current++,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 60,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      }));
      setFireworks(fw => [...fw, ...newFw]);
      setTimeout(() => {
        setFireworks(fw => fw.filter(f => !newFw.find(n => n.id === f.id)));
      }, 1200);
    };

    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 400);
  };

  const candles = Array.from({ length: Math.min(config.candleCount, 12) });

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <StarryBackground />

      <AnimatePresence>
        {celebrating && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(ellipse at 50% 70%, rgba(176,106,255,0.25) 0%, rgba(218,112,214,0.15) 40%, transparent 70%)',
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={celebrating}
          numberOfPieces={200}
          colors={['#b06aff', '#e0aaff', '#da70d6', '#c77dff', '#e040fb', '#fff']}
          style={{ zIndex: 30, pointerEvents: 'none' }}
        />
      )}

      <AnimatePresence>
        {fireworks.map(fw => (
          <motion.div
            key={fw.id}
            className="fixed pointer-events-none"
            style={{ left: `${fw.x}%`, top: `${fw.y}%`, zIndex: 25 }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: [1, 1, 0], scale: [0, 1.5, 2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {['✨', '💫', '🌟', '⭐', '✦'].map((star, i) => (
              <motion.span
                key={i}
                className="absolute text-lg"
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: Math.cos((i / 5) * Math.PI * 2) * (60 + Math.random() * 40),
                  y: Math.sin((i / 5) * Math.PI * 2) * (60 + Math.random() * 40),
                  opacity: [1, 0],
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ color: fw.color }}
              >
                {star}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative flex flex-col items-center gap-6" style={{ zIndex: 10 }}>

        <motion.h2
          className="text-white text-2xl md:text-3xl font-bold text-center"
          style={{ textShadow: '0 0 20px rgba(176,106,255,0.8)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {blown ? '🎉 Happy Birthday! 🎉' : '🎂 Make a Wish! 🎂'}
        </motion.h2>

        <motion.div
          className="relative cursor-pointer select-none"
          onClick={blowCandles}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={celebrating ? { scale: [1, 1.05, 1] } : {}}
          transition={celebrating ? { duration: 0.5, repeat: 3 } : {}}
        >
          <div className="flex flex-col items-center">
            {/* الشموع */}
            <div className="flex gap-3 mb-1 items-end">
              {candles.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <AnimatePresence>
                    {!blown && (
                      <motion.div
                        exit={{ opacity: 0, scale: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="candle-flame"
                        style={{
                          width: 10,
                          height: 16,
                          background: 'radial-gradient(ellipse at 50% 70%, #ffd700, #ff8c00, #ff4500)',
                          borderRadius: '50% 50% 40% 40%',
                          boxShadow: '0 0 8px rgba(255,165,0,0.8), 0 0 16px rgba(255,165,0,0.4)',
                          marginBottom: 2,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <div
                    style={{
                      width: 8,
                      height: 28,
                      background: `hsl(${270 + (i * 15) % 60}, 80%, 70%)`,
                      borderRadius: 4,
                      boxShadow: blown ? 'none' : `0 0 6px hsl(${270 + (i * 15) % 60}, 80%, 70%)`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* طبقات الكيكة */}
            <div className="flex flex-col items-center">
              {/* الطبقة العلوية */}
              <div
                style={{
                  width: 200,
                  height: 55,
                  background: 'linear-gradient(135deg, #c4b5fd, #a855f7)',
                  borderRadius: '40px 40px 12px 12px',
                  boxShadow: '0 0 20px rgba(176,106,255,0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {[15, 35, 55, 75, 85].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `${x}%`,
                      width: 12,
                      height: 18,
                      background: 'rgba(255,255,255,0.6)',
                      borderRadius: '0 0 50% 50%',
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-wider">Happy Birthday</span>
                </div>
              </div>

              {/* الطبقة الوسطى */}
              <div
                style={{
                  width: 240,
                  height: 60,
                  background: 'linear-gradient(135deg, #9b4dff, #7c3aed)',
                  borderRadius: '8px',
                  marginTop: 2,
                  boxShadow: '0 0 20px rgba(176,106,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {['💜', '🌸', '💜', '🌸', '💜'].map((e, i) => (
                  <span key={i} style={{ fontSize: 16 }}>{e}</span>
                ))}
              </div>

              {/* الطبقة السفلية */}
              <div
                style={{
                  width: 280,
                  height: 65,
                  background: 'linear-gradient(135deg, #b06aff, #da70d6)',
                  borderRadius: '8px 8px 20px 20px',
                  marginTop: 2,
                  boxShadow: '0 8px 30px rgba(176,106,255,0.3)',
                }}
              />

              {/* الطبق */}
              <div
                style={{
                  width: 310,
                  height: 16,
                  background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                  borderRadius: '50%',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  marginTop: 4,
                }}
              />
            </div>
          </div>
        </motion.div>

        {!blown && (
          <motion.p
            className="text-white/70 text-sm text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap the cake to blow out the candles! 🎈
          </motion.p>
        )}

        <AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-dark rounded-2xl px-6 py-4 text-center"
            >
              <p className="text-xl font-bold" style={{
                background: 'linear-gradient(90deg, #b06aff, #e0aaff, #da70d6, #b06aff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
              }}>
                Your wish has been made! ✨
              </p>
              <p className="text-white/70 text-sm mt-1">May all your dreams come true 💜</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={onNext}
                sx={{
                  background: 'linear-gradient(135deg, #b06aff, #7c3aed)',
                  color: '#fff',
                  fontWeight: 700,
                  px: 5,
                  py: 1.5,
                  boxShadow: '0 0 30px rgba(176,106,255,0.5)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c77dff, #9b4dff)',
                    boxShadow: '0 0 50px rgba(176,106,255,0.8)',
                  },
                }}
              >
                🎊 Grand Finale!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
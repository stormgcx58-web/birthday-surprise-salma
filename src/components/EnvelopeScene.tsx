import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onOpen: () => void;
}

export default function EnvelopeScene({ onOpen }: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 1800);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* خلفية */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2d0b6b_0%,#1a0035_45%,#090012_100%)]" />

        {/* توهج بنفسجي */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(176,106,255,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* جسيمات صغيرة */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#b06aff' : '#e0aaff',
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -30, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* العنوان */}
        <motion.div
          className="text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: 'linear-gradient(90deg, #c4b5fd, #e0aaff, #b06aff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            marginBottom: 4,
          }}>
            A Letter For You
          </h2>
          <motion.div
            style={{
              height: 2,
              background: 'linear-gradient(90deg, transparent, #b06aff, transparent)',
              borderRadius: 2,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* الظرف */}
        <motion.div
          onClick={handleClick}
          initial={{ y: 40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          style={{ cursor: isOpening ? 'default' : 'pointer', position: 'relative' }}
        >
          {/* توهج حول الظرف */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: 24,
              background: 'radial-gradient(ellipse, rgba(176,106,255,0.3) 0%, transparent 70%)',
              filter: 'blur(15px)',
              zIndex: 0,
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.div
            whileHover={!isOpening ? { scale: 1.03, y: -4 } : {}}
            animate={!isOpening ? { y: [0, -8, 0] } : {}}
            transition={!isOpening ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* جسم الظرف الرئيسي */}
            <div style={{
              width: 300,
              height: 200,
              position: 'relative',
              filter: 'drop-shadow(0 20px 40px rgba(100,0,200,0.5)) drop-shadow(0 0 20px rgba(176,106,255,0.3))',
            }}>

              {/* الخلفية الرئيسية للظرف */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(145deg, #7c3aed 0%, #6d28d9 40%, #5b21b6 100%)',
                borderRadius: 16,
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.2),
                  inset 0 -2px 4px rgba(0,0,0,0.3),
                  0 20px 60px rgba(76,29,149,0.6)
                `,
              }} />

              {/* الجانب السفلي — مثلث */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '55%',
                background: 'linear-gradient(160deg, #8b5cf6 0%, #6d28d9 100%)',
                clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)',
                borderRadius: '0 0 16px 16px',
              }} />

              {/* الجانب الأيسر — مثلث */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              }} />

              {/* الجانب الأيمن — مثلث */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '50%',
                background: 'linear-gradient(225deg, #6d28d9 0%, #4c1d95 100%)',
                clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
              }} />

              {/* الغطاء العلوي — يفتح عند النقر */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '55%',
                  background: 'linear-gradient(160deg, #a78bfa 0%, #7c3aed 60%, #6d28d9 100%)',
                  clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
                  transformOrigin: 'top center',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15)',
                }}
                animate={isOpening ? {
                  rotateX: -180,
                  opacity: 0.7,
                } : {
                  rotateX: 0,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />

              {/* ختم الشمع — قلب */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '42%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 44,
                  height: 44,
                  background: 'radial-gradient(circle at 35% 35%, #e0aaff, #b06aff, #7c3aed)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(176,106,255,0.8), 0 2px 8px rgba(0,0,0,0.4)',
                  zIndex: 10,
                  fontSize: 22,
                }}
                animate={isOpening ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
                transition={isOpening
                  ? { duration: 0.3 }
                  : { duration: 2, repeat: Infinity }
                }
              >
                💜
              </motion.div>

              {/* الرسالة تخرج */}
              <AnimatePresence>
                {isOpening && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -80, opacity: 1 }}
                    style={{
                      position: 'absolute',
                      top: '20%',
                      left: '10%',
                      right: '10%',
                      height: 100,
                      background: 'linear-gradient(180deg, #faf5ff, #f3e8ff)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      zIndex: 5,
                      fontSize: 28,
                    }}
                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                  >
                    💜
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </motion.div>

        {/* النص السفلي */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ delay: 1 }}
        >
          <motion.p
            className="text-white/70 text-sm tracking-widest"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✦ Tap to open ✦
          </motion.p>
        </motion.div>

      </div>
    </motion.div>
  );
}
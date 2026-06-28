import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@mui/material/Button';
import { config } from '../config';
import StarryBackground from './StarryBackground';

interface MessageSceneProps {
  onNext: () => void;
}

export default function MessageScene({ onNext }: MessageSceneProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [currentTyping, setCurrentTyping] = useState('');
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lines = config.birthdayMessage;

  useEffect(() => {
    const typeNext = () => {
      const idx = lineIndex.current;
      if (idx >= lines.length) {
        setDone(true);
        return;
      }

      const line = lines[idx];
      const ci = charIndex.current;

      if (ci <= line.length) {
        setCurrentTyping(line.slice(0, ci));
        charIndex.current++;
        rafRef.current = setTimeout(typeNext, ci === line.length ? 800 : 45);
      } else {
        setVisibleLines(prev => [...prev, line]);
        setCurrentTyping('');
        lineIndex.current++;
        charIndex.current = 0;
        rafRef.current = setTimeout(typeNext, 300);
      }
    };

    rafRef.current = setTimeout(typeNext, 600);
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ينزل تلقائياً مع كل سطر جديد
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines, currentTyping]);

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

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(176,106,255,0.07) 0%, rgba(10,0,16,0.6) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="relative glass rounded-3xl px-8 md:px-16 py-10 mx-4 max-w-2xl w-full"
        style={{
          zIndex: 2,
          boxShadow: '0 0 60px rgba(176,106,255,0.15), 0 0 120px rgba(218,112,214,0.1)',
          border: '1px solid rgba(176,106,255,0.2)',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div className="absolute top-3 left-4 text-purple-400/60 text-xl select-none">✦</div>
        <div className="absolute top-3 right-4 text-violet-400/60 text-xl select-none">✦</div>

        <div
          className="text-white text-lg md:text-xl leading-loose text-center"
          style={{ fontFamily: '"Dancing Script", cursive', textShadow: '0 0 15px rgba(176,106,255,0.3)' }}
        >
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  minHeight: line === '' ? '1rem' : undefined,
                  fontWeight: line.includes('Happy Birthday') ? 700 : 400,
                  fontSize: line.includes('Happy Birthday') ? '1.3em' : undefined,
                  color: line.includes('Happy Birthday') || line.includes('💜')
                    ? '#c4b5fd'
                    : undefined,
                  marginBottom: line === '' ? 8 : 4,
                }}
              >
                {line || '\u00A0'}
              </motion.div>
            ))}
          </AnimatePresence>

          {!done && (
            <div style={{ minHeight: '1.5rem' }}>
              {currentTyping}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ display: 'inline-block', marginLeft: 2, color: '#b06aff' }}
              >
                |
              </motion.span>
            </div>
          )}

          {/* هذا يجعل الصفحة تنزل تلقائياً */}
          <div ref={bottomRef} />
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 flex justify-center"
            >
              <Button
                variant="outlined"
                size="large"
                onClick={onNext}
                sx={{
                  borderColor: '#b06aff',
                  color: '#b06aff',
                  px: 5,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#e0aaff',
                    color: '#e0aaff',
                    background: 'rgba(176,106,255,0.08)',
                    boxShadow: '0 0 20px rgba(176,106,255,0.3)',
                  },
                }}
              >
                Continue 💜
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
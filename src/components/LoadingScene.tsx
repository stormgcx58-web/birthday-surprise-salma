import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { config } from '../config';

export default function LoadingScene() {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #1a0025 0%, #0a0010 100%)',
        zIndex: 10,
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          className="absolute rounded-full border-2 border-purple-400"
          style={{ width: 120, height: 120 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full border-2 border-violet-400"
          style={{ width: 90, height: 90 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <CircularProgress
          size={60}
          thickness={2}
          sx={{ color: '#b06aff' }}
        />
        <motion.span
          className="absolute text-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💜
        </motion.span>
      </div>

      <motion.p
        className="text-purple-300 text-sm tracking-widest uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0.7, 1], y: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Preparing something special for {config.recipientName}...
      </motion.p>
    </motion.div>
  );
}
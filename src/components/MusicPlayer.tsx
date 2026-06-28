import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic } from 'react-icons/fa';
import { config } from '../config';

interface MusicPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ audioRef, isPlaying, onToggle }: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, [audioRef]);

  const handleVolumeChange = (_: Event, val: number | number[]) => {
    setVolume(val as number);
    setMuted(false);
  };

  const handleSeek = (_: Event, val: number | number[]) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = ((val as number) / 100) * audio.duration;
    }
  };

  return (
    <motion.div
      className="fixed top-4 right-4 glass-dark rounded-full"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      style={{
        zIndex: 50,
        boxShadow: '0 0 30px rgba(255,105,180,0.3)',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Music icon / expand toggle */}
        <motion.div
          className="cursor-pointer text-pink-400"
          whileHover={{ scale: 1.2 }}
          onClick={() => setExpanded(e => !e)}
        >
          <FaMusic size={14} />
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-white text-xs font-medium truncate max-w-32">{config.musicTitle}</span>
                <span className="text-pink-300 text-xs truncate max-w-32">{config.musicArtist}</span>
              </div>
              <div className="w-24">
                <Slider
                  size="small"
                  value={progress}
                  onChange={handleSeek}
                  sx={{
                    color: '#ff69b4',
                    padding: '4px 0',
                    '& .MuiSlider-thumb': { width: 10, height: 10 },
                    '& .MuiSlider-track': { height: 2 },
                    '& .MuiSlider-rail': { height: 2, opacity: 0.3 },
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause */}
        <IconButton size="small" onClick={onToggle} sx={{ color: '#ff69b4', padding: '4px' }}>
          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
        </IconButton>

        {/* Mute */}
        <IconButton size="small" onClick={() => setMuted(m => !m)} sx={{ color: '#da70d6', padding: '4px' }}>
          {muted || volume === 0 ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
        </IconButton>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <Slider
                size="small"
                value={muted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                sx={{
                  color: '#da70d6',
                  padding: '4px 0',
                  '& .MuiSlider-thumb': { width: 10, height: 10 },
                  '& .MuiSlider-track': { height: 2 },
                  '& .MuiSlider-rail': { height: 2, opacity: 0.3 },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

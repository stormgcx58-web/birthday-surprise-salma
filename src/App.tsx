import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import { config } from './config';
import './index.css';

import MusicPlayer from './components/MusicPlayer';
// FloatingParticles محذوف — كان {false && ...} أي غير مستخدم أصلاً

const LoadingScene  = lazy(() => import('./components/LoadingScene'));
const EnvelopeScene = lazy(() => import('./components/EnvelopeScene'));
const IntroScene    = lazy(() => import('./components/IntroScene'));
const MessageScene  = lazy(() => import('./components/MessageScene'));
const CakeScene     = lazy(() => import('./components/CakeScene'));
const FinalScene    = lazy(() => import('./components/FinalScene'));

type Scene = 'loading' | 'envelope' | 'intro' | 'message' | 'cake' | 'final';

// خارج المكوّن — لا تُعاد في كل render
function getInitialScene(): Scene {
  const param = new URLSearchParams(window.location.search).get('scene');
  if (param === 'cake')    return 'cake';
  if (param === 'final')   return 'final';
  if (param === 'message') return 'message';
  return 'loading';
}

export default function App() {
  // () => getInitialScene() يعني: احسب مرة واحدة فقط عند الإنشاء
  const [scene, setScene] = useState<Scene>(getInitialScene());
  const [beating, setBeating]           = useState(false);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number>();  // لتنظيف setTimeout بشكل صحيح

  useEffect(() => {
    const audio = new Audio(config.musicUrl);
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'metadata'; // لا تحمل الملف كله فوراً
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (scene !== 'loading') return;
    timerRef.current = window.setTimeout(() => setScene('envelope'), 2000);
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line

  const startMusic = useCallback(async () => {
    if (musicStarted || !audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setMusicStarted(true);
    } catch {
      // autoplay blocked
    }
  }, [musicStarted]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      setMusicStarted(true);
    }
  }, [isPlaying]);

  const handleOpenGift = useCallback(async () => {
    await startMusic();
    setBeating(true);
    timerRef.current = window.setTimeout(() => setScene('message'), 1200);
  }, [startMusic]);

  const go = useCallback((to: Scene) => setScene(to), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Suspense هنا داخل JSX وليس خارج المكوّن */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {scene === 'loading' && <LoadingScene key="loading" />}

          {scene === 'envelope' && (
            <EnvelopeScene key="envelope" onOpen={() => setScene('intro')} />
          )}

          {scene === 'intro' && (
            <IntroScene key="intro" onOpen={handleOpenGift} beating={beating} />
          )}

          {scene === 'message' && (
            <MessageScene key="message" onNext={() => go('cake')} />
          )}

          {scene === 'cake' && (
            <CakeScene key="cake" onNext={() => go('final')} />
          )}

          {scene === 'final' && <FinalScene key="final" />}
        </AnimatePresence>
      </Suspense>

      {scene !== 'loading' && (
        <MusicPlayer
          audioRef={audioRef}
          isPlaying={isPlaying}
          onToggle={toggleMusic}
        />
      )}
    </ThemeProvider>
  );
}
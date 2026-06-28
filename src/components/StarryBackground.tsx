import { useEffect, useRef, memo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

const StarryBackground = memo(function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const gradRef = useRef<CanvasGradient | null>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    // alpha:false يخبر المتصفح أن الخلفية معتمة → أداء أسرع

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // أنشئ الـ gradient مرة واحدة فقط — وليس في كل frame
      gradRef.current = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width * 0.8
      );
      gradRef.current.addColorStop(0, 'rgb(26, 0, 37)');
      gradRef.current.addColorStop(1, 'rgb(10, 0, 16)');

      starsRef.current = Array.from({ length: 120 }, () => ({
        // كانت 200 — 120 كافية تماماً للمظهر
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.8,
        opacity: 0.1 + Math.random() * 0.9,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        // سرعة أبطأ قليلاً = أقل حسابات مرئية
      }));
    };

    init();

    // Debounce لـ resize حتى لا يعيد البناء كل pixel
    let resizeTimer: number;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, 200);
    };
    window.addEventListener('resize', onResize);

    // أوقف التحريك عند إخفاء الصفحة
    const onVisibility = () => {
      isVisible.current = document.visibilityState === 'visible';
      if (isVisible.current) animate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let t = 0;
    const animate = () => {
      if (!isVisible.current) return; // توقف عند التبديل
      t++;

      // ارسم الخلفية بالـ gradient المُخزّن
      ctx.fillStyle = gradRef.current!;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ارسم كل النجوم بدون shadowBlur وبدون save/restore
      ctx.fillStyle = '#ffffff';
      // لا shadowBlur — بدلاً عنه نغير الحجم والشفافية فقط

      for (const star of starsRef.current) {
        const twinkle = (Math.sin(t * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        ctx.globalAlpha = 0.15 + twinkle * star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // أعد الـ alpha للافتراضي خارج الحلقة — مرة واحدة فقط
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
});

export default StarryBackground;
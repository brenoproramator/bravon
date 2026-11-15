import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

const HEADER_OFFSET = 72;

const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {}
});

/**
 * Lenis controla a rolagem; o ticker do GSAP move o Lenis (autoRaf desligado)
 * e cada evento de scroll do Lenis atualiza o ScrollTrigger.
 * Com prefers-reduced-motion o Lenis não é criado e a rolagem nativa assume.
 */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const lenisRef = useRef(null);
  const lockRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const create = () => {
      if (media.matches || lenisRef.current) return;
      const instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true
      });
      instance.on('scroll', ScrollTrigger.update);
      const raf = time => instance.raf(time * 1000);
      instance.__raf = raf;
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = instance;
      setLenis(instance);
    };

    const destroy = () => {
      const instance = lenisRef.current;
      if (!instance) return;
      gsap.ticker.remove(instance.__raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };

    const onChange = () => (media.matches ? destroy() : create());
    create();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
      destroy();
    };
  }, []);

  const scrollTo = useCallback((target, { focus = true, offset = -HEADER_OFFSET, immediate = false } = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el && target !== 0) return;
    const instance = lenisRef.current;
    const done = () => {
      if (!focus || !el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    };
    if (instance) {
      instance.scrollTo(el ?? 0, { offset, duration: immediate ? 0 : 1.5, immediate, onComplete: done, force: true });
    } else {
      const top = el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
      window.scrollTo({ top, behavior: prefersReducedMotion() || immediate ? 'auto' : 'smooth' });
      done();
    }
  }, []);

  // Pausa compartilhada (menu mobile, lightbox, modal). Conta travas para não liberar cedo.
  const stop = useCallback(() => {
    lockRef.current += 1;
    lenisRef.current?.stop();
    document.documentElement.classList.add('is-locked');
  }, []);

  const start = useCallback(() => {
    lockRef.current = Math.max(0, lockRef.current - 1);
    if (lockRef.current > 0) return;
    lenisRef.current?.start();
    document.documentElement.classList.remove('is-locked');
  }, []);

  const value = useMemo(() => ({ lenis, scrollTo, stop, start }), [lenis, scrollTo, stop, start]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(SmoothScrollContext);

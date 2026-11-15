import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { GALLERY } from '../lib/content';
import Photo from '../components/Photo';

export default function Gallery() {
  const root = useRef(null);
  const boxRef = useRef(null);
  const lastFocus = useRef(null);
  const [index, setIndex] = useState(-1);
  const { stop, start } = useSmoothScroll();
  const open = index >= 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, ctx => {
        if (!ctx.conditions.motion) return undefined;
        gsap.utils.toArray('.shot').forEach((shot, i) => {
          const img = shot.querySelector('.shot__zoom');
          // Revelação por cortina + zoom que assenta (uma animação por elemento, sem concorrência)
          gsap.fromTo(
            shot.querySelector('.shot__frame'),
            { clipPath: i % 2 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.3,
              ease: 'expo.out',
              scrollTrigger: { trigger: shot, start: 'top 88%', once: true }
            }
          );
          gsap.fromTo(
            img,
            { scale: 1.3 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: shot, start: 'top bottom', end: ctx.conditions.desktop ? 'bottom 30%' : 'bottom 60%', scrub: true }
            }
          );
        });
        const speeds = [0.5, 1.3, 0.9, 0.3, 1.1, 0.7, 1.4, 0.4];
        gsap.utils.toArray('.shot').forEach((shot, i) => {
          const s = speeds[i % speeds.length] * (ctx.conditions.desktop ? 90 : 26);
          gsap.fromTo(
            shot,
            { y: s },
            { y: -s, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });
        return undefined;
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(dir => setIndex(i => (i + dir + GALLERY.length) % GALLERY.length), []);

  // Abre/fecha com animação, trava a rolagem e devolve o foco
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open) {
      if (!box.classList.contains('is-open')) {
        lastFocus.current = document.activeElement;
        box.classList.add('is-open');
        stop();
        gsap.fromTo(
          box,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: reduce ? 0 : 0.4,
            ease: 'power2.out',
            onStart: () => box.querySelector('.lightbox__close')?.focus()
          }
        );
      }
    } else if (box.classList.contains('is-open')) {
      gsap.to(box, {
        autoAlpha: 0,
        duration: reduce ? 0 : 0.35,
        ease: 'power2.in',
        onComplete: () => box.classList.remove('is-open')
      });
      start();
      lastFocus.current?.focus?.({ preventScroll: true });
    }
    return undefined;
  }, [open, stop, start]);

  // Troca de foto com leve deslize
  useEffect(() => {
    if (!open || !boxRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.fromTo(
      boxRef.current.querySelector('.lightbox__img'),
      { autoAlpha: 0, scale: reduce ? 1 : 1.06, clipPath: reduce ? 'inset(0%)' : 'inset(6% 6% 6% 6%)' },
      { autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: reduce ? 0 : 0.8, ease: 'expo.out' }
    );
  }, [index, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        const nodes = [...boxRef.current.querySelectorAll('button')];
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  // Mantém a última foto visível durante a animação de saída
  const shown = useRef(0);
  if (open) shown.current = index;
  const current = GALLERY[shown.current];
  const currentIndex = shown.current;

  return (
    <section id="galeria" ref={root} className="gallery section" aria-labelledby="gallery-title">
      <div className="wrap">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">04 — Galeria</p>
            <h2 id="gallery-title" className="section-title" data-split>
              Trabalho que <em>fala sozinho.</em>
            </h2>
          </div>
          <p className="section-lede">Cortes, barbas e o canto onde tudo acontece. Toque em uma foto para ampliar.</p>
        </header>

        <ul className="gallery__grid">
          {GALLERY.map((g, i) => (
            <li key={g.image} className={`shot shot--${i + 1}`}>
              <button type="button" className="shot__btn" onClick={() => setIndex(i)} aria-label={`Ampliar: ${g.caption}`}>
                <span className="shot__frame">
                  <span className="shot__zoom">
                    <Photo name={g.image} alt={g.alt} sizes="(min-width: 900px) 40vw, 90vw" />
                  </span>
                </span>
                <span className="shot__cap">
                  <span>{String(i + 1).padStart(2, '0')}</span> {g.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={boxRef}
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Foto ampliada"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        onClick={e => e.target === e.currentTarget && close()}
      >
        <>
            <figure className="lightbox__fig">
              <div className="lightbox__img">
                <Photo name={current.image} alt={current.alt} sizes="90vw" />
              </div>
              <figcaption>
                <span>
                  {String(currentIndex + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
                </span>
                {current.caption}
              </figcaption>
            </figure>
            <button type="button" className="lightbox__close" onClick={close} aria-label="Fechar foto">
              <span />
              <span />
            </button>
            <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Foto anterior">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Próxima foto">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
        </>
      </div>
    </section>
  );
}

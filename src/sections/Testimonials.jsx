import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { TESTIMONIALS } from '../lib/content';

export default function Testimonials() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const first = useRef(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.quotes__mark',
          { scale: 0.5, rotate: -30, yPercent: 40 },
          {
            scale: 1.15,
            rotate: 12,
            yPercent: -20,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
          }
        );
        gsap.fromTo(
          '.quotes__title',
          { x: -40 },
          { x: 30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  // Troca do depoimento: linha sai para cima, nova entra de baixo
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = root.current.querySelector('.quotes__current');
    gsap.fromTo(
      el.querySelectorAll('.quotes__text, .quotes__who'),
      { autoAlpha: 0, y: reduce ? 0 : 30 },
      { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.8, stagger: 0.08, ease: 'expo.out' }
    );
  }, [active]);

  const t = TESTIMONIALS[active];
  const go = dir => setActive(i => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section ref={root} className="quotes section" aria-labelledby="quotes-title">
      <div className="wrap quotes__wrap">
        <div className="quotes__side">
          <p className="eyebrow">06 — Quem senta, volta</p>
          <h2 id="quotes-title" className="quotes__title">Depoimentos</h2>
          <p className="demo-flag">
            <span aria-hidden="true">✦</span> Exemplos fictícios para demonstração
          </p>
        </div>

        <div className="quotes__body">
          <span className="quotes__mark" aria-hidden="true">
            “
          </span>
          <figure className="quotes__current" aria-live="polite">
            <blockquote className="quotes__text">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="quotes__who">
              <span className="quotes__avatar" aria-hidden="true">
                {t.name[0]}
              </span>
              <span>
                <strong>{t.name}</strong>
                <small>
                  {t.detail} · depoimento demonstrativo
                </small>
              </span>
            </figcaption>
          </figure>

          <div className="quotes__controls">
            <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Depoimento anterior">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <ol className="quotes__dots">
              {TESTIMONIALS.map((q, i) => (
                <li key={q.name}>
                  <button
                    type="button"
                    aria-label={`Depoimento ${i + 1} de ${TESTIMONIALS.length}`}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => setActive(i)}
                  />
                </li>
              ))}
            </ol>
            <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Próximo depoimento">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

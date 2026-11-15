import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { SERVICES, INCLUDES, brl } from '../lib/content';
import Photo from '../components/Photo';

const Check = ({ on }) =>
  on ? (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );

export default function Services({ onPick }) {
  const root = useRef(null);
  const previewRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.service').forEach((row, i) => {
          gsap.fromTo(
            row.querySelectorAll('.service__main, .service__includes, .service__time, .service__price'),
            { x: i % 2 ? -90 : 90, autoAlpha: 0.08 },
            {
              x: 0,
              autoAlpha: 1,
              ease: 'none',
              stagger: 0.08,
              scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 62%', scrub: 0.6 }
            }
          );
          gsap.fromTo(
            row.querySelector('.service__rule'),
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: i % 2 ? 'right center' : 'left center',
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 70%', scrub: 0.6 }
            }
          );
        });
      });

      // Prévia flutuante que segue o cursor (só desktop com mouse e movimento liberado)
      mm.add('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const preview = previewRef.current;
        const list = root.current.querySelector('.services__list');
        const xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3' });
        const yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3' });
        const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3' });
        let lastX = 0;

        const onMove = contextSafe(e => {
          const rect = list.getBoundingClientRect();
          const x = e.clientX - rect.left;
          xTo(x);
          yTo(e.clientY - rect.top);
          rTo(gsap.utils.clamp(-8, 8, (x - lastX) * 0.6));
          lastX = x;
        });
        const onEnterRow = contextSafe(e => {
          const idx = Number(e.currentTarget.dataset.index);
          preview.style.setProperty('--active', idx);
          gsap.to(preview.querySelectorAll('.services__preview-img'), {
            autoAlpha: i => (i === idx ? 1 : 0),
            scale: i => (i === idx ? 1 : 1.15),
            duration: 0.5
          });
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' });
        });
        const onLeave = contextSafe(() => gsap.to(preview, { autoAlpha: 0, scale: 0.7, duration: 0.35 }));

        gsap.set(preview, { autoAlpha: 0, scale: 0.7, xPercent: -50, yPercent: -50 });
        const rows = list.querySelectorAll('.service');
        list.addEventListener('pointermove', onMove);
        list.addEventListener('pointerleave', onLeave);
        rows.forEach(r => r.addEventListener('pointerenter', onEnterRow));
        return () => {
          list.removeEventListener('pointermove', onMove);
          list.removeEventListener('pointerleave', onLeave);
          rows.forEach(r => r.removeEventListener('pointerenter', onEnterRow));
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="servicos" ref={root} className="services section" aria-labelledby="services-title">
      <div className="wrap">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">03 — Serviços &amp; preços</p>
            <h2 id="services-title" className="section-title" data-split>
              Preço na mesa, <em>sem surpresa.</em>
            </h2>
          </div>
          <p className="section-lede">
            Quatro serviços, feitos do mesmo jeito todos os dias. Compare o que vem em cada um e escolha o seu.
          </p>
        </header>

        <div className="services__list">
          <div className="services__legend" aria-hidden="true">
            <span>Serviço</span>
            <span>Inclui</span>
            <span>Tempo</span>
            <span>Valor</span>
          </div>

          <ul>
            {SERVICES.map((s, i) => (
              <li key={s.id} className={`service ${s.featured ? 'service--featured' : ''}`} data-index={i}>
                <span className="service__rule" aria-hidden="true" />
                <div className="service__main">
                  <h3 className="service__name">
                    <span className="service__n" aria-hidden="true">
                      0{i + 1}
                    </span>
                    {s.name}
                    {s.featured && <span className="tag">Mais pedido</span>}
                  </h3>
                  <p className="service__text">{s.text}</p>
                </div>
                <ul className="service__includes" aria-label={`O que inclui ${s.name}`}>
                  {INCLUDES.map(inc => (
                    <li key={inc.key} className={s.includes[inc.key] ? 'is-on' : 'is-off'}>
                      <Check on={s.includes[inc.key]} />
                      <span>
                        {inc.label}
                        <span className="sr-only">{s.includes[inc.key] ? ' — incluso' : ' — não incluso'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="service__time">
                  <span className="sr-only">Duração: </span>
                  {s.duration} min
                </p>
                <div className="service__price">
                  <p>
                    <span className="sr-only">Valor: </span>
                    <span className="service__currency" aria-hidden="true">
                      R$
                    </span>
                    <strong aria-hidden="true">{s.price}</strong>
                    <span className="sr-only">{brl(s.price)}</span>
                  </p>
                  {s.featured && <small>Economia de R$&nbsp;15</small>}
                  <button type="button" className="link-btn" onClick={() => onPick(s.id)}>
                    Agendar<span className="sr-only"> {s.name}</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div ref={previewRef} className="services__preview" aria-hidden="true">
            {SERVICES.map(s => (
              <Photo key={s.id} name={s.image} alt="" className="services__preview-img" sizes="320px" />
            ))}
          </div>
        </div>

        <p className="services__note">Pagamento no local: Pix, débito ou crédito. Valores ilustrativos.</p>
      </div>
    </section>
  );
}

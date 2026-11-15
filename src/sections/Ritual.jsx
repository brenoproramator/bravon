import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import Photo from '../components/Photo';
import { RITUAL } from '../lib/content';

/**
 * Seção fixada (pin) no desktop: três passos do ritual trocam com uma
 * cortina diagonal enquanto o contador e os textos avançam pelo scroll.
 * No celular e com movimento reduzido vira uma sequência simples, sem pin.
 */
export default function Ritual() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray('.ritual__slide');
        const texts = gsap.utils.toArray('.ritual__text');
        const n = slides.length;

        gsap.set(slides.slice(1), { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' });
        gsap.set(texts.slice(1), { autoAlpha: 0, yPercent: 30 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.ritual__stage',
            start: 'top top',
            end: () => `+=${window.innerHeight * (n - 0.4) * 1.1}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
              root.current?.style.setProperty('--ritual-step', idx);
              const counter = root.current?.querySelector('.ritual__count b');
              if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
            }
          }
        });

        gsap.fromTo(
          '.ritual__slides',
          { clipPath: 'inset(10% 6% 0% 6% round 36px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true }
          }
        );

        tl.addLabel('s0');
        tl.fromTo('.ritual__progress i', { scaleY: 1 / n }, { scaleY: 1, duration: n - 1 }, 0);
        slides.forEach((slide, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.to(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1 }, at)
            .fromTo(slide.querySelector('img, .photo-fallback'), { scale: 1.25, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 1 }, at)
            .to(slides[i - 1].querySelector('img, .photo-fallback'), { scale: 0.92, yPercent: -6, duration: 1 }, at)
            .to(texts[i - 1], { autoAlpha: 0, yPercent: -30, duration: 0.4 }, at + 0.1)
            .to(texts[i], { autoAlpha: 1, yPercent: 0, duration: 0.45 }, at + 0.5)
            .addLabel(`s${i}`, at + 1);
        });
        return undefined;
      });

      // Mobile / movimento reduzido: só um fade discreto por bloco
      mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.ritual__slide').forEach(el => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 40,
            duration: 0.9,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="ritual" ref={root} aria-labelledby="ritual-title">
      <div className="ritual__stage">
        <div className="ritual__intro wrap">
          <p className="eyebrow">02 — O ritual</p>
          <h2 id="ritual-title" className="ritual__title">
            Três passos. <em>Nenhum pulado.</em>
          </h2>
        </div>

        <div className="ritual__slides">
          {RITUAL.map((step, i) => (
            <article className="ritual__slide" key={step.image} aria-labelledby={`ritual-step-${i}`}>
              <div className="ritual__media">
                <Photo name={step.image} sizes="100vw" width={1600} height={1067} alt={step.alt} />
              </div>
              <div className="ritual__text">
                <p className="ritual__kicker">{step.kicker}</p>
                <h3 id={`ritual-step-${i}`}>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="ritual__hud" aria-hidden="true">
          <p className="ritual__count">
            <b>01</b>
            <span>/ 0{RITUAL.length}</span>
          </p>
          <span className="ritual__progress">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}

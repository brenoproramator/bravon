import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { TEAM } from '../lib/content';
import TiltedCard from '../components/reactbits/TiltedCard';
import Photo from '../components/Photo';

const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
};

export default function Team({ onPick }) {
  const root = useRef(null);
  const fine = useFinePointer();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.member', {
          y: 80,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.team__grid', start: 'top 80%', once: true }
        });
        gsap.from('.member__info > *', {
          y: 20,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.05,
          delay: 0.35,
          scrollTrigger: { trigger: '.team__grid', start: 'top 80%', once: true }
        });
      });
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, ctx => {
        if (!ctx.conditions.motion) return undefined;
        const amp = ctx.conditions.desktop ? [70, 140, 40] : [30, 30, 30];
        gsap.utils.toArray('.member__card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: amp[i] },
            { y: -amp[i] * 0.6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });
        return undefined;
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="equipe" ref={root} className="team section section--light" aria-labelledby="team-title">
      <div className="wrap">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">05 — Equipe</p>
            <h2 id="team-title" className="section-title" data-split>
              Três mãos firmes, <em>três estilos.</em>
            </h2>
          </div>
          <p className="section-lede">Cada barbeiro tem a sua especialidade. Escolha pelo estilo ou deixe a gente indicar.</p>
        </header>

        <ul className="team__grid">
          {TEAM.map((m, i) => (
            <li key={m.id} className={`member member--${i + 1}`}>
              <div className="member__card">
                <TiltedCard
                  altText={`Retrato de ${m.name}, ${m.role.toLowerCase()}`}
                  captionText={m.name}
                  containerWidth="100%"
                  containerHeight="var(--member-h)"
                  imageWidth="100%"
                  imageHeight="var(--member-h)"
                  rotateAmplitude={fine ? 9 : 0}
                  scaleOnHover={fine ? 1.03 : 1}
                  showTooltip={false}
                  flipOnClick={false}
                  gyroscope={false}
                  radius={18}
                  glare={0.25}
                  glareColor="#e09a62"
                  shadow={0.6}
                  intro={false}
                  displayOverlayContent
                  overlayDepth={40}
                  overlayContent={<span className="member__badge">{m.years}</span>}
                >
                  <Photo
                    name={m.image}
                    alt={`Retrato de ${m.name}, ${m.role.toLowerCase()}`}
                    className="tilted-card__img member__photo"
                    sizes="(min-width: 900px) 30vw, 90vw"
                    style={{ '--tc-depth': -24 }}
                  />
                </TiltedCard>
              </div>
              <div className="member__info">
                <p className="member__role">{m.role}</p>
                <h3 className="member__name">{m.name}</h3>
                <p className="member__bio">{m.bio}</p>
                <button type="button" className="link-btn" onClick={() => onPick(m.id)}>
                  Agendar com {m.name.split(' ')[0]}
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="fineprint">Profissionais fictícios, criados para esta demonstração.</p>
      </div>
    </section>
  );
}

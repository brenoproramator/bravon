import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import Photo from '../components/Photo';

const PILLARS = [
  {
    n: '01',
    title: 'Atendimento',
    text: 'Horário marcado é horário cumprido. Café passado na hora e ninguém olhando o relógio na sua cadeira.'
  },
  {
    n: '02',
    title: 'Técnica',
    text: 'Degradê medido, tesoura afiada toda semana e lâmina nova para cada cliente. Sem atalho.'
  },
  {
    n: '03',
    title: 'Experiência',
    text: 'Luz quente, couro, música baixa. Um intervalo de 45 minutos que você vai querer repetir.'
  }
];

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' },
        ctx => {
          if (!ctx.conditions.motion) return undefined;
          const { desktop } = ctx.conditions;

          // Manifesto: palavras acendem conforme a leitura avança
          const split = SplitText.create('.about__statement', { type: 'words', wordsClass: 'word' });
          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.08,
              scrollTrigger: { trigger: '.about__statement', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 }
            }
          );

          // Parallax em camadas: cada foto anda num ritmo diferente
          gsap.utils.toArray('[data-speed]').forEach(el => {
            const speed = parseFloat(el.dataset.speed);
            gsap.fromTo(
              el,
              { yPercent: desktop ? speed * 10 : speed * 4 },
              {
                yPercent: desktop ? -speed * 10 : -speed * 4,
                ease: 'none',
                scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
              }
            );
          });

          // Molduras revelam de baixo para cima
          gsap.utils.toArray('.about__frame').forEach(frame => {
            gsap.fromTo(
              frame,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.4,
                ease: 'expo.out',
                scrollTrigger: { trigger: frame, start: 'top 85%', once: true }
              }
            );
          });

          gsap.fromTo(
            '.pillar',
            { y: desktop ? 120 : 50, autoAlpha: 0.1 },
            {
              y: 0,
              autoAlpha: 1,
              ease: 'none',
              stagger: 0.15,
              scrollTrigger: { trigger: '.about__pillars', start: 'top 95%', end: 'top 45%', scrub: 0.6 }
            }
          );

          // Números contam conforme a rolagem
          gsap.utils.toArray('.about__stats [data-count]').forEach(el => {
            const end = Number(el.dataset.count);
            const obj = { v: 0 };
            gsap.to(obj, {
              v: end,
              ease: 'none',
              onUpdate: () => (el.textContent = Math.round(obj.v)),
              scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: 0.5 }
            });
          });

          return () => split.revert();
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="sobre" ref={root} className="about section section--light" aria-labelledby="about-title">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">01 — A casa</p>
          <h2 id="about-title" className="section-title" data-split>
            Uma barbearia de rua <em>com acabamento de alfaiataria.</em>
          </h2>
        </header>

        <div className="about__grid">
          <p className="about__statement">
            Na Bravon, cada corte começa com uma conversa e termina com um detalhe que só você vai notar. Três cadeiras,
            três barbeiros e nenhuma fila: aqui o tempo é seu.
          </p>

          <figure className="about__fig about__fig--tall">
            <div className="about__frame">
              <div className="about__parallax" data-speed="1.2">
                <Photo
                  name="degrade"
                  sizes="(min-width: 900px) 34vw, 90vw"
                  width={1100}
                  height={1463}
                  alt="Barbeiro fazendo um degradê no cabelo crespo de um cliente"
                />
              </div>
            </div>
            <figcaption>Degradê na régua</figcaption>
          </figure>

          <figure className="about__fig about__fig--wide">
            <div className="about__frame">
              <div className="about__parallax" data-speed="0.7">
                <Photo
                  name="cadeira"
                  sizes="(min-width: 900px) 46vw, 90vw"
                  width={1200}
                  height={800}
                  alt="Cadeira de barbeiro clássica em couro marrom e metal cromado"
                />
              </div>
            </div>
            <figcaption>A cadeira de couro que dá nome ao ritual</figcaption>
          </figure>

          <div className="about__stats" role="list">
            <p role="listitem">
              <strong><span data-count="3">3</span></strong>
              <span>cadeiras, nunca mais que isso</span>
            </p>
            <p role="listitem">
              <strong><span data-count="45">45</span>&nbsp;min</strong>
              <span>por corte, sem atropelo</span>
            </p>
            <p role="listitem">
              <strong><span data-count="1">1</span></strong>
              <span>lâmina nova por cliente</span>
            </p>
          </div>
        </div>

        <ol className="about__pillars">
          {PILLARS.map(p => (
            <li key={p.n} className="pillar">
              <span className="pillar__n">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

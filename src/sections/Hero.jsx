import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useSmoothScroll } from '../lib/SmoothScroll';
import Photo from '../components/Photo';
import Button from '../components/Button';
import { Monogram } from '../components/Logo';
import Noise from '../components/reactbits/Noise';

export default function Hero() {
  const root = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 900px)'
        },
        ctx => {
          const { reduce, desktop } = ctx.conditions;
          const header = document.querySelector('[data-header] .header__bar');

          if (reduce) {
            gsap.set('.intro', { autoAlpha: 0 });
            gsap.set(['.hero__title .line > span', '.hero__eyebrow', '.hero__lead', '.hero__actions > *', '.hero__aside'], {
              clearProps: 'all'
            });
            return undefined;
          }

          // Entrada: cortina com o monograma → foto → título por linhas → texto → botões
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
          tl.from('.intro__mark', { scale: 0.6, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
            .from('.intro__rule', { scaleX: 0, duration: 0.6, ease: 'power2.inOut' }, '<0.2')
            .to('.intro__mark', { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
            .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '<0.15')
            .from('.hero__media-inner', { scale: 1.22, duration: 1.8 }, '<0.1')
            .from('.hero__title .line > span', { yPercent: 115, rotate: 2, duration: 1.2, stagger: 0.12 }, '<0.35')
            .from('.hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.8 }, '<0.2')
            .from('.hero__lead', { autoAlpha: 0, y: 24, duration: 0.9 }, '<0.25')
            .from('.hero__actions > *', { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, '<0.1')
            .from('.hero__aside > *', { autoAlpha: 0, x: 20, duration: 0.8, stagger: 0.08 }, '<')
            .set('.intro', { display: 'none' });

          if (header) tl.from(header, { yPercent: -110, autoAlpha: 0, duration: 0.9 }, 1.5);

          // Saída com a rolagem: parallax sutil na foto, conteúdo sobe e esmaece
          gsap.to('.hero__media-inner', {
            yPercent: desktop ? 14 : 8,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
          });
          gsap.to('.hero__title .line:nth-child(1)', {
            xPercent: desktop ? -10 : -6,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
          });
          gsap.to('.hero__title .line:nth-child(2)', {
            xPercent: desktop ? 8 : 5,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
          });
          gsap.to('.hero__shade', {
            opacity: 1.35,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
          });
          gsap.to('.hero__content', {
            yPercent: -12,
            autoAlpha: 0.15,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'center center', end: 'bottom top', scrub: true }
          });

          return () => {
            if (header) gsap.set(header, { clearProps: 'all' });
          };
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  const go = (e, id) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <section id="topo" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <div className="hero__media-inner">
          <Photo
            name="hero"
            priority
            sizes="100vw"
            width={1600}
            height={1064}
            alt="Barbeiro aparando a barba de um cliente com navalha, sob luz quente"
          />
        </div>
        <div className="hero__shade" />
      </div>

      <Noise opacity={0.12} fps={12} contrast={0.5} blendMode="overlay" className="hero__noise" />

      <div className="hero__content wrap">
        <p className="eyebrow hero__eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" /> Barbearia &amp; Estilo · corte, barba e navalha
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="line">
            <span>Seu estilo.</span>
          </span>
          <span className="line">
            <span>
              Sua <em>assinatura.</em>
            </span>
          </span>
        </h1>
        <p className="hero__lead">
          Tesoura, navalha e um atendimento que respeita o seu tempo. Você senta, conversa com quem entende e sai do jeito
          que imaginou.
        </p>
        <div className="hero__actions">
          <Button variant="copper" href="#agendar" magnetic onClick={e => go(e, 'agendar')}>
            Agendar meu corte
          </Button>
          <Button variant="ghost" href="#sobre" onClick={e => go(e, 'sobre')} arrow={false}>
            Conhecer a Bravon
          </Button>
        </div>
      </div>

      <aside className="hero__aside" aria-label="Informações rápidas">
        <p>
          <span>Ter a sex</span> 9h às 20h
        </p>
        <p>
          <span>Sábado</span> 8h às 18h
        </p>
        <a href="#sobre" className="hero__scroll" onClick={e => go(e, 'sobre')}>
          <span>Role</span>
          <i aria-hidden="true" />
        </a>
      </aside>

      <div className="intro" aria-hidden="true">
        <div className="intro__mark">
          <Monogram decorative />
          <span className="intro__rule" />
          <span className="intro__name">BRAVON</span>
        </div>
      </div>
    </section>
  );
}

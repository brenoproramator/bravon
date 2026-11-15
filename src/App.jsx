import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from './lib/gsap';
import { SmoothScroll, useSmoothScroll } from './lib/SmoothScroll';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import About from './sections/About';
import Ritual from './sections/Ritual';
import Services from './sections/Services';
import Gallery from './sections/Gallery';
import Team from './sections/Team';
import Testimonials from './sections/Testimonials';
import Booking from './sections/Booking';
import Footer from './sections/Footer';

function Page() {
  const main = useRef(null);
  const [preset, setPreset] = useState(null);
  const { scrollTo } = useSmoothScroll();

  const pick = useCallback(
    patch => {
      setPreset({ ...patch, at: Date.now() });
      scrollTo('#agendar');
    },
    [scrollTo]
  );

  // Títulos de seção: linhas reveladas por máscara (SplitText com autoSplit refaz no resize)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits = gsap.utils.toArray('[data-split]').map(el =>
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: self =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                stagger: 0.1,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true }
              })
          })
        );
        gsap.utils.toArray('.section-head .eyebrow, .section-lede').forEach(el => {
          gsap.from(el, { autoAlpha: 0, y: 18, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
        return () => splits.forEach(s => s.revert());
      });

      // Movimento contínuo, preso à rolagem (scrub)
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, ctx => {
        if (!ctx.conditions.motion) return undefined;
        const { desktop } = ctx.conditions;

        // Barra de progresso cobre no topo
        gsap.fromTo('.scroll-progress i', { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
        });

        // Seções claras entram como um cartão arredondado que se abre até ocupar a tela
        gsap.utils.toArray('.section--light').forEach(sec => {
          gsap.fromTo(
            sec,
            { clipPath: `inset(0% ${desktop ? 6 : 3}% 0% ${desktop ? 6 : 3}% round ${desktop ? 48 : 28}px)` },
            {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              ease: 'none',
              scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 20%', scrub: true }
            }
          );
        });

        // Títulos de seção deslizam na horizontal enquanto você lê
        gsap.utils.toArray('.section-title').forEach((title, i) => {
          gsap.fromTo(
            title,
            { x: desktop ? (i % 2 ? -70 : 70) : 24 },
            {
              x: desktop ? (i % 2 ? 30 : -30) : -12,
              ease: 'none',
              scrollTrigger: { trigger: title, start: 'top bottom', end: 'bottom top', scrub: true }
            }
          );
        });
        return undefined;
      });
      return () => mm.revert();
    },
    { scope: main }
  );

  // Recalcula posições quando fontes e imagens terminam de carregar
  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#conteudo" onClick={e => { e.preventDefault(); scrollTo('#conteudo'); }}>
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" ref={main} tabIndex={-1}>
        <div className="scroll-progress" aria-hidden="true">
          <i />
        </div>
        <Hero />
        <Marquee />
        <About />
        <Ritual />
        <Services onPick={service => pick({ service })} />
        <Gallery />
        <Team onPick={barber => pick({ barber })} />
        <Testimonials />
        <Booking preset={preset} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  );
}

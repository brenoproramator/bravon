import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { HOURS, NAV } from '../lib/content';
import { Logo } from '../components/Logo';
import Button from '../components/Button';

const SOCIAL = [
  {
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.5 2.4 4 5 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 9.5v5l4-2.5z" fill="currentColor" />
      </svg>
    )
  }
];

export default function Footer() {
  const root = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.footer__word span',
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 }
          }
        );
        gsap.from('.footer__col', {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: '.footer__cols', start: 'top 85%', once: true }
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const go = (e, id) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <footer id="contato" ref={root} className="footer" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <p className="eyebrow">08 — Contato</p>
            <h2 id="contact-title" className="footer__title">
              Passe aqui. <em>A gente cuida do resto.</em>
            </h2>
          </div>
          <Button variant="copper" href="#agendar" magnetic onClick={e => go(e, 'agendar')}>
            Agendar horário
          </Button>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h3>Horário</h3>
            <dl className="hours">
              {HOURS.map(h => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd className={h.time === 'Fechado' ? 'is-closed' : ''}>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="footer__col">
            <h3>Endereço</h3>
            <address>
              Rua das Navalhas, 000
              <br />
              Bairro Exemplo · Cidade Fictícia
            </address>
            <p className="fineprint">Endereço ilustrativo, apenas para demonstração.</p>
          </div>

          <div className="footer__col">
            <h3>Redes</h3>
            <ul className="socials">
              {SOCIAL.map(s => (
                <li key={s.label}>
                  <span className="social" title="Perfil demonstrativo">
                    {s.icon}
                    <span>{s.label}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="fineprint">Perfis demonstrativos, sem link real.</p>
          </div>

          <nav className="footer__col" aria-label="Rodapé">
            <h3>Navegue</h3>
            <ul className="footer__nav">
              {[{ id: 'topo', label: 'Início' }, ...NAV.filter(n => n.id !== 'contato'), { id: 'agendar', label: 'Agendar' }].map(n => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="navlink" onClick={e => go(e, n.id)}>
                    <span data-text={n.label}>{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <p className="footer__word" aria-hidden="true">
        {'BRAVON'.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </p>

      <div className="wrap footer__bottom">
        <Logo compact />
        <p>© {new Date().getFullYear()} BRAVON — marca fictícia. Seu estilo, sua assinatura.</p>
        <p>
          Fotos: Unsplash · Projeto conceitual por <span className="footer__sig">bn.dev</span>
        </p>
        <a href="#topo" className="to-top" onClick={e => go(e, 'topo')}>
          Voltar ao topo
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 19V6M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

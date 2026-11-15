import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { NAV, HOURS } from '../lib/content';
import { Logo } from '../components/Logo';
import Button from '../components/Button';

export default function Header() {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const tlRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { scrollTo, stop, start } = useSmoothScroll();

  // Estado do cabeçalho conforme a rolagem: sólido depois do topo, esconde ao descer, volta ao subir.
  useGSAP(
    () => {
      const header = headerRef.current;
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: self => {
          const y = self.scroll();
          header.classList.toggle('is-solid', y > 40);
          const hide = self.direction === 1 && y > window.innerHeight * 0.9 && !header.classList.contains('menu-open');
          header.classList.toggle('is-hidden', hide);
        }
      });
      return () => st.kill();
    },
    { scope: headerRef }
  );

  // Timeline do menu mobile (criada uma vez, tocada para frente e para trás).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, ctx => {
        const { reduce } = ctx.conditions;
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
        tl.set(menuRef.current, { autoAlpha: 1 })
          .fromTo('.menu__bg', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: reduce ? 0.01 : 0.8, ease: 'expo.inOut' })
          .fromTo(
            '.menu__link span',
            { yPercent: reduce ? 0 : 110 },
            { yPercent: 0, duration: reduce ? 0.01 : 0.9, stagger: 0.06 },
            reduce ? 0 : '-=0.35'
          )
          .fromTo('.menu__foot > *', { autoAlpha: 0, y: reduce ? 0 : 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.6');
        tlRef.current = tl;
        return () => {
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: headerRef }
  );

  useEffect(() => {
    const tl = tlRef.current;
    const header = headerRef.current;
    if (!tl) return undefined;
    if (open) {
      header.classList.add('menu-open');
      header.classList.remove('is-hidden');
      stop();
      tl.timeScale(1).play();
      const first = menuRef.current.querySelector('a, button');
      first?.focus();
    } else if (tl.progress() > 0) {
      header.classList.remove('menu-open');
      tl.timeScale(1.6).reverse();
      start();
    }
    return undefined;
  }, [open, stop, start]);

  // Esc fecha; Tab fica preso dentro do menu aberto.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const nodes = [burgerRef.current, ...menuRef.current.querySelectorAll('a, button')].filter(Boolean);
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
    const onResize = () => window.innerWidth >= 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // Espera o menu começar a fechar antes de rolar
    window.setTimeout(() => scrollTo(`#${id}`), wasOpen ? 380 : 0);
  };

  return (
    <header ref={headerRef} className="header" data-header>
      <div className="header__bar">
        <a href="#topo" className="header__logo" aria-label="BRAVON — voltar ao início" onClick={e => go(e, 'topo')}>
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Principal">
          <ul>
            {NAV.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="navlink" onClick={e => go(e, item.id)}>
                  <span data-text={item.label}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__cta">
          <Button variant="copper" href="#agendar" onClick={e => go(e, 'agendar')} arrow={false} className="btn--sm">
            Agendar horário
          </Button>
        </div>

        <button
          ref={burgerRef}
          type="button"
          className={`burger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        ref={menuRef}
        id="menu-mobile"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <div className="menu__bg" />
        <nav className="menu__inner" aria-label="Menu mobile">
          <ul>
            {[...NAV, { id: 'agendar', label: 'Agendar' }].map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="menu__link" onClick={e => go(e, item.id)}>
                  <span>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <p className="menu__hours">
              {HOURS[0].days}, {HOURS[0].time}
              <br />
              {HOURS[1].days}, {HOURS[1].time}
            </p>
            <Button variant="copper" href="#agendar" onClick={e => go(e, 'agendar')}>
              Agendar meu corte
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

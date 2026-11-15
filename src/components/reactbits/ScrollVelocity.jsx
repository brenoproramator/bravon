import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import './ScrollVelocity.css';

/**
 * Adaptação do ScrollVelocity do React Bits (reactbits.dev).
 * O original usa `motion/react`; aqui a mesma lógica (deslocamento base +
 * fator de velocidade do scroll + wrap infinito + skew pela velocidade)
 * roda no ticker do GSAP e lê a velocidade pelo ScrollTrigger, que já
 * recebe os eventos do Lenis. Sem dependência extra.
 */

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function VelocityRow({ children, baseVelocity, numCopies = 4, outline = false, skew = 6, className = '' }) {
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const copyRef = useRef(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!row || !track || !copy) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    let width = copy.offsetWidth;
    const ro = new ResizeObserver(() => {
      width = copy.offsetWidth;
    });
    ro.observe(copy);

    // Lê a velocidade global do scroll (px/s). Funciona com Lenis ou rolagem nativa.
    const probe = ScrollTrigger.create({ start: 0, end: 'max' });
    const setX = gsap.quickSetter(track, 'x', 'px');
    const setSkew = gsap.quickSetter(track, 'skewX', 'deg');

    let baseX = 0;
    let direction = 1;
    let smooth = 0;
    let skewNow = 0;
    let visible = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(row);

    const tick = (time, deltaTime) => {
      if (!visible || !width) return;
      const dt = Math.min(deltaTime, 64);
      const velocity = probe.getVelocity();
      // Suavização tipo mola, equivalente ao useSpring do original
      smooth += (velocity - smooth) * (1 - Math.exp(-dt / 120));
      const factor = smooth / 1000 * 5; // mapeia [0,1000] → [0,5], como no original
      if (factor < -0.05) direction = -1;
      else if (factor > 0.05) direction = 1;

      let moveBy = direction * baseVelocity * (dt / 1000);
      moveBy += direction * moveBy * Math.abs(factor);
      baseX += moveBy;
      setX(wrap(-width, 0, baseX));

      const surge = Math.tanh(Math.abs(smooth) / 1600);
      const targetSkew = -Math.sign(baseVelocity * direction) * skew * surge;
      skewNow += (targetSkew - skewNow) * (1 - Math.exp(-dt / 110));
      setSkew(Math.abs(skewNow) < 0.01 ? 0 : skewNow);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      probe.kill();
    };
  }, [baseVelocity, skew]);

  const copies = Array.from({ length: numCopies }, (_, i) => (
    <span key={i} ref={i === 0 ? copyRef : null} className="sv__copy" aria-hidden={i > 0 ? 'true' : undefined}>
      {children}
    </span>
  ));

  return (
    <div ref={rowRef} className={`sv__row ${outline ? 'sv__row--outline' : ''} ${className}`}>
      <div ref={trackRef} className="sv__track">
        {copies}
      </div>
    </div>
  );
}

export default function ScrollVelocity({ texts = [], velocity = 70, className = '' }) {
  const [rows] = useState(texts);
  return (
    <div className={`sv ${className}`}>
      {rows.map((text, i) => (
        <VelocityRow key={i} baseVelocity={i % 2 ? -velocity : velocity} outline={i % 2 === 1}>
          {text}
        </VelocityRow>
      ))}
    </div>
  );
}

import { useId } from 'react';

/**
 * Monograma BRAVON: a haste do "B" é a lâmina de uma navalha —
 * fio em cobre à esquerda, espiga curva no topo e o pino do eixo embaixo.
 */
export function Monogram({ className = '', title = 'BRAVON', decorative = false }) {
  const id = useId();
  return (
    <svg
      className={`monogram ${className}`}
      viewBox="0 0 100 100"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-labelledby={decorative ? undefined : id}
      focusable="false"
    >
      {!decorative && <title id={id}>{title}</title>}
      <g className="monogram__bowls" fill="currentColor" fillRule="evenodd">
        <path d="M38 10H55A18 18 0 0 1 55 46H38Z M38 19H54A9 9 0 0 1 54 37H38Z" />
        <path d="M38 37H58A26.5 26.5 0 0 1 58 90H38Z M38 46H57A17.5 17.5 0 0 1 57 81H38Z" />
      </g>
      <path className="monogram__blade" fill="currentColor" d="M27 10H40V90H27L20 83V17Z" />
      <path className="monogram__edge" fill="var(--copper, #c07a45)" d="M20 18.5L23.5 15V85L20 81.5Z" />
      <path
        className="monogram__tang"
        d="M27 10C26 4.5 21 2 13.5 3"
        fill="none"
        stroke="var(--copper, #c07a45)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle className="monogram__pin" cx="31.5" cy="82" r="2.7" fill="var(--copper, #c07a45)" />
    </svg>
  );
}

export function Logo({ className = '', compact = false }) {
  return (
    <span className={`logo ${compact ? 'logo--compact' : ''} ${className}`}>
      <Monogram decorative className="logo__mark" />
      <span className="logo__text">
        <span className="logo__name">BRAVON</span>
        {!compact && <span className="logo__tag">Barbearia &amp; Estilo</span>}
      </span>
    </span>
  );
}

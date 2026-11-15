import Magnet from './reactbits/Magnet';

/**
 * Botão com microinteração: texto que troca por uma cópia vinda de baixo,
 * seta que avança e, opcionalmente, o efeito Magnet do React Bits (só com ponteiro fino).
 */
export default function Button({
  children,
  variant = 'solid',
  href,
  onClick,
  magnetic = false,
  type = 'button',
  className = '',
  arrow = true,
  ...rest
}) {
  const content = (
    <>
      <span className="btn__label" data-text={typeof children === 'string' ? children : undefined}>
        <span>{children}</span>
      </span>
      {arrow && (
        <span className="btn__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        </span>
      )}
    </>
  );

  const classes = `btn btn--${variant} ${className}`;
  const el = href ? (
    <a className={classes} href={href} onClick={onClick} {...rest}>
      {content}
    </a>
  ) : (
    <button className={classes} type={type} onClick={onClick} {...rest}>
      {content}
    </button>
  );

  if (!magnetic) return el;
  return (
    <Magnet padding={70} magnetStrength={5} maxOffset={14} wrapperClassName="magnet-wrap">
      {el}
    </Magnet>
  );
}

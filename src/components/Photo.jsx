import { forwardRef, useState } from 'react';
import { Monogram } from './Logo';

const BASE = 'img/';

/**
 * Imagem com srcset (versão leve para telas pequenas) e fallback de marca:
 * se o arquivo falhar, entra um painel em cobre/carvão com o monograma —
 * nunca um ícone de imagem quebrada nem um espaço vazio.
 */
const Photo = forwardRef(function Photo(
  { name, alt, className = '', sizes = '100vw', priority = false, width, height, style },
  ref
) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div ref={ref} className={`photo-fallback ${className}`} role="img" aria-label={alt} style={style}>
        <Monogram decorative />
      </div>
    );
  }

  return (
    <img
      ref={ref}
      className={className}
      src={`${BASE}${name}.webp`}
      srcSet={`${BASE}${name}-sm.webp 640w, ${BASE}${name}.webp 1400w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable={false}
      style={style}
      onError={() => setFailed(true)}
    />
  );
});

export default Photo;

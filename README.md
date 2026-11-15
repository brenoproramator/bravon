# BRAVON — Barbearia & Estilo

Site conceitual de uma barbearia fictícia. React 19 + GSAP 3 (ScrollTrigger, SplitText, useGSAP) + Lenis.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ para publicar
```

## Estrutura

- `src/lib/SmoothScroll.jsx` — Lenis integrado ao ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)`), desligado com `prefers-reduced-motion`.
- `src/lib/gsap.js` — registro único dos plugins.
- `src/sections/` — uma seção por arquivo; todas as animações usam `useGSAP` + `gsap.matchMedia()` (limpeza automática e versão com movimento reduzido).
- `src/components/reactbits/` — componentes do React Bits (reactbits.dev, MIT + Commons Clause): Magnet, Noise, ClickSpark e TiltedCard copiados sem alteração; ScrollVelocity adaptado para GSAP (o original usa `motion`).
- `src/lib/content.js` — textos, preços, equipe, horários.

## Créditos e avisos

- Fotos: Unsplash (licença Unsplash). Os retratos da equipe são de modelos do Unsplash usados para profissionais fictícios.
- Fontes: Big Shoulders Display, Instrument Serif e Manrope (SIL OFL), auto-hospedadas em `src/assets/fonts`.
- Marca, endereço, redes, depoimentos e agendamento são demonstrativos. Nenhum horário real é reservado.

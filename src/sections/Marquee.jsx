import ScrollVelocity from '../components/reactbits/ScrollVelocity';
import { Monogram } from '../components/Logo';

const Sep = () => (
  <span className="marquee__sep" aria-hidden="true">
    <Monogram decorative />
  </span>
);

const Words = ({ words }) => (
  <>
    {words.map(w => (
      <span key={w} className="marquee__word">
        {w}
        <Sep />
      </span>
    ))}
  </>
);

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Precisão, atitude, estilo, Bravon">
      <div className="marquee__band">
        <ScrollVelocity
          velocity={55}
          texts={[
            <Words key="a" words={['Precisão', 'Atitude', 'Estilo', 'Bravon']} />,
            <Words key="b" words={['Navalha', 'Tesoura', 'Toalha quente', 'Bravon']} />
          ]}
        />
      </div>
    </section>
  );
}

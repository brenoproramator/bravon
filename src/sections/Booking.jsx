import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { SERVICES, TEAM, OPENING, brl } from '../lib/content';
import ClickSpark from '../components/reactbits/ClickSpark';
import Button from '../components/Button';
import { Monogram } from '../components/Logo';

const WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEK_LONG = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const ANY = 'qualquer';

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const pad = n => String(n).padStart(2, '0');
const fmtMin = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

// Ocupação simulada e determinística (sempre igual para a mesma data/barbeiro/horário)
const busy = (key) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return (h >>> 0) % 100 < 28;
};

function buildDays(count = 12) {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < count && i < 40; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    if (OPENING[day.getDay()]) out.push(day);
  }
  return out;
}

function buildSlots(day, duration, barber) {
  if (!day) return [];
  const [open, close] = OPENING[day.getDay()];
  const now = new Date();
  const isToday = iso(now) === iso(day);
  const nowMin = now.getHours() * 60 + now.getMinutes() + 30;
  const slots = [];
  for (let m = open * 60; m + duration <= close * 60; m += 30) {
    const ids = barber === ANY || !barber ? TEAM.map(t => t.id) : [barber];
    const free = ids.some(id => !busy(`${iso(day)}|${id}|${m}`));
    slots.push({ value: fmtMin(m), available: free && !(isToday && m < nowMin) });
  }
  return slots;
}

const onlyDigits = v => v.replace(/\D/g, '');
const maskPhone = v => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const EMPTY = { service: '', barber: '', date: '', time: '', name: '', phone: '' };

function validate(f) {
  const e = {};
  if (!f.service) e.service = 'Escolha um serviço.';
  if (!f.barber) e.barber = 'Escolha um profissional ou “Sem preferência”.';
  if (!f.date) e.date = 'Escolha um dia.';
  if (!f.time) e.time = f.date ? 'Escolha um horário disponível.' : 'Escolha um dia para ver os horários.';
  const name = f.name.trim();
  if (name.length < 3) e.name = 'Digite seu nome (pelo menos 3 letras).';
  else if (!/^[A-Za-zÀ-ÿ' .-]+$/.test(name)) e.name = 'Use apenas letras no nome.';
  const phone = onlyDigits(f.phone);
  if (phone.length < 10 || phone.length > 11) e.phone = 'Telefone com DDD, por exemplo (11) 90000-0000.';
  return e;
}

export default function Booking({ preset }) {
  const root = useRef(null);
  const dialogRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(null);
  const { stop, start } = useSmoothScroll();

  const days = useMemo(() => buildDays(), []);
  const service = SERVICES.find(s => s.id === form.service);
  const barber = TEAM.find(t => t.id === form.barber);
  const day = days.find(d => iso(d) === form.date);
  const slots = useMemo(() => buildSlots(day, service?.duration ?? 30, form.barber), [day, service, form.barber]);

  // Pré-seleção vinda de Serviços/Equipe
  useEffect(() => {
    if (!preset) return;
    setForm(f => ({ ...f, ...(preset.service ? { service: preset.service } : {}), ...(preset.barber ? { barber: preset.barber } : {}) }));
  }, [preset]);

  // Horário deixa de valer se mudar serviço/dia/profissional
  useEffect(() => {
    if (form.time && !slots.find(s => s.value === form.time && s.available)) {
      setForm(f => ({ ...f, time: '' }));
    }
  }, [slots, form.time]);

  useEffect(() => {
    if (touched) setErrors(validate(form));
  }, [form, touched]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.step', {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: '.booking__form', start: 'top 80%', once: true }
        });
        gsap.from('.ticket', {
          y: 60,
          rotate: 2,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.booking__form', start: 'top 75%', once: true }
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const submit = e => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(form);
    setErrors(errs);
    const firstKey = ['service', 'barber', 'date', 'time', 'name', 'phone'].find(k => errs[k]);
    if (firstKey) {
      const target = root.current.querySelector(`[data-field="${firstKey}"]`);
      target?.focus();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce && target) gsap.fromTo(target.closest('.step') ?? target, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    setDone({
      service,
      barber: barber ? barber.name : 'Primeiro profissional livre',
      dateLabel: `${WEEK_LONG[day.getDay()]}, ${day.getDate()} de ${MONTHS[day.getMonth()]}`,
      time: form.time,
      name: form.name.trim().split(' ')[0],
      code: `BRV-${pad(day.getDate())}${form.time.replace(':', '')}`
    });
  };

  // Modal de resumo
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return undefined;
    if (!done) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prev = document.activeElement;
    stop();
    gsap.set(dlg, { autoAlpha: 1 });
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.confirm__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.4 })
      .fromTo(
        '.confirm__card',
        { y: reduce ? 0 : 80, rotate: reduce ? 0 : -3, autoAlpha: 0 },
        { y: 0, rotate: 0, autoAlpha: 1, duration: reduce ? 0 : 0.9 },
        '<0.1'
      )
      .from('.confirm__card .stagger', { y: reduce ? 0 : 16, autoAlpha: 0, stagger: 0.05, duration: reduce ? 0 : 0.6 }, '<0.25');
    tl.call(() => dlg.querySelector('.confirm__title')?.focus({ preventScroll: true }), null, '>');

    const onKey = e => {
      if (e.key === 'Escape') setDone(null);
      if (e.key === 'Tab') {
        const nodes = [...dlg.querySelectorAll('button')];
        if (e.shiftKey && document.activeElement === nodes[0]) {
          e.preventDefault();
          nodes[nodes.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === nodes[nodes.length - 1]) {
          e.preventDefault();
          nodes[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      tl.kill();
      gsap.set(dlg, { autoAlpha: 0 });
      start();
      prev?.focus?.({ preventScroll: true });
    };
  }, [done, stop, start]);

  const reset = () => {
    setDone(null);
    setForm(EMPTY);
    setErrors({});
    setTouched(false);
  };

  const err = k => (touched && errors[k] ? errors[k] : '');
  const errorCount = touched ? Object.keys(errors).length : 0;

  return (
    <section id="agendar" ref={root} className="booking section" aria-labelledby="booking-title">
      <ClickSpark sparkColor={['#e09a62', '#f2ece1']} sparkSize={9} sparkRadius={24} sparkCount={9} duration={480}>
        <div className="wrap">
          <header className="section-head section-head--split">
            <div>
              <p className="eyebrow">07 — Agendamento</p>
              <h2 id="booking-title" className="section-title" data-split>
                Sua cadeira <em>está esperando.</em>
              </h2>
            </div>
            <p className="section-lede">
              Quatro escolhas e pronto. <strong>Demonstração:</strong> nenhum horário real é reservado e nenhum dado sai
              do seu navegador.
            </p>
          </header>

          <form className="booking__form" noValidate onSubmit={submit} aria-describedby="booking-demo-note">
            <div className="booking__steps">
              {/* 1. Serviço */}
              <fieldset className={`step ${err('service') ? 'has-error' : ''}`} aria-describedby={err('service') ? 'err-service' : undefined}>
                <legend>
                  <span className="step__n">01</span> Serviço
                </legend>
                <div className="choice-grid choice-grid--services">
                  {SERVICES.map((s, i) => (
                    <label key={s.id} className="choice">
                      <input
                        type="radio"
                        name="service"
                        value={s.id}
                        checked={form.service === s.id}
                        onChange={() => set('service', s.id)}
                        data-field={i === 0 ? 'service' : undefined}
                      />
                      <span className="choice__body">
                        <span className="choice__title">{s.name}</span>
                        <span className="choice__meta">
                          {s.duration} min · <b>{brl(s.price)}</b>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {err('service') && (
                  <p className="field-error" id="err-service">
                    {err('service')}
                  </p>
                )}
              </fieldset>

              {/* 2. Profissional */}
              <fieldset className={`step ${err('barber') ? 'has-error' : ''}`} aria-describedby={err('barber') ? 'err-barber' : undefined}>
                <legend>
                  <span className="step__n">02</span> Profissional
                </legend>
                <div className="choice-grid choice-grid--barbers">
                  {[...TEAM, { id: ANY, name: 'Sem preferência', role: 'Primeiro livre' }].map((b, i) => (
                    <label key={b.id} className="choice choice--barber">
                      <input
                        type="radio"
                        name="barber"
                        value={b.id}
                        checked={form.barber === b.id}
                        onChange={() => set('barber', b.id)}
                        data-field={i === 0 ? 'barber' : undefined}
                      />
                      <span className="choice__body">
                        <span className="choice__avatar" aria-hidden="true">
                          {b.image ? <img src={`img/${b.image}-sm.webp`} alt="" onError={e => (e.currentTarget.style.display = 'none')} /> : null}
                          <span>{b.id === ANY ? '✦' : b.name[0]}</span>
                        </span>
                        <span>
                          <span className="choice__title">{b.name}</span>
                          <span className="choice__meta">{b.role}</span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {err('barber') && (
                  <p className="field-error" id="err-barber">
                    {err('barber')}
                  </p>
                )}
              </fieldset>

              {/* 3. Data e horário */}
              <fieldset className={`step ${err('date') || err('time') ? 'has-error' : ''}`}>
                <legend>
                  <span className="step__n">03</span> Dia e horário
                </legend>
                <div className="days" role="radiogroup" aria-label="Dia" aria-describedby={err('date') ? 'err-date' : undefined}>
                  {days.map((d, i) => {
                    const value = iso(d);
                    return (
                      <label key={value} className="day">
                        <input
                          type="radio"
                          name="date"
                          value={value}
                          checked={form.date === value}
                          onChange={() => set('date', value)}
                          data-field={i === 0 ? 'date' : undefined}
                        />
                        <span className="day__body">
                          <small>{WEEK[d.getDay()]}</small>
                          <strong>{d.getDate()}</strong>
                          <small>{MONTHS[d.getMonth()]}</small>
                        </span>
                        <span className="sr-only">{`${WEEK_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`}</span>
                      </label>
                    );
                  })}
                </div>
                {err('date') && (
                  <p className="field-error" id="err-date">
                    {err('date')}
                  </p>
                )}

                <div className="times-wrap">
                  {!day ? (
                    <p className="times__empty">
                      Escolha um dia para ver os horários livres.
                    </p>
                  ) : (
                    <div className="times" role="radiogroup" aria-label="Horário" aria-describedby={err('time') ? 'err-time' : undefined}>
                      {slots.map((s, i) => (
                        <label key={s.value} className={`time ${s.available ? '' : 'is-busy'}`}>
                          <input
                            type="radio"
                            name="time"
                            value={s.value}
                            disabled={!s.available}
                            checked={form.time === s.value}
                            onChange={() => set('time', s.value)}
                            data-field={i === slots.findIndex(x => x.available) ? 'time' : undefined}
                          />
                          <span>
                            {s.value}
                            {!s.available && <span className="sr-only"> (ocupado)</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {err('time') && (
                    <p className="field-error" id="err-time">
                      {err('time')}
                    </p>
                  )}
                </div>
                {day && <p className="times__legend">Horários riscados estão ocupados (simulação).</p>}
              </fieldset>

              {/* 4. Contato */}
              <fieldset className={`step ${err('name') || err('phone') ? 'has-error' : ''}`}>
                <legend>
                  <span className="step__n">04</span> Seus dados
                </legend>
                <div className="fields">
                  <div className={`field ${err('name') ? 'has-error' : ''}`}>
                    <label htmlFor="f-name">Nome</label>
                    <input
                      id="f-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      aria-invalid={err('name') ? 'true' : undefined}
                      aria-describedby={err('name') ? 'err-name' : undefined}
                      data-field="name"
                      placeholder="Como devemos te chamar"
                    />
                    {err('name') && (
                      <p className="field-error" id="err-name">
                        {err('name')}
                      </p>
                    )}
                  </div>
                  <div className={`field ${err('phone') ? 'has-error' : ''}`}>
                    <label htmlFor="f-phone">Telefone</label>
                    <input
                      id="f-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={e => set('phone', maskPhone(e.target.value))}
                      aria-invalid={err('phone') ? 'true' : undefined}
                      aria-describedby={err('phone') ? 'err-phone' : undefined}
                      data-field="phone"
                      placeholder="(00) 00000-0000"
                    />
                    {err('phone') && (
                      <p className="field-error" id="err-phone">
                        {err('phone')}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Resumo ao vivo */}
            <aside className="booking__aside">
              <div className="ticket">
                <div className="ticket__head">
                  <Monogram decorative />
                  <span>Seu horário</span>
                </div>
                <dl className="ticket__list">
                  <div>
                    <dt>Serviço</dt>
                    <dd>{service ? service.name : '—'}</dd>
                  </div>
                  <div>
                    <dt>Profissional</dt>
                    <dd>{form.barber === ANY ? 'Sem preferência' : barber ? barber.name : '—'}</dd>
                  </div>
                  <div>
                    <dt>Dia</dt>
                    <dd>{day ? `${WEEK[day.getDay()]}, ${day.getDate()} ${MONTHS[day.getMonth()]}` : '—'}</dd>
                  </div>
                  <div>
                    <dt>Horário</dt>
                    <dd>{form.time || '—'}</dd>
                  </div>
                </dl>
                <div className="ticket__total">
                  <span>Total</span>
                  <strong>{service ? brl(service.price) : 'R$ —'}</strong>
                </div>
                <Button type="submit" variant="copper" className="ticket__submit">
                  Confirmar agendamento
                </Button>
                <p className="ticket__note" id="booking-demo-note">
                  Demonstração. Nenhum horário real é reservado.
                </p>
                <p className="sr-only" aria-live="polite">
                  {errorCount ? `${errorCount} ${errorCount === 1 ? 'campo precisa' : 'campos precisam'} de atenção.` : ''}
                </p>
                {errorCount > 0 && (
                  <p className="ticket__errors" aria-hidden="true">
                    {errorCount} {errorCount === 1 ? 'campo precisa' : 'campos precisam'} de atenção.
                  </p>
                )}
              </div>
            </aside>
          </form>
        </div>
      </ClickSpark>

      <div
        ref={dialogRef}
        className="confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-hidden={!done}
        inert={!done}
        data-lenis-prevent
      >
        <div className="confirm__backdrop" onClick={() => setDone(null)} />
        {done && (
          <div className="confirm__card">
            <div className="confirm__stamp stagger" aria-hidden="true">
              <Monogram decorative />
            </div>
            <p className="eyebrow stagger">Resumo da demonstração</p>
            <h3 id="confirm-title" className="confirm__title stagger" tabIndex={-1}>
              Tudo certo, {done.name}.
            </h3>
            <p className="confirm__alert stagger" role="note">
              <strong>Nenhum horário real foi reservado.</strong> Este agendamento é apenas uma demonstração do site.
            </p>
            <dl className="ticket__list stagger">
              <div>
                <dt>Serviço</dt>
                <dd>
                  {done.service.name} · {brl(done.service.price)}
                </dd>
              </div>
              <div>
                <dt>Profissional</dt>
                <dd>{done.barber}</dd>
              </div>
              <div>
                <dt>Quando</dt>
                <dd>
                  {done.dateLabel}, às {done.time}
                </dd>
              </div>
              <div>
                <dt>Código</dt>
                <dd>{done.code} (fictício)</dd>
              </div>
            </dl>
            <div className="confirm__actions stagger">
              <Button variant="copper" onClick={reset}>
                Fazer outro agendamento
              </Button>
              <Button variant="ghost-dark" onClick={() => setDone(null)} arrow={false}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

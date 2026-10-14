import { useEffect, useState } from 'react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShineBorder } from '@/components/ui/shine-border';
import { OFFERS_TIME_ZONE, offerEndTime, type Offer } from '@/data/offersService';
import { contactLinks, site } from '@/data/site';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { Icon } from './icons';
import { Container, Heading, Section } from './primitives';
import { withBase } from '@/content/paths';

const euro = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);

const endDate = (endsAt: string) =>
  new Intl.DateTimeFormat('it-IT', { timeZone: OFFERS_TIME_ZONE, day: 'numeric', month: 'long', year: 'numeric' }).format(
    offerEndTime(endsAt),
  );

export function Offers({ offers, onExpire }: { offers: Offer[]; onExpire: () => void }) {
  if (offers.length === 0) return null;
  return (
    <Section id="sconti" aria-labelledby="sconti-title">
      <Container>
        <Heading
          id="sconti-title"
          eyebrow="Sconti"
          title="Offerte del momento"
          intro="Promozioni a tempo su pavimenti e decorazioni. Scrivici per disponibilità e dettagli."
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <li key={o.id}>
              <OfferCard offer={o} onExpire={onExpire} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function OfferCard({ offer, onExpire }: { offer: Offer; onExpire: () => void }) {
  const reduced = useReducedMotion();
  const discount = Math.round((1 - offer.newPrice / offer.oldPrice) * 100);
  const decimals = Number.isInteger(offer.newPrice) && Number.isInteger(offer.oldPrice) ? 0 : 2;
  const message = `${site.contact.whatsappMessage} l’offerta "${offer.title}" (${offer.color}).`;
  const href = contactLinks.whatsapp.replace(/\?text=.*$/, `?text=${encodeURIComponent(message)}`);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line">
      <ShineBorder borderWidth={2} duration={16} shineColor={['#a3432a', '#c58a2c', '#f5e1d7']} />
      <div className="relative">
        <img
          src={withBase(offer.image)}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          alt={offer.imageAlt}
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-white shadow-soft">
          −{discount}%
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h3 font-medium">{offer.title}</h3>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Colore / variante: <span className="font-semibold text-ink">{offer.color}</span>
        </p>

        <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
          <span className="sr-only">Prezzo pieno</span>
          <s className="text-lg text-ink-muted decoration-accent/70">{euro(offer.oldPrice)}</s>
          <span className="sr-only">, prezzo scontato</span>
          <span className="font-display text-4xl font-semibold text-accent">
            {reduced ? (
              new Intl.NumberFormat('it-IT', { minimumFractionDigits: decimals }).format(offer.newPrice)
            ) : (
              <NumberTicker
                value={offer.oldPrice}
                startValue={offer.newPrice}
                direction="down"
                decimalPlaces={decimals}
                locale="it-IT"
                className="tracking-normal text-accent dark:text-accent"
              />
            )}
            &nbsp;€
          </span>
          {offer.unit && <span className="text-sm text-ink-muted">{offer.unit}</span>}
        </p>

        <div className="mt-6 rounded-xl bg-stone p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="clock" className="text-accent" />
            L’offerta termina tra
          </p>
          <Countdown endsAt={offer.endsAt} onExpire={onExpire} />
          <p className="mt-2 text-xs text-ink-muted">Valida fino al {endDate(offer.endsAt)} (ora italiana)</p>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-semibold text-bg transition-colors hover:bg-accent-strong"
        >
          <Icon name="whatsapp" />
          Chiedi questa offerta
          <span className="sr-only">(WhatsApp, si apre in una nuova scheda)</span>
        </a>
      </div>
    </article>
  );
}

const units = [
  ['giorni', 86400],
  ['ore', 3600],
  ['min', 60],
  ['sec', 1],
] as const;

/** Server and first client render show dashes (no hydration mismatch);
 *  boxes have fixed widths, so updating digits never shifts the layout. */
function Countdown({ endsAt, onExpire }: { endsAt: string; onExpire: () => void }) {
  const [now, setNow] = useState<number | null>(null);
  const end = offerEndTime(endsAt);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = now === null ? null : Math.max(0, Math.floor((end - now) / 1000));
  useEffect(() => {
    if (left === 0) onExpire();
  }, [left, onExpire]);

  let rest = left ?? 0;
  return (
    <dl className="mt-3 grid grid-cols-4 gap-2" aria-live="off">
      {units.map(([label, secs]) => {
        const value = Math.floor(rest / secs);
        rest -= value * secs;
        return (
          <div key={label} className="flex flex-col-reverse rounded-lg bg-surface px-1 py-2 text-center ring-1 ring-line">
            <dt className="mt-1 text-[0.6875rem] font-semibold tracking-wide text-ink-muted uppercase">{label}</dt>
            <dd className="font-display text-2xl leading-none font-semibold tabular-nums">
              {left === null ? '––' : String(value).padStart(2, '0')}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

import { contactLinks } from '@/data/site';
import { Icon } from './icons';

/** Always-visible call / WhatsApp buttons on phones. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <a
          href={contactLinks.tel}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-semibold text-bg"
        >
          <Icon name="phone" className="text-lg" />
          Chiama
        </a>
        <a
          href={contactLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white"
        >
          <Icon name="whatsapp" className="text-lg" />
          WhatsApp
          <span className="sr-only">(si apre in una nuova scheda)</span>
        </a>
      </div>
    </div>
  );
}

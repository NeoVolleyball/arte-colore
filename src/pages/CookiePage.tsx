import { business } from '../content/business';
import { withBase } from '../content/paths';
import { LegalPage, legalStyles as s } from './LegalPage';

/** Cookie policy. Keep it in step with what the site really loads (see CONTENT-CHECKLIST.md). */
export function CookiePage() {
  return (
    <LegalPage title="Cookie">
      <p>
        Questa pagina spiega quali cookie e tecnologie simili usa il sito di {business.brand}. In breve:{' '}
        <strong>il sito non usa cookie di profilazione né di statistica, e non mostra pubblicità.</strong>
      </p>

      <h2>Cosa usa il sito</h2>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">Cosa</th>
              <th scope="col">A cosa serve</th>
              <th scope="col">Durata</th>
              <th scope="col">Tipo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ac-intro</code> (memoria della sessione del browser)
              </td>
              <td>Ricorda che l’animazione iniziale è già stata mostrata, così non riparte a ogni pagina.</td>
              <td>Fino alla chiusura della scheda</td>
              <td>Tecnico, non è un cookie e non contiene dati personali</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        I caratteri (font) e le immagini del sito sono ospitati sul sito stesso: non vengono caricati da servizi di
        terzi.
      </p>

      <h2>Mappa di Google Maps</h2>
      <p>
        Nella sezione Contatti la mappa <strong>non viene caricata finché non premi “Mostra la mappa”</strong>. Quando la
        apri, il tuo browser si collega a Google, che può salvare propri cookie e raccogliere dati sull’uso della mappa,
        secondo le sue regole. Se non la apri, nessun dato viene inviato a Google. In alternativa, “Come arrivare” apre
        Google Maps in una nuova scheda, fuori dal nostro sito.
      </p>
      <p>
        Per saperne di più:{' '}
        <a href="https://policies.google.com/technologies/cookies?hl=it" target="_blank" rel="noopener noreferrer">
          informativa sui cookie di Google
        </a>
        .
      </p>

      <h2>Altri link</h2>
      <p>
        Il sito contiene un link alla nostra pagina Facebook. È un normale collegamento: Facebook non carica nulla sul
        sito e riceve dati solo se tu lo apri.
      </p>

      <h2>Come gestire o cancellare i cookie</h2>
      <p>
        Puoi bloccare o cancellare i cookie dalle impostazioni del tuo browser (Chrome, Safari, Firefox, Edge). Se
        blocchi quelli di Google, la mappa potrebbe non funzionare, ma il resto del sito funziona normalmente.
      </p>

      <h2>Contatti</h2>
      <p>
        Per domande su questa pagina scrivici a <a href={`mailto:${business.email}`}>{business.email}</a> o chiamaci al{' '}
        <a href={business.phone.href}>{business.phone.display}</a>. Trovi anche l’<a href={withBase('/privacy/')}>informativa privacy</a>.
      </p>
    </LegalPage>
  );
}

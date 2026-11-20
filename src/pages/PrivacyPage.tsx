import { business } from '../content/business';
import { withBase } from '../content/paths';
import { LegalPage } from './LegalPage';

/** Privacy notice (GDPR art. 13). Keep it in step with what the site really does. */
export function PrivacyPage() {
  const { address } = business;
  return (
    <LegalPage title="Privacy">
      <p>
        Questa informativa spiega come {business.legalName} tratta i dati di chi visita questo sito, ai sensi del
        Regolamento UE 2016/679 (GDPR). Il sito è una vetrina: non ha moduli, aree riservate, acquisti online né
        registrazione.
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        {business.legalName}
        <br />
        {address.street}, {address.postalCode} {address.city} ({address.province})
        <br />
        P. IVA {business.vatNumber}
        <br />
        Tel. <a href={business.phone.href}>{business.phone.display}</a> · E-mail{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a>
      </p>

      <h2>Quali dati trattiamo e perché</h2>
      <ul>
        <li>
          <strong>Dati di navigazione.</strong> Come ogni sito, il servizio che lo ospita registra in modo automatico
          alcuni dati tecnici (per esempio indirizzo IP, data e ora, pagina richiesta, tipo di browser) per far
          funzionare il sito e proteggerlo da abusi. Noi non li usiamo per identificarti. Base giuridica: legittimo
          interesse a garantire il funzionamento e la sicurezza del sito (art. 6.1.f).
        </li>
        <li>
          <strong>Dati che ci invii tu.</strong> Se ci scrivi un’e-mail o ci chiami, usiamo i dati che ci dai (nome,
          contatti, contenuto della richiesta) solo per risponderti, per esempio con un preventivo. Base giuridica: la
          tua richiesta e le misure precontrattuali o il contratto (art. 6.1.b).
        </li>
        <li>
          <strong>Mappa di Google Maps.</strong> Si carica solo se premi “Mostra la mappa”. In quel caso Google riceve
          alcuni dati dal tuo browser (per esempio l’indirizzo IP) e ne è titolare autonomo. Base giuridica: il tuo
          consenso, cioè il clic (art. 6.1.a). Vedi la <a href={withBase('/cookie/')}>pagina Cookie</a>.
        </li>
      </ul>
      <p>
        Il sito non usa strumenti di statistica né di pubblicità e non fa profilazione. Non prendiamo decisioni
        automatizzate sui dati.
      </p>

      <h2>A chi comunichiamo i dati</h2>
      <p>
        I dati possono essere trattati dal fornitore che ospita il sito e da Google (solo per la mappa, se la apri). Non
        vendiamo i dati e non li diamo ad altri per scopi di marketing. Alcuni fornitori possono trattare i dati anche
        fuori dallo Spazio economico europeo, con le garanzie previste dal GDPR (per esempio le clausole contrattuali
        standard).
      </p>

      <h2>Per quanto tempo</h2>
      <p>
        I dati di navigazione restano nei registri del fornitore per il tempo che esso stabilisce, di norma breve. Le
        richieste che ci invii le conserviamo per il tempo necessario a risponderti e a gestire il rapporto con te, poi
        le cancelliamo, salvo obblighi di legge (per esempio quelli contabili).
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiederci in ogni momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento,
        riceverli in un formato leggibile e opporti al trattamento. Dove la base è il consenso, puoi revocarlo quando
        vuoi, senza effetto sul passato. Scrivi a <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
      <p>
        Se pensi che i tuoi dati siano trattati in modo non corretto puoi fare reclamo al Garante per la protezione dei
        dati personali (
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
          garanteprivacy.it
        </a>
        ).
      </p>

      <h2>Modifiche</h2>
      <p>
        Se il sito cambia (per esempio se aggiungiamo un modulo di contatto o strumenti di statistica) aggiorneremo
        questa pagina e la data in alto.
      </p>
    </LegalPage>
  );
}

/** Product categories confirmed as the shop's core range. Copy describes
 *  typical uses only: no stock, prices or technical claims. */
export const products = [
  {
    id: 'pitture',
    name: 'Pitture',
    kicker: 'Pareti e soffitti',
    short: 'Per rinnovare pareti e soffitti e cambiare l’atmosfera di una stanza.',
    text: 'Pitture murali per dare nuova vita agli ambienti di casa, dalle stanze di tutti i giorni a quelle da reinventare. Il colore giusto parte da come vivi lo spazio e da come entra la luce.',
    uses: ['Rinfrescare le pareti di casa', 'Cambiare l’atmosfera di una stanza', 'Ritoccare soffitti e superfici murali'],
    alt: 'Illustrazione: due barattoli di pittura su fondo verde salvia, uno aperto con pittura chiara, accanto a un rullo.',
    tone: 'sage',
    code: '#879480',
  },
  {
    id: 'smalti',
    name: 'Smalti',
    kicker: 'Superfici e dettagli',
    short: 'Per porte, infissi, ringhiere e piccoli arredi: il colore nei dettagli.',
    text: 'Gli smalti portano il colore dove serve carattere: una porta, un infisso, una ringhiera, un mobile da recuperare. Piccoli interventi che cambiano lo sguardo su tutta la stanza.',
    uses: ['Rinnovare porte e infissi', 'Dare colore a ringhiere e cancelli', 'Ridare vita a piccoli arredi'],
    alt: 'Illustrazione: piccoli barattoli metallici su fondo terracotta, uno aperto con smalto verde bottiglia, e un pennello.',
    tone: 'terracotta',
    code: '#BE7156',
  },
  {
    id: 'decorazione',
    name: 'Prodotti per la decorazione',
    kicker: 'Strumenti e accessori',
    short: 'Tutto ciò che serve per preparare il lavoro e portarlo a termine.',
    text: 'Accessori per pitturare e decorare: dalla preparazione delle superfici alla stesura del colore, fino alle rifiniture. Gli strumenti giusti rendono il lavoro più semplice e il risultato più curato.',
    uses: ['Preparare le superfici', 'Stendere il colore con gli strumenti adatti', 'Rifinire bordi e dettagli'],
    alt: 'Illustrazione: un campione materico in intonaco, una spatola, un rullo e un ventaglio di cartelle colore su fondo ocra.',
    tone: 'ochre',
    code: '#C7A35D',
  },
] as const;

/** Illustrative colour concepts (digital renders, not customer projects). */
export const inspirations = [
  {
    id: 'living',
    title: 'Soggiorno in neutri caldi',
    text: 'Lino e calce costruiscono una base morbida: il legno e una nota d’ocra fanno il resto.',
    palette: ['lino-grezzo', 'calce-antica', 'ocra-veneziana'],
    alt: 'Interno illustrativo: soggiorno con pareti beige caldo, una nicchia ad arco, divano chiaro, tavolino rotondo in legno e lampada da terra in ottone.',
  },
  {
    id: 'studio',
    title: 'Studio color salvia',
    text: 'Un verde quieto dietro la scrivania aiuta la concentrazione e dialoga con il legno chiaro.',
    palette: ['salvia', 'verde-lichene', 'calce-antica'],
    alt: 'Interno illustrativo: angolo studio con parete verde salvia, scrivania in legno, mensole con libri, lampada da tavolo e una pianta.',
  },
  {
    id: 'terracotta',
    title: 'Accento terracotta',
    text: 'Un arco dipinto su una parete chiara crea un punto focale senza appesantire la stanza.',
    palette: ['terracotta', 'calce-antica', 'ocra-veneziana'],
    alt: 'Interno illustrativo: parete chiara con un grande arco dipinto color terracotta, panca in legno con cuscino ocra, vasi e una pianta d’ulivo.',
  },
] as const;

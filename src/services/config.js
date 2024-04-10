/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */


import { APP_TITLE_KEBAB_CASE } from "src/services/business_logic";

export const VERSION = "3.0";
export const RELEASES_NOTES_STORAGE_KEY = `${APP_TITLE_KEBAB_CASE}--last-version-seen`;
export const RELEASES_NOTES = [
  //   {
  //     version: VERSION,
  //     date: "2022-10-31",
  //     text: `
  // <strong>SEZIONE INFORMAZIONI - DATI STRUTTURA</strong>
  // <br/>
  // A partire dal 31 ottobre 2022 sarete tenuti obbligatoriamente ad inserire a sistema nella sezione INFORMAZIONI - DATI
  // STRUTTURA  i contatti della Direzione ovvero numero di telefono e mail. Se questi dati non saranno valorizzati non
  // riuscirete a procedere con la compilazione e il salvataggio della rilevazione settimanale del 7 novembre 2022.
  //
  // <br/>
  // <br/>
  // <strong>SEZIONE RILEVAZIONE - POSTI</strong>
  // <br/>
  // Il campo "occupati da DGR 23" ÃÂ¨ diventato "occupati da DGR 10". Ricordiamo che il valore da imputare ÃÂ¨ il totale degli
  // ospiti in struttura provenienti da percorsi protetti. Solo al termine dei 60 giorni previsti dalla DGR 10 , se l'ospite
  // permane in struttura  lo stesso dovrÃÂ  essere conteggiato nel campo "occupati convenzionati" o "occupati paganti in
  // proprio".
  // <br/>
  // <br/>
  //
  // Il campo "Posti Totali" ÃÂ¨ diventato "Posti Totali Occupabili". Ricordiamo che il valore da imputare ÃÂ¨ il numero totale
  // dei posti di cui dispone la struttura in quel momento complessivamente (ovvero il totale numero letti includendo quelli
  // occupati).
  //
  // <br/>
  // <br/>
  // <strong>SEZIONE RILEVAZIONI - PERSONALE</strong>
  // <br/>
  // Il campo Ã¢ÂÂAltroÃ¢ÂÂ ÃÂ¨ stato ripartito tra:
  // <ul>
  // <li>
  // Ã¢ÂÂAltro SanitarioÃ¢ÂÂ (si consideri: Medico, Fisioterapista, podologo, educatore etcÃ¢ÂÂ¦)
  // </li>
  // <li>
  // Ã¢ÂÂAltro non SanitarioÃ¢ÂÂ (si consideri: addetto mensa, personale amministrativo, manutentore, personale pulizie)
  // </li>
  // </ul>
  //
  // <br/>
  // <br/>
  // <strong>SEZIONE RILEVAZIONI - INGRESSO VISITATORI</strong>
  // <br/>
  // E' stato aggiornato il menÃÂ¹ a tendina per selezionare la tipologia di ingresso dei visitatori.`
  //   }

  //   {
  //     version: VERSION,
  //     date: "2023-01-12",
  //     text: `
  // <strong>Sezione Rilevazioni - sotto sezione Posti</strong>
  // <br/>
  // <ul>
  // <li>
  // i campi  <strong>Posti Totali Occupabili</strong> e  <strong>Posti Occupati da DGR 10</strong>  verranno lasciati vuoti invece di essere pre compilati e
  // modificabili. L'utente pertanto dovrÃÂ  compilarli di volta in volta. I campi non potranno essere lasciati vuoti
  // altrimenti la rilevazione non potrÃÂ  essere salvata.
  // </li>
  // <li>
  // ÃÂ¨ stato inserito un nuovo campo <strong>Totale dei Posti Occupabili da DGR10</strong> .   In questo campo la struttura dovrÃÂ  inserire la
  // somma dei posti liberi e di quelli occupati dedicati alla DGR10. Il campo non potrÃÂ  essere lasciato vuoto altrimenti la
  // rilevazione non potrÃÂ  essere salvata. Tutte le strutture che non hanno posti in DGR10 liberi o occupati inseriranno
  // <strong>zero</strong>.
  // </li>
  // </ul>
  //
  // <br/>
  // <br/>
  // <strong>Sezione Informazioni - sotto sezione Dati Struttura </strong>
  // <br/>
  // <ul>
  // <li>
  // il campo <strong>PEC</strong> ÃÂ¨ diventato un campo obbligatorio. Non essendo certi che tutte le strutture abbiano la PEC si chiede alla
  // struttura in caso di assenza PEC di ripetere l'indirizzo mail della struttura. Il campo non potrÃÂ  essere lasciato vuoto
  // altrimenti la rilevazione non potrÃÂ  essere salvata.
  // </li>
  // <li>
  // ÃÂ¨ stato inserito un nuovo campo <strong>DGR10</strong>. In questo campo l'utente dovrÃÂ  obbligatoriamente  inserire una spunta nel
  // quadratino se la struttura ÃÂ¨ stata autorizzata dalle ASL di competenza ad effettuare inserimenti in DGR10. Il campo
  // potrÃÂ  essere lasciato vuoto solo dalle strutture che NON rientrano negli elenchi di quelle che aderiscono agli
  // inserimenti da dimissioni protette.
  // </li>
  // </ul>
  // <br/>
  // <br/>
  // <strong>Sezione Informazioni - sotto sezione Direttore Struttura </strong>
  // <br/>
  // <ul>
  // <li>
  // i campi <strong>nome, telefono e mail</strong> sono diventati obbligatori. Non essendo certi che tutte le strutture abbiano un Direttore
  //  Struttura, in caso quest'ultimo sia assente ÃÂ¨ richiesto l'inserimento dei riferimenti del Responsabile o Coordinatore
  //  della stessa.  I campi non potranno essere lasciati vuoti altrimenti la rilevazione non potrÃÂ  essere salvata.
  // </li>
  // </ul>`
  //   },
  //   {
  //     version: VERSION,
  //     date: "2023-02-06",
  //     text: `
  // <strong>Sezione Informazioni - Dati Strutture</strong>
  // <br/>
  // <ul>
  // <li>
  // Per poter caricare i dati relativamente ai posti in DGR 10 ÃÂ¨ necessario che vi sia il flag (ovvero la spunta)ÃÂ  nel
  // quadratino con scritto DGR 10 nei dati della struttura. Se la spunta viene tolta non potrete caricare i dati
  // relativamente ai posti in DGR10. Per mettere e togliere la spunta dovete andare in MODIFICA (di fianco ai Contatti).
  // </li>
  //
  // </ul>
  //
  // <br/>
  // <br/>
  // <strong>Sezione Rilevazione - Posti</strong>
  // <br/>
  // <ul>
  // <li>
  // I campi posti totali occupati in DGR 10 e posti totali occupabili in DGR 10 sono stati suddivisi tra uomini e donne.
  // Ricordiamo che per posti totali occupabili in DGR10 si intendono il totale dei posti liberi in DGR10 e dei posti
  // occupati in DGR10.
  // <br/>
  // Ricordiamo che tutti i campi devono essere compilati per poter salvare la rilevazione.
  // </li>
  //
  // </ul>`
  //   },
  {
    version: VERSION,
    date: "2023-09-18",
    text: `
<strong>Rendicontazioni Buono ResidenzialitÃÂ </strong>
<br/>
<ul>
<li>
E' disponibile la nuova sezione dell'applicativo dedicata alla rendicontazione delle strutture aderenti al Buono Welfare ResidenzialitÃÂ .
</li>

</ul>

<br/>
<br/>

<strong>Rilevazioni</strong>
<br/>
<ul>
<li>
Alla luce della attuale situazione sanitaria regionale, sono stati ridotti e/o semplificati i campi da alimentare in 
riferimento ai parametri COVID in quasi tutte le sotto sezioni (Personale, Ospiti, Tamponi, Ingresso Visitatori)
</li>

</ul>

<br/>
<br/>
<strong>Rilevazioni - Tamponi</strong>
<br/>
<ul>
<li>

E' stata creata una unica sotto sezione tamponi dove andranno inseriti tutti i tamponi effettuati indipendentemente se 
molecolari o rapidi, in riferimento agli ospiti ed al personale.

</li>

</ul>
<br/>
<br/>
<strong>Rilevazioni - Posti</strong>
<br/>
<ul>
<li>

I posti saranno rilevati sulla base nel numero di posti occupati e liberi. <br/> Solamente per la categoria Anziani, la sotto 
sezione  ÃÂ¨ stata arricchita con l'inserimento delle principali tipologie di posti letto (letti di sollievo, dimissioni 
protette/ DGR 10, CAVS, lungodegenze, hospice). 
</li>

</ul>

<br/>
<br/>
<strong>Informazioni - Dati Struttura</strong>
<br/>
<ul>
<li>

Solo per la categoria Anziani, nella sotto sezione <strong>Dati Struttura</strong> l'utente dovrÃÂ  mettere il flag tramite la funzionalitÃÂ  
<strong>Modifica</strong> alle categorie di adesione posti letto applicabili alla propria struttura.  <br/>
In fase di inserimento della Rilevazione, all'utente compariranno solamente le tipologie posti letto per cui la 
struttura ÃÂ¨ abilitata, ovvero quelle per cui l'utente ha inserito il flag in <strong>Informazioni - Dati Struttura</strong>.
</li>

</ul>

`
  }
];

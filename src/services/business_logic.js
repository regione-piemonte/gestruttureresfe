/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */


import { date, uid } from 'quasar'

export const IS_DEV = process.env.APP_IS_DEV;
export const IS_TEST = process.env.APP_IS_TEST;
export const IS_PROD = process.env.APP_IS_PROD;
const { getDateDiff } = date

export const USCA_RQUEST_STATUSS = {
  DRAFT: 'B',
  PENDING: 'I',
  REFUSED: 'R',
  ACCEPTED: 'P',
  COMPLETED: 'E'
}

export const TIPO_PAZIENTE = {
  STUDENTE: 7
}

export const PREFIX = [
  { nome: 'Cipro', prefisso: '+357', label: '(+357) Cipro' },
  { nome: 'Colombia', prefisso: '+57', label: '(+57) Colombia' },
  { nome: 'Comore', prefisso: '+269', label: '(+269) Comore' },
  { nome: 'Cook', prefisso: '+682', label: '(+682) Cook' }
]

export const USCA_RQUEST_STATUSS_LABEL = {
  DRAFT: 'Bozza',
  PENDING: 'In Attesa',
  ACCEPTED: 'In carico',
  REFUSED: 'Rifiutata',
  COMPLETED: 'Evasa',
  [USCA_RQUEST_STATUSS.DRAFT]: 'Bozza',
  [USCA_RQUEST_STATUSS.PENDING]: 'In Attesa',
  [USCA_RQUEST_STATUSS.ACCEPTED]: 'In carico',
  [USCA_RQUEST_STATUSS.REFUSED]: 'Rifiutata',
  [USCA_RQUEST_STATUSS.COMPLETED]: 'Evasa'
}

export const SWAB_RESULT_STATUSS = {
  PENDING: 1,
  POSITIVE: 2,
  NEGATIVE: 4,
  SUSPENDED: 6,
  UNSUITABLE: 7,
  NOT_RECEIVED: 8,
  UNKNOWN: 9,
  DOUBT: 10
}

export const SWAB_RESULT_STATUSS_ALT = {
  POSITIVE: 'P',
  NEGATIVE: 'N',
  UNKNOWN: 'I',
  DOUBT: 'D'
}

export const SWAB_RESULT_STATUSS_LABEL = {
  PENDING: 'In corso',
  [SWAB_RESULT_STATUSS_ALT.POSITIVE]: 'Positivo',
  [SWAB_RESULT_STATUSS_ALT.NEGATIVE]: 'Negativo',
  SUSPENDED: 'Sospeso',
  UNSUITABLE: 'Non idoneo',
  NOT_RECEIVED: 'Non pervenuto',
  [SWAB_RESULT_STATUSS_ALT.UNKNOWN]: 'Indeterminato',
  [SWAB_RESULT_STATUSS_ALT.DOUBT]: 'Dubbio',
  [SWAB_RESULT_STATUSS.PENDING]: 'In corso',
  [SWAB_RESULT_STATUSS.POSITIVE]: 'Positivo',
  [SWAB_RESULT_STATUSS.NEGATIVE]: 'Negativo',
  [SWAB_RESULT_STATUSS.SUSPENDED]: 'Sospeso',
  [SWAB_RESULT_STATUSS.UNSUITABLE]: 'Non idoneo',
  [SWAB_RESULT_STATUSS.NOT_RECEIVED]: 'Non pervenuto',
  [SWAB_RESULT_STATUSS.UNKNOWN]: 'Indeterminato',
  [SWAB_RESULT_STATUSS.DOUBT]: 'Dubbio'
}

export const ICONS_LABELS = {}

export const TEST_TYPE_CODES = {
  SIEROLOGICO: 'SIEROLOGICO',
  TAMPONE: 'TAMPONE',
  TAMPONE_RAPIDO_A: 'TAMPONE_RAPIDO_A',
  TAMPONE_RAPIDO_B: 'TAMPONE_RAPIDO_B'
}

export const SWAB_TYPE_LABELS = {
  [TEST_TYPE_CODES.TAMPONE]: 'Tampone',
  [TEST_TYPE_CODES.TAMPONE_RAPIDO_A]: 'Tampone rapido tipo A',
  [TEST_TYPE_CODES.TAMPONE_RAPIDO_B]: 'Tampone rapido tipo B'
}

export const EVENT_TYPE_CODES = {
  HOME_ISOLATION: 1,
  HOSPITALIZED: 2,
  TRANSFERRED_INTERNAL: 3,
  TRANSFERRED_ETERNAL: 4,
  DEAD: 5,
  HEALED: 6,
  TEST_WAITING: 8,
  POST_HOSPITALIZATION: 9,
  HOME_ASSIGNMENT: 10,
  REPORTED: 11,
  IN_CHARGE: 12,
  LEAVED: 13,
  MORE_INFO: 14,
  ISOLATION: 15,
  HOME_ISOLATION_DISPOSED: 16,
  HOME_ASSIGNMENT_DISPOSED: 17,
  DEAD_NO_COVID: 18
}

export const PRESCRIPTION_TYPE_CODES = {
  DRUG: 'F',
  OXYGEN_THERAPY: 'O'
}

export const CONSENT_TYPE_CODES = {
  WRITTEN: 'S',
  ORAL: 'O'
}

export const DRUG_NAMES_OTHER = 'ALTRO'

// La dimensione massima dei file ÃÂ¨ di 20 MB

export const FILE_MAX_SIZE = 20 * 1024 * 1024

export const SUBJECT_TYPE = {
  ospite: 'OSPITE',
}

export const NO_SUBJECT_TYPE = {
  descTipoSoggetto: 'cittadino',
  idTipoSoggetto: 99
}

export const NO_ASL = {
  descAslEstesa: 'Extra regione',
  codAsl: 'EXTRA'
}

export const EXTRA_REGIONE = 'EXTRA-REGIONE'

export const NOTIFICATION_ACTION_CODES = {
  ACKNOWLEDGMENT: 'PRESA_VISIONE'
}

export const NOTIFICATION_EVENT_CODES = {
  POSITIVO: 'TAMPONE POSITIVO',
  QUARANTINE: 'ISOLAMENTO',
  AGGRAVATION: 'AGGRAVAMENTO',
  IMPROVEMENT: 'MIGLIORAMENTO',
  OTHER: 'ALTRO'
}

export const NOTIFICATION_PRIORITY_CODES = {
  HIGH: 'ALTA',
  MEDIUM: 'MEDIA',
  LOW: 'BASSA'
}

export const NOTIFICATION_TYPE_CODES = {
  INFO: 'INF',
  COMMUNICATION: 'COM',
  SCREENING: 'S'
}

export const NOTIFICATION_USER_TYPE_CODES = {
  MMG: 'MMG',
  SISP: 'SISP',
  USCA: 'USCA',
  SCREEN: 'SCREEN'
}

export const SUBJECT_SCHOOL_TEST_RESULT_CODES = {
  POSITIVE: 'P',
  NEGATIVE: 'N'
}

export const SUBJECT_SCHOOL_TEST_RESULT_LABEL = {
  [SUBJECT_SCHOOL_TEST_RESULT_CODES.POSITIVE]: 'Positivo',
  [SUBJECT_SCHOOL_TEST_RESULT_CODES.NEGATIVE]: 'Negativo'
}

export const logout = () => {
  const RUPAR = location.hostname.startsWith('int-')
    ? '/int-sdp-wrupsliv1wrup/Shibboleth.sso/Logout'
    : '/sdp-wrupsliv1wrup/Shibboleth.sso/Logout'
  const WEB = '/sdp-wrupsliv2wrup/Shibboleth.sso/Logout'
  let url = null

  if (location.hostname.includes('rupcovid')) url = RUPAR
  if (location.hostname.includes('webcovid')) url = WEB
  if (url) location.assign(url)
}

// Dal momento che le prescrizioni di tipo "Ossigeno terapia" in realtÃÂ  sono uniche
// bisogna raggrupparle per mostrarle come una sola prescrizione
export const normalizePrescriptions = prescriptions => {
  let result = []

  const drugList = prescriptions.filter(
    p => p.tipo?.codice === PRESCRIPTION_TYPE_CODES.DRUG
  )

  const oxygenTherapyList = prescriptions.filter(
    p => p.tipo?.codice === PRESCRIPTION_TYPE_CODES.OXYGEN_THERAPY
  )

  result = [...drugList]

  // Se c'ÃÂ¨ almeno un'ossigeno terapia la raggruppiamo per avere un'unica prescrizione
  if (oxygenTherapyList.length > 0) {
    result.push({
      tipo: oxygenTherapyList[0]?.tipo,
      _uuid: uid(),
      _items: oxygenTherapyList
    })
  }

  return result
}

export const NATION_CODE_ITALY = 'IT'

export const isNotificationSeen = notification => {
  return !!notification?.dataPresaVisione
}

export const isNotificationSeenWaiting = notification => {
  return (
    !isNotificationSeen(notification) &&
    notification?.codAzione === NOTIFICATION_ACTION_CODES.ACKNOWLEDGMENT
  )
}

export const isNotificationSeenRecent = notification => {
  const now = new Date()
  return (
    isNotificationSeen(notification) &&
    getDateDiff(now, notification?.dataPresaVisione) < 2
  )
}

export const EVENTS = {
  GO_TO: 'goTo',
  EXPAND_ITEM: 'expandItem',
  CONFIRM_DIALOG: 'confirmDialog',
  OPEN_DIALOG: 'openDialog',
  CLOSE_DIALOG: 'closeDialog',
  RELOAD_RELEVATIONS: 'reloadRelevations',
  EXPORT: 'export',
  // ADD
  ADD_RELEVATION: 'addRelevation',
  ADD_POSTI: 'addPosti',
  ADD_PERSONALE: 'addPersonale',
  ADD_TAMPONI: 'addTamponi',
  // ADD_RAPIDI: 'addRapidi',
  ADD_OSPITI: 'addOspiti',
  ADD_DECESSI: 'addDecessi',
  // COPY
  COPY_RELEVATION: 'copyRelevation',
  COPY_POSTI: 'copyPosti',
  COPY_PERSONALE: 'copyPersonale',
  COPY_TAMPONI: 'copyTamponi',
  //COPY_RAPIDI: 'copyRapidi',
  COPY_OSPITI: 'copyOspiti',
  COPY_DECESSI: 'copyDecessi',
  // DELETE
  DEL_RELEVATION: 'delRelevation',
  DEL_POSTI: 'delPosti',
  DEL_PERSONALE: 'delPersonale',
  DEL_TAMPONI: 'delTamponi',
  // DEL_RAPIDI: 'delRapidi',
  DEL_OSPITI: 'delOspiti',
  DEL_DECESSI: 'delDecessi',
  // EDIT
  EDIT_RELEVATION: 'editRelevation',
  EDIT_POSTI: 'editPosti',
  EDIT_PERSONALE: 'editPersonale',
  EDIT_TAMPONI: 'editTamponi',
  // EDIT_RAPIDI: 'editRapidi',
  EDIT_OSPITI: 'editOspiti',
  EDIT_DECESSI: 'editDecessi'
}

export const DIALOG_REFS = {
  POSTI: 'dialogPosti',
  PERSONALE: 'dialogPersonale',
  TAMPONI: 'dialogTamponi',
  // RAPIDI: 'dialogRapidi',
  OSPITI: 'dialogOspiti',
  DECESSI: 'dialogDecessi',
  VISITATORI: 'dialogVisitatori',
  INFO_STRUTTURA: 'dialogInfoStruttura',
  NUOVA_RILEVAZIONE: 'dialogNewRelevation'
}

export const RELEVATION_TYPES = [
  { cod: 'POSTI', desc: 'POSTI' },
  { cod: 'PERSONALE', desc: 'PERSONALE' },
  { cod: 'TAMPONI', desc: 'TAMPONI' },
  // { cod: 'TAMPONI_RAPIDI', desc: 'TAMPONI RAPIDI' },
  { cod: 'OSPITI', desc: 'OSPITI' },
  { cod: 'DECESSI', desc: 'DECESSI' },
  { cod: 'VISITATORI', desc: 'VISITATORI' }

]

export const RSA_ASL = 'RSA_ASL'
export const RSA = 'RSA'
export const RSA_RP = 'RSA RP'
export const GEST_ST_RES = 'GEST_ST_RES'
export const GEST_EROGATORI = 'GEST_EROGATORI'

export const PROFILI_VALIDI = [GEST_ST_RES, GEST_EROGATORI, RSA, RSA_RP, RSA_ASL]

export const PROFILI_EROGATORI = [GEST_EROGATORI];
export const PROFILI_RSA = [RSA, RSA_RP, RSA_ASL, GEST_ST_RES];
export const PROFILI_RILEVAZIONI = [RSA, RSA_RP, RSA_ASL];


export const PAGE_LINKS = [
  // {
  //   title: 'Test Rapidi Strutture Residenziali',
  //   icon: 'img:icons/test_strut.svg',
  //   link: '/strutture',
  //   profile: 'GEST_ST_RES'
  // },
  {
    title: 'Test Rapidi Erogatori - Auto Screening',
    icon: 'img:icons/test_erog.png',
    link: '/soggetti',
    submenu: [],
    provenienza: null,
    profiles: PROFILI_EROGATORI
  },
  {
    title: 'Strutture Residenziali',
    icon: 'img:icons/strut_res.svg',
    // link: '/gestione_rsa',
    link: '/gestione_rsa_servizi',
    submenu: [
      {
        title: 'Rilevazioni settimanali',
        link: '/gestione_rsa',
        provenienza: 'rilevazioni',
        profiles: [RSA, RSA_RP, RSA_ASL]
      },
      {
        title: 'Test Rapidi',
        link: '/strutture',
        provenienza: null,
        profiles: [GEST_ST_RES]
      },
      {
        title: 'Adesione Buono ResidenzialitÃÂ ',
        link: '/gestione_rsa',
        provenienza: 'adesioni',
        profiles: [RSA, RSA_RP, RSA_ASL]
      },
      {
        title: 'Rendicontazioni Buono ResidenzialitÃÂ ',
        link: '/gestione_rsa/buono',
        provenienza: 'buono',
        profiles: [RSA, RSA_RP, RSA_ASL]
      }],
    profiles: PROFILI_RSA
  }
]

export const TITLE_GEST_ST_RES = 'Strutture residenziali - Test Rapidi'
export const TITLE_GEST_EROGATORI = 'Test Rapidi Erogatori - Auto Screening'
export const TITLE_GEST_RSA = 'Strutture residenziali - Rilevazioni settimanali'
export const TITLE_GEST_ADESIONE = 'Strutture residenziali - Adesione Buono ResidenzialitÃÂ '
export const TITLE_GEST_BUONO = 'Rendicontazione Buono ResidenzialitÃÂ '
export const TITLE_GEST_STRUTTURA = 'Rendicontazione Buono ResidenzialitÃÂ '
export const TITLE_GEST_RSA_MENU = 'Strutture residenziali'


export const DELEGA = 'AR_DELEGA'

export const E_MAIL_GEST_ST_RES = 'assistenza_rsa_covid19@csi.it'
export const E_MAIL_EROGATORI = 'assistenza_erogatori_covid19@csi.it'

export const COMMUNICATION_LIST_HIDDEN_KEY_PREFIX = 'GESTRUTTURERES_COMMUNICATION_LIST_HIDDEN'
export const COMMUNICATION_LIST_INTERVAL = 60 * 10 * 1000

export const EMAIL_REGEX = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/
export const ONLY_NUMBER = /^[0-9]/
export const APP_TITLE_KEBAB_CASE = 'gestruttureres'

export const JRC_TO_EXCLUDE = {
  JRC0000: "0000",
};
export const SWAB_MODAL_TYPE = {
  SISP: "SISP",
  HOTSPOT: "HOTSPOT",
  FAST: "RAPIDO_ESITATO",
  SCHOOL: "SCUOLA_SENTINELLA",
  RSA: "RSA",
  DISPENSER: "EROGATORI"
};
export const SWAB_TYPE = {
  NORMAL: "TAMPONE",
  FAST: "TAMPONE_RAPIDO",
  SALIVAR: "TAMP_MOLECOLARE_SALIV"
};
export const SWAB_TYPE_NEW = {
  NORMAL: "TAMPONE",
  FAST: "TAMPONE_RAPIDO",
  SALIVAR: "TAMP_MOLECOLARE_SALIV",
};

export const ASSISTANCE_CODES = {
  GEST_ST_RES: 'strutrestestrapidi',
  GEST_EROGATORI: 'testrapidierog',
  GEST_RSA: 'strutresrilevazioni',
  GEST_ADESIONE: 'adesionestrutture',
  // GEST_BUONO: 'buonores',
  GEST_BUONO: 'rendicontazstrutture',
  // GEST_STRUTTURA: 'strutturares'
  GEST_STRUTTURA: 'rendicontazstrutture'
};

export const APP_CODE = {
  STRUTTURE: "COVIDRSA"
};

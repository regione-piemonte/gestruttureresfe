/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

import Vue from 'vue'
import axios from 'axios'
import { uid } from 'quasar'
// import MockAdapter from 'axios-mock-adapter'

Vue.prototype.$axios = axios

export const http = axios.create({
  baseURL: process.env.APP_API_BASE_URL.replaceAll('"', '')
})

export const httpPhp = axios.create({
  baseURL: process.env.APP_API_PHP_BASE_URL.replaceAll('"', '')
})

export const httpGestioneUtente = axios.create({
  baseURL: process.env.APP_API_GESTIONE_UTENTE_BASE_URL.replaceAll('"', '')
});

export const httpMmg = axios.create({
  baseURL: process.env.APP_API_MMG_BASE_URL.replaceAll('"', '')
});

export const httpMessages = axios.create({
  baseURL: process.env.APP_MSG_API_BASE_URL.replaceAll('"', '')
})

export const httpUsca = axios.create({
  baseURL: process.env.APP_USCA_API_BASE_URL.replaceAll('"', '')
})

// overrideIdentity(http)
addHeaders(http)
// overrideIdentity(httpPhp)
addHeaders(httpPhp)
// overrideIdentity(httpMessages)
addHeaders(httpMessages)
addHeaders(httpMmg)
addHeaders(httpGestioneUtente)

function addHeaders (http) {
  http.interceptors.request.use(cfg => {
    cfg.headers = cfg.headers || {}
    cfg.headers['X-Request-Id'] = uid()
    return cfg
  })
}

// eslint-disable-next-line no-unused-vars
function overrideIdentity (http) {
  http.interceptors.request.use(cfg => {
    cfg.params = cfg.params || {}
    cfg.params._shcf = 'AAAAAA00A11C000K'
    cfg.params._shc = 'Demo 22'
    cfg.params._shn = 'Csi Piemonte'

    cfg.headers = cfg.headers || {}
    cfg.headers['Shib-Identita-CodiceFiscale'] = 'AAAAAA00A11C000K'

    return cfg
  })
}

// MOCK-API

/*
var mock = new MockAdapter(http)

const DATI_BELLI_RILEVAZIONI = [
  {
    idRilevazione: 1,
    data: '01-10-2020',
    stato: {
      id: 1,
      codice: 'chiuso'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  },
  {
    idRilevazione: 2,
    data: '02-10-2020',
    stato: {
      id: 1,
      codice: 'chiuso'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  },
  {
    idRilevazione: 3,
    data: '03-10-2020',
    stato: {
      id: 1,
      codice: 'chiuso'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  },
  {
    idRilevazione: 4,
    data: '04-10-2020',
    stato: {
      id: 1,
      codice: 'chiuso'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  },
  {
    idRilevazione: 5,
    data: '05-10-2020',
    stato: {
      id: 1,
      codice: 'chiuso'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  },
  {
    idRilevazione: 6,
    data: '06-10-2020',
    stato: {
      id: 0,
      codice: 'aperto'
    },
    elencoCasi: [
      { ciao: 'ciao' }
    ]
  }
]

const RILEVAZIONE_BELLA = {
  idRilevazione: 6,
  data: '06-10-2020',
  stato: {
    id: 0,
    codice: 'aperto'
  },
  elencoCasi: [
    {
      idCaso: 1,
      codice: 'caso_covid_brutto',
      idRilevazione: 6,
      stato: {
        idStatoCaso: 0,
        codice: 'in corso'
      },
      istitutoScolastico: {
        idIstituto: 99,
        codiceIstituto: 'Scuola bella',
        denominazioneIstituto: 'Istituto Napoleone',
        indirizzoIstituto: 'Via Tal dei Tali, 98',
        comuneIstituto: 'Bitonto',
        provinciaIstituto: 'Bari',
        telIstituto: '080 8888 123',
        ordineIstituto: 'Scuola primaria'
      },
      classe: '4B',
      classeInIsolamento: true,
      tamponiEseguitiAlunni: 15,
      numAlunniIsolati: 14,
      esitiPositivi: 14,
      alunniInIsolamento: 13,
      alunniInQuarantena: 12,
      altriProvvedimenti: 'altri provvedim. lorem ipsum',
      motivazioneIsolamentoClasse: 'motivazione lorem ipsum',
      modalitaRilievo: 'mod. rilievo lorem ipsum',
      numCasiSecondari: 11,
      dataNotificaSisp: '07-10-2020',
      personaleIsolato: 6,
      tamponiEseguitiPersonale: 5,
      esitiPositiviPersonale: 4,
      personaleInIsolamento: 3,
      personaleInQuarantena: 2
    },
    {
      idCaso: 2,
      codice: 'caso_covid_brutto_2',
      idRilevazione: 6,
      stato: {
        idStatoCaso: 0,
        codice: 'in corso'
      },
      istitutoScolastico: {
        idIstituto: 99,
        codiceIstituto: 'Scuola bella',
        denominazioneIstituto: 'Istituto Napoleone',
        indirizzoIstituto: 'Via Tal dei Tali, 98',
        comuneIstituto: 'Bitonto',
        provinciaIstituto: 'Bari',
        telIstituto: '080 8888 123',
        ordineIstituto: 'Scuola primaria'
      },
      classe: '4B',
      classeInIsolamento: true,
      tamponiEseguitiAlunni: 15,
      numAlunniIsolati: 14,
      esitiPositivi: 14,
      alunniInIsolamento: 13,
      alunniInQuarantena: 12,
      altriProvvedimenti: 'altri provvedim. lorem ipsum',
      motivazioneIsolamentoClasse: 'motivazione lorem ipsum',
      modalitaRilievo: 'mod. rilievo lorem ipsum',
      numCasiSecondari: 11,
      dataNotificaSisp: '07-10-2020',
      personaleIsolato: 6,
      tamponiEseguitiPersonale: 5,
      esitiPositiviPersonale: 4,
      personaleInIsolamento: 3,
      personaleInQuarantena: 2
    }
  ]
}

mock.onGet('/rilevazioni', { params: { idEnte: 1 } }).reply(200, {
  rilevazioni: DATI_BELLI_RILEVAZIONI
})

mock.onGet('/currentUser').reply(200, {
  user: {
    cfUtente: 'BDAPPP95R07A662K',
    nome: 'MARIO',
    cognome: 'ROSSI',
    telefono: '0123456789',
    email: 'pippo@baudo.com',
    elencoProfili: [
      {
        idProfilo: 29,
        nomeProfilo: 'RIL_SCUOLA_ASL'
      }
    ]
  }
})

mock.onGet('/rilevazioni/6').reply(200, {
  rilevazione: RILEVAZIONE_BELLA
})
*/

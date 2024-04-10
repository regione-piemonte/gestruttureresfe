/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */



import Axios from "axios";
import {
  http,
  httpMessages,
  httpPhp,
  httpUsca,
  httpMmg,
  httpGestioneUtente
} from "boot/axios";
import { jsonToParamsString } from "./utils";
import { APP_CODE, IS_DEV, IS_TEST } from "src/services/business_logic";
import store from "../store";
import { TYPES } from "src/store";
import { openURL } from "quasar";
import { getUri } from "src/services/utils";

function paramsOperation() {
  let entity = store.getters[TYPES.GETTERS.USER]?.asr?.idEnte;
  let area = null;
  let structure = null;
  let profile = null;
  if (store.getters[TYPES.GETTERS.USER]?.elencoProfilo?.length > 0) {
    profile = store.getters[TYPES.GETTERS.USER]?.elencoProfilo[0].idProfilo;
  }
  if (store.getters[TYPES.GETTERS.SELECTED_PROFILE]) {
    profile = store.getters[TYPES.GETTERS.SELECTED_PROFILE].idProfilo;
  }

  if (store.getters[TYPES.GETTERS.SELECTED_STRUCTURE]) {
    entity = store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idEnte;
    structure = store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idStruttura;

    //SE PASSO DA RILEVAZIONI SETTIMANALI, ENTE SARÃÂ  NULL, QUINDI LO CALCOLO DIVERSAMENTE
    if (!entity) {
      entity = store.getters[TYPES.GETTERS.SELECTED_ENTITY].idEnte;
    }
    if (
      store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].elencoArea?.length > 0
    ) {
      area =
        store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].elencoArea[0].idArea;
    }
  }

  let paramsOperation = {
    webappOperazione: APP_CODE.STRUTTURE,
    idProfiloOperazione: profile,
    ruoloOperazione: store.getters[TYPES.GETTERS.USER]?.categoriaOpessan,
    utenteOperazione: store.getters[TYPES.GETTERS.USER]?.cfUtente,
    idEnteOperazione: entity,
    idStrutturaOperazione: structure,
    idAreaOperazione: null
  };
  return paramsOperation;
}

//GESTIONE PAZIENTI
//----------------------------------------------------------------------------------------------------------------------

export const getUserInfo = (params, httpConfig = {}) => {
  // if (IS_DEV || IS_TEST) {
  const url = `/api/currentUser`;
  return httpGestioneUtente.get(url, { params }, httpConfig);
  // } else {
  //   const url = `/api/currentUser`;
  //   return httpPhp.get(url, { params }, httpConfig);
  // }
};

// LISTA PREFISSI
export const getPrefixList = (httpConfig = {}) => {
  const url = "/api/decodifiche/prefissi-telefonici";
  return httpPhp.get(url, httpConfig);
};

export const getSubjectTypeList = (httpConfig = {}) => {
  const url = "/api/decodifiche/tiposoggetto";
  return httpPhp.get(url, httpConfig);
};

export const getAslList = (httpConfig = {}) => {
  const url = "/api/decodifiche/asl";
  return httpPhp.get(url, httpConfig);
};

export const getAsrList = (httpConfig = {}) => {
  const url = "/api/decodifiche/asr";
  return httpPhp.get(url, httpConfig);
};

export const getCityList = (httpConfig = {}) => {
  const url = "/api/decodifiche/comuni";
  return httpPhp.get(url, httpConfig);
};

export const getDocumentTypeList = (httpConfig = {}) => {
  const url = "/api/decodifiche/documento-tipo";
  return httpPhp.get(url, httpConfig);
};

export const getAuraAssistedListByTaxCode = (taxCode, httpConfig = {}) => {
  const url = `/api/aura/${taxCode}`;
  return httpPhp.get(url, httpConfig);
};

export const getAuraAssistedListByInfo = (
  lastName,
  firstName,
  birthDate,
  httpConfig = {}
) => {
  // eslint-disable-next-line no-undef
  const date = birthDate.split("-");
  const url = `/api/aura/${firstName}/${lastName}/${date[2]}/${date[1]}/${date[0]}`;
  return httpPhp.get(url, httpConfig);
};

export const getAuraAssistedDetail = (id, httpConfig = {}) => {
  const url = `/api/aura/find/${id}`;
  return httpPhp.get(url, httpConfig);
};

// Servizi che si collegano alle API esterne alle app di Alessandro
export const createSoggetto = (payload, httpConfig = {}) => {
  const url = "/api/soggetto";
  return httpPhp.post(url, payload, httpConfig);
};
export const getTestTipoList = (payload, httpConfig = {}) => {
  const url = "/api/decodifiche/test-tipo";
  return httpPhp.get(url, httpConfig);
};

export const getTestEsitoList = (payload, httpConfig = {}) => {
  const url = "/api/decodifiche/ristampone";
  return httpPhp.get(url, httpConfig);
};

export const getSubjectDetailGesPaz = (id, httpConfig = {}) => {
  let entity = store.getters[TYPES.GETTERS.USER]?.asr?.idEnte;
  let area = null;
  let structure = null;
  let profile = null;
  if (store.getters[TYPES.GETTERS.USER]?.elencoProfilo?.length > 0) {
    profile = store.getters[TYPES.GETTERS.USER]?.elencoProfilo[0].idProfilo;
  }
  if (store.getters[TYPES.GETTERS.SELECTED_PROFILE]) {
    profile = store.getters[TYPES.GETTERS.SELECTED_PROFILE].idProfilo;
  }

  if (store.getters[TYPES.GETTERS.SELECTED_STRUCTURE]) {
    entity = store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idEnte;
    structure = store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idStruttura;
    if (
      store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].elencoArea?.length > 0
    ) {
      area =
        store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].elencoArea[0].idArea;
    }
  }
  let params = {
    webappOperazione: APP_CODE.STRUTTURE,
    idProfiloOperazione: profile,
    ruoloOperazione: store.getters[TYPES.GETTERS.USER]?.categoriaOpessan,
    utenteOperazione: store.getters[TYPES.GETTERS.USER]?.cfUtente,
    idEnteOperazione: entity,
    idStrutturaOperazione: structure,
    idAreaOperazione: null
  };

  const url = `/api/soggetto/${id}`;
  return httpPhp.get(url, { params }, httpConfig);
};

export const updateSoggettoExternal = (payload, httpConfig = {}) => {
  const url = "/api/soggetto";
  return httpPhp.put(url, payload, httpConfig);
};

export const getElencoTestRapidiJrc = (params, httpConfig) => {
  const url = `/api/decodifiche/test-rapido-jrc`;
  return httpPhp.get(url, { params }, httpConfig);
};

// Servizio che si collega alle API esterne all'app
export const inserisciTamponeExternal = (
  payload,
  params = {},
  httpConfig = {}
) => {
  const url = "/api/tampone";
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  return httpPhp.post(url, payload, { params }, httpConfig);
};

export const getValidPhone = phone => {
  const url = `/api/decodifiche/valida-telefono/${phone}`;
  return httpPhp.get(url);
};

export const getValidPhoneInternational = phone => {
  const url = `/api/decodifiche/valida-telefono-internazionale/${phone}`;
  return httpPhp.get(url);
};

export const createEvent = (payload, httpConfig = {}) => {
  const url = "/api/decorso";
  return httpPhp.post(url, payload, httpConfig);
};

export const getEventTypeList = (httpConfig = {}) => {
  const url = "/api/decodifiche/tipoevento";
  return httpPhp.get(url, httpConfig);
};

export const getEventStructureAreaList = (structureId, httpConfig = {}) => {
  const url = `/api/postiletto/struttura/${structureId}/area`;
  return httpPhp.get(url, httpConfig);
};

export const getQuarantineStructureList = (httpConfig = {}) => {
  const url = "/api/postiletto/struttura/nonacuta";
  return httpPhp.get(url, httpConfig);
};

export const getStructureList = (params, httpConfig = {}) => {
  const url = `/api/postiletto/struttura`;
  return httpPhp.get(url, { params }, httpConfig);
};

export const getCovidTestTypesList = (params, httpConfig = {}) => {
  const url = `/api/decodifiche/testcovid`;
  return httpPhp.get(url, { params }, httpConfig);
};

export const getLaboratoryList = (params, httpConfig = {}) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/api/laboratorio`;
  return httpPhp.get(url, { params }, httpConfig);
};

export const getHotspotEffectiveAvailability = (
  id,
  params,
  httpConfig = {}
) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/api/hotspot/dispEffettiva/${id}`;
  return httpPhp.get(url, { params }, httpConfig);
};
export const getHotspotTypeList = (params, httpConfig = {}) => {
  const url = `/api/decodifiche/hotspot-tipo`;
  return httpPhp.get(url, { params }, httpConfig);
};
export const createFastSwabRequest = (payload, httpConfig = {}) => {
  const url = `/api/tampone-rapido/prenotazione`;
  return httpPhp.post(url, payload, httpConfig);
};
export const getCriteriaFullList = (params, httpConfig = {}) => {
  const url = `/api/decodifiche/criterio-epidemiologico-full`;
  return httpPhp.get(url, { params }, httpConfig);
};
export const getMotivazioneFullList = (params, httpConfig = {}) => {
  const url = `/decodifica/tipo-mov-ospite`;
  return http.get(url, { params }, httpConfig);
};
export const getHotspotEffectiveAvailabilityByType = (
  id,
  params,
  httpConfig = {}
) => {
  if (!params) {
    params = {};
  }
  const url = `/api/hotspot/disp/${id}`;
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  return httpPhp.get(url, { params }, httpConfig);
};
export const getActionCodeList = (params, httpConfig = {}) => {
  const url = `/api/decodifiche/azione`;
  return httpPhp.get(url, { params }, httpConfig);
};
export const deleteSwab = (id, httpConfig = {}) => {
  const url = `/api/tampone/${id}`;
  return httpPhp.delete(url, httpConfig);
};

//GESTRUTTURE
//----------------------------------------------------------------------------------------------------------------------

export const getSubjectList = (
  stiId,
  ruolo,
  httpConfig = {
    idStrutturaRes: stiId.toString(),
    codRuolo: ruolo
  },
  params = {}
) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/soggetti";
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);
};

export const systemSearchByCf = (
  cf,
  stiId,
  params = {},
  httpConfig = {
    idStrutturaRes: stiId
  }
) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  const url = `/soggetti/by-cf/${cf}`;
  return http.get(url, config);
};

export const systemSearchByInfo = (
  nome,
  cognome,
  dataDiNascita,
  stiId,
  params = {},
  httpConfig = {
    idStrutturaRes: stiId
  }
) => {
  const data = dataDiNascita.split("-");
  const dataVera = data[2] + "-" + data[1] + "-" + data[0];

  const url = `/soggetti/list-by-nome-cognome?nome=${nome}&cognome=${cognome}&dataNascita=${dataVera}`;
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);
};

export const associaSoggettoStruttura = (
  idSoggetto,
  stiId,
  flagOspite,
  payload,
  params = {},
  httpConfig = {
    idStrutturaRes: stiId,
    idSoggetto: idSoggetto,
    flgOspite: flagOspite
  }
) => {
  const url = "/soggetti/associa";
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

export const disassociaSoggettoStruttura = (
  idSoggetto,
  stiId,
  payload,
  params = {},
  httpConfig = {
    idStrutturaRes: stiId,
    idSoggetto: idSoggetto
  }
) => {
  const url = `/soggetti/elimina-assoc`;
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

export const updateSoggetto = (
  idSoggetto,
  idTipoSoggeto,
  params = {},
  httpConfig = {
    // headers: {
    idSoggetto: idSoggetto,
    idTipoSoggetto: idTipoSoggeto
    // }
  }
) => {
  const url = "/soggetti/aggiorna-tipo-sogg";
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);
};

export const getSerologicalTestList = (id, httpConfig) => {
  const url = `/test/test-referti/${id}`;
  return http.get(url, httpConfig);
};

export const inserisciTampone = (payload, httpConfig = {}) => {
  const url = "/test";
  return http.post(url, payload, httpConfig);
};

export const segnalaSisp = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/decorso";
  return http.post(url, payload, { params }, httpConfig);
};

// STRUTTURE
export const getStrutture = (
  currentRunningPromise,
  params,
  httpConfig = {}
) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/struttura-info`;

  if (currentRunningPromise) {
    httpConfig.cancelToken = new Axios.CancelToken(function executor(c) {
      currentRunningPromise.cancel = c;
    });
  }

  return http.get(url, { params }, httpConfig);
};

export const getStruttureCsv = (params, httpConfig = {}) => {
  const url = `/struttura-info/csv${jsonToParamsString(params)}`;

  return http.get(url, httpConfig);
};

export const getRilevazioniCsv = (params, httpConfig = {}) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/struttura-info/rilevazioni/csv`;

  return http.get(url, { params }, httpConfig);
};

export const getInfoStruttura = (id, params, httpConfig = {}) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/struttura-info/${id}`;

  return http.get(url, { params }, httpConfig);
};

export const aggiornaInfoStruttura = (
  payload,
  params = {},
  httpConfig = {}
) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-info";

  return http.put(url, payload, { params }, httpConfig);
};

// VALORI FILTRI
export const getTipiUtenza = (httpConfig = {}) => {
  const url = "/tipo-utenza";

  return http.get(url, httpConfig);
};

export const getEnti = (httpConfig = {}) => {
  const url = "/ente/asl";

  return http.get(url, httpConfig);
};

// DROPDOWN
export const getAssistenzaMedica = (httpConfig = {}) => {
  const url = "/assistenza-medica";

  return http.get(url, httpConfig);
};

export const getTipiStruttura = (httpConfig = {}) => {
  const url = "/struttura-categoria";

  return http.get(url, httpConfig);
};

export const getTipiPersonale = (httpConfig = {}) => {
  const url = "/rsa-personale-tipo";

  return http.get(url, httpConfig);
};

export const getTipiTampone = (httpConfig = {}) => {
  const url = "/rsa-tipo-tampone";

  return http.get(url, httpConfig);
};

export const getTamponeCategorie = (httpConfig = {}) => {
  const url = "/rsa-tampone-categoria";

  return http.get(url, httpConfig);
};

// NOTE
export const getStrutturaNote = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-struttura-note";

  return http.get(url, { params }, httpConfig);
};

export const getStrutturaNoteCsv = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-struttura-note/csv";

  return http.get(url, { params }, httpConfig);
};

export const cancellaStrutturaNote = (stnId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-struttura-note/cancella";

  return http.put(url, { stnId }, { params }, httpConfig);
};

export const aggiornaStrutturaNote = (
  payload,
  params = {},
  httpConfig = {}
) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-struttura-note";

  return http.put(url, payload, { params }, httpConfig);
};

export const inserisciStrutturaNote = (
  payload,
  params = {},
  httpConfig = {}
) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-struttura-note";

  return http.post(url, payload, { params }, httpConfig);
};

// RILEVAZIONE POSTI
export const inserisciPosti = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-posti";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaPosti = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-posti";

  return http.put(url, payload, { params }, httpConfig);
};

export const cancellaPosti = (postiId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-posti/cancella";

  return http.put(url, { postiId }, { params }, httpConfig);
};

// RILEVAZIONE POSTI
export const inserisciVisitatori = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-visitatori";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaVisitatori = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-visitatori";

  return http.put(url, payload, { params }, httpConfig);
};

export const getTipiVisitatori = httpConfig => {
  const url = "/rsa-visitatori-ingressi";

  return http.get(url, httpConfig);
};

// RILEVAZIONE PERSONALE
export const inserisciPersonale = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-personale";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaPersonale = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-personale";

  return http.put(url, payload, { params }, httpConfig);
};

export const cancellaPersonale = (persId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-personale/cancella";

  return http.put(url, { persId }, { params }, httpConfig);
};

// RILEVAZIONE TAMPONI
export const inserisciTamponi = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-tampone";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaTamponi = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-tampone";

  return http.put(url, payload, { params }, httpConfig);
};

export const cancellaTamponi = (tampId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-tampone/cancella";

  return http.put(url, { tampId }, { params }, httpConfig);
};

// RILEVAZIONE OSPITI
export const inserisciOspiti = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-ospiti";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaOspiti = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-ospiti";

  return http.put(url, payload, { params }, httpConfig);
};

export const cancellaOspiti = (covidId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-ospiti/cancella";

  return http.put(url, { covidId }, { params }, httpConfig);
};

// RILEVAZIONE DECESSI
export const inserisciDecessi = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-decessi";

  return http.post(url, payload, { params }, httpConfig);
};

export const modificaDecessi = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-decessi";

  return http.put(url, payload, { params }, httpConfig);
};

export const cancellaDecessi = (decId, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/rsa-decessi/cancella";

  return http.put(url, { decId }, { params }, httpConfig);
};

//MESSAGGI
//----------------------------------------------------------------------------------------------------------------------

export const getMessages = async (params, httpConfig = {}) => {
  const url = "/fe/messaggi?attive";
  return httpMessages.get(url, { params }, httpConfig);
};

//MMG
//----------------------------------------------------------------------------------------------------------------------

export const sendSms = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/visurammgweb/api/mmgvisura/tampone/notifica-sms`;
  return httpMmg.post(url, payload, { params }, httpConfig);
};
export const sendFastSwabSms = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/visurammgweb/api/mmgvisura/tampone-rapido/notifica-sms`;
  return httpMmg.post(url, payload, { params }, httpConfig);
};

//USCA
//----------------------------------------------------------------------------------------------------------------------
export const inviaNotifica = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/notifiche";
  return httpUsca.post(url, payload, { params }, httpConfig);
};

//EXCEL
//return `${baseUrl}/soggetti/report/xlsx?idStrutturaRes=${idStruttura}&cf=${codiceFiscale}&codRuolo=${GEST_EROGATORI}`

export const getSubjectExcel = (params, httpConfig = {}) => {
  if (!params) {
    params = {};
  }
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = getUri({
    url: `${http.defaults.baseURL}/soggetti/report/xlsx`,
    ...{ params },
    httpConfig
  });
  openURL(url);
};

export const createWelfareRequest = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare";
  return http.post(url, payload, { params }, httpConfig);
}

export const getWelfareRequest = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare";
  return http.get(url, { params }, httpConfig);
}

export const verificaStruttura = (partitaIva, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = `/verifica-impresa/${partitaIva}`;
  return http.get(url, { params }, httpConfig);
}

export const getWelfareFasce = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/decodifica/welfare-fascia";
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);
}

export const getStrutturaWelfareFasce = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare";
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);
}

export const getListFile = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare/file-tipo";
  return http.get(url, { params }, httpConfig);
}

export const verificaFirma = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare/verifica-firma";
  return http.post(url, payload, { params }, httpConfig);
}

export const downloadModulo = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = getUri({
    url: `${http.defaults.baseURL}/struttura-welfare/dichiarazione`,
    ...{ params },
    ...httpConfig
  });
  openURL(url);
}

export const createWelfareRequestForAllegato = (payload, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = "/struttura-welfare/files";
  return http.post(url, payload, { params }, httpConfig);
}

export const getStruttureByNatura = (natura, params = {}, httpConfig = {}) => {
  // if (IS_DEV || IS_TEST) {
  let operationParams = paramsOperation();

  Object.assign(params, operationParams);

  const url = `/api/struttura/nature`;
  let n = {
    natura: natura
  }
  Object.assign(httpConfig, n);

  let config = { params: params, headers: httpConfig };
  return httpGestioneUtente.get(url, config);
  // } else {
  //   const url = `/api/currentUser`;
  //   return httpPhp.get(url, { params }, httpConfig);
  // }
};

/*
 *  Ottengo i soggetti di una struttura
*/
export const getSoggettiRendicontazione = (pagination, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(operationParams, pagination);
  Object.assign(params, operationParams);

  const url = `/soggetti/rendicontazione`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Ottengo i conti di una struttura
*/
export const getContiStrutturaRendicontazione = (params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/struttura-conto`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Add/Update new conto to structure
*/
export const postContiStruttura = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/struttura-conto`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

/*
 *  Remove conto from structure
*/
export const postRemoveContiStruttura = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/struttura-conto/delete`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

/*
 *  Invalida conto from structure
*/
export const postInvalidaContiStruttura = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/struttura-conto/invalida`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

/*
 *  Ottengo le rendicontazioni effettuare per una struttura
*/
export const getRendicontazioniStruttura = (pagination, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(operationParams, pagination);
  Object.assign(params, operationParams);

  const url = `/rendicontazione`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Modifica di una rendicontazione di una struttura
*/
export const postRendicontazioniStruttura = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/rendicontazione`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

/*
 *  Elimino movimento ospite
*/
export const postRemoveMovimentoOspite = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/movimento-ospite/delete`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

/*
 *  Ottengo la lista delle condizioni dell'ospite
*/
export const getCondizioniOspite = (params = {}, httpConfig = {}) => {

  const url = `/decodifica/condizione-ospite`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Aggiungo un moviemnto all'ospite
*/
export const associaMovimentoOspite = (payload, params = {}, httpConfig = {}) => {
  const url = "/movimento-ospite";
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

/*
 *  Ottengo la lista degli stati della rendicontazione
*/
export const getStatiRendicontazione = (params = {}, httpConfig = {}) => {

  const url = `/decodifica/stato-rendicontazione`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Cambio stato rendicontazioni
*/
export const postStatiRendicontazione = (payload, params = {}, httpConfig = {}) => {
  const url = "/rendicontazione/stato";
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);
};

/*
 *  Ottengo il file dal fileId
*/
export const getFile = (id, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  Object.assign(params, operationParams);
  const url = getUri({
    url: `${httpUsca.defaults.baseURL}/documenti/${id}`,
    ...{ params },
    ...httpConfig
  });
  openURL(url);
}

/*
 *  Add file to BackEnd
*/
export const postFileRendicontazione = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/rendicontazione/file`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

/*
 *  Ottengo file generato dichiarazioneRSA
*/
export const getDichiarazioneRsa = (id, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = getUri({
    url: `${http.defaults.baseURL}/rendicontazione/dichiarazione/${id}`,
    ...{ params },
    ...httpConfig
  });
  openURL(url);

};

/*
 *  Esporto le rendicontazioni della struttura in formato CSV
*/
export const getRendicontazioniCsv = (pagination, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(operationParams, pagination);
  Object.assign(params, operationParams);

  const url = `/rendicontazione/csv`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Esporto le rendicontazioni della struttura in formato CSV
*/
export const getTestoDichiarazione = (idRendicontazione, params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(params, operationParams);

  const url = `/rendicontazione/presavisione/${idRendicontazione}`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Ottengo la lista delle richieste di tamponi rapidi
*/
export const getRichiesteTamponi = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(params, operationParams);

  const url = `/richiesta-tampone`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Ottengo l'ultima data possibile per modificare una richiesta
*/
export const getUltimaDataTamponi = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(params, operationParams);

  const url = `/richiesta-tampone/data-approvigionamento`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Ottengo numero delle persone in struttura
*/
export const getNumeroPersoneInStruttura = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(params, operationParams);

  const url = `/richiesta-tampone/persone`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Aggiungi/modifica richiesta approvvigionamento tamponi
*/
export const postRichiesteTamponi = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/richiesta-tampone`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

/*
 *  Elimina richiesta approvvigionamento tamponi
*/
export const postElimnaRichiesteTamponi = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/richiesta-tampone/delete`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

/*
 *  Ottengo mail in conti della struttura
*/
export const getEmailStruttura = (params = {}, httpConfig = {}) => {
  let operationParams = paramsOperation();
  operationParams.idStruttura = operationParams.idStrutturaOperazione;
  Object.assign(params, operationParams);

  const url = `/struttura-welfare/email`;
  let config = { params: params, headers: httpConfig };
  return http.get(url, config);

};

/*
 *  Elimina richiesta approvvigionamento tamponi
*/
export const postEmailStruttura = (payload, params = {}, httpConfig = {}) => {

  let operationParams = paramsOperation();
  Object.assign(params, operationParams);

  const url = `/struttura-welfare/email`;
  let config = { params: params, headers: httpConfig };
  return http.post(url, payload, config);

};

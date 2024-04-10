/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */


import Vue from 'vue'
import Vuex from 'vuex'
import {
  GEST_ST_RES,
  GEST_EROGATORI,
  COMMUNICATION_LIST_HIDDEN_KEY_PREFIX
} from 'src/services/business_logic'
import { LocalStorage } from 'quasar'
import { getMessages } from 'src/services/api'

Vue.use(Vuex)

const PROFILI_VALIDI = ['GEST_ST_RES', 'GEST_EROGATORI']

export const TYPES = {
  GETTERS: {
    USER: 'user',
    HAS_USER_CONTACTS: 'hasUserContacts',
    APP_TITLE: 'title',
    USER_TYPE: 'userType',
    COMMUNICATION_LIST_RILEVAZIONI: 'communicationListRilevazioni',
    COMMUNICATION_LIST_RAPIDI: 'communicationListRapidi',
    COMMUNICATION_LIST_RAPIDI_EROGATORI: 'communicationListRapidiErogatori',
    COMMUNICATION_LIST_HIDDEN_KEY: 'communicationListHiddenKey',
    SELECTED_STRUCTURE: 'selectedStructure',
    SELECTED_ENTITY: 'selectedEntity',
    ACTIVE_PROFILES: 'activeProfiles',
    SELECTED_PROFILE: 'selectedProfile',
  },
  ACTIONS: {
    SET_USER: 'setUser',
    LOAD_COMMUNICATION_LIST: 'loadCommunicationList',
    SET_COMMUNICATION_LIST_RILEVAZIONI: 'setCommunicationListRilevazioni',
    SET_COMMUNICATION_LIST_RAPIDI: 'setCommunicationListRapidi',
    SET_COMMUNICATION_LIST_RAPIDI_EROGATORI: 'setCommunicationListRapidiErogatori',
    HIDE_COMMUNICATION: 'hideCommunication',
    SET_SELECTED_STRUCTURE: 'setSelectedStructure',
    SET_SELECTED_ENTITY: 'setSelectedEntity',
    SET_ACTIVE_PROFILES: 'setActiveProfiles',
    SET_SELECTED_PROFILE:'setSelectedProfile',
  }
}
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      user: null,
      hasUserContacts: null,
      title: '',
      userType: '',
      communicationListRilevazioni: [],
      communicationListRapidi: [],
      communicationListRapidiErogatori: [],
      selectedStructure: null,
      selectedEntity: null,
      activeProfiles:[],
      selectedProfile: null, 
      provenienza: null,
      soggettoSelezionato: null,
      tabSelezionataBuono: null,
      // Rendicontazione
      conti: [],
      fasce: [],
      fileList: [],
      statiRendicontazione: [],
    },

    getters: {
      [TYPES.GETTERS.SELECTED_PROFILE]: state => {
        return state.selectedProfile
      },
      [TYPES.GETTERS.USER]: state => {
        return state.user
      },
      [TYPES.GETTERS.HAS_USER_CONTACTS]: state => {
        return state.user?.contatto?.telefono
      },
      [TYPES.GETTERS.APP_TITLE]: state => {
        const isGestStRes = state.user.elencoProfilo.filter(profilo => profilo.nomeProfilo === PROFILI_VALIDI[0])
        const isGestErogatori = state.user.elencoProfilo.filter(profilo => profilo.nomeProfilo === PROFILI_VALIDI[1])
        if (isGestStRes.length > 0 && isGestErogatori.length > 0) {
          return 'Test Rapidi Strutture Residenziali - Auto Screening'
        } else if (isGestStRes.length > 0) {
          return 'Test Rapidi Strutture Residenziali - Auto Screening'
        } else if (isGestErogatori.length > 0) {
          return 'Test Rapidi Erogatori - Auto Screening'
        }
      },
      [TYPES.GETTERS.USER_TYPE]: state => {
        const isGestStRes = state.user.elencoProfilo.filter(profilo => profilo.nomeProfilo === PROFILI_VALIDI[0])
        const isGestErogatori = state.user.elencoProfilo.filter(profilo => profilo.nomeProfilo === PROFILI_VALIDI[1])
        if (isGestStRes.length > 0 && isGestErogatori.length > 0) {
          return GEST_ST_RES
        } else if (isGestStRes.length > 0) {
          return GEST_ST_RES
        } else if (isGestErogatori.length > 0) {
          return GEST_EROGATORI
        }
      },
      [TYPES.GETTERS.COMMUNICATION_LIST_RILEVAZIONI]: (state, getters) => {
        const hiddenKey = getters[TYPES.GETTERS.COMMUNICATION_LIST_HIDDEN_KEY]
        const communicationListHidden = LocalStorage.getItem(hiddenKey) || []

        return state.communicationListRilevazioni.filter((communication) => {
          return !communicationListHidden.includes(communication.id)
        })
      },
      [TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI]: (state, getters) => {
        const hiddenKey = getters[TYPES.GETTERS.COMMUNICATION_LIST_HIDDEN_KEY]
        const communicationListHidden = LocalStorage.getItem(hiddenKey) || []

        return state.communicationListRapidi.filter((communication) => {
          return !communicationListHidden.includes(communication.id)
        })
      },
      [TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI_EROGATORI]: (state, getters) => {
        const hiddenKey = getters[TYPES.GETTERS.COMMUNICATION_LIST_HIDDEN_KEY]
        const communicationListHidden = LocalStorage.getItem(hiddenKey) || []

        return state.communicationListRapidiErogatori.filter((communication) => {
          return !communicationListHidden.includes(communication.id)
        })
      },
      [TYPES.GETTERS.COMMUNICATION_LIST_HIDDEN_KEY]: state => {
        const taxcode = state.user?.cfUtente ?? ''
        return `${COMMUNICATION_LIST_HIDDEN_KEY_PREFIX}-${taxcode}`
      },
      [TYPES.GETTERS.SELECTED_STRUCTURE]: state => {
        return state.selectedStructure
      },
      [TYPES.GETTERS.SELECTED_ENTITY]: state => {
        return state.selectedEntity
      },
      [TYPES.GETTERS.ACTIVE_PROFILES]: state => {
        return state.activeProfiles
      },
      getProvenienza: state => state.provenienza,
      getSoggettoSelezionato: state => state.soggettoSelezionato,
      getTabSelezionataBuono: state => state.tabSelezionataBuono,
      // Rendicontazione
      getListaContiStruttura: state => state.conti,
      getListaWelfareFasce: state => state.fasce,
      getFileList: state => state.fileList,
      getStatiRendicontazione: state => state.statiRendicontazione,
    },

    mutations: {
      SET_USER: (state, { user }) => {
        state.user = user
      },
      SET_COMMUNICATION_LIST_RILEVAZIONI: (state, { communicationListRilevazioni }) => {
        state.communicationListRilevazioni = communicationListRilevazioni
      },
      SET_COMMUNICATION_LIST_RAPIDI: (state, { communicationListRapidi }) => {
        state.communicationListRapidi = communicationListRapidi
      },
      SET_COMMUNICATION_LIST_RAPIDI_EROGATORI: (state, { communicationListRapidiErogatori }) => {
        state.communicationListRapidiErogatori = communicationListRapidiErogatori
      },
      SET_SELECTED_STRUCTURE: (state, { structure }) => {
        state.selectedStructure = structure
      },
      SET_SELECTED_ENTITY: (state, { entity }) => {
        state.selectedEntity = entity
      },
      SET_SELECTED_PROFILE: (state, { profile }) => {
        state.selectedProfile = profile
      },
      SET_ACTIVE_PROFILES:(state, activeProfiles) => {
        state.activeProfiles = activeProfiles
      },
      SET_PROVENIENZA: (state, { provenienza }) => (state.provenienza = provenienza),
      SET_SOGGETTO_SELEZIONATO: (state, { soggettoSelezionato }) => (state.soggettoSelezionato = soggettoSelezionato),
      SET_TAB_SELEZIONATA_BUONO: (state, { tabSelezionataBuono }) => (state.tabSelezionataBuono = tabSelezionataBuono),
      // Rendicontazione
      SET_LISTA_CONTI_STRUTTURA: (state, { conti }) => (state.conti = conti),
      SET_LISTA_WELFARE_FASCE: (state, { fasce }) => (state.fasce = fasce),
      SET_FILE_LIST: (state, { fileList }) => (state.fileList = fileList),
      SET_STATI_RENDICONTAZIONE: (state, { statiRendicontazione }) => (state.statiRendicontazione = statiRendicontazione),
    },

    actions: {
      [TYPES.ACTIONS.SET_USER]: (context, { user }) => {
        context.commit('SET_USER', { user })
      },

      [TYPES.ACTIONS.LOAD_COMMUNICATION_LIST]: async (context) => {
        try {
          let params = {
            applicazione: 'GESTIONE_STRUTTURE_RAPIDI_EROGATORI'
          }
          const { data } = await getMessages(params)
          context.commit('SET_COMMUNICATION_LIST_RAPIDI_EROGATORI', { communicationListRapidiErogatori: data })
        } catch (err) {
          console.error(err)
        }

        try {
          let params = {
            applicazione: 'GESTIONE_STRUTTURE_RILEVAZIONI'
          }
          const { data } = await getMessages(params)
          context.commit('SET_COMMUNICATION_LIST_RILEVAZIONI', { communicationListRilevazioni: data })
        } catch (err) {
          console.error(err)
        }

        try {
          let params = {
            applicazione: 'GESTIONE_STRUTTURE_RAPIDI'
          }
          const { data } = await getMessages(params)
          context.commit('SET_COMMUNICATION_LIST_RAPIDI', { communicationListRapidi: data })
        } catch (err) {
          console.error(err)
        }
      },
      [TYPES.ACTIONS.HIDE_COMMUNICATION]: (context, { id }) => {
        // Inserisco l'id del messaggio nella lista dei messaggi nascosti
        const hiddenKey = context.getters[TYPES.GETTERS.COMMUNICATION_LIST_HIDDEN_KEY]
        const communicationListHidden = LocalStorage.getItem(hiddenKey) || []
        communicationListHidden.push(id)
        LocalStorage.set(hiddenKey, communicationListHidden)

        // Forzo la reattivitÃÂ  dello store
        const communicationListRilevazioni = [...context.getters[TYPES.GETTERS.COMMUNICATION_LIST_RILEVAZIONI]]
        const communicationListRapidi = [...context.getters[TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI]]
        const communicationListRapidiErogatori = [...context.getters[TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI_EROGATORI]]
        context.commit('SET_COMMUNICATION_LIST_RILEVAZIONI', { communicationListRilevazioni: communicationListRilevazioni })
        context.commit('SET_COMMUNICATION_LIST_RAPIDI', { communicationListRapidi: communicationListRapidi })
        context.commit('SET_COMMUNICATION_LIST_RAPIDI_EROGATORI', { communicationListRapidiErogatori: communicationListRapidiErogatori })
      },
      [TYPES.ACTIONS.SET_SELECTED_STRUCTURE]: (context, { structure }) => {
        context.commit('SET_SELECTED_STRUCTURE', { structure })
      },
      [TYPES.ACTIONS.SET_SELECTED_ENTITY]: (context, { entity }) => {
        context.commit('SET_SELECTED_ENTITY', { entity })
      },
      [TYPES.ACTIONS.SET_SELECTED_PROFILE]: (context, { profile }) => {
        context.commit('SET_SELECTED_PROFILE', { profile })
      },
      [TYPES.ACTIONS.SET_ACTIVE_PROFILES]: (context,  activeProfiles ) => {
        context.commit('SET_ACTIVE_PROFILES',  activeProfiles )
      },
      setProvenienza: ({ commit }, { provenienza }) => commit("SET_PROVENIENZA", { provenienza }),
      setSoggettoSelezionato: ({ commit }, { soggettoSelezionato }) => commit("SET_SOGGETTO_SELEZIONATO", { soggettoSelezionato }),
      setTabSelezionataBuono: ({ commit }, { tabSelezionataBuono }) => commit("SET_TAB_SELEZIONATA_BUONO", { tabSelezionataBuono }),
      // Rendicontazione
      setListaContiStruttura: ({commit}, {conti}) => commit('SET_LISTA_CONTI_STRUTTURA', {conti}),
      setListaWelfareFasce: ({commit}, {fasce}) => commit('SET_LISTA_WELFARE_FASCE', {fasce}),
      setFileList: ({commit}, {fileList}) => commit('SET_FILE_LIST', {fileList}),
      setStatiRendicontazione: ({commit}, {statiRendicontazione}) => commit('SET_STATI_RENDICONTAZIONE', {statiRendicontazione}),
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

//   return Store
// }

export default Store

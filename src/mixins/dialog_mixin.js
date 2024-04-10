/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

import { EVENTS } from 'src/services/business_logic'
import { EventBus } from 'src/services/event_bus'
import { nextMonday } from 'src/services/utils'

export const dialogMixin = {
  props: {
    rilevazioneNome: { type: String },
    stiNome: { type: String },
    strTipoId: { type: Number },
    idStruttura: { type: String },
    loading: { type: Boolean },
    stiAdesioneDgr10: { type: Boolean },
    stiAbilitatoSollievo: { type: Boolean },
    stiAbilitatoDimProt: { type: Boolean },
    stiAbilitatoCavs: { type: Boolean },
    stiAbilitatoLungodeg: { type: Boolean },
    stiAbilitatoHospice: { type: Boolean },
    dropdowns: { type: Object },
    strCategoriaId: { type: Number },
    covid: { type: Boolean },
    tipiStrutturaFiltrati: {type: Array}
  },
  data () {
    return {
      open: false,
      editMode: false
    }
  },
  computed: {
    dialogTitle () {
      if (this.editMode) {
        return 'Modifica rilevazione'
      } else {
        return 'Nuova rilevazione'
      }
    },
    data () {
      return this.dataRilevazione ?? nextMonday()
    },
    tipiStruttura () {
      return this.dropdowns?.tipiStruttura
    },
    tipiStrutturaOptions () {
      return this.tipiStrutturaFiltrati
    },
    ruleRequired () {
      return v => (v !== null && v !== undefined && v !== '') || 'Campo obbligatorio'
    }
  },
  methods: {
    openDialog (editMode, payload) {
      this.open = true
      this.editMode = editMode

      this.prefillFormInputs(payload)
    },
    closeDialog () {
      this.open = false
      this.clearFormInputs()
    },
    confirmDialog (payload) {
      EventBus.$emit(EVENTS.CONFIRM_DIALOG, payload)
    }
  }
}

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico generic :open="open" @closeDialog="closeDialog" @confirmDialog="sendPayload">
    <template slot="head">
      <div class="text-h6" v-text="dialogTitle" />
    </template>

    <template slot="body">
      <q-form ref="form">
        <q-select
          v-model="idStruttura"
          @input="preselectTipoStruttura"
          outlined
          dense
          label="Struttura"
          :options="dropdowns.listaStrutture"
          option-label="stiNome"
          option-value="idStruttura"
          emit-value
          map-options
          :rules="[ruleRequired]" />

        <q-select
          v-model="strCategoriaId"
          label="Tipo Struttura"
          outlined
          dense
          :disable="tipoStrutturaDisabled"
          :options="dropdowns.listaCategorie"
          option-value="strCategoriaId"
          option-label="strCategoriaDesc"
          emit-value
          map-options
          :rules="[ruleRequired]" />

        <q-input
          v-model="dataRilevazione"
          label="Data"
          outlined
          dense
          type="date"
          :rules="[ruleRequired]" />

        <q-input
          v-model="stnNote"
          label="Nota"
          outlined
          dense
          type="textarea"
          :rules="[ruleRequired]" />
      </q-form>
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from 'src/mixins/dialog_mixin'
import DialogGenerico from './Rilevazioni/DialogGenerico.vue'
import { dateToString } from 'src/services/utils'
import { aggiornaStrutturaNote, inserisciStrutturaNote } from 'src/services/api'
export default {
  name: 'DialogNote',
  components: { DialogGenerico },

  mixins: [dialogMixin],
  props: {},
  data () {
    return {
      stnId: null,
      idStruttura: null,
      strCategoriaId: null,
      dataRilevazione: null,
      stnNote: ''
    }
  },
  watch: {},
  computed: {
    dialogTitle () {
      if (this.editMode) {
        return 'Modifica nota'
      } else {
        return 'Inserimento nota'
      }
    },
    strutSel () {
      return this.dropdowns?.listaStrutture?.find(strut => strut.idStruttura === this.idStruttura)
    },
    tipoStrutturaDisabled () {
      return !this.idStruttura || !!this.defTipoStruttura
    },
    defTipoStruttura () {
      return this.dropdowns?.listaCategorie?.find(categoria => this.strutSel?.strCategoriaId === categoria.strCategoriaId)?.strCategoriaId
    }
  },
  methods: {
    preselectTipoStruttura () {
      if (this.tipoStrutturaDisabled) {
        this.strCategoriaId = this.defTipoStruttura
      } else {
        this.strCategoriaId = null
      }
    },
    prefillFormInputs (payload) {
      if (payload) {
        this.stnId = payload.id
        this.idStruttura = payload.idStruttura
        this.strCategoriaId = payload.strCategoriaId
        this.dataRilevazione = dateToString(new Date(payload.dataRilevazione))
        this.stnNote = payload.stnNote
      } else {
        this.dataRilevazione = dateToString(new Date())
      }
    },
    clearFormInputs () {
      this.stnId = null
      this.idStruttura = null
      this.strCategoriaId = null
      this.dataRilevazione = null
      this.stnNote = ''
    },
    async sendPayload () {
      const isValid = await this.$refs.form.validate()

      if (isValid) {
        const payload = {
          stnId: this.stnId,
          idStruttura: this.idStruttura,
          strCategoriaId: this.strCategoriaId,
          dataRilevazione: this.dataRilevazione,
          stnNote: this.stnNote
        }

        const eventData = {
          payload: payload,
          func: this.editMode ? aggiornaStrutturaNote : inserisciStrutturaNote,
          callbackDialog: this.closeDialog
        }

        this.confirmDialog(eventData)
      }
    }
  }
}
</script>

<style>

</style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico :open="open" :strCategoriaIdToEdit="strCategoriaId" :tipiStruttura="tipiStruttura" :stiNome="stiNome" :data="data" :loading="loading" :strTipoId="strTipoId" @closeDialog="closeDialog" @confirmDialog="sendPayload($event)">
    <template slot="head">
        <div class="text-h6" v-text="`${dialogTitle} DECESSI`" />
    </template>

    <template slot="body">
      <q-form ref="form">
        <div class="text-h6 q-mt-xs">Deceduti ultima settimana</div>
        <div class="row q-mt-none">
          <q-input
            class="col-6 q-pr-sm q-pb-md"
            label-color="black"
            label="In struttura"
            v-model.number="decNumInStrutturaUltimaSettimana"
            type="number"
            :min="0"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="loading"
            :rules="[ruleRequired]" />

          <q-input
            class="col-6 q-pl-sm q-pb-md"
            label-color="black"
            label="Di cui con covid"
            v-model.number="decNumInStrutturaCovidUltimaSettimana"
            type="number"
            :min="0"
            :max="decNumInStrutturaUltimaSettimana"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="loading"
            :rules="[ruleRequired]" />

          <q-input
            class="col-6 q-pr-sm q-py-md"
            label-color="black"
            label="In ospedale"
            v-model.number="decNumInOspedaleUltimaSettimana"
            type="number"
            :min="0"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="loading"
            :rules="[ruleRequired]" />

          <q-input
            class="col-6 q-pl-sm q-py-sm"
            label-color="black"
            label="Di cui con covid"
            v-model.number="decNumInOspedaleCovidUltimaSettimana"
            type="number"
            :min="0"
            :max="decNumInOspedaleUltimaSettimana"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="loading"
            :rules="[ruleRequired]" />

          <q-input
            class="col-6 q-pr-sm q-pt-md"
            label-color="black"
            label="Totale deceduti"
            v-model.number="decNumUltimaSettimana"
            type="number"
            :min="0"
            dense
            outlined
            input-class="text-black text-bold"
            disable
            :rules="[ruleRequired]" />

          <q-input
            class="col-6 q-pl-sm q-pt-md"
            label-color="black"
            label="Di cui con covid"
            v-model.number="decNumCovidUltimaSettimana"
            type="number"
            dense
            outlined
            input-class="text-black text-bold"
            disable
            :rules="[ruleRequired]" />
        </div>
      </q-form>
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from 'src/mixins/dialog_mixin'
import DialogGenerico from './DialogGenerico.vue'
import { inserisciDecessi, modificaDecessi } from 'src/services/api'

export default {
  components: { DialogGenerico },
  name: 'DialogRilevazioni',
  mixins: [dialogMixin],
  data () {
    return {
      decId: null,
      decNumInStrutturaUltimaSettimana: 0,
      decNumInStrutturaCovidUltimaSettimana: 0,
      decNumInOspedaleUltimaSettimana: 0,
      decNumInOspedaleCovidUltimaSettimana: 0
    }
  },
    watch: {
        decNumInStrutturaUltimaSettimana: function (newVal, oldVal) {
            if (newVal < 0) {
                this.decNumInStrutturaUltimaSettimana = 0
            }
        },
        decNumInStrutturaCovidUltimaSettimana: function (newVal, oldVal) {
            if (newVal < 0) {
                this.decNumInStrutturaCovidUltimaSettimana = 0
            }
        },
        decNumInOspedaleUltimaSettimana: function (newVal, oldVal) {
            if (newVal < 0) {
                this.decNumInOspedaleUltimaSettimana = 0
            }
        },
        decNumInOspedaleCovidUltimaSettimana: function (newVal, oldVal) {
            if (newVal < 0) {
                this.decNumInOspedaleCovidUltimaSettimana = 0
            }
        },
    },
  computed: {
    decNumUltimaSettimana () {
      return this.decNumInStrutturaUltimaSettimana + this.decNumInOspedaleUltimaSettimana
    },
    decNumCovidUltimaSettimana () {
      return this.decNumInStrutturaCovidUltimaSettimana + this.decNumInOspedaleCovidUltimaSettimana
    }
  },
  methods: {
    prefillFormInputs (payload) {
      if (payload) {
        if (this.editMode) {
          this.decId = payload.id
          this.dataRilevazione = payload.dataRilevazione
        }

        this.strCategoriaId = payload.strCategoriaId
        this.decNumInStrutturaUltimaSettimana = payload.decNumInStrutturaUltimaSettimana
        this.decNumInStrutturaCovidUltimaSettimana = payload.decNumInStrutturaCovidUltimaSettimana
        this.decNumInOspedaleUltimaSettimana = payload.decNumInOspedaleUltimaSettimana
        this.decNumInOspedaleCovidUltimaSettimana = payload.decNumInOspedaleCovidUltimaSettimana
      }
    },
    clearFormInputs () {
      this.decId = null
      this.dataRilevazione = null
      this.strCategoriaId = null
      this.decNumInStrutturaUltimaSettimana = 0
      this.decNumInStrutturaCovidUltimaSettimana = 0
      this.decNumInOspedaleUltimaSettimana = 0
      this.decNumInOspedaleCovidUltimaSettimana = 0
    },
    async sendPayload ({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate()

      if (isValidForm) {
        const payload = {
          decId: this.decId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.data,
          strCategoriaId: strCategoriaId,
          decNumUltimaSettimana: this.decNumUltimaSettimana,
          decNumCovidUltimaSettimana: this.decNumCovidUltimaSettimana,
          decNumInStrutturaUltimaSettimana: this.decNumInStrutturaUltimaSettimana,
          decNumInStrutturaCovidUltimaSettimana: this.decNumInStrutturaCovidUltimaSettimana,
          decNumInOspedaleUltimaSettimana: this.decNumInOspedaleUltimaSettimana,
          decNumInOspedaleCovidUltimaSettimana: this.decNumInOspedaleCovidUltimaSettimana
        }

        const eventData = {
          payload: payload,
          func: this.editMode ? modificaDecessi : inserisciDecessi,
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

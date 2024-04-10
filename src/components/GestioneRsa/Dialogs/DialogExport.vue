<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico animated generic :open="open" @closeDialog="closeDialog" @confirmDialog="exportTable">
    <template slot="head">
      <div class="text-h6">Esportazione Rilevazioni</div>
    </template>

    <template slot="body">
      <q-form ref="form" class="row">
        <q-input class="col-12 q-py-md" dense outlined stack-label label="Da" v-model="dataRilevazioneDa" mask="##/##/####" :rules="[dateRule]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dataRilevazioneDa" mask="DD/MM/YYYY" :options="dateSelezionabili" @input="$refs.qDateProxy.hide()"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input class="col-12 q-py-md" dense outlined stack-label label="A" v-model="dataRilevazioneA" mask="##/##/####" :rules="[dateRule, dateARule]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dataRilevazioneA" mask="DD/MM/YYYY" :options="dateSelezionabili" @input="$refs.qDateProxy.hide()"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          v-if="selectStrutturaVisible"
          outlined
          dense
          v-model="idStruttura"
          disable
          use-input
          emit-value
          map-options
          clearable
          input-debounce="0"
          label="Struttura"
          :options="elencoStruttureFiltrato"
          option-value="idStruttura"
          option-label="stiNome"
          @filter="filterStrutture"
          class="col-12 q-py-md"
          behavior="menu" >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="tipo"
          :options="rilevazioni"
          label="Rilevazione"
          option-value="cod"
          option-label="desc"
          emit-value
          map-options
          class="col-12 q-py-md"
          dense
          outlined
          :rules="[ruleRequired]" />
      </q-form>
    </template>
  </dialog-generico>
</template>

<script>
import { EVENTS, RELEVATION_TYPES } from 'src/services/business_logic'
import DialogGenerico from './Rilevazioni/DialogGenerico.vue'
import { invertDate, isDateGreaterThanDate } from 'src/services/utils'
// import { dateToString, nextMonday } from 'src/services/utils'
export default {
  components: { DialogGenerico },
  name: 'DialogExport',
  data () {
    return {
      open: false,
      dataRilevazioneDa: null,
      dataRilevazioneA: null,
      idStruttura: null,
      tipo: null,
      elencoStrutture: [],
      elencoStruttureFiltrato: [],
      rilevazioni: RELEVATION_TYPES,
      selectStrutturaVisible: true
    }
  },
  created () {
  },
  computed: {
    ruleRequired () {
      return v => !!v || 'Campo obbligatorio'
    },
    dateRule () {
      return v => !v || (new Date(invertDate(v))).getDay() === 1 || 'Solo i lunedÃ¬ sono selezionabili!'
    },
    dateARule () {
      return v => !v || !this.dataRilevazioneDa || isDateGreaterThanDate(new Date(invertDate(v)), new Date(invertDate(this.dataRilevazioneDa))) || 'Range di date non valido'
    }
  },
  methods: {
    dateSelezionabili (date) {
      return (new Date(date)).getDay() === 1
    },
    async exportTable () {
      if (await this.$refs.form.validate()) {
        const dataDa = invertDate(this.dataRilevazioneDa.replaceAll('/', '-'))
        const dataA = invertDate(this.dataRilevazioneA.replaceAll('/', '-'))
        this.$emit(EVENTS.CONFIRM_DIALOG, { dataRilevazioneDa: dataDa, dataRilevazioneA: dataA, idStruttura: this.idStruttura, tipo: this.tipo })
      }
    },
    openDialog (elencoStrutture, idStruttura = null, tipo = null) {
      this.open = true
      this.prefillFields()
      this.elencoStrutture = elencoStrutture
      this.elencoStruttureFiltrato = elencoStrutture

      this.idStruttura = idStruttura
      this.tipo = tipo

      if (idStruttura === null && tipo === null) {
        this.selectStrutturaVisible = false
      } else {
        this.selectStrutturaVisible = true
      }
    },
    closeDialog () {
      this.open = false
    },
    prefillFields () {
      // const d = new Date(nextMonday())
      // d.setDate(d.getDate() - 7)
      // this.dataRilevazioneA = dateToString(d)
      // d.setDate(d.getDate() - 7)
      // this.dataRilevazioneDa = dateToString(d)

      this.dataRilevazioneDa = null
      this.dataRilevazioneA = null

      this.tipo = null
      this.idStruttura = null
    },
    filterStrutture (val, update) {
      if (val === '') {
        update(() => {
          this.elencoStruttureFiltrato = this.elencoStrutture
        })

        return
      }

      update(() => {
        this.elencoStruttureFiltrato = this.elencoStrutture.filter(struttura => struttura.stiNome.toLowerCase().includes(val.toLowerCase()))
      })
    }
  }
}
</script>

<style>

</style>

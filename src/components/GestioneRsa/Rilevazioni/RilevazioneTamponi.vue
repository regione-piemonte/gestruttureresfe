<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
  <rilevazione-generica
    idField="tampId"
    :columns="columns"
    :data="rilevazioni"
    :loading="loading"
    @addRelevation="newRelevation"
    @copyRelevation="copyRelevation($event)"
    @editRelevation="editRelevation($event)"
    @delRelevation="delRelevation($event)" />

  </div>
</template>

<script>
import { EVENTS, RELEVATION_TYPES } from 'src/services/business_logic'
import RilevazioneGenerica from './RilevazioneGenerica.vue'
import { EventBus } from 'src/services/event_bus'

const COLUMNS = [
  {
    name: 'dataRilevazione',
    field: 'dataRilevazione',
    label: 'Data Rilevazione',
    required: true,
    sortable: true,
    align: 'left'
  },
  {
    name: 'tipoStruttura',
    field: 'tipologiaStrutturaDesc',
    label: 'Tipo Struttura',
    required: true,
    sortable: true,
    align: 'left'
  },
  {
    name: 'categoria',
    field: 'categoriaTampDesc',
    label: 'Categoria',
    required: true,
    sortable: false,
    align: 'left'
  },
  {
    name: 'datiValidi',
    field: 'datiValidi',
    label: 'Dati Validi',
    required: true,
    sortable: false,
    align: 'left'
  }
]

export default {
  name: 'RilevazioneTamponi',
  components: { RilevazioneGenerica },
  props: {
    molecolare: { type: Boolean },
    rilevazioni: { type: Array },

  },
  data () {
    return {
      selezione: [],
      loading: false
    }
  },
  computed: {
    columns () {
      let fields = [
        { field: 'tampNumTotali', label: 'Totali', default: '0' },
        { field: 'tampNumPositivi', label: 'Positivi', default: '0' },
        { field: 'tampNumNegativi', label: 'Negativi', default: '0' },
        // { field: 'tampNumIndeterminati', label: 'Indeterminati', default: '0' },
      ]
      // if(this.molecolare){
      //   const anotherTampResults = [
      //
      //     { field: 'tampNumDubbi', label: 'Dubbi', default: '0' }
      //   ]
      //   fields =  [...fields, ...anotherTampResults]
      // }

      const resultCol = {
        name: 'risultati',
        label: 'Risultati',
        fields: fields,
        required: true,
        sortable: false,
        align: 'left'
      }

      // if (this.molecolare) {
      //   resultCol.fields = [...resultCol.fields, ...COLONNE_MOLECOLARI]
      // }

      return [...COLUMNS, resultCol]
    }
  },
  methods: {
    newRelevation () {
      this.$emit(EVENTS.ADD_RELEVATION)
    },
    copyRelevation (rilevazione) {
      this.$emit(EVENTS.COPY_RELEVATION, rilevazione)
    },
    editRelevation (rilevazione) {
      this.$emit(EVENTS.EDIT_RELEVATION, rilevazione)
    },
    delRelevation (selezione) {
      EventBus.$emit(EVENTS.DEL_RELEVATION, { relevationType: RELEVATION_TYPES.TAMPONI, id: selezione })
    }
  }
}
</script>

<style>

</style>

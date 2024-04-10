<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <rilevazione-generica
    idField="persId"
    :columns="columns"
    :data="rilevazioni"
    :loading="loading"
    @addRelevation="newRelevation"
    @copyRelevation="copyRelevation($event)"
    @editRelevation="editRelevation($event)"
    @delRelevation="delRelevation($event)" />
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
    name: 'tipoPersonale',
    field: 'persTipoDesc',
    label: 'Tipologia personale',
    maxWidth: '100px',
    required: true,
    sortable: true,
    align: 'left'
  },
  {
    name: 'datiValidi',
    field: 'datiValidi',
    label: 'Dati Validi',
    required: true,
    sortable: false,
    align: 'left'
  },
  {
    name: 'personale',
    label: 'Personale',
    fields: [
      // { field: 'persNumPiantaOrganica', label: 'In pianta organica', default: '0' },
      { field: 'persNumAttuali', label: 'Attuali', default: '0' },
      // { field: 'persNumNuoveAssunzioni', label: 'Nuove assunzioni ultima settimana', default: '0' }
    ],
    required: true,
    sortable: false,
    align: 'left'
  }
]

export default {
  name: 'RilevazionePersonale',
  components: { RilevazioneGenerica },
  props: {
    rilevazioni: { type: Array }
  },
  data () {
    return {
      columns: COLUMNS,
      selezione: [],
      loading: false
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
      EventBus.$emit(EVENTS.DEL_RELEVATION, { relevationType: RELEVATION_TYPES.PERSONALE, id: selezione })
    }
  }
}
</script>

<style>

</style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog class="col-12" v-model="show">
    <q-card class="full-width q-pa-md">
      <q-card-section class="row">
        <div class="text-h6">Seleziona un soggetto</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-table
        :columns="columns"
        :data="list"
        @row-click="onRowClick"/>
    </q-card>
  </q-dialog>
</template>

<script>
const COLUMNS = [
  {
    name: 'codiceFiscale',
    required: true,
    label: 'Codice fiscale',
    align: 'left',
    sortable: true,
    field: row => {
      return row.codiceFiscale || '-'
    }
  },
  {
    name: 'nome',
    required: true,
    label: 'Nominativo',
    align: 'left',
    field: row => {
      return row.cognome && row.nome ? `${row.cognome} ${row.nome}` : '-' // `${row.cognome} ${row.nome}`
    }
  },
  {
    name: 'residenza',
    required: true,
    label: 'Residenza',
    align: 'left',
    sortable: true,
    field: row => {
      return row.comuneResidenza ? row.comuneResidenza.nomeComune : '-'
    }
  },
  {
    name: 'aslDomicilio',
    required: true,
    label: 'ASL Domicilio',
    align: 'left',
    field: row => {
      return row.aslDomicilio
    }
  },
  {
    name: 'aslResidenza',
    required: true,
    label: 'ASL Residenza',
    align: 'left',
    field: row => {
      return row.aslResidenza
    }
  }
]

export default {
  name: 'GesStruttureResSelectSubject',
  data () {
    return {
      show: false,
      list: [],
      columns: COLUMNS
    }
  },
  methods: {
    setShow (bool) {
      this.show = bool
    },
    setList (list) {
      this.list = list
    },
    onRowClick (evt, row) {
      this.$emit('selectedSubject', row)
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>

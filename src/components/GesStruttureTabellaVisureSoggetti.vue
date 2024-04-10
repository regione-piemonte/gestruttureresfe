<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-table
    :columns="columns"
    :data="tableData"
    :pagination.sync="tablePagination"
    @row-click="onRowClick"
  >
    <!-- RICERCA -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template v-slot:top>
      <q-input
        filled
        dense
        debounce="300"
        v-model="searchValue"
        @input="search"
        placeholder="Cerca ..."
        class="full-width"
        autofocus
        hint="Puoi cercare per codice fiscale, cognome e nome soggetto, cognome e nome medico MMG o cittÃ  di domicilio"
      >
        <q-icon slot="append" name="search" />
      </q-input>
    </template>

    <template v-slot:body-cell-icons="props">
      <q-td :props="props">
        <mmg-subject-list-table-row-icons-soggetti :row="props.row" />
      </q-td>
    </template>

    <template v-slot:body-cell-domicilio="props">
      <q-td :props="props">
        <div class="text-weight-bold">
          <div>{{ props.row.indirizzodomicilio }}, {{ props.row.comuneDomicilioDesc }}</div>
          <div></div>
          <div>{{ props.row.aslDomicilio }}</div>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import MmgSubjectListTableRowIconsSoggetti from 'components/mmgComponents/MmgSubjectListTableRowIconsSoggetti'

export default {
  name: 'GesStruttureTabellaVisureSoggetti',
  components: {
    MmgSubjectListTableRowIconsSoggetti
  },
  props: ['columns', 'data'],
  data () {
    return {
      backDataFilter: null,
      searchValue: '',
      tableData: this.data,
      backData: null,
      // tablePageOptions: [10, 25, 50, 100, 500], // modo 1
      tablePagination: {
        rowsPerPage: 10,
        page: 1
        // sortBy: 'idRilevazione',
        // descending: false,
      } // modo 2
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$router.push('/visure_soggetti/dettaglio/' + row.idSoggetto + '/' + this.$route.params.id)
    },
    search () {
      if (this.backData === null && this.searchValue !== '') {
        this.backData = this.tableData
      } else if (this.searchValue === '' && this.backData !== null) {
        this.tableData = this.backData
        this.backData = null
        return
      }
      if (this.searchValue !== '') {
        this.tableData = []
        this.backData.forEach(item => {
          if (item.nome?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            item.codiceFiscale?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            item.cognome?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            item.comuneDomicilioDesc?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            item.medico?.nome?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            item.medico?.cognome?.toLowerCase().includes(this.searchValue.toLowerCase())
          ) {
            this.tableData.push(item)
          }
        })
      }
    },
    setData (data) {
      if (this.backData === null) {
        this.tableData = data
      } else {
        this.backData = data
        this.search()
      }
    }
  }
}
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <page-header no-title-bar :menuOpen="searchEnabled">
      <template slot="header">
        <q-btn
          @click="enableSearch"
          icon="search"
          size="10pt"
          class="q-mr-sm animated-item"
          :ripple="false"
          :outline="!searchEnabled"
          color="primary"
          round/>
      </template>

      <template slot="body">
        <!-- STRUTTURA -->
        <q-select
          v-model="search.struttura.selezione"
          :options="search.struttura.listaStrutture"
          label="Struttura"
          :class="inputClasses"
          dense
          filled />

        <!-- TIPO UTENZA -->
        <q-select
          v-model="search.tipoUtenza.selezione"
          :options="search.tipoUtenza.listaTipiUtenza"
          label="Tipo utenza"
          :class="inputClasses"
          dense
          filled />

        <!-- CATEGORIA -->
        <q-select
          v-model="search.categoria.selezione"
          :options="search.categoria.listaCategorie"
          label="Categoria"
          :class="inputClasses"
          dense
          filled />
      </template>
    </page-header>

    <loading-component :loading="loading">
      <q-table
        :columns="dataColumns"
        :data="associazioni.listaAssociazioni"
        class="q-mt-md"
        selection="multiple"
        :selected="associazioni.selezione"
        @selection="selectRows($event)" />
    </loading-component>
  </q-page>
</template>

<script>
import PageHeader from 'src/components/GestioneRsa/PageHeader.vue'
import Axios from 'axios'
import { selectFromArray } from 'src/services/utils'
import LoadingComponent from 'src/components/LoadingComponent.vue'

const COLUMNS = [
  {
    name: 'struttura',
    field: 'nomeStruttura',
    label: 'Struttura',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'tipoAssistenza',
    field: 'tipoAssistenza',
    label: 'Tipo Assistenza',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'postiAutorizzati',
    field: 'postiAutorizzati',
    label: 'Posti Autorizzati',
    required: true,
    sortable: true,
    align: 'right',
    headerClasses: 'text-bold'
  },
  {
    name: 'tipoUtenza',
    field: 'tipoUtenza',
    label: 'Tipo Utenza',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  }
]

export default {
  name: 'GestioneRsaAssStrutCat',
  components: { PageHeader, LoadingComponent },
  data () {
    return {
      loading: false,
      searchEnabled: false,
      dataColumns: COLUMNS,
      search: {
        struttura: {
          listaStrutture: [],
          selezione: null
        },
        tipoUtenza: {
          listaTipiUtenza: [],
          selezione: null
        },
        categoria: {
          listaCategorie: [],
          selezione: null
        }
      },
      associazioni: {
        listaAssociazioni: [],
        selezione: []
      },
      inputClasses: ['col-12', 'col-sm-4', 'col-md-4', 'q-pa-xs']
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    enableSearch () {
      this.searchEnabled = !this.searchEnabled
    },
    selectRows (detail) {
      this.associazioni.selezione = selectFromArray(this.associazioni.selezione, detail.rows, detail.added)
    },
    async loadData () {
      this.loading = true

      try {
        const { data: associazioni } = await Axios.get('http://localhost:3000/associazioni')

        this.associazioni.listaAssociazioni = associazioni
      } catch (e) {

      }

      this.loading = false
    }
  }
}
</script>

<style>

</style>

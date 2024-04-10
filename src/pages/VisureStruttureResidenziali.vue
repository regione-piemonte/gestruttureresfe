<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <h4 class="q-mt-sm q-mb-sm">{{ name }}</h4>
    <h6 class="q-mt-sm q-mb-sm">Ospiti e personale</h6>
    <div class="row items-center q-mt-sm q-pl-md q-pr-md q-col-gutter-md">
      <ges-strutture-page-title v-if="!$route.path.includes('struttura')" @back="$router.back()">
        Torna alla selezione della struttura
      </ges-strutture-page-title>
      <div class="col-auto q-ml-auto">
        <q-btn @click=excelUrl type="a" target="_blank" label="Scarica Excel" rel="noopener" outline color="primary">
          <q-tooltip>
            Il download si apre in una nuova scheda/finestra
          </q-tooltip>
        </q-btn>
      </div>

      <div class="col-auto" v-if="!internalError">
        <q-btn color="primary" @click="$router.push('/nuovo_soggetto/' + $route.params.id)">
          Nuovo ospite o personale
        </q-btn>
      </div>
    </div>
    <!-- FILTRI PER STATO RILEVAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mb-md row q-col-gutter-md">
      <div class="col-12">Filtra per stato rilevazione</div>

      <div>
        <!-- <mmg-filter-button
          @click="toggleSwapFilter"
          :active="swapFilter"
          class="q-mr-auto"
          color="grey-8">
          Tampone positivo
        </mmg-filter-button> -->

        <mmg-filter-button @click="setFilterTamponeMolecolare" :active="filterTamponeMolecolare" class="q-mr-auto q-ml-sm"
          color="grey-8">
          Tampone positivo
        </mmg-filter-button>

        <mmg-filter-button @click="setFilterDaCompletare" :active="filterDaCompletare" class="q-mr-auto q-ml-sm"
          color="grey-8">
          Da integrare
        </mmg-filter-button>

      </div>
    </div>

    <q-banner rounded class="bg-red-2" v-if="internalError">
      <div class="text-body1">
        Attenzione! <br />
        Si Ã¨ verificato un errore interno, se il problema persiste contattare l'assistenza
      </div>
    </q-banner>

    <ges-strutture-tabella-visure ref="table" :columns="columns" :data="data" :idStrutturaRes="$route.params.id"
      class="q-mt-md" />
  </q-page>
</template>

<script>
import { http } from 'src/boot/axios'
import { getSubjectList } from 'src/services/api' // getExcelFile

const API_PATH_EXCEL = '/soggetti/report/xlsx'
const COLUMNS = [
  {
    name: 'icons',
    required: true,
    label: '',
    align: 'left',
    sortable: false
  },
  {
    name: 'nome',
    required: true,
    label: 'Nominativo',
    align: 'left',
    field: row => {
      return row.cognome + ' ' + row.nome
    },
    sortable: true
  },
  {
    name: 'domicilio',
    label: 'Domicilio',
    align: 'left',
    field: row => {
      return row.comuneDomicilioDesc
    },
    sortable: true
  },
  {
    name: 'medico',
    label: 'Medico MMG',
    align: 'left',
    field: row => {
      let medico = 'N/A'
      if (row.medico !== null) {
        medico = row.medico.nome + ' ' + row.medico.cognome
      }
      return medico
    },
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'left',
    field: row => {
      return row.descTipoSogg || '-'
    },
    sortable: true
  },
  {
    name: 'desc-ultimo-decorso',
    label: 'Ultimo decorso',
    align: 'left',
    field: row => {
      return row.descTipoUltimoDecorso || '-'
    },
    sortable: true
  }/*,
  {
    name: 'azioni',
    required: true,
    label: 'Azioni',
    align: 'left',
    sortable: false
  } */
]

import GesStruttureTabellaVisure from 'components/GesStruttureTabellaVisure'
import GesStrutturePageTitle from 'components/GesStrutturePageTitle'
import MmgFilterButton from 'components/MmgFilterButton'
import { TYPES } from 'src/store'
import { GEST_ST_RES } from 'src/services/business_logic'
import { getSubjectExcel } from "../services/api";
export default {
  name: 'VisureStruttureResidenziali',
  components: { MmgFilterButton, GesStruttureTabellaVisure, GesStrutturePageTitle },
  data() {
    return {
      columns: COLUMNS,
      backData: null,
      data: [],
      name: '',
      swapFilter: false,
      filter: null,
      filterDaCompletare: false,
      filterTamponeMolecolare: false,
      internalError: false
    }
  },
  async created() {
    this.$root.$emit('titolo-res')
    try {
      const { data } = await getSubjectList(this.$route.params.id, GEST_ST_RES)
      const listaStrutture = this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE].elencoStrutturaArea
      listaStrutture.forEach(struttura => {
        if (struttura.idStruttura === this.$route.params.id) {
          this.name = struttura.nome
        }
      })
      this.data = data
      this.data.sort(function (a, b) {
        if (a.cognome > b.cognome) {
          return 1
        }
        if (a.cognome < b.cognome) {
          return -1
        }
        return 0
      })
      this.$refs.table.setData(this.data)
    } catch (err) {
      this.internalError = true
      console.log(err)
    }
  },
  computed: {

  },
  methods: {
    async excelUrl() {

      let params = {
        idStrutturaRes: this.$route.params.id ? this.$route.params.id : '',
        cf: this.$store.state.user.cfUtente,
        codRuolo: GEST_ST_RES
      }
      try {
        await getSubjectExcel(params)
      } catch (e) {

      }
    },
    toggleSwapFilter() {
      /* console.log('toggleSwapFilter')
      this.swapFilter = !this.swapFilter
      if (this.swapFilter) {
        this.backData = this.data
        this.data = []
        this.backData.forEach(item => {
          if (item.ultimoTestPositivo) {
            this.data.push(item)
          }
        })
        this.$refs.table.setData(this.data)
      } else {
        this.data = this.backData
        this.backData = null
        this.$refs.table.setData(this.data)
      } */
      this.swapFilter = !this.swapFilter
      this.applicaFiltri()
    },
    setFilterDaCompletare() {
      this.filterDaCompletare = !this.filterDaCompletare
      this.applicaFiltri()
      // if (this.filterDaCompletare) {} else {}
    },
    setFilterTamponeMolecolare() {
      this.filterTamponeMolecolare = !this.filterTamponeMolecolare
      this.applicaFiltri()
      // if (this.filterDaCompletare) {} else {}
    },
    applicaFiltri() {
      if (this.filterDaCompletare || this.filterTamponeMolecolare) {
        if (this.backData !== null) {
          this.data = []
        } else {
          this.backData = this.data
          this.data = []
        }
        this.backData.forEach(item => {
          if ((item.idTipoUltimoDecorso === 14 && this.filterDaCompletare) || (this.filterTamponeMolecolare && (item.ultimoTestPositivo || item.ultimoTamponeMolecolarePositivo))) {
            this.data.push(item)
          }
        })
        this.$refs.table.setData(this.data)
      } else {
        this.data = this.backData
        this.backData = null
        this.$refs.table.setData(this.data)
      }
    }
  }
}
</script>

<style scoped></style>

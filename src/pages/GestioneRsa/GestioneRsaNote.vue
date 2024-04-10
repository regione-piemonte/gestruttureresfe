<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <page-header no-title-bar>
      <template slot="header">
        <!-- PULSANTE AGGIUNGI -->
        <q-btn
          @click="addNote"
          label="AGGIUNGI"
          icon="add"
          color="primary"
          size="10pt"
          class="q-mr-sm"
          rounded />

        <!-- PULSANTE ESPORTA -->
        <q-btn
          @click="exportTable"
          label="ESPORTA"
          icon="file_download"
          rounded
          size="10pt"
          color="red" />
      </template>
    </page-header>

    <loading-component :loading="loading">
      <q-table
        v-if="!loading"
        key="table"
        :columns="tableColumns"
        :data="note.listaNote">
        <template v-slot:body-cell-actions="props">
          <td key="actions" style="padding-left: 4px; padding-right: 4px">
            <div class="row q-gutter-md items-center justify-center">
              <q-btn
                @click="editNote(props.row)"
                icon="edit"
                dense
                size="sm"
                round
                flat>
                <q-tooltip>Modifica</q-tooltip>
              </q-btn>

              <q-btn
                @click="deleteNote(props.row.id)"
                icon="delete"
                dense
                size="sm"
                round
                flat>
                <q-tooltip>Cancella</q-tooltip>
              </q-btn>
            </div>
          </td>
        </template>

        <template v-slot:body-cell-dataNota="props">
          <td>
            {{dateToString(props.row.dataRilevazione)}}
          </td>
        </template>
      </q-table>
    </loading-component>

    <dialog-note ref="dialogNote" v-bind="dialog" />
    <dialog-conferma-eliminazione ref="dialogConfermaEliminazione" />
  </q-page>
</template>

<script>
import PageHeader from 'src/components/GestioneRsa/PageHeader.vue'
import { dateToString, downloadCsv, notifyError, notifySuccess, selectFromArray, sortBy } from 'src/services/utils'
import LoadingComponent from 'src/components/LoadingComponent.vue'
import { cancellaStrutturaNote, getStrutturaNote, getStrutturaNoteCsv, getTipiStruttura } from 'src/services/api'
import DialogNote from 'src/components/GestioneRsa/Dialogs/DialogNote.vue'
import { TYPES } from 'src/store'
import { EventBus } from 'src/services/event_bus'
import { EVENTS, RSA_RP } from 'src/services/business_logic'
import DialogConfermaEliminazione from 'src/components/GestioneRsa/Dialogs/Rilevazioni/DialogConfermaEliminazione.vue'

const COLUMNS = [
  {
    name: 'actions',
    label: 'Azioni',
    align: 'center'
  },
  {
    name: 'dataNota',
    label: 'Data Nota',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'struttura',
    field: 'nomeStruttura',
    label: 'Struttura',
    required: true,
    sortable: false,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'tipoStruttura',
    field: 'tipologiaStrutturaDesc',
    label: 'Tipo Struttura',
    required: true,
    sortable: true,
    align: 'left',
    headerClasses: 'text-bold'
  },
  {
    name: 'nota',
    field: 'stnNote',
    label: 'Nota',
    required: true,
    sortable: false,
    align: 'left',
    headerClasses: 'text-bold'
  }
]

export default {
  components: { PageHeader, LoadingComponent, DialogNote, DialogConfermaEliminazione },
  name: 'GestioneRsaNote',
  data () {
    return {
      tableColumns: COLUMNS,
      note: {
        listaNote: [],
        selezione: []
      },
      dialog: {
        loading: false,
        dropdowns: {
          listaStrutture: [],
          listaCategorie: []
        }
      },
      loading: false
    }
  },
  created () {
    this.isAuthorized()
    this.loadNote()
    this.initDropdowns()
    this.setupDialogEvents()
  },
  destroyed () {
    EventBus.$off(EVENTS.CONFIRM_DIALOG)
  },
  computed: {
    deleteDisabled () {
      return !this.note.selezione.length
    },
    currentUser () {
      return this.$store.getters[TYPES.GETTERS.USER]
    }
  },
  methods: {
    isAuthorized (link) {
      const roles = this.currentUser?.elencoProfilo

      if (roles.some(role => role.nomeProfilo === RSA_RP)) {
        this.$router.replace('/gestione_rsa')
      }
    },
    setupDialogEvents () {
      EventBus.$on(EVENTS.CONFIRM_DIALOG, ({ payload, func, callbackDialog }) => this.confirmDialog(payload, func, callbackDialog))

      EventBus.$on(EVENTS.DEL_RELEVATION)
    },
    addNote () {
      this.$refs.dialogNote.openDialog()
    },
    editNote (payload) {
      this.$refs.dialogNote.openDialog(true, payload)
    },
    deleteNote (stnId) {
      this.$refs.dialogConfermaEliminazione.openDialog(() => this.delNote(stnId))
    },
    async exportTable () {
      try {
        const { data: csv } = await getStrutturaNoteCsv()

        downloadCsv(csv, 'export_note.csv')
      } catch (e) {
        console.log(e)
        notifyError(1, 'Errore nel download')
      }
    },
    dateToString (date) {
      return dateToString(new Date(date))
    },
    selectRows (detail) {
      this.note.selezione = selectFromArray(this.note.selezione, detail.rows, detail.added)
    },
    async confirmDialog (payload, func, callbackDialog) {
      this.dialog.loading = true

      try {
        await func(payload)
        callbackDialog()
        this.loadNote()
        notifySuccess('Inserimento avvenuto con successo')
      } catch (e) {
        console.log(e)
        notifyError(e, e.message)
      }
    },
    async delNote (stnId) {
      try {
        await cancellaStrutturaNote(stnId)
        this.loadNote()
        this.$refs.dialogConfermaEliminazione.closeDialog()
        notifySuccess('Cancellazione avvenuta con successo')
      } catch (e) {
        console.log(e)
        notifyError(e, e.message)
      }
    },
    async loadNote () {
      this.loading = true

      try {
        const { data: note } = await getStrutturaNote()

        note.forEach(nota => {
          nota.id = nota.stnId
          delete nota.stnId
        })

        this.note.listaNote = sortBy(note, 'dataCreazione', true, true)
      } catch (e) {
        console.log(e)
      }

      this.loading = false
    },
    async initDropdowns () {
      this.dialog.dropdowns.listaStrutture = this.currentUser?.elencoRsa

      try {
        const { data: listaCategorie } = await getTipiStruttura()

        this.dialog.dropdowns.listaCategorie = listaCategorie
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>

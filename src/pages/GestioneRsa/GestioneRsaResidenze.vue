<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <!-- LISTA MESSAGGI -->
    <template v-if="!!communicationList.length">
      <communication-list-item
        v-for="communication in communicationList"
        :key="communication.id"
        :communication="communication"
        class="q-mb-lg q-mt-md"
      />
    </template>
    <!-- HEADER PAGINA -->
    <page-header :menuOpen="searchEnabled" no-title-bar is-root>
      <template slot="header">
        <div class="row full-width q-col-gutter-md justify-end ">
          <template v-if="getProvenienza !== 'rilevazioni'">
            <div class="  col-md-auto col-12 text-bold text-h6 text-right">
              <q-btn class="full-width" @click="showAttoNomina" color="primary">
                SCARICA ATTESTATO DI NOMINA
              </q-btn>
            </div>
            <div class=" col-md-auto col-12 text-bold text-h6 text-right ">
              <q-btn class="full-width" @click="showDelega" color="primary">
                SCARICA MODULO DI DELEGA
              </q-btn>
            </div>
          </template>

          <!-- PULSANTE RICERCA -->
          <div class="col-md-auto col-12">
            <q-btn
              @click="enableSearch"
              icon="search"
              size="10pt"
              class="q-mr-sm animated-item full-width"
              :ripple="false"
              :outline="!searchEnabled"
              color="primary"
            />
          </div>

          <!-- PULSANTE ESPORTA -->
          <div class="col-md-auto col-12">
            <q-btn
              @click="openExportDialog()"
              label="ESPORTA"
              icon="file_download"
              class="q-ml-sm full-width"
              size="10pt"
              color="red"
              v-if="getProvenienza == 'rilevazioni'"
            />
          </div>
        </div>
      </template>

      <template slot="body">
        <!-- ID STRUTTURA -->
        <q-input
          :class="inputClasses"
          style="height: 48px"
          dense
          clearable
          label="ID Struttura"
          v-model="search.idStruttura"
          filled
        />

        <!-- ENTE -->
        <q-select
          v-if="!isAsl"
          :class="inputClasses"
          style="height: 48px"
          dense
          clearable
          label="Ente"
          v-model="search.ente"
          :options="listaEnti"
          option-label="nome"
          option-value="idEnte"
          emit-value
          map-options
          filled
        />

        <!-- CATEGORIA STRUTTURA -->
        <q-select
          :class="inputClasses"
          style="height: 48px"
          dense
          clearable
          label="Categoria struttura"
          v-model="search.tipoStruttura"
          :options="currentDialog.dropdowns.tipiStruttura"
          option-label="strCategoriaDesc"
          option-value="strCategoriaId"
          emit-value
          map-options
          filled
        />

        <!-- TIPO UTENZA -->
        <q-select
          :class="inputClasses"
          style="height: 48px"
          dense
          clearable
          label="Tipo Utenza"
          v-model="search.tipoUtenza"
          :options="listaTipiUtenze"
          option-label="strTipoUtenzaDesc"
          option-value="strTipoUtenzaId"
          emit-value
          map-options
          filled
        />

        <!-- NOME STRUTTURA -->
        <q-input
          :class="inputClasses"
          style="height: 48px"
          clearable
          dense
          label="Nome Struttura"
          v-model="search.nomeStruttura"
          filled
        />
      </template>
    </page-header>

    <page-selector
      v-if="this.rows > 0"
      v-model="pagination"
      :totalPages="pages"
      :disable="loading"
    />

    <!-- BODY PAGINA -->
    <loading-component :loading="loading">
      <div v-if="table.listaResidenze && !!table.listaResidenze.length">
        <residenza-list-element
          v-for="residenza in table.listaResidenze"
          v-bind="residenza"
          :dropdowns="currentDialog.dropdowns"
          class="q-mx-xs q-my-md flip-list-move"
          :key="residenza.stiId"
          clickable
          :expanded="isExpanded(residenza.stiId)"
          :some-selected="expandedItem !== null"
          @goTo="goTo($event)"
          @expandItem="expandItem(residenza.stiId, $event)"
        />
        <!-- v-show="expandedItem === null || expandedItem === residenza.stiId" -->
      </div>

      <div v-else class="row justify-center q-pt-xl">
        Nessun risultato trovato con i criteri di ricerca applicati.
      </div>
    </loading-component>

    <dialog-info-struttura ref="dialogInfoStruttura" v-bind="currentDialog" />
    <dialog-rilevazioni-posti ref="dialogPosti" v-bind="currentDialog" />
    <dialog-rilevazioni-personale
      ref="dialogPersonale"
      v-bind="currentDialog"
    />
    <dialog-rilevazioni-tamponi
      ref="dialogTamponi"
      v-bind="currentDialog"
    />
    <!--    <dialog-rilevazioni-rapidi ref="dialogRapidi" v-bind="currentDialog" />-->
    <dialog-rilevazioni-ospiti ref="dialogOspiti" v-bind="currentDialog" />
    <dialog-rilevazioni-decessi ref="dialogDecessi" v-bind="currentDialog" />
    <dialog-rilevazioni-visitatori
      ref="dialogVisitatori"
      v-bind="currentDialog"
    />
    <dialog-conferma-eliminazione ref="dialogConfermaEliminazione" />
    <dialog-new-relevation ref="dialogNewRelevation" v-bind="currentDialog" />
    <dialog-export ref="exportDialog" @confirmDialog="exportTable($event)" />
  </q-page>
</template>

<script>
import {
  DIALOG_REFS,
  EVENTS,
  RELEVATION_TYPES,
  RSA_ASL
} from "src/services/business_logic";
import { EventBus } from "src/services/event_bus";
import PageHeader from "src/components/GestioneRsa/PageHeader.vue";
import ResidenzaListElement from "src/components/GestioneRsa/ResidenzaListElement.vue";
import DialogRilevazioniPosti from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniPosti.vue";
import LoadingComponent from "src/components/LoadingComponent.vue";
import DialogRilevazioniPersonale from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniPersonale.vue";
import DialogRilevazioniTamponi from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniTamponi.vue";
import DialogRilevazioniOspiti from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniOspiti.vue";
import DialogRilevazioniDecessi from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniDecessi.vue";
import DialogRilevazioniVisitatori from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogRilevazioniVisitatori.vue";

import {
  aggiornaInfoStruttura,
  cancellaDecessi,
  cancellaOspiti,
  cancellaPersonale,
  cancellaPosti,
  cancellaTamponi,
  getAssistenzaMedica,
  getEnti,
  getRilevazioniCsv,
  getStrutture,
  getTamponeCategorie,
  getTipiPersonale,
  getTipiStruttura,
  getTipiTampone,
  getTipiUtenza,
  getTipiVisitatori
} from "src/services/api";
import {
  debounce,
  downloadCsv,
  notifyError,
  notifySuccess
} from "src/services/utils";
import DialogConfermaEliminazione from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogConfermaEliminazione.vue";
import DialogInfoStruttura from "src/components/GestioneRsa/Dialogs/DialogInfoStruttura.vue";
import PageSelector from "src/components/GestioneRsa/PageSelector.vue";
import DialogNewRelevation from "src/components/GestioneRsa/Dialogs/Rilevazioni/DialogNewRelevation.vue";
import DialogExport from "src/components/GestioneRsa/Dialogs/DialogExport.vue";
import { TYPES } from "src/store";
import CommunicationListItem from "../../components/messages/CommunicationListItem";
import { openURL } from "quasar";

export default {
  name: "GestioneRsaResidenze",
  components: {
    CommunicationListItem,
    PageHeader,
    ResidenzaListElement,
    DialogRilevazioniPosti,
    LoadingComponent,
    DialogRilevazioniPersonale,
    DialogRilevazioniTamponi,
    DialogRilevazioniOspiti,
    DialogRilevazioniDecessi,
    DialogConfermaEliminazione,
    DialogInfoStruttura,
    PageSelector,
    DialogNewRelevation,
    DialogExport,
    DialogRilevazioniVisitatori
  },
  data() {
    return {
      searchEnabled: false,
      loading: false,
      search: {
        idStruttura: null,
        ente: null,
        tipoStruttura: null,
        tipoUtenza: null,
        nomeStruttura: null
      },
      pagination: {
        rowPerPage: 10,
        pageNumber: 1
      },
      listaTipiUtenze: [],
      listaEnti: [],
      listaTipi: [],
      rows: 0,
      currentDialog: {
        editMode: false,
        stiNome: "",
        strTipoId: null,
        idStruttura: null,
        strCategoriaId: null,
        loading: false,
        covid: false,
        dropdowns: {
          tipiStruttura: [],
          tipiPersonale: [],
          tipiTampone: [],
          tipiVisite: [],
          tamponeCategorie: [],
          assistenzaMedica: []
        },
        tipiStrutturaFiltrati: []
      },
      table: {
        listaResidenze: []
      },
      events: {
        goToEvent: EVENTS.GO_TO,
        expandItem: EVENTS.EXPAND_ITEM
      },
      expandedItem: null,
      inputClasses: ["col-12", "col-sm-6", "col-md-grow", "q-pa-xs"],
      callbackReloadDettagli: null,
      currentRunningPromise: {}
    };
  },
  watch: {
    search: {
      deep: true,
      handler() {
        if (!this.expandedItem) {
          this.pagination.pageNumber = 1;
          debounce(this, () => this.loadResidenze(), 500);
        }
      }
    },
    pagination: {
      deep: true,
      handler() {
        debounce(this, () => this.loadResidenze(), 250);
      }
    }
  },
  created() {
    this.loadResidenze();
    this.loadDropdownsOptions();
    this.setupDialogEvents();
  },
  destroyed() {
    EventBus.$off(EVENTS.CONFIRM_DIALOG);

    EventBus.$off(EVENTS.OPEN_DIALOG);

    EventBus.$off(EVENTS.DEL_RELEVATION);

    EventBus.$off(EVENTS.EXPORT);
  },
  computed: {
    communicationList() {
      return (
        this.$store.getters[TYPES.GETTERS.COMMUNICATION_LIST_RILEVAZIONI] ?? []
      );
    },
    currentUser() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    isAsl() {
      return this.currentUser?.elencoProfilo?.some(
        profilo => profilo.nomeProfilo === RSA_ASL
      );
    },
    residenzaSelected() {
      return this.table?.listaResidenze?.find(
        residenza => residenza.stiId === this.expandedItem
      );
    },
    pages() {
      const value = Math.ceil(this.rows / this.pagination.rowPerPage);

      if (value > 0) {
        return value;
      } else {
        return 1;
      }
    },
    getProvenienza() {
      return this.$store.getters["getProvenienza"];
    }
  },
  methods: {
    showAttoNomina() {
      openURL("/manualigescovid/rsa/Atto_di_nomina_resp_esterni_RSA.pdf");
    },
    showDelega() {
      openURL("/manualigescovid/rsa/mod_delega_legale_rappr_RSA.pdf");
    },
    openDgrEditDialog(partialPayload) {},
    openExportDialog(idStruttura = null, tipo = null) {
      this.$refs.exportDialog.openDialog(
        this.table.listaResidenze,
        idStruttura,
        tipo
      );
    },
    // GESTIONE FILTRI DI RICERCA
    onSearchFilterUpdate() {
      const func = debounce(() => {
      }, 1000);
      func();
    },
    // GESTIONE DIALOGS
    setupDialogEvents() {
      EventBus.$on(EVENTS.CONFIRM_DIALOG, ({ payload, func, callbackDialog }) =>
        this.confirmDialog(payload, func, callbackDialog)
      );

      EventBus.$on(EVENTS.OPEN_DIALOG, data => {
        this.openDialogRilevazione(data);
      });

      EventBus.$on(EVENTS.DEL_RELEVATION, ({ relevationType, id }) =>
        this.openDialogConfermaEliminazione(relevationType, id)
      );

      EventBus.$on(EVENTS.EXPORT, (idStruttura, tipo) =>
        this.openExportDialog(idStruttura, tipo)
      );
    },
    setEditMode(editMode) {
      this.currentDialog.editMode = editMode;
    },
    openDialogRilevazione(data) {
      this.callbackReloadDettagli = data.callbackReloadDettagli;
      this.currentDialog.strTipoId =
        data?.relevation?.strTipoId ?? this.residenzaSelected?.strTipoId;
      this.currentDialog.stiNome = this.residenzaSelected?.stiNome;
      this.currentDialog.stiAdesioneDgr10 = this.residenzaSelected?.stiAdesioneDgr10;
      this.currentDialog.stiAbilitatoSollievo = this.residenzaSelected?.stiAbilitatoSollievo;
      this.currentDialog.stiAbilitatoDimProt = this.residenzaSelected?.stiAbilitatoDimProt;
      this.currentDialog.stiAbilitatoCavs = this.residenzaSelected?.stiAbilitatoCavs;
      this.currentDialog.stiAbilitatoLungodeg = this.residenzaSelected?.stiAbilitatoLungodeg;
      this.currentDialog.stiAbilitatoHospice = this.residenzaSelected?.stiAbilitatoHospice;
      this.currentDialog.idStruttura = this.residenzaSelected?.idStruttura;
      this.currentDialog.strCategoriaId =
        data?.relevation?.strCategoriaId ??
        this.residenzaSelected?.strCategoriaId;
      this.currentDialog.covid = data?.covid;
      this.currentDialog.tipiStrutturaFiltrati =
        data?.relevation?.listAvailableType;

      if (this.$refs[data.dialog]) {
        if (data.dialog === DIALOG_REFS.INFO_STRUTTURA) {
          this.$refs[data.dialog].openDialog(false, data.infoStruttura);
        } else {
          this.$refs[data.dialog].openDialog(data.editMode, data.relevation);
        }
      }
    },
    openDialogConfermaEliminazione(tipoRilevazione, id) {
      let func;

      switch (tipoRilevazione) {
        case RELEVATION_TYPES.POSTI:
          func = cancellaPosti;
          break;

        case RELEVATION_TYPES.PERSONALE:
          func = cancellaPersonale;
          break;

        case RELEVATION_TYPES.TAMPONI:
          func = cancellaTamponi;
          break;

        case RELEVATION_TYPES.OSPITI:
          func = cancellaOspiti;
          break;

        case RELEVATION_TYPES.DECESSI:
          func = cancellaDecessi;
          break;
      }

      const callback = () => this.confirmEliminazioneRilevazione(id, func);

      if (this.$refs.dialogConfermaEliminazione) {
        this.$refs.dialogConfermaEliminazione.openDialog(callback);
      }
    },
    closeDialogConfermaEliminazione() {
      this.$refs.dialogConfermaEliminazione.closeDialog();
    },
    async confirmEliminazioneRilevazione(id, func) {
      try {
        await func(id);
        notifySuccess("Eliminazione avvenuta con successo!");
      } catch (e) {
        notifyError(e.response?.message);
      }

      EventBus.$emit(EVENTS.RELOAD_RELEVATIONS);

      this.closeDialogConfermaEliminazione();
    },
    async confirmDialog(payload, func, callbackDialog) {
      this.currentDialog.loading = true;

      try {
        await func(payload);

        notifySuccess("Inserimento avvenuto con successo");
        if (func === aggiornaInfoStruttura) {
          this.loadResidenzaCorrente();
        } else if (callbackDialog) {
          this.callbackReloadDettagli();
          callbackDialog();
        }
      } catch (e) {
        notifyError(e.descrizione);
      }

      this.currentDialog.loading = false;
    },
    // CHIAMATE API
    async loadResidenzaCorrente() {
      const idStruttura = this.residenzaSelected?.idStruttura;

      const residenzaCorrente = (await this.loadResidenze(idStruttura))[0];
      const residenzaSelected = this.residenzaSelected;

      residenzaSelected.stiTelefono = residenzaCorrente.stiTelefono;
      residenzaSelected.stiEmail = residenzaCorrente.stiEmail;
      residenzaSelected.stiEmail2 = residenzaCorrente.stiEmail2;
      residenzaSelected.stiPec = residenzaCorrente.stiPec;
      residenzaSelected.stiAsmedMmg = residenzaCorrente.stiAsmedMmg;
      residenzaSelected.assmedId = residenzaCorrente.assmedId;
      residenzaSelected.stiAsmedMista = residenzaCorrente.stiAsmedMista;
      residenzaSelected.stiPersInfNotturno =
        residenzaCorrente.stiPersInfNotturno;
      residenzaSelected.stiMensaInternaPresente =
        residenzaCorrente.stiMensaInternaPresente;
      residenzaSelected.stiAdesioneDgr10 = residenzaCorrente.stiAdesioneDgr10;
      residenzaSelected.stiAbilitatoSollievo =
        residenzaCorrente.stiAbilitatoSollievo;
      residenzaSelected.stiAbilitatoDimProt =
        residenzaCorrente.stiAbilitatoDimProt;
      residenzaSelected.stiAbilitatoCavs = residenzaCorrente.stiAbilitatoCavs;
      residenzaSelected.stiAbilitatoLungodeg =
        residenzaCorrente.stiAbilitatoLungodeg;
      residenzaSelected.stiAbilitatoHospice =
        residenzaCorrente.stiAbilitatoHospice;
      residenzaSelected.stiDirStrPresente = residenzaCorrente.stiDirStrPresente;
      residenzaSelected.stiDirStrNome = residenzaCorrente.stiDirStrNome;
      residenzaSelected.stiDirStrEmail = residenzaCorrente.stiDirStrEmail;
      residenzaSelected.stiDirStrTelReperibilita =
        residenzaCorrente.stiDirStrTelReperibilita;
      residenzaSelected.stiDirSanitPresente =
        residenzaCorrente.stiDirSanitPresente;
      residenzaSelected.stiDirSanitNome = residenzaCorrente.stiDirSanitNome;
      residenzaSelected.stiDirSanitEmail = residenzaCorrente.stiDirSanitEmail;
      residenzaSelected.stiDirSanitTelReperibilita =
        residenzaCorrente.stiDirSanitTelReperibilita;
      residenzaSelected.stiCoordInfPresente =
        residenzaCorrente.stiCoordInfPresente;
      residenzaSelected.stiCoordInfNome = residenzaCorrente.stiCoordInfNome;
      residenzaSelected.stiCoordInfEmail = residenzaCorrente.stiCoordInfEmail;
      residenzaSelected.stiCoordInfTelReperibilita =
        residenzaCorrente.stiCoordInfTelReperibilita;
    },
    async exportTable(params) {
      try {
        // const params = this.builSearchPayload(true)

        const { data: csv } = await getRilevazioniCsv(params);

        downloadCsv(csv, "export_strutture.csv");
      } catch (e) {
        notifyError(1, "Errore nel download");
      }
    },
    async loadResidenze(idStruttura) {
      try {
        if (this.currentRunningPromise.cancel) {
          this.currentRunningPromise.cancel("cancelled");
          this.currentRunningPromise.cancel = null;
        }

        let params = {};

        if (!idStruttura) {
          this.loading = true;
          this.expandedItem = null;
          params = this.builSearchPayload();
        } else {
          params.idStruttura = idStruttura;

          // return (await getStrutture(params)).data;
          let promise = await getStrutture(params);
          this.table.listaResidenze = promise.data;
          return;
        }

        getStrutture(this.currentRunningPromise, params)
          .then(response => {
            this.rows = response.headers["rows-number"];
            this.table.listaResidenze = response.data;

            this.loading = false;
          })
          .catch(reason => {
            console.log(reason.message);
            if (reason.message !== "cancelled") {
              this.loading = false;
            }

            this.table.listaResidenze = [];
          });
      } catch (e) {
        console.log(e);
      }
    },
    loadDropdownsOptions() {
      this.loadTipiStruttura();
      this.loadTipiPersonale();
      this.loadTipiTampone();
      this.loadTamponeCategorie();
      this.loadTipiUtenza();
      this.loadEnti();
      this.loadTipiVisitatori();
      this.loadAssistenzaMedica();
    },
    async loadAssistenzaMedica() {
      try {
        const { data: assistenzaMedica } = await getAssistenzaMedica();

        this.currentDialog.dropdowns.assistenzaMedica = assistenzaMedica;
      } catch (e) {
        console.log(e);
      }
    },
    async loadEnti() {
      try {
        const { data: enti } = await getEnti();

        this.listaEnti = enti;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTipiVisitatori() {
      try {
        const { data: visitatori } = await getTipiVisitatori();

        this.currentDialog.dropdowns.tipiVisite = visitatori;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTipiUtenza() {
      try {
        const { data: tipiUtenza } = await getTipiUtenza();

        this.listaTipiUtenze = tipiUtenza;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTipiStruttura() {
      try {
        const { data: tipiStruttura } = await getTipiStruttura();

        this.currentDialog.dropdowns.tipiStruttura = tipiStruttura;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTipiPersonale() {
      try {
        const { data: tipiPersonale } = await getTipiPersonale();

        this.currentDialog.dropdowns.tipiPersonale = tipiPersonale;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTipiTampone() {
      try {
        const { data: tipiTampone } = await getTipiTampone();

        this.currentDialog.dropdowns.tipiTampone = tipiTampone;
      } catch (e) {
        console.log(e);
      }
    },
    async loadTamponeCategorie() {
      try {
        const { data: tamponeCategorie } = await getTamponeCategorie();

        this.currentDialog.dropdowns.tamponeCategorie = tamponeCategorie;
      } catch (e) {
        console.log(e);
      }
    },
    // GESTIONE ELEMENTI DELLA PAGE
    enableSearch() {
      this.searchEnabled = !this.searchEnabled;

      if (!this.searchEnabled && !this.expandedItem) {
        this.search.nomeStruttura = null;
        this.search.idStruttura = null;
        this.search.ente = null;
        this.search.tipoUtenza = null;
      } else if (this.expandedItem !== null && this.searchEnabled) {
        this.expandedItem = null;
      }
    },
    expandItem(expandedItem, expanded) {
      if (expanded) {
        this.expandedItem = expandedItem;
      } else {
        this.expandedItem = null;
      }

      if (this.searchEnabled) {
        this.enableSearch();
      }
    },
    isExpanded(item) {
      return this.expandedItem === item;
    },
    builSearchPayload(csv = false) {
      const payload = {};

      payload.idStruttura = this.search?.idStruttura;
      payload.nomeSti = this.search?.nomeStruttura;
      payload.idTipoUtenza = this.search?.tipoUtenza;
      payload.strCategoriaId = this.search?.tipoStruttura;
      payload.idEnte = this.search?.ente;

      if (!csv) {
        payload.descendingStr = "false";
        payload.orderby = "nome_st";
        payload.rowPerPage = this.pagination.rowPerPage;
        payload.pageNumber = this.pagination.pageNumber;
      }

      return payload;
    },
    goTo(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style>
.flip-list-move {
  transition: transform 0.3s;
}

.flip-list-leave-to {
  opacity: 0;
}
</style>

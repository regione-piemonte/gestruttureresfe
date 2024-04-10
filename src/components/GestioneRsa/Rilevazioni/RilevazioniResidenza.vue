<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="row col-12 full-height">
    <q-tabs v-model="tab" class="row full-width">


      <template v-if="!covid">
        <q-tab :name="1" label="Posti" class="q-mx-xs" :ripple="false" />
        <q-tab :name="2" label="Personale" class="q-mx-xs" :ripple="false" />
        <q-tab :name="3" label="Tamponi" class="q-mx-xs" :ripple="false" />
        <!--        <q-tab-->
        <!--          :name="4"-->
        <!--          label="Tamponi rapidi"-->
        <!--          class="q-mx-xs"-->
        <!--          :ripple="false"-->
        <!--        />-->
        <q-tab :name="5" label="Ospiti" class="q-mx-xs" :ripple="false" />
        <q-tab :name="6" label="Decessi" class="q-mx-xs" :ripple="false" />
        <q-tab
          :name="7"
          label="Ingressi visitatori"
          class="q-mx-xs"
          :ripple="false"
        />
      </template>
    </q-tabs>

    <div class="row full-width">
      <!--      v-if="!isRsaRp && !isRsaAsl"-->
      <q-btn
        v-if="isRsa"
        @click="newRilevazioneCompleta"
        :disable="addDisabled"
        label="AGGIUNGI"
        icon="add"
        color="primary"
        size="md"
        class="q-mt-md q-ml-md"
      />

      <q-space class="col-grow" />

      <!-- PULSANTE ESPORTA -->
      <q-btn
        @click="exportRelevation"
        label="ESPORTA"
        icon="file_download"
        size="md"
        class="q-mt-md q-mr-md"
        color="red"
      />

      <q-btn
        @click="mostraNonVuoti = !mostraNonVuoti"
        :outline="!mostraNonVuoti"
        label="SOLO RIGHE VALORIZZATE"
        color="primary"
        size="md"
        class="q-mt-md q-mr-md"
      />
    </div>

    <loading-component :loading="loading">
      <q-tab-panels
        v-model="tab"
        animated
        class="full-width full-height bg-transparent"
      >
        <template v-if="!covid">
          <q-tab-panel :name="1">
            <rilevazione-posti
              :rilevazioni="rilevazioniPosti"
              @addRelevation="newRilevazionePosti"
              @copyRelevation="copyRilevazionePosti($event)"
              @editRelevation="editRilevazionePosti($event)"
              :flagsPosti="flagsPosti"
            />
          </q-tab-panel>

          <q-tab-panel :name="2">
            <rilevazione-personale
              :rilevazioni="rilevazioniPersonale"
              @addRelevation="newRilevazionePersonale"
              @copyRelevation="copyRilevazionePersonale($event)"
              @editRelevation="editRilevazionePersonale($event)"
            />
          </q-tab-panel>

          <q-tab-panel :name="3">
            <rilevazione-tamponi
              molecolare
              :rilevazioni="rilevazioniTamponi"
              @addRelevation="newRilevazioneTemponi"
              @copyRelevation="copyRilevazioneTamponi($event)"
              @editRelevation="editRilevazioneTamponi($event)"
            />
          </q-tab-panel>

<!--          <q-tab-panel :name="4">-->
<!--            <rilevazione-tamponi-->
<!--              :rilevazioni="rilevazioniRapidi"-->
<!--              @addRelevation="newRilevazioneRapidi"-->
<!--              @copyRelevation="copyRilevazioneRapidi($event)"-->
<!--              @editRelevation="editRilevazioneRapidi($event)"-->
<!--            />-->
<!--          </q-tab-panel>-->

          <q-tab-panel :name="5">
            <rilevazione-ospiti
              :rilevazioni="rilevazioniOspiti"
              @addRelevation="newRilevazioneOspiti"
              @copyRelevation="copyRilevazioneOspiti($event)"
              @editRelevation="editRilevazioneOspiti($event)"
            />
          </q-tab-panel>

          <q-tab-panel :name="6">
            <rilevazione-decessi
              :rilevazioni="rilevazioniDecessi"
              @addRelevation="newRilevazioneDecessi"
              @copyRelevation="copyRilevazioneDecessi($event)"
              @editRelevation="editRilevazioneDecessi($event)"
            />
          </q-tab-panel>

          <q-tab-panel :name="7">
            <rilevazione-visitatori
              :rilevazioni="rilevazioniVisitatori"
              @addRelevation="newRilevazioneVisitatori"
              @copyRelevation="copyRilevazioneVisitatori($event)"
              @editRelevation="editRilevazioneVisitatori($event)"
            />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </loading-component>
  </div>
</template>

<script>
import {
  DIALOG_REFS,
  EVENTS,
  RELEVATION_TYPES,
  RSA_ASL,
  RSA_RP
} from "src/services/business_logic";
import RilevazioneDecessi from "./RilevazioneDecessi.vue";
import RilevazioneOspiti from "./RilevazioneOspiti.vue";
import RilevazionePersonale from "./RilevazionePersonale.vue";
import RilevazionePosti from "./RilevazionePosti.vue";
import RilevazioneTamponi from "./RilevazioneTamponi.vue";
import RilevazioneVisitatori from "./RilevazioneVisitatori.vue";
import { getInfoStruttura } from "src/services/api";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { EventBus } from "src/services/event_bus";
import { dateToString, getOnlyDate } from "src/services/utils";
import { TYPES } from "src/store";
import { nextMonday, notifyError } from "../../../services/utils";
import { RSA } from "../../../services/business_logic";

export default {
  components: {
    RilevazionePosti,
    RilevazionePersonale,
    RilevazioneTamponi,
    RilevazioneOspiti,
    RilevazioneDecessi,
    LoadingComponent,
    RilevazioneVisitatori
  },
  name: "RilevazioniResidenza",
  props: {
    idStruttura: { type: String },
    dropdowns: { type: Object },
    covid: { type: Boolean }
  },
  data() {
    return {
      tab: 1,
      rilevazioni: {},
      loading: false,
      mostraNonVuoti: false,
      categoriePermesseAttuali: []
    };
  },
  watch: {},
  created() {
    this.loadData();

    EventBus.$on(EVENTS.RELOAD_RELEVATIONS, this.loadData);
  },
  destroyed() {
    EventBus.$off(EVENTS.RELOAD_RELEVATIONS);
  },
  computed: {
    flagsPosti() {
      let flags = {};
      flags.sollievo = this.rilevazioni?.stiAbilitatoSollievo;
      flags.cavs = this.rilevazioni?.stiAbilitatoCavs;
      flags.dimissioni = this.rilevazioni?.stiAbilitatoDimProt;
      flags.lungodegenza = this.rilevazioni?.stiAbilitatoLungodeg;
      flags.hospice = this.rilevazioni?.stiAbilitatoHospice;
      return flags;
    },
    rilevazioniPosti() {
      if (this.mostraNonVuoti) {
        return this.rilevazioni?.posti?.filter(
          rilevazione => rilevazione.totale > 0
        );
      } else {
        return this.rilevazioni?.posti;
      }
    },
    rilevazioniPersonale() {
      if (this.mostraNonVuoti) {
        return this.rilevazioni?.personale?.filter(
          rilevazione => rilevazione.totale > 0
        );
      } else {
        return this.rilevazioni?.personale;
      }
    },
    // rilevazioniRapidi() {
    //   return this.rilevazioni?.tamponiRapidi
    //     ?.map(tampone => {
    //       tampone.tipologiaStrutturaDesc = this.dropdowns?.tipiStruttura?.find(
    //         tipo => tipo.strCategoriaId === tampone.strCategoriaId
    //       )?.strCategoriaDesc;
    //       tampone.tampCatDesc = this.dropdowns?.tamponeCategorie?.find(
    //         tipo => tipo.tampCatId === tampone.tampCatId
    //       )?.tampCatDesc;
    //
    //       return tampone;
    //     })
    //     .filter(tampone => {
    //       return tampone.totale > 0 || !this.mostraNonVuoti;
    //     });
    // },
    rilevazioniTamponi() {
        let tamponi = this.rilevazioni?.tamponi

        // ?.map(tampone => {
        //   tampone.tipologiaStrutturaDesc = this.dropdowns?.tipiStruttura?.find(
        //     tipo => tipo.strCategoriaId === tampone.strCategoriaId
        //   )?.strCategoriaDesc;
        //   tampone.tampCatDesc = this.dropdowns?.tamponeCategorie?.find(
        //     tipo => tipo.tampCatId === tampone.tampCatId
        //   )?.tampCatDesc;
        //
        //   return tampone;
        // })
        let filteredTamponi = tamponi.filter(tampone => {
          return tampone.totale > 0 || !this.mostraNonVuoti;
        });
        return filteredTamponi
    },
    rilevazioniOspiti() {
      if (this.mostraNonVuoti) {
        return this.rilevazioni?.ospiti?.filter(
          rilevazione => rilevazione.totale > 0
        );
      } else {
        return this.rilevazioni?.ospiti;
      }
    },
    rilevazioniDecessi() {
      if (this.mostraNonVuoti) {
        return this.rilevazioni?.decessi?.filter(
          rilevazione => rilevazione.totale > 0
        );
      } else {
        return this.rilevazioni?.decessi;
      }
    },
    rilevazioniVisitatori() {
      if (this.rilevazioni?.visitatori) {
        return this.rilevazioni?.visitatori.map(v => {
          const description = this.dropdowns?.tipiVisite.find(
            j => j.visitatoriIngressiId === v.visitatoriIngressiId
          );
          return {
            ...v,
            visitatoriDesc: description?.visitatoriIngressiDesc ?? undefined
          };
        });
      }
    },
    addDisabled() {
      let listaCategorie = this.rilevazioni?.categorie ?? [];
      this.categoriePermesseAttuali = listaCategorie.filter(
        a => a.esisteUltimaRilevazione === false
      );
      if (
        this.categoriePermesseAttuali &&
        this.categoriePermesseAttuali.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    isRsaRp() {
      return !!this.$store.getters[TYPES.GETTERS.USER]?.elencoProfilo?.find(
        profilo => profilo.nomeProfilo === RSA_RP
      );
    },
    isRsaAsl() {
      return !!this.$store.getters[TYPES.GETTERS.USER]?.elencoProfilo?.find(
        profilo => profilo.nomeProfilo === RSA_ASL
      );
    },
    isRsa() {
      return !!this.$store.getters[TYPES.GETTERS.USER]?.elencoProfilo?.find(
        profilo => profilo.nomeProfilo === RSA
      );
    }
  },
  methods: {
    exportRelevation() {
      EventBus.$emit(
        EVENTS.EXPORT,
        this.idStruttura,
        RELEVATION_TYPES[this.tab - 1].cod
      );
    },
    newRilevazione(dialog, relevation = null, covid = false) {
      EventBus.$emit(EVENTS.OPEN_DIALOG, {
        editMode: false,
        relevation: relevation,
        callbackReloadDettagli: this.loadData,
        dialog: dialog,
        covid: covid
      });
    },
    copyRilevazione(rilevazione, dialog) {
      EventBus.$emit(EVENTS.OPEN_DIALOG, {
        editMode: false,
        relevation: rilevazione,
        callbackReloadDettagli: this.loadData,
        dialog: dialog
      });
    },
    editRilevazione(rilevazione, dialog) {
      EventBus.$emit(EVENTS.OPEN_DIALOG, {
        editMode: true,
        relevation: rilevazione,
        callbackReloadDettagli: this.loadData,
        dialog: dialog
      });
    },
    newRilevazioneCompleta() {
      let relevation = null;

      // if (!this.covid) {
      relevation = {
        posti: this.rilevazioni?.posti?.[0],
        personaleA: this.rilevazioni?.personale?.find(
          r => r.persTipoCod === "PA"
        ),
        personaleI: this.rilevazioni?.personale?.find(
          r => r.persTipoCod === "PI"
        ),
        personaleNS: this.rilevazioni?.personale?.find(
          r => r.persTipoCod === "ANS"
        ),
        personale: this.rilevazioni?.personale?.find(
          r => r.persTipoCod === "AS"
        ),
        ospiti: this.rilevazioni?.ospiti?.[0],
        decessi: this.rilevazioni?.decessi?.[0],
        listAvailableType: this.categoriePermesseAttuali
      };

      this.newRilevazione(
        DIALOG_REFS.NUOVA_RILEVAZIONE,
        relevation /* , this.covid */
      );
    },
    newRilevazionePosti() {
      // this.$emit(EVENTS.OPEN_DIALOG_POSTI, this.loadData)
      this.newRilevazione(DIALOG_REFS.POSTI);
    },
    copyRilevazionePosti(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.POSTI);
    },
    editRilevazionePosti(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.POSTI);
    },
    newRilevazionePersonale() {
      this.newRilevazione(DIALOG_REFS.PERSONALE);
    },
    copyRilevazionePersonale(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.PERSONALE);
    },
    editRilevazionePersonale(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.PERSONALE);
    },
    newRilevazioneTamponi() {
      this.newRilevazione(DIALOG_REFS.TAMPONI);
    },
    copyRilevazioneTamponi(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.TAMPONI);
    },
    editRilevazioneTamponi(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.TAMPONI);
    },
    // newRilevazioneRapidi() {
    //   this.newRilevazione(DIALOG_REFS.RAPIDI);
    // },
    // copyRilevazioneRapidi(rilevazione) {
    //   this.copyRilevazione(rilevazione, DIALOG_REFS.RAPIDI);
    // },
    // editRilevazioneRapidi(rilevazione) {
    //   this.editRilevazione(rilevazione, DIALOG_REFS.RAPIDI);
    // },
    newRilevazioneOspiti() {
      this.newRilevazione(DIALOG_REFS.OSPITI);
    },
    copyRilevazioneOspiti(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.OSPITI);
    },
    editRilevazioneOspiti(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.OSPITI);
    },
    newRilevazioneDecessi() {
      this.newRilevazione(DIALOG_REFS.DECESSI);
    },
    copyRilevazioneDecessi(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.DECESSI);
    },
    editRilevazioneDecessi(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.DECESSI);
    },
    newRilevazioneVisitatori() {
      this.newRilevazione(DIALOG_REFS.VISITATORI);
    },
    copyRilevazioneVisitatori(rilevazione) {
      this.copyRilevazione(rilevazione, DIALOG_REFS.VISITATORI);
    },
    editRilevazioneVisitatori(rilevazione) {
      this.editRilevazione(rilevazione, DIALOG_REFS.VISITATORI);
    },

    async loadData() {
      this.loading = true;

      try {
        //PASSO LA DATA DI RILEVAZIONE DI MODO CHE POI MI VENGA DETTO QUALI CATEGORIE SONO EFFETTIVAMENTE UTILIZZABILI
        let data = nextMonday();
        // let params = {
        //   dataRilevazione: data
        // };
        const { data: rilevazioni } = await getInfoStruttura(
          this.idStruttura
          // params
        );
        this.rilevazioni = rilevazioni;
      } catch (e) {
        notifyError(e, e.response.data.descrizione);
      }

      this.loading = false;
    }
  }
};
</script>

<style></style>

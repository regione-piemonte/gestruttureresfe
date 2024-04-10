<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-card class="row overflow-hidden" style="z-index: 1" bordered>
    <q-card-section class="row q-pt-none full-width">
      <div class="row col-grow" :class="cardClasses">
        <div :class="fieldsClasses">
          <div class="row text-caption q-pt-sm">
            Ente:
          </div>

          <div class="row col-grow text-bold">
            {{ nomeEnte }}
          </div>

          <div class="row text-caption q-pt-sm">
            Nome struttura:
          </div>

          <div class="row col-grow text-bold">
            {{ stiNome }}
          </div>
        </div>

        <div :class="fieldsClasses">
          <div class="row text-caption q-pt-sm">
            Comune:
          </div>

          <div class="row text-bold">
            {{ comune }}
          </div>

          <div class="row text-caption q-pt-sm">
            Indirizzo:
          </div>

          <div class="row text-bold">
            {{ stiIndirizzo }}
          </div>
        </div>

        <div :class="fieldsClasses">
          <div class="row text-caption q-pt-sm">
            Tipo struttura:
          </div>

          <div class="row text-bold">
            {{ tipoStrutturaDesc }}
          </div>

          <div class="row text-caption q-pt-sm">
            Natura:
          </div>

          <div class="row text-bold">
            {{ naturaDesc }}
          </div>
        </div>

        <div :class="fieldsClasses">
          <div class="row text-caption q-pt-sm">
            Accreditamento:
          </div>
          <div class="row text-bold">
            {{ accreditamentoDesc }}
          </div>

          <div class="row text-caption q-pt-sm">
            Tipo utenza:
          </div>

          <div class="row text-bold">
            {{ tipoUtenzaDesc }}
          </div>
        </div>
      </div>

      <div v-if="clickable" class="row col-shrink items-center q-pt-sm">
        <q-btn
          icon="expand_more"
          class="animated-item"
          :class="expandBtnClasses"
          size="16pt"
          @click="expandDetail"
          flat
          dense
          :ripple="false"
          round
        />
      </div>
    </q-card-section>

    <transition name="expand">
      <div v-if="expanded" class="col-12">
        <dettagli-residenza
          v-bind="$props"
          ref="dettagliResidenza"
          @openDialogPosti="newRilevazionePosti($event)"
          @openDialogPersonale="newRilevazionePersonale($event)"
          @openDialogTamponi="newRilevazioneTamponi($event)"
          @openDialogOspiti="newRilevazioneOspiti($event)"
          @openDialogDecessi="newRilevazioneDecessi($event)"
        />
      </div>
    </transition>
  </q-card>
</template>

<script>
import { EVENTS } from "src/services/business_logic";
import DettagliResidenza from "src/components/GestioneRsa/DettagliResidenza.vue";
export default {
  components: { DettagliResidenza },
  name: "ResidenzaListElement",
  props: {
    dropdowns: { type: Object },
    nomeEnte: { type: String },
    idStruttura: { type: String },
    idEnte: { type: String },
    stiNome: { type: String },
    comune: { type: String },
    stiIndirizzo: { type: String },
    siglaProv: { type: String },
    tipoStrutturaDesc: { type: String },
    naturaDesc: { type: String },
    accreditamentoDesc: { type: String },
    tipoUtenzaDesc: { type: String },
    stiId: { type: Number },
    stiTelefono: { type: String },
    stiEmail: { type: String },
    stiEmail2: { type: String },
    stiMensaInternaPresente: { type: Boolean },
    stiAdesioneDgr10: { type: Boolean },
    stiAsmedMmg: { type: Boolean },
    assmedId: { type: Number },
    stiAsmedMista: { type: Boolean },
    stiPersInfNotturno: { type: Boolean },
    stiPec: { type: String },
    stiDirStrPresente: { type: Boolean },
    stiDirStrNome: { type: String },
    stiDirStrEmail: { type: String },
    stiDirStrTelReperibilita: { type: String },
    stiDirSanitPresente: { type: Boolean },
    stiDirSanitNome: { type: String },
    stiDirSanitEmail: { type: String },
    stiDirSanitTelReperibilita: { type: String },
    stiCoordInfPresente: { type: Boolean },
    stiCoordInfNome: { type: String },
    stiCoordInfEmail: { type: String },
    stiCoordInfTelReperibilita: { type: String },
    strTipoId: { type: Number },
    clickable: { type: Boolean },
    someSelected: { type: Boolean },
    expanded: { type: Boolean },
      stiAbilitatoSollievo: { type: Boolean },
      stiAbilitatoDimProt: { type: Boolean },
      stiAbilitatoCavs: { type: Boolean },
      stiAbilitatoLungodeg: { type: Boolean },
      stiAbilitatoHospice: { type: Boolean },
  },
  data() {
    return {
      fieldsClasses: ["col-12 col-sm-6 col-md-3"]
    };
  },
  computed: {
    expandBtnClasses() {
      return this.expanded ? ["rotate-180"] : [];
    },
    properties() {
      return this.$props;
    },
    cardClasses() {
      if (this.someSelected && !this.expanded) {
        return ["light-dimmed"];
      } else {
        return [];
      }
    }
  },
  methods: {
    expandDetail() {
      this.$emit(EVENTS.EXPAND_ITEM, !this.expanded);
      this.$store.dispatch("setSelectedStructure", {
        structure: { idStruttura: this.idStruttura }
      });
      this.$store.dispatch("setSelectedEntity", {
        entity: { idEnte: this.idEnte }
      });
    }
  }
};
</script>

<style></style>

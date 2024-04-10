<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <q-tabs v-model="tab">
      <q-tab :name="1" label="INFORMAZIONI" class="q-mx-xs" :ripple="false" v-if="getProvenienza == 'rilevazioni'" />

      <q-tab :disable="!hasContacts" :name="2" label="RILEVAZIONI" class="q-mx-xs" :ripple="false"
        v-if="getProvenienza == 'rilevazioni'">
        <template v-if="!hasContacts">
          <q-tooltip>
            <div class="text-body2">
              <!--              TODO-->
              Per consultare e inserire le rilevazioni settimanali la struttura
              deve disporre di un contatto mail, una mail Pec, numero di telefono e i dati del direttore della struttura
              <!--              Per consultare e inserire le rilevazioni settimanali la struttura-->
              <!--              deve disporre di un contatto mail e  di un numero di telefono-->
            </div>
          </q-tooltip>
        </template>
      </q-tab>
      <q-tab :name="3" label="ADESIONE RESIDENZIALITA'" class="q-mx-xs" :ripple="false"
        v-if="getProvenienza == 'adesioni'" />
      <!-- <q-tab :name="4" label="APPROVVIGIONAMENTO TAMPONI" class="q-mx-xs" :ripple="false"
        v-if="getProvenienza == 'rilevazioni'" /> -->

      <!-- <q-tab
          :name="3"
          label="COVID"
          class="rounded-corners q-mx-xs"
          :ripple="false"/> -->
    </q-tabs>
    <q-card-section class="q-py-xs">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel :name="1" style="height: 650px" v-if="getProvenienza == 'rilevazioni'">
          <div class="row">
            <div class="col-12 q-col-gutter-x-md">
              <div class="row q-py-md">
                <div class="col-shrink text-h5">
                  ID Struttura: <strong>{{ idStruttura }}</strong>
                </div>
              </div>

              <q-separator />

              <div class="row">
                <div class="col-shrink text-h5">
                  Contatti
                </div>

                <div class="column col-grow content-end">
                  <q-btn v-if="editEnabled" @click="openInfoStruttura" flat color="primary" icon="edit"
                    label="modifica" />
                </div>
              </div>
              <div class="row">
                <!-- TELEFONO -->
                <div class="col-3">
                  <div class="row  ">
                    Telefono
                  </div>

                  <div class="row text-bold">
                    {{ stiTelefono }}
                  </div>
                </div>

                <!-- 1Â° EMAIL -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row ">
                    1Â° Email
                  </div>

                  <div class="  text-bold">
                    {{ stiEmail }}
                  </div>
                </div>

                <!-- 2Â° EMAIL -->
                <div class="col-3 " style="overflow-wrap: break-word">
                  <div class="row ">
                    2Â° Email
                  </div>

                  <div class="row text-bold">
                    {{ stiEmail2 }}
                  </div>
                </div>

                <!-- PEC -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row ">
                    Pec
                  </div>

                  <div class="row text-bold">
                    {{ stiPec }}
                  </div>
                </div>
              </div>
            </div>

            <q-separator />

            <div class="col-12 q-pt-xs">
              <div class="row text-h5">
                Assistenza medica
              </div>
              <div class="row">
                <!-- Ass.Med.Gar.(MMG) -->
                <div class="col-3">
                  <div class="row">
                    Ass.Med.Gar.(MMG)
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAsmedMmg" />
                  </div>
                </div>

                <!-- Ass.Med.Gar.(no MMG) -->
                <div class="col-3">
                  <div class="row">
                    Ass.Med.Gar.(no MMG)
                  </div>

                  <div class="row text-bold">
                    {{ assMedNoMmg }}
                  </div>
                </div>

                <!-- Ass.Med.Mista -->
                <div class="col-3">
                  <div class="row">
                    Ass.Med.Mista
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAsmedMista" />
                  </div>
                </div>

                <!-- Personale Inf. Notturno -->
                <div class="col-3">
                  <div class="row">
                    Personale Inf. Notturno
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiPersInfNotturno" />
                  </div>
                </div>
              </div>
            </div>

            <q-separator />

            <!-- PRESENZA MENSA -->
            <div class="col-12 q-pt-xs">
              <div class="row text-h5">
                Presenza mensa
              </div>
              <div class="row">
                <div class="col-3">
                  <div class="row">
                    Mensa Int.
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiMensaInternaPresente" />
                  </div>
                </div>
              </div>
            </div>

            <q-separator />
            <!-- DGR 10 -->
            <div class="col-12 q-pt-xs">
              <!--              <div class="row text-h5">-->
              <!--                DGR 10-->
              <!--              </div>   -->
              <div class="row text-h5">
                Abilitazioni posti letto
              </div>
              <div class="row ">
                <!--                <div class="col-3">-->
                <!--                  <div class="row">-->
                <!--                    Abilitato DGR 10-->
                <!--                  </div>-->

                <!--                  <div class="row">-->
                <!--                    <q-checkbox disable :value="stiAdesioneDgr10" />-->
                <!--                  </div>-->
                <!--                </div>-->
                <div class="col-3">
                  <div class="row">
                    PL di sollievo
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAbilitatoSollievo" />
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    PL dimissioni protette (DGR 10)
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAbilitatoDimProt" />
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    PL CAVS
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAbilitatoCavs" />
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    PL lungodegenze
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAbilitatoLungodeg" />
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    PL hospice
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiAbilitatoHospice" />
                  </div>
                </div>
              </div>
            </div>

            <q-separator />

            <!-- DIRETTORE STRUTTURA -->
            <div class="col-12 q-pt-xs">
              <div class="row text-h5">
                Direttore - coordinatore struttura
              </div>
              <div class="row">
                <!-- Presenza -->
                <div class="col-3">
                  <div class="row">
                    Presenza
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiDirStrPresente" />
                  </div>
                </div>

                <!-- Nome direttore -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row">
                    Nome direttore
                  </div>

                  <div class="row text-bold">
                    {{ stiDirStrNome }}
                  </div>
                </div>

                <!-- Email direttore -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row">
                    Email
                  </div>

                  <div class="row text-bold">
                    {{ stiDirStrEmail }}
                  </div>
                </div>

                <!-- Tel reperibilitÃ  -->
                <div class="col-3">
                  <div class="row">
                    Tel.reperibilitÃ 
                  </div>

                  <div class="row text-bold">
                    {{ stiDirStrTelReperibilita }}
                  </div>
                </div>
              </div>
            </div>

            <q-separator />

            <!-- DIRETTORE SANITARIO -->
            <div class="col-12 q-pt-xs">
              <div class="row text-h5">
                Direttore sanitario
              </div>
              <div class="row">
                <!-- Presenza -->
                <div class="col-3">
                  <div class="row">
                    Presenza
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiDirSanitPresente" />
                  </div>
                </div>

                <!-- Nome direttore -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row">
                    Nome direttore
                  </div>

                  <div class="row text-bold">
                    {{ stiDirSanitNome }}
                  </div>
                </div>

                <!-- Email direttore -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row">
                    Email
                  </div>

                  <div class="row text-bold">
                    {{ stiDirSanitEmail }}
                  </div>
                </div>

                <!-- Tel reperibilitÃ  -->
                <div class="col-3">
                  <div class="row">
                    Tel.reperibilitÃ 
                  </div>

                  <div class="row text-bold">
                    {{ stiDirSanitTelReperibilita }}
                  </div>
                </div>
              </div>
            </div>

            <q-separator />

            <!-- COORDINATORE INFERMIERISTICO -->
            <div class="column col-12 q-pt-xs">
              <div class="row text-h5">
                Coordinatore infermieristico
              </div>
              <div class="row">
                <!-- Presenza -->
                <div class="col-3">
                  <div class="row">
                    Presenza
                  </div>

                  <div class="row">
                    <q-checkbox disable :value="stiCoordInfPresente" />
                  </div>
                </div>

                <!-- Nome direttore -->
                <div class="col-3" style="overflow-wrap: break-word">
                  <div class="row">
                    Nome coordinatore
                  </div>

                  <div class="row text-bold">
                    {{ stiCoordInfNome }}
                  </div>
                </div>

                <!-- Email direttore -->
                <div class="col-3">
                  <div class="row">
                    Email
                  </div>

                  <div class="row text-bold" style="overflow-wrap: break-word">
                    {{ stiCoordInfEmail }}
                  </div>
                </div>

                <!-- Tel reperibilitÃ  -->
                <div class="col-3">
                  <div class="row">
                    Tel.reperibilitÃ 
                  </div>

                  <div class="row text-bold">
                    {{ stiCoordInfTelReperibilita }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- RILEVAZIONI -->
        <q-tab-panel :name="2" class="q-pa-none" style="height: 650px" v-if="getProvenienza == 'rilevazioni'">
          <div style="height: 500px">
            <rilevazioni-residenza :idStruttura="idStruttura" :dropdowns="dropdowns"
              @openDialogPosti="newRilevazionePosti($event)" @openDialogPersonale="newRilevazionePersonale($event)"
              @openDialogTamponi="newRilevazioneTamponi($event)" @openDialogOspiti="newRilevazioneOspiti($event)"
              @openDialogDecessi="newRilevazioneDecessi($event)" @openDialogVisitatori="newRilevazioneVisitatori($event)"
              @delPosti="delPosti($event)" />
          </div>
        </q-tab-panel>

        <q-tab-panel :name="3" class="q-pa-none" v-if="getProvenienza == 'adesioni'">
          <form-welfare :stiNome="stiNome" :comune="comune" :stiIndirizzo="stiIndirizzo"
            :tipoStrutturaDesc="tipoStrutturaDesc" :siglaProv="siglaProv"></form-welfare>
        </q-tab-panel>
        <!--

          <q-tab-panel :name="3" class="q-pa-none" style="height: 620px">
            <div style="height: 500px">
              <rilevazioni-residenza
              :idStruttura="idStruttura"
                :dropdowns="dropdowns"
                covid
                @openDialogPosti="newRilevazionePosti($event)"
                @openDialogPersonale="newRilevazionePersonale($event)"
                @openDialogMolecolari="newRilevazioneMolecolari($event)"
                @openDialogRapidi="newRilevazioneRapidi($event)"
                @openDialogOspiti="newRilevazioneOspiti($event)"
                @openDialogDecessi="newRilevazioneDecessi($event)"
                @delPosti="delPosti($event)" />
              </div>
            </q-tab-panel> -->
        <!-- <q-tab-panel :name="4" class="q-pa-none" v-if="getProvenienza == 'rilevazioni'">
          <approvvigionamento-tamponi></approvvigionamento-tamponi>
        </q-tab-panel> -->
      </q-tab-panels>
    </q-card-section>
  </div>
</template>

<script>
import { EventBus } from "src/services/event_bus";
import RilevazioniResidenza from "./Rilevazioni/RilevazioniResidenza.vue";
import {
  DIALOG_REFS,
  EVENTS,
  RSA_ASL,
  RSA_RP
} from "src/services/business_logic";
import { TYPES } from "src/store";
import FormWelfare from "./FormWelfare";
import ApprovvigionamentoTamponi from './Rilevazioni/ApprovvigionamentoTamponi.vue';
export default {
  components: { FormWelfare, RilevazioniResidenza, ApprovvigionamentoTamponi },
  name: "DettagliResidenza",
  props: {
    dropdowns: { type: Object },
    idStruttura: { type: String },
    nomeEnte: { type: String },
    stiNome: { type: String },
    comune: { type: String },
    stiIndirizzo: { type: String },
    tipoStrutturaDesc: { type: String },
    siglaProv: { type: String },
    stiId: { type: Number },
    stiTelefono: { type: String },
    stiEmail: { type: String },
    stiEmail2: { type: String },
    stiPec: { type: String },
    stiAsmedMmg: { type: Boolean },
    assmedId: { type: Number },
    stiAsmedMista: { type: Boolean },
    stiPersInfNotturno: { type: Boolean },
    stiMensaInternaPresente: { type: Boolean },

    stiAdesioneDgr10: { type: Boolean },
    stiAbilitatoSollievo: { type: Boolean },
    stiAbilitatoDimProt: { type: Boolean },
    stiAbilitatoCavs: { type: Boolean },
    stiAbilitatoLungodeg: { type: Boolean },
    stiAbilitatoHospice: { type: Boolean },

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
    stiCoordInfTelReperibilita: { type: String }
  },
  data() {
    return {
      tab: this.getProvenienza == 'rilevazioni' ? 1 : 3
    };
  },
  computed: {
    hasContacts() {
      //TODO
      if (this.stiEmail && this.stiTelefono && this.stiPec && this.stiDirStrNome && this.stiDirStrEmail && this.stiDirStrTelReperibilita) {
        // if (this.stiEmail && this.stiTelefono){
        return true;
      }
      return false;
    },
    currentUser() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    getProvenienza() {
      return this.$store.getters["getProvenienza"];
    },
    assMedNoMmg() {
      return this.dropdowns?.assistenzaMedica?.find(
        assmed => assmed.assmedId === this.assmedId
      )?.assmedDesc;
    },
    editEnabled() {
      const roles = this.currentUser?.elencoProfilo;

      return !roles.some(
        role => role.nomeProfilo === RSA_RP || role.nomeProfilo === RSA_ASL
      );
    }
  },
  methods: {
    openInfoStruttura() {
      const data = {
        dialog: DIALOG_REFS.INFO_STRUTTURA,
        infoStruttura: this.$props
      };
      EventBus.$emit(EVENTS.OPEN_DIALOG, data);
    }
  }
};
</script>

<style></style>

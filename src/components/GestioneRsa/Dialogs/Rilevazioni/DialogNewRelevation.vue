<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico
    ref="dialog"
    :isNew="true"
    animated
    :open="open"
    :tipiStruttura="tipiStruttura"
    :tipiStrutturaFiltrati="relevations.listAvailableType"
    :strCategoriaIdToEdit="null"
    :postiTotali.sync="postiTotali"
    custom-buttons
    :stiNome="stiNome"
    :data="data"
    :loading="loading"
    :strTipoId="strTipoId"
    @closeDialog="closeDialog"
    @confirmDialog="sendPayload($event)"
    @chooseStructureType="chooseStructureType"
  >
    <template slot="head">
      <div class="text-h6" v-text="dialogTitle" />
    </template>
    <template slot="body">
      <div class="col-12">
        <q-linear-progress :value="(step + 1) / 9" rounded />
      </div>
      <div>
        <q-tab-panels keep-alive v-model="step" animated>
          <template v-if="!covid">
            <!-- POSTI -->
            <q-tab-panel class="no-padding overflow-hidden" :name="0">
              <form-posti
                ref="formPosti"
                :prefillData="relevations.posti"
                :postiTotali="postiTotali"
                :stiAdesioneDgr10="stiAdesioneDgr10"
                :stiAbilitatoSollievo= "stiAbilitatoSollievo"
                :stiAbilitatoDimProt= "stiAbilitatoDimProt"
                :stiAbilitatoCavs="stiAbilitatoCavs"
                :stiAbilitatoLungodeg="stiAbilitatoLungodeg"
                :stiAbilitatoHospice="stiAbilitatoHospice"
                :selected-structure-type="selectedStructureType"
              />
            </q-tab-panel>

            <!-- PERSONALE -->
            <q-tab-panel class="no-padding overflow-hidden" :name="1">
              <form-personale
                ref="formPersonaleA"
                :tipiPersonale="tipiPersonaleOptions"
                :persTipo="persTipoAssistenza.persTipoId"
                :prefillData="relevations.personaleA"
              />
            </q-tab-panel>

            <q-tab-panel class="no-padding overflow-hidden" :name="2">
              <form-personale
                ref="formPersonaleI"
                :tipiPersonale="tipiPersonaleOptions"
                :persTipo="persTipoInfermieristico.persTipoId"
                :prefillData="relevations.personaleI"
              />
            </q-tab-panel>

            <q-tab-panel class="no-padding overflow-hidden" :name="3">
              <form-personale
                ref="formPersonaleNS"
                :tipiPersonale="tipiPersonaleOptions"
                :persTipo="persTipoAltroNS.persTipoId"
                :prefillData="relevations.personaleNS"
              />
            </q-tab-panel>

            <q-tab-panel class="no-padding overflow-hidden" :name="4">
              <form-personale
                ref="formPersonale"
                :tipiPersonale="tipiPersonaleOptions"
                :persTipo="persTipoAltro.persTipoId"
                :prefillData="relevations.personale"
              />
            </q-tab-panel>

            <!-- TAMPONI MOLECOLARI -->
            <q-tab-panel class="no-padding overflow-hidden" :name="5">
              <form-tamponi
                ref="formTamponiO"
                :tipiTampone="tipiTamponeOptions"
                :tamponeCategorie="tamponeCategorieOptions"
                :tampCatId="tampCatOspiteId"
              />
            </q-tab-panel>

            <q-tab-panel class="no-padding overflow-hidden" :name="6">
              <form-tamponi
                ref="formTamponiP"
                :tipiTampone="tipiTamponeOptions"
                :tamponeCategorie="tamponeCategorieOptions"
                :tampCatId="tampCatPersonaleId"
              />
            </q-tab-panel>

<!--            <q-tab-panel class="no-padding overflow-hidden" :name="7">-->
<!--              <form-molecolari-->
<!--                ref="formMolecolariV"-->
<!--                :tipiTampone="tipiTamponeOptions"-->
<!--                :tamponeCategorie="tamponeCategorieOptions"-->
<!--                :tampCatId="tampCatVisitatoreId"-->
<!--              />-->
<!--            </q-tab-panel>-->

            <!-- TAMPONI RAPIDI -->
<!--            <q-tab-panel class="no-padding overflow-hidden" :name="8">-->
<!--              <form-rapidi-->
<!--                ref="formRapidiO"-->
<!--                :tipiTampone="tipiTamponeOptions"-->
<!--                :tamponeCategorie="tamponeCategorieOptions"-->
<!--                :tampCatId="tampCatOspite.tampCatId"-->
<!--              />-->
<!--            </q-tab-panel>-->

<!--            <q-tab-panel class="no-padding overflow-hidden" :name="9">-->
<!--              <form-rapidi-->
<!--                ref="formRapidiP"-->
<!--                :tipiTampone="tipiTamponeOptions"-->
<!--                :tamponeCategorie="tamponeCategorieOptions"-->
<!--                :tampCatId="tampCatPersonale.tampCatId"-->
<!--              />-->
<!--            </q-tab-panel>-->

<!--            <q-tab-panel class="no-padding overflow-hidden" :name="10">-->
<!--              <form-rapidi-->
<!--                ref="formRapidiV"-->
<!--                :tipiTampone="tipiTamponeOptions"-->
<!--                :tamponeCategorie="tamponeCategorieOptions"-->
<!--                :tampCatId="tampCatVisitatore.tampCatId"-->
<!--              />-->
<!--            </q-tab-panel>-->

            <!-- OSPITI -->
            <q-tab-panel class="no-padding overflow-hidden" :name="7">
              <form-ospiti ref="formOspiti" :prefillData="relevations.ospiti" />
            </q-tab-panel>

            <!-- DECESSI -->
            <q-tab-panel class="no-padding overflow-hidden" :name="8">
              <form-decessi
                ref="formDecessi"
                :prefillData="relevations.decessi"
              />
            </q-tab-panel>

            <q-tab-panel class="no-padding overflow-hidden" :name="9">
              <form-visitatori
                ref="formVisitatori"
                :prefillData="relevations.visitatori"
                :dropdown="optionsTipiVisite"
              />
            </q-tab-panel>
          </template>
        </q-tab-panels>
      </div>
    </template>

    <template slot="actions">
      <q-btn
        @click="closeDialog"
        label="annulla"
        color="primary"
        outline
        size="10pt"
        :disable="loading"
      />

      <q-btn
        :disable="step <= 0"
        @click="onBack"
        label="indietro"
        color="primary"
        size="10pt"
        :loading="loading"
      />

      <q-btn
        @click="nextStep"
        :label="nextLabel"
        color="primary"
        size="10pt"
        :loading="loading"
      />
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from "src/mixins/dialog_mixin";
import DialogGenerico from "./DialogGenerico.vue";
import {
  inserisciDecessi,
  inserisciOspiti,
  inserisciPersonale,
  inserisciPosti,
  inserisciTamponi,
  inserisciVisitatori,
  modificaDecessi,
  modificaOspiti,
  modificaPersonale,
  modificaPosti,
  modificaTamponi,
  modificaVisitatori
} from "src/services/api";
import FormPosti from "./Forms/FormPosti.vue";
import FormPersonale from "./Forms/FormPersonale.vue";
import FormTamponi from "./Forms/FormTamponi.vue";
import FormOspiti from "./Forms/FormOspiti.vue";
import FormDecessi from "./Forms/FormDecessi.vue";
import FormVisitatori from "./Forms/FormVisitatori.vue";
import { TYPES } from "src/store";

export default {
  components: {
    DialogGenerico,
    FormPosti,
    FormPersonale,
    FormTamponi,
    FormOspiti,
    FormDecessi,
    FormVisitatori
  },
  name: "DialogNewRelevation",
  mixins: [dialogMixin],
  data() {
    return {
      step: 0,
      strCatSel: null,
      relevations: {},
      postiTotali: 0,
      selectedStructureType: null,
    };
  },
  watch: {},
  computed: {
    listAvailableType() {
      if (this.relevations?.listAvailableType) {
        return this.relevations.listAvailableType;
      }
      return [];
    },
    nextLabel() {
      switch (this.step) {
        case 9:
          return "SALVA";

        default:
          return "AVANTI";
      }
    },
    tipiTamponeOptions() {
      return this.dropdowns?.tipiTampone;
    },
    tipiStrutturaOptions() {
      return this.dropdowns?.tipiStruttura;
    },
    tipiPersonaleOptions() {
      return this.dropdowns?.tipiPersonale;
    },
    persTipoAssistenza() {
      return this.tipiPersonaleOptions?.find(tipo => tipo.persTipoCod === "PA");
    },
    persTipoInfermieristico() {
      return this.tipiPersonaleOptions?.find(tipo => tipo.persTipoCod === "PI");
    },
    persTipoAltroNS() {
      return this.tipiPersonaleOptions?.find(
        tipo => tipo.persTipoCod === "ANS"
      );
    },
    persTipoAltro() {
      return this.tipiPersonaleOptions?.find(tipo => tipo.persTipoCod === "AS");
    },
    tamponeCategorieOptions() {
      return this.dropdowns?.tamponeCategorie;
    },
    optionsTipiVisite() {
      return this.dropdowns?.tipiVisite;
    },
    tampCatOspiteId() {

        let cat = null
        cat= this.tamponeCategorieOptions?.find(cat => cat.tampCatCod === "TO")
        if(!!cat){
            return cat.tampCatId
        }else return null
    },
    tampCatPersonaleId() {

        let cat = null
        cat= this.tamponeCategorieOptions?.find(cat => cat.tampCatCod === "TP")
        if(!!cat){
            return cat.tampCatId
        }else return null
    },

    strutturaSelected() {
      return this.$store.getters[TYPES.GETTERS.USER]?.elencoRsa?.find(
        strut => strut.idStruttura === this.idStruttura
      );
    }
  },
  methods: {
      chooseStructureType(type){
          this.selectedStructureType=type
      },
    onBack() {
      this.step--;
    },
    async nextStep() {
      if (this.step < 9) {
        let valid;
        switch (this.step) {
          case 0:
            valid = await this.$refs.formPosti.checkValid(this.strCategoriaId);

            break;

          case 1:
            valid = await this.$refs.formPersonaleA.checkValid(
              this.strCategoriaId
            );

            break;

          case 2:
            valid = await this.$refs.formPersonaleI.checkValid(
              this.strCategoriaId
            );

            break;

          case 3:
            valid = await this.$refs.formPersonaleNS.checkValid(
              this.strCategoriaId
            );

            break;

          case 4:
            valid = await this.$refs.formPersonale.checkValid(
              this.strCategoriaId
            );

            break;

          case 5:
            valid = await this.$refs.formTamponiO.checkValid(
              this.strCategoriaId
            );

            break;

          case 6:
            valid = await this.$refs.formTamponiP.checkValid(
              this.strCategoriaId
            );

            break;

          // case 7:
          //   valid = await this.$refs.formMolecolariV.checkValid(
          //     this.strCategoriaId
          //   );
          //
          //   break;

          // case 8:
          //   valid = await this.$refs.formRapidiO.checkValid(
          //     this.strCategoriaId
          //   );
          //
          //   break;
          //
          // case 9:
          //   valid = await this.$refs.formRapidiP.checkValid(
          //     this.strCategoriaId
          //   );
          //
          //   break;
          //
          // case 10:
          //   valid = await this.$refs.formRapidiV.checkValid(
          //     this.strCategoriaId
          //   );
          //
          //   break;

          case 7:
            valid = await this.$refs.formOspiti.checkValid(this.strCategoriaId);

            break;

          case 8:
            valid = await this.$refs.formDecessi.checkValid(
              this.strCategoriaId
            );

            break;

          case 9:
            valid = await this.$refs.formVisitatori.checkValid(
              this.strCategoriaId
            );

            break;

          default:
            break;
        }

        if (valid) {
          this.step++;
        }
      } else {
        this.sendPayload();
      }
    },
    prefillFormInputs(payload) {
      this.step = 0;
      if (payload) {
        if (this.editMode) {
          this.postiId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        if (!this.covid) {
          this.relevations = payload;
        }
      }
    },
    clearFormInputs() {
      this.postiId = null;
      this.dataRilevazione = null;
    },
    async checkValidSteps() {
      const valid = await this.$refs.dialog.checkValid();
      const validPosti = await this.$refs.formPosti.checkValid(
        this.strCategoriaId
      );

      const validPersonaleA = await this.$refs.formPersonaleA.checkValid(
        this.strCategoriaId
      );
      const validPersonaleI = await this.$refs.formPersonaleI.checkValid(
        this.strCategoriaId
      );
      const validPersonaleNS = await this.$refs.formPersonaleNS.checkValid(
        this.strCategoriaId
      );
      const validPersonale = await this.$refs.formPersonale.checkValid(
        this.strCategoriaId
      );
      const validOspiti = await this.$refs.formOspiti.checkValid(
        this.strCategoriaId
      );
      const validDecessi = await this.$refs.formDecessi.checkValid(
        this.strCategoriaId
      );
      const validTamponiO = await this.$refs.formTamponiO.checkValid(
        this.strCategoriaId
      );
      const validTamponiP = await this.$refs.formTamponiP.checkValid(
        this.strCategoriaId
      );
      // const validMolecolariV = await this.$refs.formMolecolariV.checkValid(
      //   this.strCategoriaId
      // );
      // const validRapidiO = await this.$refs.formRapidiO.checkValid(
      //   this.strCategoriaId
      // );
      // const validRapidiP = await this.$refs.formRapidiP.checkValid(
      //   this.strCategoriaId
      // );
      // const validRapidiV = await this.$refs.formRapidiV.checkValid(
      //   this.strCategoriaId
      // );
      const validVisitatori = await this.$refs.formVisitatori.checkValid(
        this.strCategoriaId
      );

      if (!validPosti) {
        this.step = 0;
      }
      // else if (!validPostiDgr) {
      //     this.step = 1;
      // }
      else if (!validPersonaleA) {
        this.step = 1;
      } else if (!validPersonaleI) {
        this.step = 2;
      } else if (!validPersonaleNS) {
        this.step = 3;
      } else if (!validPersonale) {
        this.step = 4;
      } else if (!validTamponiO) {
        this.step = 5;
      } else if (!validTamponiP) {
        this.step = 6;
      }
      // else if (!validMolecolariV) {
      //   this.step = 7;
      // }
      // else if (!validRapidiO) {
      //   this.step = 8;
      // } else if (!validRapidiP) {
      //   this.step = 9;
      // } else if (!validRapidiV) {
      //   this.step = 10;
      // }
      else if (!validOspiti) {
        this.step = 7;
      } else if (!validDecessi) {
        this.step = 8;
      } else if (!validVisitatori) {
        this.step = 9;
      } else if (valid) {
        return true;
      }

      return false;
    },
    async sendPayload() {
      const strCategoriaId = this.$refs.dialog.getTipoStruttura();
      const isValidForm = await this.checkValidSteps();

      if (isValidForm) {
        const tamponiOPayload = this.$refs.formTamponiO.getFormData();
        const tamponiPPayload = this.$refs.formTamponiP.getFormData();
        // const molecolariVPayload = this.$refs.formMolecolariV.getFormData();
        // const rapidiOPayload = this.$refs.formRapidiO.getFormData();
        // const rapidiPPayload = this.$refs.formRapidiP.getFormData();
        // const rapidiVPayload = this.$refs.formRapidiV.getFormData();
        const postiPayload = this.$refs.formPosti.getFormData();
        const personaleAPayload = this.$refs.formPersonaleA.getFormData();
        const personaleIPayload = this.$refs.formPersonaleI.getFormData();
        const personalePayloadNS = this.$refs.formPersonaleNS.getFormData();
        const personalePayload = this.$refs.formPersonale.getFormData();
        const ospitiPayload = this.$refs.formOspiti.getFormData();
        const decessiPayload = this.$refs.formDecessi.getFormData();
        const visitePayload = this.$refs.formVisitatori.getFormData();

        tamponiOPayload.idStruttura = this.idStruttura;
        tamponiOPayload.strCategoriaId = strCategoriaId;
        tamponiOPayload.dataRilevazione = this.data;

        const eventData = {
          payload: tamponiOPayload,
          func: await this.editMode ? modificaTamponi : inserisciTamponi,
          callbackDialog: null
        };

        this.confirmDialog(eventData);

        tamponiPPayload.idStruttura = this.idStruttura;
        tamponiPPayload.strCategoriaId = strCategoriaId;
        tamponiPPayload.dataRilevazione = this.data;

        eventData.payload = tamponiPPayload;

        this.confirmDialog(eventData);

        // molecolariVPayload.idStruttura = this.idStruttura;
        // molecolariVPayload.strCategoriaId = strCategoriaId;
        // molecolariVPayload.dataRilevazione = this.data;
        //
        // eventData.payload = molecolariVPayload;

        // this.confirmDialog(eventData);

        // rapidiOPayload.idStruttura = this.idStruttura;
        // rapidiOPayload.strCategoriaId = strCategoriaId;
        // rapidiOPayload.dataRilevazione = this.data;
        //
        // eventData.payload = rapidiOPayload;

        // this.confirmDialog(eventData);

        // rapidiPPayload.idStruttura = this.idStruttura;
        // rapidiPPayload.strCategoriaId = strCategoriaId;
        // rapidiPPayload.dataRilevazione = this.data;
        //
        // eventData.payload = rapidiPPayload;
        //
        // this.confirmDialog(eventData);

        // rapidiVPayload.idStruttura = this.idStruttura;
        // rapidiVPayload.strCategoriaId = strCategoriaId;
        // rapidiVPayload.dataRilevazione = this.data;
        //
        // eventData.payload = rapidiVPayload;
        //
        // this.confirmDialog(eventData);

        postiPayload.idStruttura = this.idStruttura;
        postiPayload.strCategoriaId = strCategoriaId;
        postiPayload.dataRilevazione = this.data;

        eventData.payload = postiPayload;
        eventData.func = await this.editMode ? modificaPosti : inserisciPosti;

        this.confirmDialog(eventData);

        personaleAPayload.idStruttura = this.idStruttura;
        personaleAPayload.strCategoriaId = strCategoriaId;
        personaleAPayload.dataRilevazione = this.data;

        eventData.payload = personaleAPayload;
        eventData.func = await this.editMode ? modificaPersonale : inserisciPersonale;

        this.confirmDialog(eventData);

        personaleIPayload.idStruttura = this.idStruttura;
        personaleIPayload.strCategoriaId = strCategoriaId;
        personaleIPayload.dataRilevazione = this.data;

        eventData.payload = personaleIPayload;

        this.confirmDialog(eventData);

        personalePayloadNS.idStruttura = this.idStruttura;
        personalePayloadNS.strCategoriaId = strCategoriaId;
        personalePayloadNS.dataRilevazione = this.data;

        eventData.payload = personalePayloadNS;

        this.confirmDialog(eventData);

        personalePayload.idStruttura = this.idStruttura;
        personalePayload.strCategoriaId = strCategoriaId;
        personalePayload.dataRilevazione = this.data;

        eventData.payload = personalePayload;

        this.confirmDialog(eventData);

        ospitiPayload.idStruttura = this.idStruttura;
        ospitiPayload.strCategoriaId = strCategoriaId;
        ospitiPayload.dataRilevazione = this.data;

        eventData.payload = ospitiPayload;
        eventData.func = await this.editMode ? modificaOspiti : inserisciOspiti;

        this.confirmDialog(eventData);

        decessiPayload.idStruttura = this.idStruttura;
        decessiPayload.strCategoriaId = strCategoriaId;
        decessiPayload.dataRilevazione = this.data;

        eventData.payload = decessiPayload;
        eventData.func = await this.editMode ? modificaDecessi : inserisciDecessi;
        eventData.callbackDialog = this.closeDialog;

        this.confirmDialog(eventData);

        visitePayload.idStruttura = this.idStruttura;
        visitePayload.strCategoriaId = strCategoriaId;
        visitePayload.dataRilevazione = this.data;

        eventData.payload = visitePayload;
        eventData.func = await this.editMode
          ? modificaVisitatori
          : inserisciVisitatori;
        eventData.callbackDialog = this.closeDialog;

        this.confirmDialog(eventData);

        // EventBus.$emit(EVENTS.RELOAD_RELEVATIONS)
      }
    }
  }
};
</script>

<style></style>

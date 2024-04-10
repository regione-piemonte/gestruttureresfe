<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico
    :open="open"
    :strCategoriaIdToEdit="strCategoriaId"
    :tipiStruttura="tipiStruttura"
    :stiNome="stiNome"
    :data="data"
    :loading="loading"
    :strTipoId="strTipoId"
    @closeDialog="closeDialog"
    @confirmDialog="sendPayload($event)"
    @chooseStructureType="chooseStructureType"
  >
    <template slot="head">
      <div class="text-h6" v-text="`${dialogTitle} POSTI`"></div>
    </template>
    <template slot="body">
      <q-form ref="form">
        <div class="row q-mt-md q-mb-xs q-col-gutter-md">
          <div class="text-h6  col-12">
            Posti totali struttura
          </div>
          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Occupati"
            v-model.number="counterPostiTotaliOccupati"
            type="number"
            stack-label
            dense
            outlined
            disable
            input-class="text-black text-bold"
          >
          </q-input>
          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Liberi"
            v-model.number="counterPostiTotaliLiberi"
            type="number"
            stack-label
            dense
            outlined
            disable
            input-class="text-black text-bold"
          >
          </q-input>
          <div class="text-h6  col-12">Posti residenziali</div>
          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Totale occupati"
            v-model.number="postiOccupatiTot"
            disable
            type="number"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
          </q-input>

          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Totale liberi"
            disable
            v-model.number="postiLiberiTot"
            type="number"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
          </q-input>

          <!--          <div class="col-12 text-h6">Posti - Occupati</div>-->
          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Occupati paganti in proprio"
            v-model.number="postiNumPaganti"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />

          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Di cui scelta sociale"
            v-model.number="postiNumPagantiSceltaSociale"
            type="number"
            :min="0"
            :max="postiNumPaganti"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired, ruleSS]"
          >
            <q-tooltip max-width="300px">
              <div class="text-body2">
                In questo campo va inserito il numero di posti letto occupati
                paganti in proprio che hanno ottenuto il buono residenzialitÃ 
                (scelta sociale)
              </div>
            </q-tooltip>
          </q-input>

          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Occupati convenzionati"
            v-model.number="postiNumConvenzionati"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
            <q-tooltip max-width="300px">
              <div class="text-body2">
                In questo campoÂ  va inserito il numero totale di posti letto
                occupati convenzionati ESCLUSI: posti occupati letti di
                sollievo, dimissioni protette, CAVS, lungodegenze che hanno
                sezioni specifiche dedicate.
              </div>
            </q-tooltip>
          </q-input>

          <!--          <div class="col-12 text-h6">Posti - Liberi</div>-->
          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Liberi - Donne"
            v-model.number="postiNumLiberiTotDonne"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
            <q-tooltip max-width="300px">
              <div class="text-body2">
                In questo campo va inserito il numero totale di posti letto
                liberi donne ESCLUSI quelli che avete inserito come liberi nelle
                sezioni dedicate (SE precedentemente ABILITATE): letti di
                sollievo, dimissioni protette, CAVS, lungodegenze, hospice.
              </div>
            </q-tooltip>
          </q-input>

          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Liberi - Uomini"
            v-model.number="postiNumLiberiTotUomini"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
            <q-tooltip max-width="300px">
              <div class="text-body2">
                In questo campo va inserito il numero totale di posti letto
                liberi uomini ESCLUSI quelli che avete inserito come liberi
                nelle sezioni dedicate (SE precedentemente ABILITATE): letti di
                sollievo, dimissioni protette, CAVS, lungodegenze, hospice.
              </div>
            </q-tooltip>
          </q-input>

          <q-input
            class="col-md-6 col-12 "
            label-color="black"
            label="Liberi - Indifferenti"
            v-model.number="postiNumLiberiTotIndifferenti"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          >
            <q-tooltip max-width="300px">
              <div class="text-body2">
                In questo campo va inserito il numero totale di posti letto
                liberi indifferenti ESCLUSI quelli che avete inserito come
                liberi nelle sezioni dedicate (SE precedentemente ABILITATE):
                letti di sollievo, dimissioni protette, CAVS, lungodegenze,
                hospice.
              </div>
            </q-tooltip>
          </q-input>

          <template v-if="stiAbilitatoSollievo">
            <div class="text-h6  col-12">Posti di sollievo</div>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Occupati"
              v-model.number="postiNumOccupatiSollievo"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi"
              v-model.number="postiNumLiberiSollievo"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              disable
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Donne"
              v-model.number="postiNumLiberiDonneSollievo"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Uomini"
              v-model.number="postiNumLiberiUominiSollievo"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Indifferenti"
              v-model.number="postiNumLiberiIndifferentiSollievo"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>
          </template>

          <template v-if="stiAbilitatoDimProt">
            <div class="col-12 text-h6 ">Posti dimissioni protette (DGR10)</div>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Occupati"
              v-model.number="postiNumOccupatiDimissioni"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi"
              v-model.number="postiNumLiberiDimissioni"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              disable
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Donne"
              v-model.number="postiNumLiberiDonneDimissioni"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Uomini"
              v-model.number="postiNumLiberiUominiDimissioni"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Indifferenti"
              v-model.number="postiNumLiberiIndifferentiDimissioni"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>
          </template>

          <template v-if="stiAbilitatoCavs">
            <div class="col-12 text-h6 ">Posti CAVS</div>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Occupati"
              v-model.number="postiNumOccupatiCavs"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi"
              v-model.number="postiNumLiberiCavs"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              disable
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Donne"
              v-model.number="postiNumLiberiDonneCavs"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Uomini"
              v-model.number="postiNumLiberiUominiCavs"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Indifferenti"
              v-model.number="postiNumLiberiIndifferentiCavs"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>
          </template>
          <template v-if="stiAbilitatoLungodeg">
            <div class="col-12 text-h6 ">Posti Lungodegenze</div>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Occupati"
              v-model.number="postiNumOccupatiLungodegenze"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi"
              v-model.number="postiNumLiberiLungodegenze"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              disable
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Donne"
              v-model.number="postiNumLiberiDonneLungodegenze"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Uomini"
              v-model.number="postiNumLiberiUominiLungodegenze"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Indifferenti"
              v-model.number="postiNumLiberiIndifferentiLungodegenze"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>
          </template>
          <template v-if="stiAbilitatoHospice">
            <div class="col-12 text-h6 ">Posti Hospice</div>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Occupati"
              v-model.number="postiNumOccupatiHospice"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi"
              v-model.number="postiNumLiberiHospice"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              disable
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Donne"
              v-model.number="postiNumLiberiDonneHospice"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Uomini"
              v-model.number="postiNumLiberiUominiHospice"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              class="col-12 col-md-6 "
              label-color="black"
              label="Liberi - Indifferenti"
              v-model.number="postiNumLiberiIndifferentiHospice"
              type="number"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :min="0"
              :rules="[ruleRequired]"
            >
            </q-input>
          </template>
        </div>

        <q-separator />

        <div class="text-h6 q-mt-xs">Ospedalizzazioni</div>

        <div class="row q-mt-md q-mb-xs">
          <q-input
            class="col-6 q-pr-sm"
            label-color="black"
            label="Osped. COV + NON COV"
            v-model.number="postiNumOspedalizzati"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />

          <q-input
            class="col-6 q-pl-sm"
            label-color="black"
            label="Invii in Pronto Soccorso"
            v-model.number="accessiInPsNum"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />
        </div>
        <q-separator />

        <div class="text-h6 q-mt-xs">Stanze singole</div>
        <div class="row q-mt-md">
          <!-- :disable="editMode" -->

          <q-input
            class="col-md-6 col-12"
            label-color="black"
            label="Libere"
            v-model.number="postiNumSingoleResidue"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />
        </div>
      </q-form>
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from "src/mixins/dialog_mixin";
import DialogGenerico from "./DialogGenerico.vue";
import { inserisciPosti, modificaPosti } from "src/services/api";

export default {
  components: { DialogGenerico },
  name: "DialogRilevazioniPosti",
  mixins: [dialogMixin],
  data() {
    return {
      postiNumLiberiTotDonne: null,
      postiNumLiberiTotUomini: null,
      postiNumLiberiTotIndifferenti: null,
      selectedStructureType: null,
      postiNumPagantiSceltaSociale: null,
      postiNumOccupatiSollievo: null,
      postiNumLiberiDonneSollievo: null,
      postiNumLiberiUominiSollievo: null,
      postiNumLiberiIndifferentiSollievo: null,
      postiNumOccupatiDimissioni: null,
      postiNumLiberiUominiDimissioni: null,
      postiNumLiberiDonneDimissioni: null,
      postiNumLiberiIndifferentiDimissioni: null,
      postiNumOccupatiCavs: null,
      postiNumLiberiUominiCavs: null,
      postiNumLiberiDonneCavs: null,
      postiNumLiberiIndifferentiCavs: null,
      postiNumOccupatiHospice: null,
      postiNumLiberiUominiHospice: null,
      postiNumLiberiDonneHospice: null,
      postiNumLiberiIndifferentiHospice: null,
      postiNumOccupatiLungodegenze: null,
      postiNumLiberiUominiLungodegenze: null,
      postiNumLiberiDonneLungodegenze: null,
      postiNumLiberiIndifferentiLungodegenze: null,
      postiId: null,
      dataRilevazione: null,
      strCategoriaId: null,
      postiNumPaganti: null,
      postiNumConvenzionati: null,
      postiNumOspedalizzati: null,
      postiNumSingoleResidue: null,
      accessiInPsNum: null
    };
  },
  created() {},
  watch: {
    accessiInPsNum: function(newVal, oldVal) {
      if (newVal < 0) {
        this.accessiInPsNum = 0;
      }
    },

    postiNumOspedalizzati: function(newVal, oldVal) {
      if (newVal < 0) {
        this.postiNumOspedalizzati = 0;
      }
    }
  },
  computed: {
    counterPostiTotaliOccupati() {
      return (
        (this.postiOccupatiTot ?? 0) +
        (this.postiNumOccupatiSollievo ?? 0) +
        (this.postiNumOccupatiDimissioni ?? 0) +
        (this.postiNumOccupatiCavs ?? 0) +
        (this.postiNumOccupatiHospice ?? 0) +
        (this.postiNumOccupatiLungodegenze ?? 0)
      );
    },
    counterPostiTotaliLiberi() {
        return this.postiLiberiTot +
            this.postiNumLiberiSollievo +
            this.postiNumLiberiDimissioni  +
            this.postiNumLiberiCavs  +
            this.postiNumLiberiHospice  +
            this.postiNumLiberiLungodegenze ;
    },
    ruleSS() {
      return v => v <= this.postiNumPaganti || "Valore troppo alto";
    },
    ruleMinLiberi() {
      return v => v >= this.postiLiberiTotMin || "Valore troppo basso";
    },
    postiLiberiTotMin() {
      return (
        (this.postiNumLiberiSollievo ?? 0) +
        (this.postiNumLiberiCavs ?? 0) +
        (this.postiNumLiberiDimissioni ?? 0) +
        (this.postiNumLiberiLungodegenze ?? 0) +
        (this.postiNumLiberiHospice ?? 0)
      );
    },
    postiNumLiberiSollievo() {
      return (
        (this.postiNumLiberiDonneSollievo ?? 0) +
        (this.postiNumLiberiUominiSollievo ?? 0) +
        (this.postiNumLiberiIndifferentiSollievo ?? 0)
      );
      //SOMMA DEI LIBERI SOLLIEVO
    },
    postiNumLiberiLungodegenze() {
      return (
        (this.postiNumLiberiDonneLungodegenze ?? 0) +
        (this.postiNumLiberiUominiLungodegenze ?? 0) +
        (this.postiNumLiberiIndifferentiLungodegenze ?? 0)
      );
      //SOMMA DEI LIBERI CAVS
    },
    postiNumLiberiCavs() {
      return (
        (this.postiNumLiberiDonneCavs ?? 0) +
        (this.postiNumLiberiUominiCavs ?? 0) +
        (this.postiNumLiberiIndifferentiCavs ?? 0)
      );
      //SOMMA DEI LIBERI HOSPICE
    },
    postiNumLiberiHospice() {
      return (
        (this.postiNumLiberiDonneHospice ?? 0) +
        (this.postiNumLiberiUominiHospice ?? 0) +
        (this.postiNumLiberiIndifferentiHospice ?? 0)
      );
      //SOMMA DEI LIBERI DIMISSIONI
    },
    postiNumLiberiDimissioni() {
      return (
        (this.postiNumLiberiDonneDimissioni ?? 0) +
        (this.postiNumLiberiUominiDimissioni ?? 0) +
        (this.postiNumLiberiIndifferentiDimissioni ?? 0)
      );
    },
    ruleTotaleOccupati() {
      return v => v >= this.postiOccupatiTot || "Totale troppo basso";
    },
    postiOccupatiTot() {
      return this.postiNumPaganti + this.postiNumConvenzionati;
    },

    postiLiberiTot() {
      return (
        (this.postiNumLiberiTotDonne ?? 0) +
        (this.postiNumLiberiTotUomini ?? 0) +
        (this.postiNumLiberiTotIndifferenti ?? 0)
      );
    }
  },
  methods: {
    chooseStructureType(type) {
      this.selectedStructureType = type;
    },
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.postiId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }
        this.strCategoriaId = payload.strCategoriaId;
        this.postiLiberiTot = payload.postiNumLiberi;
        this.postiNumLiberiTotUomini = payload.postiNumLiberiUomini;
        this.postiNumLiberiTotDonne = payload.postiNumLiberiDonne;
        this.postiNumLiberiTotIndifferenti = payload.postiNumLiberiIndiff;
        this.postiNumOccupati = payload.postiNumOccupati;
        this.postiNumOspedalizzati = payload.postiNumOspedalizzati;
        this.postiNumSingoleResidue = payload.postiNumSingoleResidue;
        this.accessiInPsNum = payload.accessiInPsNum;
        this.postiNumConvenzionati = payload.postiNumOccupatiConvenzionati;
        this.postiNumPaganti = payload.postiNumOccupatiPaganti;
        this.postiNumPagantiSceltaSociale = payload.postiNumOccupatiPagantiSs;
        this.postiNumOccupatiSollievo = payload.postiNumSollievoOccupati;
        this.postiNumLiberiUominiSollievo =
          payload.postiNumSollievoLiberiUomini;
        this.postiNumLiberiDonneSollievo = payload.postiNumSollievoLiberiDonne;
        this.postiNumLiberiIndifferentiSollievo =
          payload.postiNumSollievoLiberiIndiff;
        this.postiNumOccupatiDimissioni = payload.postiNumDimProtOccupati;
        this.postiNumLiberiUominiDimissioni =
          payload.postiNumDimProtLiberiUomini;
        this.postiNumLiberiDonneDimissioni = payload.postiNumDimProtLiberiDonne;
        (this.postiNumLiberiIndifferentiDimissioni =
          payload.postiNumDimProtLiberiIndiff),
          (this.postiNumOccupatiCavs = payload.postiNumCavsOccupati),
          (this.postiNumLiberiUominiCavs = payload.postiNumCavsLiberiUomini),
          (this.postiNumLiberiDonneCavs = payload.postiNumCavsLiberiDonne),
          (this.postiNumLiberiIndifferentiCavs =
            payload.postiNumCavsLiberiIndiff),
          (this.postiNumOccupatiLungodegenze =
            payload.postiNumLungodegOccupati),
          (this.postiNumLiberiUominiLungodegenze =
            payload.postiNumLungodegLiberiUomini),
          (this.postiNumLiberiDonneLungodegenze =
            payload.postiNumLungodegLiberiDonne),
          (this.postiNumLiberiIndifferentiLungodegenze =
            payload.postiNumLungodegLiberiIndiff),
          (this.postiNumOccupatiHospice = payload.postiNumHospiceOccupati),
          (this.postiNumLiberiUominiHospice =
            payload.postiNumHospiceLiberiUomini),
          (this.postiNumLiberiDonneHospice =
            payload.postiNumHospiceLiberiDonne),
          (this.postiNumLiberiIndifferentiHospice =
            payload.postiNumHospiceLiberiIndiff);
      }
    },
    clearFormInputs() {
      this.postiNumLiberiTotDonne = null;
      this.postiNumLiberiTotUomini = null;
      this.postiNumLiberiTotIndifferenti = null;
      this.postiNumPagantiSceltaSociale = null;
      this.postiNumOccupatiSollievo = null;
      this.postiNumLiberiDonneSollievo = null;
      this.postiNumLiberiUominiSollievo = null;
      this.postiNumLiberiIndifferentiSollievo = null;
      this.postiNumOccupatiDimissioni = null;
      this.postiNumLiberiUominiDimissioni = null;
      this.postiNumLiberiDonneDimissioni = null;
      this.postiNumLiberiIndifferentiDimissioni = null;
      this.postiNumOccupatiCavs = null;
      this.postiNumLiberiUominiCavs = null;
      this.postiNumLiberiDonneCavs = null;
      this.postiNumLiberiIndifferentiCavs = null;
      this.postiNumOccupatiHospice = null;
      this.postiNumLiberiUominiHospice = null;
      this.postiNumLiberiDonneHospice = null;
      this.postiNumLiberiIndifferentiHospice = null;
      this.postiNumOccupatiLungodegenze = null;
      this.postiNumLiberiUominiLungodegenze = null;
      this.postiNumLiberiDonneLungodegenze = null;
      this.postiNumLiberiIndifferentiLungodegenze = null;
      this.postiId = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
      this.postiNumOspedalizzati = null;
      this.postiNumConvenzionati = null;
      this.postiNumPaganti = null;
      this.postiNumSingoleResidue = null;
      this.accessiInPsNum = null;
    },
    async sendPayload({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate();
      if (!this.stiAdesioneDgr10) {
      }
      if (isValidForm) {
        const payload = {
          postiId: this.postiId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.data,
          strCategoriaId: strCategoriaId,
          // postiNumTotali: this.postiNumTotali,
          postiNumOccupati: this.postiOccupatiTot,
          postiNumOccupatiConvenzionati: this.postiNumConvenzionati,
          postiNumOccupatiPaganti: this.postiNumPaganti,
          postiNumOspedalizzati: this.postiNumOspedalizzati,
          // postiNumTotaliSingole: this.postiNumTotaliSingole,
          postiNumSingoleResidue: this.postiNumSingoleResidue,
          accessiInPsNum: this.accessiInPsNum,
          postiNumLiberiUomini: this.postiNumLiberiTotUomini,
          postiNumLiberiDonne: this.postiNumLiberiTotDonne,
          postiNumLiberiIndiff: this.postiNumLiberiTotIndifferenti,
          postiNumLiberi: this.postiLiberiTot ?? 0,
          postiNumOccupatiPagantiSs: this.postiNumPagantiSceltaSociale,
          postiNumSollievoOccupati: this.postiNumOccupatiSollievo,
          postiNumSollievoLiberi: this.postiNumLiberiSollievo,
          postiNumSollievoLiberiUomini: this.postiNumLiberiUominiSollievo,
          postiNumSollievoLiberiDonne: this.postiNumLiberiDonneSollievo,
          postiNumSollievoLiberiIndiff: this.postiNumLiberiIndifferentiSollievo,
          postiNumDimProtOccupati: this.postiNumOccupatiDimissioni,
          postiNumDimProtLiberi: this.postiNumLiberiDimissioni,
          postiNumDimProtLiberiUomini: this.postiNumLiberiUominiDimissioni,
          postiNumDimProtLiberiDonne: this.postiNumLiberiDonneDimissioni,
          postiNumDimProtLiberiIndiff: this
            .postiNumLiberiIndifferentiDimissioni,
          postiNumCavsOccupati: this.postiNumOccupatiCavs,
          postiNumCavsLiberi: this.postiNumLiberiCavs,
          postiNumCavsLiberiUomini: this.postiNumLiberiUominiCavs,
          postiNumCavsLiberiDonne: this.postiNumLiberiDonneCavs,
          postiNumCavsLiberiIndiff: this.postiNumLiberiIndifferentiCavs,
          postiNumLungodegOccupati: this.postiNumOccupatiLungodegenze,
          postiNumLungodegLiberi: this.postiNumLiberiLungodegenze,
          postiNumLungodegLiberiUomini: this.postiNumLiberiUominiLungodegenze,
          postiNumLungodegLiberiDonne: this.postiNumLiberiDonneLungodegenze,
          postiNumLungodegLiberiIndiff: this
            .postiNumLiberiIndifferentiLungodegenze,
          postiNumHospiceOccupati: this.postiNumOccupatiHospice,
          postiNumHospiceLiberi: this.postiNumLiberiHospice,
          postiNumHospiceLiberiUomini: this.postiNumLiberiUominiHospice,
          postiNumHospiceLiberiDonne: this.postiNumLiberiDonneHospice,
          postiNumHospiceLiberiIndiff: this.postiNumLiberiIndifferentiHospice
        };

        const eventData = {
          payload: payload,
          func: await this.editMode ? modificaPosti : inserisciPosti,
          callbackDialog: this.closeDialog
        };

        this.confirmDialog(eventData);
      }
    }
  }
};
</script>

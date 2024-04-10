<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico
    :strCategoriaIdToEdit="strCategoriaId"
    :open="open"
    :tipiStruttura="tipiStruttura"
    :stiNome="stiNome"
    :data="data"
    :loading="loading"
    :strTipoId="strTipoId"
    @closeDialog="closeDialog"
    @confirmDialog="sendPayload($event)"
  >
    <template slot="head">
      <div class="text-h6" v-text="`${dialogTitle} OSPITI`" />
    </template>

    <template slot="body">
      <q-form ref="form">
        <div class="text-h6 q-mt-xs">Ospiti</div>
        <div class="row q-mt-none">
          <!--          <q-input-->
          <!--            class="col-4 q-pr-sm"-->
          <!--            label-color="black"-->
          <!--            label="Sospetti COVID"-->
          <!--            v-model.number="covidNumSospetti"-->
          <!--            type="number"-->
          <!--            :min="0"-->
          <!--            dense-->
          <!--            outlined-->
          <!--            input-class="text-black text-bold"-->
          <!--            :disable="loading"-->
          <!--            :rules="[ruleRequired]" />-->

          <!--          <q-input-->
          <!--            class="col-4 q-px-sm"-->
          <!--            label-color="black"-->
          <!--            label="Isolati COVID"-->
          <!--            v-model.number="covidNumIsolati"-->
          <!--            type="number"-->
          <!--            :min="0"-->
          <!--            dense-->
          <!--            outlined-->
          <!--            input-class="text-black text-bold"-->
          <!--            :disable="loading"-->
          <!--            :rules="[ruleRequired]" />-->

          <!--          <q-input-->
          <!--            class="col-4 q-pl-sm"-->
          <!--            label-color="black"-->
          <!--            label="Ospedalizzati con COVID"-->
          <!--            v-model.number="covidNumOspedalizzati"-->
          <!--            type="number"-->
          <!--            :min="0"-->
          <!--            dense-->
          <!--            outlined-->
          <!--            input-class="text-black text-bold"-->
          <!--            :disable="loading"-->
          <!--            :rules="[ruleRequired]" />-->
          <q-input
            class="col-12 "
            label-color="black"
            label="Isolati COVID"
            v-model.number="covidNumIsolati"
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
import { inserisciOspiti, modificaOspiti } from "src/services/api";

export default {
  components: { DialogGenerico },
  name: "DialogRilevazioniOspiti",
  mixins: [dialogMixin],
  data() {
    return {
      covidId: null,
      categoriaOptions: [],
      // covidNumSospetti: 0,
      covidNumIsolati: 0
      // covidNumOspedalizzati: 0
    };
  },
  watch: {
    // covidNumSospetti: function (newVal, oldVal) {
    //     if (newVal < 0) {
    //         this.covidNumSospetti = 0
    //     }
    // },
    covidNumIsolati: function(newVal, oldVal) {
      if (newVal < 0) {
        this.covidNumIsolati = 0;
      }
    }
    // covidNumOspedalizzati: function (newVal, oldVal) {
    //     if (newVal < 0) {
    //         this.covidNumOspedalizzati = 0
    //     }
    // },
  },
  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.covidId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        this.strCategoriaId = payload.strCategoriaId;
        // this.covidNumSospetti = payload.covidNumSospetti
        this.covidNumIsolati = payload.covidNumIsolati;
        // this.covidNumOspedalizzati = payload.covidNumOspedalizzati
      }
    },
    clearFormInputs() {
      this.covidId = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
      // this.covidNumSospetti = 0
      this.covidNumIsolati = 0;
      // this.covidNumOspedalizzati = 0
    },
    async sendPayload({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate();

      if (isValidForm) {
        const payload = {
          covidId: this.covidId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.data,
          strCategoriaId: strCategoriaId,
          // covidNumSospetti: this.covidNumSospetti,
          covidNumIsolati: this.covidNumIsolati
          // covidNumOspedalizzati: this.covidNumOspedalizzati
        };

        const eventData = {
          payload: payload,
          func: this.editMode ? modificaOspiti : inserisciOspiti,
          callbackDialog: this.closeDialog
        };

        this.confirmDialog(eventData);
      }
    }
  }
};
</script>

<style></style>

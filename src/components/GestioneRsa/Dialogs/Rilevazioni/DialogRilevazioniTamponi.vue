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
  >
    <template slot="head">
      <div class="text-h6" v-text="`${dialogTitle} TAMPONI`" />
    </template>

    <template slot="body">
      <q-form ref="form">
        <div class="text-h6 q-mt-xs">Tamponi</div>

        <div class="row q-mt-md justify-end q-col-gutter-md">
          <template v-if="editMode">
            <q-select
              class="col-12"
              label-color="black"
              label="Categoria"
              v-model="tampCatId"
              :options="categoriaOptions"
              option-value="tampCatId"
              option-label="tampCatDesc"
              emit-value
              map-options
              dense
              outlined
              input-class="text-black text-bold"
              :disable="loading || editMode"
              :rules="[ruleRequired]"
            />
          </template>

          <q-input
            class="col-md-4 col-12 "
            label-color="black"
            label="Positivi"
            v-model.number="tampNumPositivi"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />

          <q-input
            class="col-md-4 col-12 "
            label-color="black"
            label="Negativi"
            v-model.number="tampNumNegativi"
            type="number"
            :min="0"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
          />

          <!--      <q-input-->
          <!--        class="col-3 q-px-sm"-->
          <!--        label-color="black"-->
          <!--        label="Dubbi"-->
          <!--        v-model.number="tampNumDubbi"-->
          <!--        type="number"-->
          <!--        :min="0"-->
          <!--        stack-label-->
          <!--        dense-->
          <!--        outlined-->
          <!--        input-class="text-black text-bold"-->
          <!--        :rules="[ruleRequired]" />-->

          <!--      <q-input-->
          <!--        class="col-3 q-pl-sm"-->
          <!--        label-color="black"-->
          <!--        label="Indeterminati"-->
          <!--        v-model.number="tampNumIndeterminati"-->
          <!--        type="number"-->
          <!--        :min="0"-->
          <!--        stack-label-->
          <!--        dense-->
          <!--        outlined-->
          <!--        input-class="text-black text-bold"-->
          <!--        :rules="[ruleRequired]" />-->

          <q-input
            class="col-md-4 col-12 "
            label-color="black"
            label="Totali"
            :value="tampNumTotali"
            type="number"
            stack-label
            dense
            outlined
            input-class="text-black text-bold"
            disable
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
import { inserisciTamponi, modificaTamponi } from "src/services/api";

export default {
  components: { DialogGenerico },
  name: "DialogRilevazioniTamponi",
  mixins: [dialogMixin],
  data() {
    return {
      tampId: null,
      strTipoTamponeCod: "T",
      tampCatId: null,
      tampNumPositivi: 0,
      tampNumNegativi: 0
      // tampNumDubbi: 0,
      // tampNumIndeterminati: 0
    };
  },
  computed: {
    tampNumTotali() {
      return this.tampNumPositivi + this.tampNumNegativi;
    },
    tipoTamponeOptions() {
      return this.dropdowns?.tipiTampone;
    },
    categoriaOptions() {
      return this.dropdowns?.tamponeCategorie;
    },
    strTipoTamponeId() {
      return this.tipoTamponeOptions?.find(
        tampone => tampone.strTipoTamponeCod === this.strTipoTamponeCod
      )?.strTipoTamponeId;
    }
  },
  watch: {
    tampNumPositivi: function(newVal, oldVal) {
      if (newVal < 0) {
        this.tampNumPositivi = 0;
      }
    },
    tampNumNegativi: function(newVal, oldVal) {
      if (newVal < 0) {
        this.tampNumNegativi = 0;
      }
    }
    // tampNumDubbi: function (newVal, oldVal) {
    //     if (newVal < 0) {
    //         this.tampNumDubbi = 0
    //     }
    // },
    // tampNumIndeterminati: function (newVal, oldVal) {
    //     if (newVal < 0) {
    //         this.tampNumIndeterminati = 0
    //     }
    // },
  },
  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.tampId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        this.strCategoriaId = payload.strCategoriaId;
        this.tampCatId = payload.tampCatId;
        this.tampNumPositivi = payload.tampNumPositivi;
        this.tampNumNegativi = payload.tampNumNegativi;
        // this.tampNumDubbi = payload.tampNumDubbi
        // this.tampNumIndeterminati = payload.tampNumIndeterminati
      }
    },
    clearFormInputs() {
      this.tampId = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
      this.tampCatId = null;
      this.tampNumPositivi = 0;
      this.tampNumNegativi = 0;
      // this.tampNumDubbi = 0
      // this.tampNumIndeterminati = 0
    },
    async sendPayload({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate();

      if (isValidForm) {
        const payload = {
          tampId: this.tampId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.data,
          strCategoriaId: strCategoriaId,
          strTipoTamponeId: this.strTipoTamponeId,
          tampCatId: this.tampCatId,
          tampNumTotali: this.tampNumTotali,
          tampNumPositivi: this.tampNumPositivi,
          tampNumNegativi: this.tampNumNegativi
          // tampNumDubbi: this.tampNumDubbi,
          // tampNumIndeterminati: this.tampNumIndeterminati
        };

        const eventData = {
          payload: payload,
          func: this.editMode ? modificaTamponi : inserisciTamponi,
          callbackDialog: this.closeDialog
        };

        this.confirmDialog(eventData);
      }
    }
  }
};
</script>

<style></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-form ref="form">
    <div class="text-h6 q-mt-xs">Ospiti</div>
    <div class="row q-col-gutter-md q-mt-md">
      <!--      <q-input-->
      <!--        class="col-4 q-pr-sm"-->
      <!--        label-color="black"-->
      <!--        label="Sospetti COVID"-->
      <!--        v-model.number="covidNumSospetti"-->
      <!--        type="number"-->
      <!--        :min="0"-->
      <!--        stack-label-->
      <!--        dense-->
      <!--        outlined-->
      <!--        input-class="text-black text-bold"-->
      <!--        :rules="[ruleRequired]" />-->

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

      <!--      <q-input-->
      <!--        class="col-4 q-pl-sm"-->
      <!--        label-color="black"-->
      <!--        label="Ospedalizzati con COVID"-->
      <!--        v-model.number="covidNumOspedalizzati"-->
      <!--        type="number"-->
      <!--        :min="0"-->
      <!--        stack-label-->
      <!--        dense-->
      <!--        outlined-->
      <!--        input-class="text-black text-bold"-->
      <!--        :rules="[ruleRequired]" />-->
    </div>
  </q-form>
</template>

<script>
export default {
  name: "FormOspiti",
  props: {
    strTipoId: { type: Number },
    idStruttura: { type: String },
    prefillData: { type: Object }
  },
  data() {
    return {
      covidId: null,
      categoriaOptions: [],
      // covidNumSospetti: null,
      covidNumIsolati: 0
      // covidNumOspedalizzati: null
    };
  },
  created() {
    // this.prefillFormInputs(this.prefillData)
  },
  computed: {
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    }
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
        this.covidNumSospetti = payload.covidNumSospetti;
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
    async checkValid() {
      return await this.$refs.form.validate();
    },
    getFormData(strCategoriaId) {
      const payload = {
        covidId: this.covidId,
        idStruttura: this.idStruttura,
        dataRilevazione: this.data,
        strCategoriaId: strCategoriaId,
        // covidNumSospetti: this.covidNumSospetti,
        covidNumIsolati: this.covidNumIsolati
        // covidNumOspedalizzati: this.covidNumOspedalizzati
      };

      return payload;
    }
  }
};
</script>

<style></style>

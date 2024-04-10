<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-form ref="form">
    <div class="text-h6 q-mt-xs">Tamponi - {{ tampCat }}</div>
    <div class="row q-col-gutter-md q-mt-md justify-end">
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

<script>
export default {
  name: "FormTamponi",
  props: {
    tipiTampone: { type: Array, required: true },
    tamponeCategorie: { type: Array, required: true },
    tampCatId: { type: Number, required: true },
    strTipoId: { type: Number },
    idStruttura: { type: String }
  },
  data() {
    return {
      tampId: null,
      strTipoTamponeCod: "T",
      tampNumPositivi: 0,
      tampNumNegativi: 0
      // tampNumDubbi: null,
      // tampNumIndeterminati: null
    };
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
  computed: {
    tampNumTotali() {
      return this.tampNumPositivi + this.tampNumNegativi;
    },
    strTipoTamponeId() {
      return this.tipiTampone?.find(
        tampone => tampone.strTipoTamponeCod === this.strTipoTamponeCod
      )?.strTipoTamponeId;
    },
    tampCat() {
      return this.tamponeCategorie?.find(
        tipo => tipo.tampCatId === this.tampCatId
      )?.tampCatDesc;
    },
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    }
  },
  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.tampId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        this.strCategoriaId = payload.strCategoriaId;
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
      this.tampNumPositivi = 0;
      this.tampNumNegativi = 0;
      // this.tampNumDubbi = 0
      // this.tampNumIndeterminati = 0
    },
    async checkValid() {
      return await this.$refs.form.validate();
    },
    getFormData(strCategoriaId) {
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

      return payload;
    }
  }
};
</script>

<style></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-form ref="form">
    <div class="text-h6 q-mt-xs">
      Personale - {{ tipoSelected.persTipoDesc }}
    </div>
    <div class="row q-col-gutter-md q-mt-md">
      <!--      <q-input-->
      <!--        class="col-6 q-pr-sm"-->
      <!--        label-color="black"-->
      <!--        label="In pianta organica!!"-->
      <!--        v-model.number="persNumPiantaOrganica"-->
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
        label="Attuali"
        v-model.number="persNumAttuali"
        type="number"
        :min="0"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        :rules="[ruleRequired]"
      />

      <!--      <q-input-->
      <!--        class="col-12"-->
      <!--        label-color="black"-->
      <!--        label="Nuove assunzioni ultima settimana"-->
      <!--        v-model.number="persNumNuoveAssunzioni"-->
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
  name: "FormPersonale",
  props: {
    tipiPersonale: { type: Array },
    strTipoId: { type: Number },
    idStruttura: { type: String },
    persTipo: { type: Number },
    prefillData: { type: Object }
  },
  data() {
    return {
      persId: null,
      //persNumPiantaOrganica: null,
      persNumAttuali: null
      // persNumNuoveAssunzioni: null
    };
  },
  created() {
    //fin qui ok
    this.prefillFormInputs(this.prefillData);
  },
  watch: {
    // persNumPiantaOrganica: function (newVal, oldVal) {
    //    if (newVal < 0) {
    //         this.persNumPiantaOrganica = 0
    //     }
    // },
    persNumAttuali: function(newVal, oldVal) {
      if (newVal < 0) {
        this.persNumAttuali = 0;
      }
    }
    // persNumNuoveAssunzioni: function (newVal, oldVal) {
    //     if (newVal < 0) {
    //         this.persNumNuoveAssunzioni = 0
    //     }
    // },
  },
  computed: {
    persTipoOptions() {
      return this.tipiPersonale;
    },
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    },
    tipoSelected() {
      return this.persTipoOptions?.find(
        tipo => tipo.persTipoId === this.persTipo
      );
    }
  },
  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.persId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        this.strCategoriaId = payload.strCategoriaId;
        this.persTipo = payload.persTipoId;
        //this.persNumPiantaOrganica = payload.persNumPiantaOrganica
        this.persNumAttuali = payload.persNumAttuali;
        // this.persNumNuoveAssunzioni = payload.persNumNuoveAssunzioni
      }
    },
    clearFormInputs() {
      this.persId = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
      this.persTipo = null;
      // this.persNumPiantaOrganica = 0
      this.persNumAttuali = 0;
      // this.persNumNuoveAssunzioni = 0
    },
    async checkValid() {
      return await this.$refs.form.validate();
    },
    getFormData(strCategoriaId) {
      const payload = {
        persId: this.persId,
        idStruttura: this.idStruttura,
        dataRilevazione: this.data,
        strCategoriaId: strCategoriaId,
        persTipoId: this.persTipo,
        //persNumPiantaOrganica: this.persNumPiantaOrganica,
        persNumAttuali: this.persNumAttuali
        //persNumNuoveAssunzioni: this.persNumNuoveAssunzioni
      };

      return payload;
    }
  }
};
</script>

<style></style>

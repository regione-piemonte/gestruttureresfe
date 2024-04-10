<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-form ref="form">
    <div class="text-h6 q-py-sm">Tipologia ingresso</div>

    <div class="row q-mt-none">
      <q-select
        class="col-12 q-pr-sm q-pb-md"
        label-color="black"
        label="Tipologia"
        v-model="visitatoriIngressiId"
        :options="dropdown"
        option-value="visitatoriIngressiId"
        option-label="visitatoriIngressiDesc"
        emit-value
        map-options
        dense
        outlined
        input-class="text-black text-bold"
        :rules="[ruleRequired]"
      />
    </div>
  </q-form>
</template>

<script>
export default {
  name: "FormVisitatori",
  props: {
    strTipoId: { type: Number },
    idStruttura: { type: String },
    strCategoriaId: { type: Number },
    dropdown: { type: Array },
    prefillData: { type: Object }
  },
  data() {
    return {
      visitatoriId: null,
      visitatoriIngressiId: null,
      dataRilevazione: null
    };
  },
  computed: {
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    }
  },

  created() {
    this.prefillFormInputs(this.prefillData);
  },

  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.visitatoriIngressiId = payload.visitatoriIngressiId;
          this.visitatoriId = payload.visitatoriId;
          this.dataRilevazione = payload.dataRilevazione;
        }
        this.strCategoriaId = payload.strCategoriaId;
      }
    },

    clearFormInputs() {
      this.visitatoriId = null;
      this.visitatoriIngressiId = null;
      this.idStruttura = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
    },

    async checkValid() {
      return await this.$refs.form.validate();
    },

    getFormData(strCategoriaId) {
      const payload = {
        visitatoriId: this.visitatoriId,
        visitatoriIngressiId: this.visitatoriIngressiId,
        idStruttura: this.idStruttura,
        dataRilevazione: this.dataRilevazione,
        strCategoriaId: strCategoriaId
      };

      return payload;
    }
  }
};
</script>

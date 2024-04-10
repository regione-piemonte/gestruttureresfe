<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-form ref="form">
    <div class="text-h6 q-mt-xs">Deceduti ultima settimana</div>
    <div class="row q-mt-md">
      <q-input
        class="col-6 q-pr-sm q-pt-md"
        label-color="black"
        label="Totale deceduti"
        v-model.number="decNumUltimaSettimana"
        type="number"
        :min="0"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        disable
        :rules="[ruleRequired]"
      />

      <q-input
        class="col-6 q-pl-sm q-pt-md"
        label-color="black"
        label="Di cui con covid"
        v-model.number="decNumCovidUltimaSettimana"
        type="number"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        disable
        :rules="[ruleRequired]"
      />

      <q-input
        class="col-6 q-pr-sm q-pb-md"
        label-color="black"
        label="In struttura"
        v-model.number="decNumInStrutturaUltimaSettimana"
        type="number"
        :min="0"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        :rules="[ruleRequired]"
      />

      <q-input
        class="col-6 q-pl-sm q-pb-md"
        label-color="black"
        label="Di cui con covid"
        v-model.number="decNumInStrutturaCovidUltimaSettimana"
        type="number"
        :min="0"
        :max="decNumInStrutturaUltimaSettimana"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        :rules="[ruleRequired]"
      />

      <q-input
        class="col-6 q-pr-sm q-py-md"
        label-color="black"
        label="In ospedale"
        v-model.number="decNumInOspedaleUltimaSettimana"
        type="number"
        :min="0"
        stack-label
        dense
        outlined
        input-class="text-black text-bold"
        :rules="[ruleRequired]"
      />

      <q-input
        class="col-6 q-pl-sm q-py-sm"
        label-color="black"
        label="Di cui con covid"
        v-model.number="decNumInOspedaleCovidUltimaSettimana"
        type="number"
        :min="0"
        :max="decNumInOspedaleUltimaSettimana"
        stack-label
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
  name: "FormDecessi",
  props: {
    strTipoId: { type: Number },
    idStruttura: { type: String },
    prefillData: { type: Object }
  },
  data() {
    return {
      decId: null,
      decNumInStrutturaUltimaSettimana: null,
      decNumInStrutturaCovidUltimaSettimana: null,
      decNumInOspedaleUltimaSettimana: null,
      decNumInOspedaleCovidUltimaSettimana: null
    };
  },
  created() {
    // this.prefillFormInputs(this.prefillData)
  },
  computed: {
    decNumUltimaSettimana() {
      return (
        this.decNumInStrutturaUltimaSettimana +
        this.decNumInOspedaleUltimaSettimana
      );
    },
    decNumCovidUltimaSettimana() {
      return (
        this.decNumInStrutturaCovidUltimaSettimana +
        this.decNumInOspedaleCovidUltimaSettimana
      );
    },
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    }
  },
  watch: {
    decNumInStrutturaUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumInStrutturaUltimaSettimana = 0;
      }
    },
    decNumInStrutturaCovidUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumInStrutturaCovidUltimaSettimana = 0;
      }
    },
    decNumInOspedaleUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumInOspedaleUltimaSettimana = 0;
      }
    },
    decNumInOspedaleCovidUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumInOspedaleCovidUltimaSettimana = 0;
      }
    },

    decNumUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumUltimaSettimana = 0;
      }
    },
    decNumCovidUltimaSettimana: function(newVal, oldVal) {
      if (newVal < 0) {
        this.decNumCovidUltimaSettimana = 0;
      }
    }
  },
  methods: {
    prefillFormInputs(payload) {
      if (payload) {
        if (this.editMode) {
          this.decId = payload.id;
          this.dataRilevazione = payload.dataRilevazione;
        }

        this.strCategoriaId = payload.strCategoriaId;
        this.decNumInStrutturaUltimaSettimana =
          payload.decNumInStrutturaUltimaSettimana;
        this.decNumInStrutturaCovidUltimaSettimana =
          payload.decNumInStrutturaCovidUltimaSettimana;
        this.decNumInOspedaleUltimaSettimana =
          payload.decNumInOspedaleUltimaSettimana;
        this.decNumInOspedaleCovidUltimaSettimana =
          payload.decNumInOspedaleCovidUltimaSettimana;
      }
    },
    clearFormInputs() {
      this.decId = null;
      this.dataRilevazione = null;
      this.strCategoriaId = null;
      this.decNumInStrutturaUltimaSettimana = 0;
      this.decNumInStrutturaCovidUltimaSettimana = 0;
      this.decNumInOspedaleUltimaSettimana = 0;
      this.decNumInOspedaleCovidUltimaSettimana = 0;
    },
    async checkValid() {
      return await this.$refs.form.validate();
    },
    getFormData(strCategoriaId) {
      const payload = {
        decId: this.decId,
        idStruttura: this.idStruttura,
        dataRilevazione: this.data,
        strCategoriaId: strCategoriaId,
        decNumUltimaSettimana: this.decNumUltimaSettimana,
        decNumCovidUltimaSettimana: this.decNumCovidUltimaSettimana,
        decNumInStrutturaUltimaSettimana: this.decNumInStrutturaUltimaSettimana,
        decNumInStrutturaCovidUltimaSettimana: this
          .decNumInStrutturaCovidUltimaSettimana,
        decNumInOspedaleUltimaSettimana: this.decNumInOspedaleUltimaSettimana,
        decNumInOspedaleCovidUltimaSettimana: this
          .decNumInOspedaleCovidUltimaSettimana
      };

      return payload;
    }
  }
};
</script>

<style></style>

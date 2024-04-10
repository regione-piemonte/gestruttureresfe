<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog :value="open" :persistent="loading" @hide="closeDialog">
    <q-card class="dialog">
      <q-card-section class="q-pb-none">
        <slot name="head" />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <q-form
            ref="form"
            v-if="!generic"
            class="row q-col-gutter-md q-ml-none"
          >
            <q-input
              class="col-12"
              label="Struttura"
              outlined
              dense
              disable
              input-class="text-black text-bold"
              label-color="black"
              :value="stiNome"
            />

            <q-input
              label="Data Rilevazione"
              class="col-6 q-pb-sm"
              type="date"
              outlined
              dense
              disable
              input-class="text-black text-bold"
              label-color="black"
              :value="data"
            />

            <q-select
              v-model="strCategoriaId"
              :disable="tipoStrutturaDisabled"
              class="col-6 q-pb-sm"
              label="Tipo Struttura"
              outlined
              dense
              :options="tipiStrutturaOptions"
              option-value="strCategoriaId"
              option-label="strCategoriaDesc"
              emit-value
              map-options
              :error="tipoRequired"
              error-message="Campo obbligatorio"
              @input="updateTotal(strCategoriaId)"
            />

            <!-- <q-select
              label="Tipo Struttura"
              type="date"
              outlined
              dense
              disable
              input-class="text-black text-bold"
              label-color="black"
              :options="tipiStruttura"
              option-value="strCategoriaId"
              option-label="strCategoriaDesc"
              :value="strTipoId"
              emit-value
              map-options /> -->
          </q-form>
          <slot name="body" />
        </div>
      </q-card-section>

      <q-card-actions v-if="!customButtons">
        <q-btn
          @click="confirmDialog"
          label="conferma"
          color="primary"
          size="10pt"
          :loading="loading"
        />

        <q-btn
          @click="closeDialog"
          label="annulla"
          color="primary"
          outline
          size="10pt"
          :disable="loading"
        />
      </q-card-actions>

      <q-card-actions v-else align="right">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EVENTS } from "src/services/business_logic";
export default {
  name: "DialogGenerico",
  props: {
    isNew: { type: Boolean, required: false, default: false },
    open: { type: Boolean },
    stiNome: { type: String },
    strTipoId: { type: Number },
    postiTotali: { type: Number },
    strCategoriaIdToEdit: { type: Number, required: false, default: null },
    tipiStruttura: { type: Array },
    dataRilevazione: { type: String },
    editMode: { type: Boolean },
    loading: { type: Boolean },
    data: { type: String },
    generic: { type: Boolean },
    customButtons: { type: Boolean },
    tipiStrutturaFiltrati: { type: Array, required: false, default: null }
  },
  data() {
    return {
      date: "",
      modified: false,
      strCategoriaId: null
    };
  },
  watch: {
    open: function(newVal, oldVal) {
      if (newVal) {
        this.preselectTipoStruttura();
      }
    }
  },

  computed: {
    tipiStrutturaOptions() {
      if (this.tipiStrutturaFiltrati) {
        return this.tipiStrutturaFiltrati;
      }
      return this.tipiStruttura;
    },
    tipoRequired() {
      return (
        this.modified &&
        (this.strCategoriaId === null || this.strCategoriaId === undefined)
      );
    },
    strutSel() {
      return this.dropdowns?.listaStrutture?.find(
        strut => strut.idStruttura === this.idStruttura
      );
    },
    tipoStrutturaDisabled() {
      return this.isNew !== true;
    },
    defTipoStruttura() {
      return this.tipiStrutturaOptions?.find(
        categoria => this.strCategoriaId === categoria.strCategoriaId
      );
    }
  },
  methods: {
    //FUNZIONE PER PASSARE AL FORM DEI POSTI, IL NUMERO DEI POSTI MASSIMI A SECONDA DEL TIPO STRUTTURA SCELTO
    updateTotal(typeId) {
      this.$emit("update:postiTotali", this.defTipoStruttura?.postiAutorizzati);
      let selectedLabel = this.tipiStrutturaOptions.find(
        a => a.strCategoriaId === typeId
      )?.strCategoriaDesc;
      this.$emit("chooseStructureType", selectedLabel);
    },
    getTipoStruttura() {
      return this.strCategoriaId;
    },
    preselectTipoStruttura() {
      // if (this.tipoStrutturaDisabled) {
      //   this.strCategoriaId = this.defTipoStruttura;
      // } else {
      //   this.strCategoriaId = null;
      // }
      if (this.isNew) {
        this.$emit("update:postiTotali", 0);
        this.strCategoriaId = null;
      } else {
        this.strCategoriaId = this.tipiStruttura.find(
          a =>
            a.strCategoriaId.toString() === this.strCategoriaIdToEdit.toString()
        );

          let selectedLabel = this.tipiStrutturaOptions.find(
              a => a.strCategoriaId.toString() === this.strCategoriaId?.strCategoriaId.toString()
          )?.strCategoriaDesc;
          this.$emit("chooseStructureType", selectedLabel);
      }
    },
    checkValid() {
      this.modified = true;
      return !this.tipoRequired || this.generic;
    },
    async confirmDialog() {
      const isValid = this.checkValid();

      if (isValid) {
        this.$emit(EVENTS.CONFIRM_DIALOG, {
          strCategoriaId: this.strCategoriaId?.strCategoriaId
        });
      }
    },
    closeDialog() {
      this.modified = false;
      this.strCategoriaId = null;
      this.$emit(EVENTS.CLOSE_DIALOG);
    }
  }
};
</script>

<style>
.dialog {
  width: 500px;
}
</style>

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
      <div class="text-h6" v-text="`${dialogTitle} INGRESSI VISITATORI`" />
    </template>
    <template slot="body">
      <q-form ref="form">
        <div class="text-h6 q-py-sm">Tipologia ingresso</div>

        <div class="row q-mt-none">
          <q-select
            class="col-12 q-pr-sm q-pb-md"
            label-color="black"
            label="Tipologia"
            v-model="visitatoriIngressiId"
            :options="dropdowns.tipiVisite"
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
  </dialog-generico>
</template>

<script>
import { dialogMixin } from "src/mixins/dialog_mixin";
import DialogGenerico from "./DialogGenerico.vue";
import { inserisciVisitatori, modificaVisitatori } from "src/services/api";

export default {
  components: { DialogGenerico },
  name: "DialogRilevazioniVisitatori",
  mixins: [dialogMixin],
  data() {
    return {
      visitatoriId: null,
      visitatoriIngressiId: null,
      idStruttura: null,
      dataRilevazione: null,
      strCategoriaId: null
    };
  },
  computed: {
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    }
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

    async sendPayload({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate();

      if (isValidForm) {
        const payload = {
          visitatoriId: this.visitatoriId,
          visitatoriIngressiId: this.visitatoriIngressiId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.dataRilevazione,
          strCategoriaId: strCategoriaId
        };

        const eventData = {
          payload: payload,
          func: this.editMode ? modificaVisitatori : inserisciVisitatori,
          callbackDialog: this.closeDialog
        };

        this.confirmDialog(eventData);
      }
    }
  }
};
</script>

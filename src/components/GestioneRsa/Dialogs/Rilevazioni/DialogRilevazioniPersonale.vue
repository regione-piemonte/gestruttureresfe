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
      <div class="text-h6" v-text="`${dialogTitle} PERSONALE`" />
    </template>

    <template slot="body">
      <q-form ref="form">
        <div class="text-h6 q-mt-xs">Personale</div>
        <div class="row q-mt-none">
          <q-select
            class="col-12 q-pr-sm q-pb-md"
            label-color="black"
            label="Tipologia"
            v-model="persTipo"
            :options="persTipoOptions"
            option-value="persTipoId"
            option-label="persTipoDesc"
            emit-value
            map-options
            dense
            outlined
            input-class="text-black text-bold"
            :disable="loading || editMode"
            :rules="[ruleRequired]"
          />

          <!--          <q-input-->
          <!--            class="col-4 q-pl-sm q-pb-md"-->
          <!--            label-color="black"-->
          <!--            label="In pianta organica"-->
          <!--            v-model.number="persNumPiantaOrganica"-->
          <!--            type="number"-->
          <!--            :min="0"-->
          <!--            dense-->
          <!--            outlined-->
          <!--            input-class="text-black text-bold"-->
          <!--            :disable="loading"-->
          <!--            :rules="[ruleRequired]" />-->

          <!--          <q-input-->
          <!--            class="col-4 q-pl-sm q-pb-md"-->
          <!--            label-color="black"-->
          <!--            label="Attuali"-->
          <!--            v-model.number="persNumAttuali"-->
          <!--            type="number"-->
          <!--            :min="0"-->
          <!--            dense-->
          <!--            outlined-->
          <!--            input-class="text-black text-bold"-->
          <!--            :disable="loading"-->
          <!--            :rules="[ruleRequired]" />-->

          <!--          <q-input-->
          <!--            class="col-12 q-pt-sm"-->
          <!--            label-color="black"-->
          <!--            label="Nuove assunzioni ultima settimana"-->
          <!--            v-model.number="persNumNuoveAssunzioni"-->
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
        </div>
      </q-form>
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from "src/mixins/dialog_mixin";
import DialogGenerico from "./DialogGenerico.vue";
import { inserisciPersonale, modificaPersonale } from "src/services/api";

export default {
  components: { DialogGenerico },
  name: "DialogRilevazioniPersonale",
  mixins: [dialogMixin],
  data() {
    return {
      persId: null,
      persTipo: null,
      // persNumPiantaOrganica: 0,
      persNumAttuali: 0
      // persNumNuoveAssunzioni: 0
    };
  },
  watch: {
    // persNumPiantaOrganica: function (newVal, oldVal) {
    //     if (newVal < 0) {
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
      return this.dropdowns?.tipiPersonale;
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
        // this.persNumPiantaOrganica = payload.persNumPiantaOrganica
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
    async sendPayload({ strCategoriaId }) {
      const isValidForm = await this.$refs.form.validate();
      if (isValidForm) {
        const payload = {
          persId: this.persId,
          idStruttura: this.idStruttura,
          dataRilevazione: this.data,
          strCategoriaId: strCategoriaId,
          persTipoId: this.persTipo,
          // persNumPiantaOrganica: this.persNumPiantaOrganica,
          persNumAttuali: this.persNumAttuali
          // persNumNuoveAssunzioni: this.persNumNuoveAssunzioni
        };

        const eventData = {
          payload: payload,
          func: this.editMode ? modificaPersonale : inserisciPersonale,
          callbackDialog: this.closeDialog
        };

        this.confirmDialog(eventData);
      }
    }
  }
};
</script>

<style></style>

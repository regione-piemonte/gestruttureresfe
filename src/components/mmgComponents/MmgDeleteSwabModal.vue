<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" full-width>
    <q-card style="max-width: 1000px !important;  min-height: 70px">
      <q-card-section class="q-py-none">
        <q-toolbar class="q-px-none">
          <q-toolbar-title>Conferma cancellazione</q-toolbar-title>
          <q-btn v-close-popup round dense flat icon="close" />
        </q-toolbar>
      </q-card-section>
      <q-separator />

      <template v-if="checkSameUser">
        <q-card-section>
          Sei sicuro di voler cancellare il tampone con id
          {{ this.swabId }} ?
        </q-card-section>

        <q-card-section>
          <div class="row reverse q-col-gutter-md">
            <div class="col-md-auto col-12">
              <q-btn
                class="full-width"
                color="negative"
                label="Cancella"
                @click="deleteSwab"
                :loading="isDeleting"
              />
            </div>
            <div class="col-md-auto col-12">
              <q-btn
                class="full-width"
                outline
                label="Indietro"
                color="primary"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>
      </template>
      <template v-else>
        <q-card-section>
          <q-banner class="bg-blue-2">
            Il tampone puÃ² essere cancellato solo dal medico che lo ha inserito
            <span v-if="swab.utenteUltimaModifica">
              ( {{ swab.utenteUltimaModifica }} )
            </span>
          </q-banner>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { notifyError, notifySuccess } from "../../services/utils";
import { deleteSwab } from "../../services/api";
import { TYPES } from "../../store";

export default {
  name: "MmgDeleteSwabModal",
  props: {
    swab: { type: Object, required: false, default: null }
  },
  data() {
    return {
      isDeleting: false
    };
  },
  computed: {
    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    swabResultCode() {
      return this.swab?.idRisTamp;
    },
    checkSameUser() {
      if (
        this.swab?.utenteUltimaModifica === this.user?.cfUtente ||
        !this.swabResultCode
      ) {
        return true;
      } else {
        return false;
      }
    },
    swabId() {
      return this.swab.idTampone;
    },

    attrs() {
      let { ...attrs } = this.$attrs;
      return attrs;
    },

    listeners() {
      let { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  async created() {},
  methods: {
    async deleteSwab() {
      this.isDeleting = true;
      try {
        let promise = await deleteSwab(this.swabId);
        notifySuccess("Tampone cancellato correttamente");
        this.$emit("deleteSwab");
      } catch (e) {
        notifyError(e, "Non Ã¨ stato possibile cancellare il tampone");
      }
      this.isDeleting = false;
    }
  }
};
</script>

<style scoped></style>

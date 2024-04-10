<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <rilevazione-generica
    idField="decId"
    :columns="columns"
    :data="rilevazioni"
    :loading="loading"
    @addRelevation="newRelevation"
    @copyRelevation="copyRelevation($event)"
    @editRelevation="editRelevation($event)"
    @delRelevation="delRelevation($event)"
  />
</template>

<script>
import { EVENTS, RELEVATION_TYPES } from "src/services/business_logic";
import RilevazioneGenerica from "./RilevazioneGenerica.vue";
import { EventBus } from "src/services/event_bus";

const COLUMNS = [
  {
    name: "dataRilevazione",
    field: "dataRilevazione",
    label: "Data Rilevazione",
    required: true,
    sortable: true,
    align: "left"
  },
  {
    name: "tipoStruttura",
    field: "tipologiaStrutturaDesc",
    label: "Tipo Struttura",
    required: true,
    sortable: true,
    align: "left"
  },
  {
    name: "datiValidi",
    field: "datiValidi",
    label: "Dati Validi",
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "visitatoriDesc",
    field: "visitatoriIngressiDesc",
    label: "Ingresso visitatori",
    required: true,
    sortable: false,
    align: "left"
  }
];

export default {
  name: "RilevazioneDecessi",
  components: { RilevazioneGenerica },
  props: {
    rilevazioni: { type: Array }
  },
  data() {
    return {
      columns: COLUMNS,
      selezione: [],
      loading: false
    };
  },

  methods: {
    newRelevation() {
      this.$emit(EVENTS.ADD_RELEVATION);
    },
    copyRelevation(rilevazione) {
      this.$emit(EVENTS.COPY_RELEVATION, rilevazione);
    },
    editRelevation(rilevazione) {
      this.$emit(EVENTS.EDIT_RELEVATION, rilevazione);
    },
    delRelevation(selezione) {
      EventBus.$emit(EVENTS.DEL_RELEVATION, {
        relevationType: RELEVATION_TYPES.DECESSI,
        id: selezione
      });
    }
  }
};
</script>

<style></style>

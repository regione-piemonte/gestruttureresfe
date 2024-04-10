<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <rilevazione-generica
      :columns="columns"
      :data="rilevazioni"
      :loading="loading"
      :flagsPosti="flagsPosti"
      idField="postiId"
      @addRelevation="newRelevation"
      @copyRelevation="copyRelevation($event)"
      @editRelevation="editRelevation($event)"
      @delRelevation="delRelevation($event)"
    />
  </div>
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
    name: "disposizionePosti",
    label: "Posti totali",
    fields: [
      { field: "totaliLiberi", label: "Totali liberi", default: "0" },
      {
        field: "totaliOccupati",
        label: "Totale occupati",
        default: "0"
      }
    ],
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "dettaglioPosti",
    label: "Posti residenziali occupati",
    fields: [
      {
        field: "postiNumOccupatiConvenzionati",
        label: "Occupati convenz.",
        default: "0"
      },
      {
        field: "postiNumOccupatiPaganti",
        label: "Occupati paganti",
        default: "0"
      },
      {
        field: "postiNumOccupatiPagantiSs",
        label: "Di cui scelta sociale",
        default: "0"
      }
    ],
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "dettaglioPostiLiberi",
    label: "Posti residenziali liberi",
    fields: [
      {
        field: "postiNumLiberiUomini",
        label: "Liberi uomini",
        default: "0"
      },
      {
        field: "postiNumLiberiDonne",
        label: "Liberi donne",
        default: "0"
      },
      {
        field: "postiNumLiberiIndiff",
        label: "Liberi indifferenti",
        default: "0"
      }
    ],
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "dettaglioPostiCategorie",
    label: "Posti altre categorie",
    // fields: [

    // {
    field: "postiNumOccupatiDgr23",
    default: "0",
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "ospedalizzazioni",
    label: "Ospedalizzazioni",
    fields: [
      {
        field: "postiNumOspedalizzati",
        label: "Osped. COV + NON COV",
        default: "0"
      },
      {
        field: "accessiInPsNum",
        label: "Invii in Pronto Soccorso",
        default: "0"
      }
    ],
    required: true,
    sortable: false,
    align: "left"
  },
  {
    name: "camereSingole",
    label: "Camere Singole",
    fields: [
      // { field: "postiNumTotaliSingole", label: "Totali", default: "0" },
      { field: "postiNumSingoleResidue", label: "Libere", default: "0" }
    ],
    required: true,
    sortable: false,
    align: "left"
  }
];

export default {
  name: "RilevazionePosti",
  components: { RilevazioneGenerica },
  props: {
    rilevazioni: { type: Array },
    flagsPosti: { type: Object }
  },
  data() {
    return {
      columns: COLUMNS,
      loading: false
    };
  },
  created() {
    if (this.rilevazioni) {
      this.rilevazioni.forEach(
        a =>
          {
                  a.totaliOccupati =
                      (a.postiNumOccupati ?? 0) +
                      (a.postiNumSollievoOccupati ?? 0) +
                      (a.postiNumDimProtOccupati ?? 0) +
                      (a.postiNumCavsOccupati ?? 0) +
                      (a.postiNumLungodegOccupati ?? 0) +
                      (a.postiNumHospiceOccupati ?? 0)
                  a.totaliLiberi =       (a.postiNumCavsLiberi ?? 0) +
                      (a.postiNumSollievoLiberi ?? 0) +
                      (a.postiNumDimProtLiberi ?? 0) +
                      (a.postiNumLungodegLiberi ?? 0 )+
                      (a.postiNumHospiceLiberi ?? 0 )+
                      (a.postiNumHospiceLiberi ?? 0 )+
                      (a.postiNumLiberi ?? 0 )
              }


      );
    }
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
        relevationType: RELEVATION_TYPES.POSTI,
        id: selezione
      });
    }
  }
};
</script>

<style></style>

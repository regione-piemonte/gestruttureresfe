<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="column" style="height: 450px">
    <loading-component :loading="loading">
      <q-table
        class="row q-mt-md"
        style="height: 400px"
        key="table"
        :columns="tableColumns"
        :data="rectifiedData"
        separator="cell"
        wrap-cells
      >
        <template v-slot:body-cell-actions="props">
          <td key="actions" style="padding-left: 4px; padding-right: 4px">
            <div class="row q-gutter-md items-center justify-center">
              <q-btn
                @click="editRilevazione(props.row)"
                v-if="isEditable(props.row)"
                icon="edit"
                dense
                size="sm"
                round
                flat
              >
                <q-tooltip>Modifica</q-tooltip>
              </q-btn>
            </div>
          </td>
        </template>

        <template v-slot:body-cell-dettaglioPostiCategorie="props">
          <td style="padding-left: 4px; padding-right: 4px">
            <div class="row q-gutter-md items-center justify-center">
              <q-btn
                v-if="isDetail"
                round
                flat
                icon="search"
                @click="openDetail(props.row)"
              ></q-btn>
            </div>
          </td>
        </template>

        <template
          v-for="col in colsMultipleFields"
          v-slot:[dynamicSlot(col)]="props"
        >
          <td
            :key="col.name"
            :style="col.maxWidth ? [`max-width: ${col.maxWidth}`] : ''"
          >
            <div class="row q-col-gutter-sm q-mt-xs">
              <div
                v-for="field in col.fields"
                :key="field.field"
                class="q-py-none col-grow"
              >
                <div class="text-caption">
                  {{ field.label }}
                </div>

                <div class="text-bold justify-right">
                  {{ props.row[field.field] || field.default }}
                </div>
              </div>
            </div>
          </td>
        </template>
      </q-table>
    </loading-component>
    <!--MODALI-->
    <template v-if="isModalOpen">
      <q-dialog v-model="isModalOpen">
        <q-card style="width: 1000px !important">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>Posti altre categorie</q-toolbar-title>
              <q-btn v-close-popup round dense flat icon="close" />
            </q-toolbar>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <template v-if="flagsPosti.sollievo">
                <div class="col-12 text-h6">
                  Posti di sollievo
                </div>
                <div class="col-md-4 col-12">
                  Occupati:
                  <strong>{{ selectedRow.postiNumSollievoOccupati }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi:
                  <strong>{{ selectedRow.postiNumSollievoLiberi }}</strong>
                </div>
                <div class="col-4"></div>

                <div class="col-md-4 col-12">
                  Liberi - uomini:
                  <strong>{{
                    selectedRow.postiNumSollievoLiberiUomini
                  }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - donne:
                  <strong>{{ selectedRow.postiNumSollievoLiberiDonne }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - indifferenti:
                  <strong>{{
                    selectedRow.postiNumSollievoLiberiIndiff
                  }}</strong>
                </div>
                <q-separator class="q-my-md" color="black"></q-separator>
              </template>

              <template v-if="flagsPosti.dimissioni">
                <div class="col-12 text-h6">
                  Posti dimissioni protette (DGR10)
                </div>
                <div class="col-md-4 col-12">
                  Occupati:
                  <strong>{{ selectedRow.postiNumDimProtOccupati }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi:
                  <strong>{{ selectedRow.postiNumDimProtLiberi }}</strong>
                </div>
                <div class="col-4"></div>

                <div class="col-md-4 col-12">
                  Liberi - uomini:
                  <strong>{{ selectedRow.postiNumDimProtLiberiUomini }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - donne:
                  <strong>{{ selectedRow.postiNumDimProtLiberiDonne }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - indifferenti:
                  <strong>{{ selectedRow.postiNumDimProtLiberiIndiff }}</strong>
                </div>
                <q-separator class="q-my-md" color="black"></q-separator>
              </template>

              <template v-if="flagsPosti.cavs">
                <div class="col-12 text-h6">
                  Posti Cavs
                </div>
                <div class="col-md-4 col-12">
                  Occupati:
                  <strong>{{ selectedRow.postiNumCavsOccupati }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi: <strong>{{ selectedRow.postiNumCavsLiberi }}</strong>
                </div>
                <div class="col-4"></div>

                <div class="col-md-4 col-12">
                  Liberi - uomini:
                  <strong>{{ selectedRow.postiNumCavsLiberiUomini }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - donne:
                  <strong>{{ selectedRow.postiNumCavsLiberiDonne }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - indifferenti:
                  <strong>{{ selectedRow.postiNumCavsLiberiIndiff }}</strong>
                </div>
                <q-separator class="q-my-md" color="black"></q-separator>
              </template>

              <template v-if="flagsPosti.lungodegenza">
                <div class="col-12 text-h6">
                  Posti Lungodegenze
                </div>
                <div class="col-md-4 col-12">
                  Occupati:
                  <strong>{{ selectedRow.postiNumLungodegOccupati }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi:
                  <strong>{{ selectedRow.postiNumLungodegLiberi }}</strong>
                </div>
                <div class="col-4"></div>

                <div class="col-md-4 col-12">
                  Liberi - uomini:
                  <strong>{{
                    selectedRow.postiNumLungodegLiberiUomini
                  }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - donne:
                  <strong>{{ selectedRow.postiNumLungodegLiberiDonne }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - indifferenti:
                  <strong>{{
                    selectedRow.postiNumLungodegLiberiIndiff
                  }}</strong>
                </div>
                <q-separator class="q-my-md" color="black"></q-separator>
              </template>

              <template v-if="flagsPosti.hospice">
                <div class="col-12 text-h6">
                  Posti Hospice
                </div>
                <div class="col-md-4 col-12">
                  Occupati:
                  <strong>{{ selectedRow.postiNumHospiceOccupati }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi:
                  <strong>{{ selectedRow.postiNumHospiceLiberi }}</strong>
                </div>
                <div class="col-4"></div>

                <div class="col-md-4 col-12">
                  Liberi - uomini:
                  <strong>{{ selectedRow.postiNumHospiceLiberiUomini }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - donne:
                  <strong>{{ selectedRow.postiNumHospiceLiberiDonne }}</strong>
                </div>
                <div class="col-md-4 col-12">
                  Liberi - indifferenti:
                  <strong>{{ selectedRow.postiNumHospiceLiberiIndiff }}</strong>
                </div>
                <q-separator class="q-my-md" color="black"></q-separator>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import LoadingComponent from "src/components/LoadingComponent.vue";
import {
  dateToString,
  getOnlyDate,
  nextMonday,
  selectFromArray
} from "src/services/utils";
import { EVENTS, RSA_ASL, RSA_RP } from "src/services/business_logic";
import { TYPES } from "src/store";
import { date } from "quasar";
const { getDateDiff, formatDate } = date;

const defaultColumns = [
  {
    name: "actions",
    label: "",
    align: "left"
  }
];

export default {
  components: { LoadingComponent },
  name: "RilevazioneGenerica",
  props: {
    loading: { type: Boolean },
    columns: { type: Array },
    data: { type: Array },
    idField: { type: String, required: true },
    flagsPosti: { type: Object }
  },
  data() {
    return {
      selezione: [],
      isModalOpen: false,
      selectedRow: null
    };
  },
  computed: {
    isDetail() {
      if (
        this.flagsPosti.sollievo === true ||
        this.flagsPosti.cavs === true ||
        this.flagsPosti.lungodegenza === true ||
        this.flagsPosti.dimissioni === true ||
        this.flagsPosti.hospice === true
      ) {
        return true;
      }
      return false;
    },

    currentUser() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    addDisabled() {
      return getOnlyDate(this.data?.[0]?.dataRilevazione) === this.nextMonday;
    },
    rectifiedData() {
      return this.data?.map(relevation => {
        const rectifiedRelevation = {};

        for (const key in relevation) {
          if (key === this.idField) {
            rectifiedRelevation.id = relevation[this.idField];
          } else if (key === "dataRilevazione") {
            rectifiedRelevation[key] = getOnlyDate(relevation[key]);
          } else {
            rectifiedRelevation[key] = relevation[key];
          }
        }

        return rectifiedRelevation;
      });
    },
    colsMultipleFields() {
      return this.columns?.filter(col => !!col.fields);
    },
    nextMonday() {
      return nextMonday();
    },
    tableColumns() {
      if (this.editEnabled) {
        return [...defaultColumns, ...this.columns];
      } else {
        return this.columns;
      }
    },
    editEnabled() {
      const roles = this.currentUser?.elencoProfilo;

      return !roles.some(
        role => role.nomeProfilo === RSA_RP || role.nomeProfilo === RSA_ASL
      );
    },
    isRsaRp() {
      return this.currentUser?.elencoProfilo?.some(
        profilo => profilo.nomeProfilo === RSA_RP
      );
    },
    isRsaAsl() {
      return this.currentUser?.elencoProfilo?.some(
        profilo => profilo.nomeProfilo === RSA_ASL
      );
    }
  },
  methods: {
    openDetail(row) {
      this.isModalOpen = true;
      this.selectedRow = row;
    },
    selectRows(detail) {
      this.selezione = selectFromArray(
        this.selezione,
        detail.rows,
        detail.added,
        this.idField
      );
    },
    addRilevazione() {
      this.$emit(EVENTS.ADD_RELEVATION);
    },
    copyRelevation(rilevazione) {
      this.$emit(EVENTS.COPY_RELEVATION, rilevazione);
    },
    delRilevazione(rilevazione) {
      this.$emit(EVENTS.DEL_RELEVATION, rilevazione.id);
    },
    editRilevazione(rilevazione) {
      this.$emit(EVENTS.EDIT_RELEVATION, rilevazione);
    },
    dynamicSlot(col) {
      return "body-cell-" + col.name;
    },
    isSelected(row) {
      return !!this.selezione.find(selection => selection.id === row.id);
    },
    isEditable(row) {
      const today = new Date();
      const dataDa = new Date(row.validitaInizio);
      const dataA = new Date(row.validitaFine);
      if (getDateDiff(today, dataDa) >= 0 && getDateDiff(today, dataA) <= 0) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style></style>

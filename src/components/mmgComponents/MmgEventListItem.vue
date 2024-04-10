<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="mmg-event-list-item row q-col-gutter-md no-margin q-pr-xs">
    <div
      v-bind:class="[isRevoked ? 'bg-red-2' : 'bg-grey-4']"
      class="row q-col-gutter-x-md full-width  q-pa-sm q-px-md "
    >
      <div class="col-md-auto col-12  ">
        Decorso: <span class="text-weight-bold">{{ eventId }}</span>
      </div>
      <div class="col-md-auto col-12 ">
        Provvedimento:
        <span class="text-weight-bold">{{ mesureId | emptyString }}</span>
      </div>

      <template v-if="isRevoked">
        <div class="col-md-auto col-12 ">
          Questo decorso Ã¨ stato revocato il
          <span class="text-weight-bold">{{ revokeDate | date }}</span>
          con ID revoca <span class="text-weight-bold"> {{ revokeId }} </span>
        </div>
      </template>
    </div>
    <div class="col">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label main bold>
            {{ eventType | emptyString }}
          </mmg-summary-label>
          <mmg-summary-label caption bold>
            {{ eventDate | date }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>Fine evento</mmg-summary-label>
          <mmg-summary-label main bold>
            {{ eventQuarantineEndDate | date }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>
            Indirizzo Isolamento/Quarantena
          </mmg-summary-label>
          <mmg-summary-label caption>
            (Comune, indirizzo e presso)
          </mmg-summary-label>
          <mmg-summary-label caption bold>
            {{ eventIsolationPlace | emptyString }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>Struttura ed area</mmg-summary-label>
          <mmg-summary-label main bold>
            {{ eventStructure | emptyString }}
          </mmg-summary-label>
          <mmg-summary-label caption bold>
            {{ eventArea | emptyString }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>Condizioni cliniche</mmg-summary-label>
          <mmg-summary-label main bold class="text-wrap-word">
            {{ eventClinicalCondition | emptyString }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>
            Data esordio sintomi malattia
          </mmg-summary-label>
          <mmg-summary-label main bold>
            {{ eventSymptomsStartDate | date }}
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>Note</mmg-summary-label>
          <mmg-summary-label main bold class="text-wrap-word">
            <span class="pre-line">{{ eventNote | emptyString }}</span>
          </mmg-summary-label>
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg">
          <mmg-summary-label title>Sintomi</mmg-summary-label>
          <mmg-summary-label main bold>
            <template v-if="mustShowSymptomsNo">-</template>
            <template v-else-if="mustShowSymptomsYesOnly">SI</template>
            <template v-else-if="mustShowSymptoms">
              <a href="#" class="no-decoration" @click.prevent="showSymptoms">
                Visualizza
              </a>
            </template>
          </mmg-summary-label>
        </div>
      </div>
    </div>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isSymptomsDialogVisible">
      <mmg-event-symptoms-dialog
        v-model="isSymptomsDialogVisible"
        :event="event"
      />
    </template>
  </div>
</template>

<script>
import { EVENT_TYPE_CODES } from "src/services/business_logic";
import MmgEventSymptomsDialog from "components/mmgComponents/MmgEventSymptomsDialog";
import MmgSummaryLabel from "components/mmgComponents/MmgSummaryLabel";

export default {
  name: "MmgEventListItem",
  components: {
    MmgEventSymptomsDialog,
    MmgSummaryLabel
  },
  props: {
    event: { type: Object, required: false, default: null }
  },
  data() {
    return {
      isSymptomsDialogVisible: false,
      isQuarantineDateEditDialogVisible: false
    };
  },
  computed: {
    eventType() {
      return this.event?.decodeTipoEvento?.descTipoEvento;
    },
    eventDate() {
      return this.event?.dataDimissioni;
    },
    eventQuarantineEndDate() {
      return this.event?.dataPrevFineEvento;
    },
    eventSymptomsStartDate() {
      return this.event?.dataInizioSint;
    },
    eventSymptoms() {
      return this.event?.sintomi ?? "NO";
    },
    mustShowSymptomsNo() {
      return (
        this.eventSymptoms === "NO" &&
        !this.event?.descrizioneContesto &&
        !this.event?.luogoPaziente &&
        !this.event?.condizioniCliniche
      );
    },
    mustShowSymptomsYesOnly() {
      return (
        this.eventSymptoms === "SI" &&
        !this.event?.sintomo &&
        !this.event?.descrizioneContesto &&
        !this.event?.luogoPaziente &&
        !this.event?.condizioniCliniche
      );
    },
    mustShowSymptoms() {
      return !this.mustShowSymptomsNo && !this.mustShowSymptomsYesOnly;
      // return (
      //   this.eventSymptoms === "SI" ||
      //   this.event?.descrizioneContesto ||
      //   this.event?.luogoPaziente ||
      //   this.event?.condizioniCliniche
      // );
    },
    eventNote() {
      return this.event?.note;
    },
    eventClinicalCondition() {
      return this.event?.condizioniCliniche;
    },
    eventStructure() {
      return this.event?.struttura?.nome;
    },
    eventArea() {
      return this.event?.area?.nome;
    },
    isRevoked() {
      if (this.event.idProvvedimentoRevoca) {
        return true;
      }
      return false;
    },
    eventId() {
      return this.event?.idDecorso;
    },
    revokeDate() {
      return this.event.dataRevoca;
    },
    revokeId() {
      if (this.isRevoked) {
        return this.event.idProvvedimentoRevoca;
      }
      return null;
    },
    mesureId() {
      return this.event?.idProvvedimento;
    },
    eventIsolationPlace() {
      const city = this.event?.comuneRicovero?.nomeComune;
      const address = this.event?.indirizzoDecorso;
      const place = this.event?.decorsoPresso;
      return [city, address, place]
        .filter(v => !!v)
        .join(", ")
        .trim();
    },
    canEditQuarantineDate() {
      const codes = [EVENT_TYPE_CODES.ISOLATION];

      return codes.includes(this.event?.idTipoEvento);
    }
  },
  methods: {
    showSymptoms() {
      this.isSymptomsDialogVisible = true;
    }
  }
};
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
  <div class="mmg-swab-list-item row q-col-gutter-md no-margin">
    <div v-if="uniqueId" class="col-12 col-sm-4 col-md-2">
      <div class="row q-gutter-sm">
        <mmg-summary-label title>
          ID Tampone
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ testId | emptyString }}
        </mmg-summary-label>
      </div>

      <div class="row q-gutter-md">
        <mmg-summary-label title>
          ID Univoco
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ uniqueId | emptyString }}
        </mmg-summary-label>
      </div>
    </div>

    <div v-else class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        ID Test
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testId | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Tipologia
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ swabType | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Criterio epidemiologico
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ swabCriteria | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Motivazione
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ swabReason | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Esito
      </mmg-summary-label>
      <mmg-summary-label main bold>
        <mmg-swab-result-label :code="swabResultCode" />
      </mmg-summary-label>
      <mmg-summary-label title>
        {{ swabTestDate | datetime }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Laboratorio
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ laboratory | emptyString }}
      </mmg-summary-label>
    </div>

<!--    AGGIUNGO AZIONE DI CANCELLAZIONE PER TUTTI I TAMPONI-->
    <div class="col-12 col-sm-4 col-md">
      <mmg-summary-label title>
        Azioni
      </mmg-summary-label>
      <mmg-summary-label main bold>
        <q-btn round flat icon="delete" @click="openDeleteModal"></q-btn>
      </mmg-summary-label>
    </div>
  </div>
    <template v-if="isDeleteSwabModalOpen">
<mmg-delete-swab-modal @deleteSwab="deleteSwab" :swab="swab" v-model="isDeleteSwabModalOpen"></mmg-delete-swab-modal>
    </template>
  </div>
</template>

<script>
import { SWAB_TYPE_LABELS } from 'src/services/business_logic'
import MmgSummaryLabel from './MmgSummaryLabel'
import MmgSwabResultLabel from './MmgSwabResultLabel'
import MmgDeleteSwabModal from "./MmgDeleteSwabModal";

export default {
  name: 'MmgSwabListItem',
  components: {MmgDeleteSwabModal, MmgSwabResultLabel, MmgSummaryLabel },
  props: {
    swab: { type: Object, required: false, default: null }
  },
    data() {
        return {
            isDeleteSwabModalOpen: false
        }
        },
  computed: {
    testId () {
      return this.swab?.idTampone ?? this.swab?.testId
    },
    uniqueId () {
      return this.swab?.idUnivoco
    },
    swabType () {
      return this.swab?.testCovid?.testCovid || SWAB_TYPE_LABELS[this.swab?.testTipo.testTipoCod]
    },
    swabRequestDate () {
      return this.swab?.dataInserimentoRichiesta
    },
    swabTestDate () {
      return this.swab?.dataTest ?? this.swab?.testDataEsecuzione
    },
    swabCriteria () {
      return this.swab?.criterioEpidemiologicoCovid19 ?? this.swab?.testRichiestaTipo?.testRichiestaTipoDesc ?? this.swab?.testRichiestaTipoDesc ?? this.swab?.criterioEpidemiologico?.criterioEpidemiologicoDesc
    },
    swabResult () {
      return this.swab?.risTampone?.risultatoTampone
    },
    swabResultCode () {
      return this.swab?.idRisTamp ?? this.swab?.testEsito?.testEsitoCod
    },
    swabReason () {
      return this.swab?.tamponeMotivo?.tamponeMotivoDesc
    },
    laboratory () {
      return this.swab?.laboratorio?.descrizione
    }
  },
    methods: {
        deleteSwab(){
            this.isDeleteSwabModalOpen=false
            this.$emit("deleteSwab");
        },
        openDeleteModal() {
            this.isDeleteSwabModalOpen=true
        }
    }
}
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="mmg-serological-test-list-item row q-col-gutter-md no-margin">
    <div class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        Data Esecuzione
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testExecutionDate | datetime }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        Tipo test
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testTypeLabel | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        Tipo richiesta
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testRequestTypeLabel | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        ID Test
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testId | emptyString }}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-4 col-md-2">
      <mmg-summary-label title>
        Esito
      </mmg-summary-label>
      <mmg-summary-label main bold>
        <!-- <mmg-swab-result-label :code="swabResultCode" /> -->
        {{testResultLabel}}
      </mmg-summary-label>
    </div>

    <div class="col-12 col-sm-6 col-md-2">
      <mmg-summary-label title>
        Luogo esecuzione
      </mmg-summary-label>
      <mmg-summary-label main bold>
        {{ testLaboratoryLabel | emptyString }}
      </mmg-summary-label>
    </div>
  </div>
</template>

<script>
import MmgSummaryLabel from './MmgSummaryLabel'

export default {
  name: 'MmgSerologicalTestListItem',
  components: { MmgSummaryLabel },
  data () {
    return {}
  },
  props: {
    test: { type: Object, required: false, default: null }
  },
  computed: {
    testId () {
      return this.test?.testId
    },
    testRequestTypeLabel () {
      return this.test?.testRichiestaTipo?.testRichiestaTipoDesc
    },
    testExecutionDate () {
      return this.test?.testDataEsecuzione
    },
    testLaboratoryLabel () {
      return this.test?.testLaboratorioDesc
    },
    testTypeLabel () {
      return this.test?.testTipo?.testTipoDesc
    },
    testResultLabel () {
      return this.test?.testEsito?.testEsitoDesc
    },
    swabResultCode () {
      return this.swab?.idRisTamp ?? this.swab?.testEsito?.testEsitoCod
    }
  },
  methods: {}
}
</script>

<style lang="sass"></style>

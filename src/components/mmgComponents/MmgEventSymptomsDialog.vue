<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" full-width>
    <q-card style="max-width: 800px !important">
      <q-card-section>
        <q-toolbar class="q-px-none">
          <q-toolbar-title>Dettaglio sintomi</q-toolbar-title>
          <q-btn v-close-popup round dense flat icon="close" />
        </q-toolbar>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <mmg-summary-label title>
          Data esordio sintomi malattia:
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ date | date }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Temperatura
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ temperature | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Tosse
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ cough | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Dispnea
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ dyspnoea | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Disturbi gastrointestinali (diarrea, nausea, vomito)
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ diarrhea | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Congiuntivite bilaterale
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ conjunctivitis | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Dolori osteomuscolari diffusi
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ musclePain | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Ageusia
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ ageusia | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Anosmia
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ anosmia | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Rinorrea
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ cold | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Astenia severa
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ fatigue | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Altri sintomi
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ moreSymptoms | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <mmg-summary-label title>
          Condizioni cliniche
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ clinicalConditions | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Luogo paziente
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ subjectPlace | emptyString }}
        </mmg-summary-label>
      </q-card-section>

      <q-card-section>
        <mmg-summary-label title>
          Contesto - Contatto
        </mmg-summary-label>
        <mmg-summary-label main bold>
          {{ context | emptyString }}
        </mmg-summary-label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import MmgSummaryLabel from 'components/mmgComponents/MmgSummaryLabel'

export default {
  name: 'MmgEventSymptomsDialog',
  inheritAttrs: false,
  components: { MmgSummaryLabel },
  props: {
    event: { type: Object, required: false, default: null }
  },
  computed: {
    attrs () {
      const { ...attrs } = this.$attrs
      return attrs
    },
    listeners () {
      const { ...listeners } = this.$listeners
      return listeners
    },
    date () {
      return this.event?.dataInizioSint
    },
    temperature () {
      return this.event?.sintomo?.temperatura
    },
    cough () {
      return this.event?.sintomo?.flgTosse
    },
    dyspnoea () {
      return this.event?.sintomo?.flgDispnea
    },
    diarrhea () {
      return this.event?.sintomo?.flgDiarrea
    },
    conjunctivitis () {
      return this.event?.sintomo?.flgCongiuntivite
    },
    musclePain () {
      return this.event?.sintomo?.flgDoloriMusc
    },
    ageusia () {
      return this.event?.sintomo?.flgGusto
    },
    anosmia () {
      return this.event?.sintomo?.flgOlfatto
    },
    cold () {
      return this.event?.sintomo?.flgRaffreddore
    },
    fatigue () {
      return this.event?.sintomo?.flgStanchezza
    },
    moreSymptoms () {
      return this.event?.sintomo?.noteSintomo
    },
    clinicalConditions () {
      return this.event?.condizioniCliniche
    },
    subjectPlace () {
      return this.event?.luogoPaziente
    },
    context () {
      return this.event?.descrizioneContesto
    }
  }
}
</script>

<style scoped></style>

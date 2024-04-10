<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <!-- LISTA MESSAGGI -->
    <template v-if="!!communicationList.length">
      <communication-list-item
        v-for="communication in communicationList"
        :key="communication.id"
        :communication="communication"
        class="q-mb-lg q-mt-md"
      />
    </template>
    <div class="row items-center q-mt-sm q-pl-md q-pr-md q-col-gutter-md">
      <ges-strutture-page-title :no-back="true">
        Accedi ad una struttura
      </ges-strutture-page-title>
    </div>

    <q-card
      class="q-mt-sm"
      v-for="struttura in strutture"
      :key="struttura.stiId">

      <q-card-section class="row">
        <div class="text-h6 col-12">{{ struttura.nome }}</div>
      </q-card-section>

      <div class="q-mb-lg q-ml-md">
        <q-btn
          @click="navigateTo(struttura.idStruttura)"
          label="Accedi"
          color="primary" />
      </div>

      <q-separator inset />

      <q-card-section class="row">
        <div class="col-4">
          <strong>Indirizzo: </strong>{{ struttura.indirizzo }}
        </div>
        <div class="col-4">
          <strong>Direttore: </strong>{{ struttura.direttore }}
        </div>
        <div class="col-4">
          <strong>Telefono: </strong>{{ struttura.telefono }}
        </div>
      </q-card-section>

    </q-card>

  </q-page>
</template>

<script>
import GesStrutturePageTitle from 'components/GesStrutturePageTitle'
import { TYPES } from 'src/store'
import CommunicationListItem from "../components/messages/CommunicationListItem";
export default {
  name: 'PageElencoSoggetti',
  components: {CommunicationListItem, GesStrutturePageTitle },
  data () {
    return {
      strutture: []
    }
  },
    computed: {
        communicationList () {
            return this.$store.getters[TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI_EROGATORI] ?? []
        },
    },
  methods: {
    navigateTo (id) {
      // Salvataggio nello store della struttura selezionata
      const structure = this.strutture.find(s => s.idStruttura === id)
      console.log('Struttura da salvare nello store =>', structure)
      // debugger
      this.$store.dispatch('setSelectedStructure', { structure: structure })

      // Navigazione verso la rotta
      this.$router.push(`/visure_soggetti/${id}`)
    },
    cleanSelectedStructure () {
      // Resetta a null nello store, al ritorno su questa rotta, il laboratorio selezionato.
      this.$store.dispatch('setSelectedStructure', { structure: null })
    }
  },
  created () {
    this.$root.$emit('titolo-soggetti')
      this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE].elencoStrutturaArea.forEach(struttura => {
      if (struttura.natura.toUpperCase() === 'EROGATORI') {
        this.strutture.push(struttura)
      }
    })
    this.cleanSelectedStructure()
    if (this.strutture.length === 1) {
      // this.$router.push('/visure_soggetti/struttura/' + this.strutture[0].idStruttura)
      //this.navigateTo(this.strutture[0].idStruttura)
    }
  }
}
</script>

<style scoped>

</style>

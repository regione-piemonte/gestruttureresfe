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
      :key="struttura.stiId"
    >
      <q-card-section class="row">
        <div class="text-h6 col-12">{{ struttura.stiNome }}</div>
      </q-card-section>

      <div class="q-mb-lg q-ml-md">
        <q-btn
          @click="navigateTo(struttura.idStruttura,'/gestione_rsa/buono/struttura')"
          label="Accedi"
          color="primary"
          :disable="!struttura.adesioneBuonoWelfare"
          :title="!struttura.adesioneBuonoWelfare ? 'Questa struttura non ha aderito al Buono Residenzialita\'' : ''"
        />
      </div>

      <q-separator inset />

      <q-card-section class="row">
        <div class="col-4">
          <strong>Indirizzo: </strong>{{ struttura.stiIndirizzo }}
        </div>
        <div class="col-4">
          <strong>Direttore: </strong>{{ struttura.stiDirStrNome }}
        </div>
        <div class="col-4">
          <strong>Telefono: </strong>{{ struttura.stiTelefono }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import GesStrutturePageTitle from "components/GesStrutturePageTitle";
import { TYPES } from "src/store";
import CommunicationListItem from "src/components/messages/CommunicationListItem.vue";
import { getInfoStruttura, getStrutture } from 'src/services/api';
export default {
  name: "PageElencoStruttureBuono",
  components: { GesStrutturePageTitle, CommunicationListItem },
  data() {
    return {
      strutture: []
    };
  },
  computed: {
    communicationList() {
      return this.$store.getters[TYPES.GETTERS.COMMUNICATION_LIST_RAPIDI] ?? [];
    }
  },
  methods: {
    async navigateTo(id, basePath) {
      // Salvataggio nello store della struttura selezionata
      const structure = this.strutture.find(s => s.idStruttura === id);
      this.$store.dispatch("setSelectedStructure", { structure: structure });

      // Navigazione verso la rotta
      this.$router.push(`${basePath}/${id}`);
    },
    cleanSelectedStructure() {
      // Resetta a null nello store, al ritorno su questa rotta, il laboratorio selezionato.
      this.$store.dispatch("setSelectedStructure", { structure: null });
    }
  },
  async created() {
    // Per vedere tutto commentare le righe di sotto e scommentare la riga commentata
    let promise = await getStrutture();
    let s = promise.data;
    this.strutture = s;
    this.strutture = this.strutture.filter((e) => e.adesioneBuonoWelfare);
    this.cleanSelectedStructure();
    if (this.strutture.length === 1 && this.strutture.some(f => f.adesioneBuonoWelfare)) {
      // this.$router.push('/visure/struttura/' + this.strutture[0].idStruttura)
      //this.navigateTo(this.strutture[0].idStruttura, "/visure/struttura");
    }
  }
};
</script>

<style scoped></style>

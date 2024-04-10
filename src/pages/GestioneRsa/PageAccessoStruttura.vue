<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <h4 class="q-mt-sm q-mb-sm">{{ getStruttura.stiNome }}</h4>
    <div class="row items-center q-mt-sm q-pl-md q-pr-md q-col-gutter-md">
      <ges-strutture-page-title v-if="$route.path.includes('struttura')" @back="goBack">
        Torna alla selezione della struttura
      </ges-strutture-page-title>
      <div class="col-auto q-ml-auto" v-if="tab === 'conti'">
        <q-btn color="primary" @click="nuovoConto()">
          Nuovo conto
        </q-btn>
      </div>
    </div>

    <dialog-nuovo-conto title="Nuovo conto" :showDialog="openDialogNuovoConto" @hide="openDialogNuovoConto = false"
      :contoToUpdate="modelConto" @newConto="onAddConto" :provenienza="'new'"
      :flgDefault="flgDefault"></dialog-nuovo-conto>


    <!-- Selection tabs -->
    <q-tabs v-model="tab">
      <q-tab name="conti" label="CONTI CORRENTI" class="q-mx-xs" />
      <q-tab name="ospiti" label="OSPITI" class="q-mx-xs" :disable="!checkContoPredefinito">
        <q-tooltip v-if="!checkContoPredefinito" max-width="300px" anchor="top middle" self="bottom middle">
          <div class="text-body2">
            Per accedere a questa sezione devi prima avere un conto predefinito
          </div>
        </q-tooltip>
      </q-tab>
      <q-tab name="rendicontazioni" label="RENDICONTAZIONI" class="q-mx-xs" :disable="!checkContoPredefinito">
        <q-tooltip v-if="!checkContoPredefinito" max-width="300px" anchor="top middle" self="bottom middle">
          <div class="text-body2">
            Per accedere a questa sezione devi prima avere un conto predefinito
          </div>
        </q-tooltip>
      </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab">
      <!-- Show content tab CONTI -->
      <q-tab-panel name="conti">
        <conti-struttura ref="contiStruttura"></conti-struttura>
      </q-tab-panel>
      <!-- Show content tab OSPITI -->
      <q-tab-panel name="ospiti">
        <ospiti-struttura></ospiti-struttura>
      </q-tab-panel>
      <!-- Show content tab RENDICONTAZIONI -->
      <q-tab-panel name="rendicontazioni">
        <rendicontazioni-struttura></rendicontazioni-struttura>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
  
<script>
import { http } from 'src/boot/axios'
import GesStrutturePageTitle from 'components/GesStrutturePageTitle'
import { getContiStrutturaRendicontazione } from 'src/services/api'
import { notifyError } from 'src/services/utils'
import OspitiStruttura from 'src/components/GestioneRsa/Rendicontazioni/OspitiStruttura.vue'
import { TYPES } from 'src/store'
import ContiStruttura from 'src/components/GestioneRsa/Rendicontazioni/ContiStruttura.vue'
import DialogNuovoConto from 'src/components/GestioneRsa/Dialogs/DialogNuovoConto.vue'
import RendicontazioniStruttura from 'src/components/GestioneRsa/Rendicontazioni/RendicontazioniStruttura.vue'

export default {
  name: 'PageAccessoStruttura',
  components: { GesStrutturePageTitle, OspitiStruttura, ContiStruttura, DialogNuovoConto, RendicontazioniStruttura },
  data() {
    return {
      tab: this.$store.getters['getTabSelezionataBuono'] === null ? 'conti' : this.$store.getters['getTabSelezionataBuono'],
      idStruttura: null,
      openDialogNuovoConto: false,
      modelConto: {
        strContoId: Number,
        flgDefault: false,
        strContoIban: '',
        strContoIstituto: '',
        strContoDesc: '',
        validitaInizio: '',
        validitaFine: '',
      },
      conti: [],
      contiValidi: [],
      contiNonValidi: [],
      flgDefault: false

    }
  },
  // beforeUpdate() {
  //   console.log('beforeUpdate');//DEBUG
  //   this.conti = this.$store.getters['getListaContiStruttura'];
  //   this.contiValidi = this.conti.filter((e) => e.isValid !== false);
  //   this.contiNonValidi = this.conti.filter((e) => e.isValid === false);
  // },
  async created() {
    this.$root.$emit('titolo-accesso-struttura');
    try {
      let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
      this.conti = subjectList;
      this.contiValidi = this.conti.filter((e) => e.isValid !== false);
      this.contiNonValidi = this.conti.filter((e) => e.isValid === false);

      this.idStruttura = this.$route.params.id;
    } catch (err) {
      this.internalError = true
      console.log(err)
    }
  },
  computed: {
    getStruttura() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE];
    },
    checkContoPredefinito() {
      if (this.conti.length > 0) {
        // let contoPredefinito = this.contiValidi.filter((e) => e.flgDefault === true);
        // if (contoPredefinito.length > 0) {
        return true;
        // } else {
        //   return false;
        // }
      } else {
        return false;
      }
    }
  },
  methods: {
    nuovoConto() {
      this.initModelConto();
      const jsonString = JSON.stringify(this.modelConto);
      const data = JSON.parse(jsonString);
      this.openDialogNuovoConto = true;
    },
    initModelConto() {
      this.modelConto.flgDefault = false;
      this.modelConto.strContoIban = '';
      this.modelConto.strContoIstituto = '';
      this.modelConto.strContoDesc = '';
      this.modelConto.validitaInizio = '';
      this.modelConto.validitaFine = '';
      this.modelConto.stiId = this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].stiId;
    },
    async loadConti() {
      try {
        let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
        this.conti = subjectList;
      } catch (err) {
        this.internalError = true
        console.log(err)
      }
    },
    onAddConto() {
      this.openDialogNuovoConto = false;
      this.$on('newConto', this.$refs.contiStruttura.onLoading());
      this.$on('newConto', this.loadConti());
    },
    goBack() {
      this.$store.dispatch("setTabSelezionataBuono", { tabSelezionataBuono: null });
      this.$router.back();
    }
  }
}
</script>
  
<style scoped></style>
  
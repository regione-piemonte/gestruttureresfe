<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" full-width>
    <q-card style="max-width: 800px !important">
      <q-form ref="form" greedy @submit.prevent>
        <q-card-section class="q-py-none">
          <q-toolbar class="q-px-none">
            <q-toolbar-title>Movimento ingresso in struttura</q-toolbar-title>
            <q-btn v-close-popup round dense flat icon="close" />
          </q-toolbar>
        </q-card-section>
        <q-separator />

        <!-- DATI -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <template v-if="!isLoading">
          <q-card-section>
            Desideri assegnare il soggetto
            <strong>{{ subjectFullName }}</strong> alla struttura
            <strong>{{ selectedStructure.nome }}</strong>?
          </q-card-section>
        </template>
        <template v-else>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-if="!isLoading">
          <q-card-section >
            <div class="row col-md-12">
              <div class="col-md-6 q-pr-lg">
                <q-input class="col-md-4" v-model="dataFine" type="date" label="Data Ingresso*" stack-label
                  @input="dataSoggNotValid = false" filled dense no-error-icon :rules="[ruleRequired]" />
              </div>
              <div class="col-md-6 q-pr-lg">
                <q-select class="col-md-4" v-model="motivazioneSelezionata" :options="mot" :rules="[ruleRequired]"
                  option-label="tipoMovOspiteDesc" label="Motivazione*" emit-value map-options dense filled options-dense
                  no-error-icon bottom-slots clearable @input="selezionaMotivazione" />
              </div>
              <div class="col-md-12 q-pr-lg" v-if="dest && dest.length > 0">
                <q-select class="col-md-4" v-model="destinazioneSelezionata" :options="struttureOptions"
                  option-value="idStruttura" option-label="nome" label="Provenienza" emit-value map-options dense filled
                  options-dense no-error-icon bottom-slots clearable use-input input-debounce="0"
                  @filter="filtraStrutture" />
              </div>
              <div class="col-md-12 q-pr-lg">
                <q-input v-model="note" filled type="textarea" label="Note*" :rules="[ruleRequired]" />
              </div>
            </div>
          </q-card-section>
        </template>
        <template v-else>
          <q-inner-loading showing color="primary" />
        </template>

        <!--        CONFERMA E SALVA-->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-card-section class="text-right">
          <div class="row  q-col-gutter-md reverse">
            <div class="col-md-auto col-12">
              <q-btn v-if="!isLoading" color="negative" :loading="isAssociation" class="full-width"
                @click="onAssociation">Aggiungi</q-btn>
            </div>
            <div class="col-md-auto col-12">
              <q-btn v-if="!isLoading" color="primary" outline v-close-popup class="full-width">Indietro</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { TYPES } from "../store";
import { associaSoggettoStruttura, disassociaSoggettoStruttura, getMotivazioneFullList, getStruttureByNatura } from "../services/api";
import { notifyError, notifySuccess, sortBy } from "../services/utils";
import { date } from 'quasar';

export default {
  name: "NewAssociationStructureDialog",
  props: {
    subject: { type: Object, required: false, default: null },
    idStrutturaRes: { type: String, required: false, default: null }
  },
  data() {
    return {
      isLoading: false,
      isAssociation: false,
      dataFine: null,
      mot: [],
      motivazioneSelezionata: null,
      destinazioneSelezionata: null,
      dest: [],
      struttureSearchValue: "",
      note: '',
      flag: false,
    }
  },
  computed: {
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    selectedStructure() {
      return this.$store.getters[
        TYPES.GETTERS.SELECTED_PROFILE
      ]?.elencoStrutturaArea?.find(
        strut => strut.idStruttura === this.idStrutturaRes
      );
    },

    subjectFullName() {
      return this.subject?.nome + " " + this.subject?.cognome;
    },
    strutturaOperazione() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idStruttura;
    },
    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },

    userFirstName() {
      return this.user?.contatto?.nome ?? "";
    },
    userLastName() {
      return this.user?.contatto?.cognome ?? "";
    },
    userFullName() {
      let lastName = this.userLastName ?? "";
      let firstName = this.userFirstName ?? "";
      return [lastName, firstName].join(" ").trim();
    },

    attrs() {
      let { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      let { ...listeners } = this.$listeners;
      return listeners;
    },

    subjectId() {
      return this.subject?.idSoggetto;
    },
    subjectStrutturaAssistenza() {
      return this.subject?.idStrutturaAssistenza;
    },
    struttureOptions() {
      return this.dest.filter(c => {
        const toSearch = this.struttureSearchValue?.toUpperCase?.() ?? "";
        const searchable = c.nome.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
  },
  watch: {},
  async created() {
    this.isLoading = true;
    let promise = await getMotivazioneFullList();
    let motiva = promise.data;
    this.mot = motiva.filter(f => f.flgIngresso);
    this.isLoading = false;
  },
  methods: {
    async onAssociation() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;
      
      this.isAssociation = true;
      let payload = {
        dataMovimento: new Date(this.dataFine),
        tipoMovOspiteId: this.motivazioneSelezionata.tipoMovOspiteId,
        flgPreservaPosto: true,
        idStrutturaOd: this.destinazioneSelezionata,
        note: this.note
      }
      try {
        let promise = await associaSoggettoStruttura(
          this.subject.idSoggetto,
          this.idStrutturaRes,
          true,
          payload
        );
        notifySuccess("Soggetto aggiunto dalla struttura");
        this.$emit("newAssociation");
      } catch (e) {
        let message =
          "Non Ã¨ stato possibile aggiungere il soggetto dalla struttura";
        notifyError(e, message);
      }

      this.isAssociation = false;
    },
    async selezionaMotivazione() {
      if (this.motivazioneSelezionata.tipoMovOspiteNaturaSod.length > 0) {
        this.isLoading = true;
        let nature = '';
        for (let i = 0; i < this.motivazioneSelezionata.tipoMovOspiteNaturaSod.length; i++) {
          if (i == this.motivazioneSelezionata.tipoMovOspiteNaturaSod.length - 1) {
            nature += this.motivazioneSelezionata.tipoMovOspiteNaturaSod[i].naturaStrutturaOd;
          } else {
            nature += this.motivazioneSelezionata.tipoMovOspiteNaturaSod[i].naturaStrutturaOd + ',';
          }
        }
        let promise = await getStruttureByNatura(nature);
        let d = promise.data;

        this.dest = d;
        // this.dest = sortBy(this.dest, "nome")
        this.isLoading = false;
      } else {
        this.dest = [];
      }
    },
    filtraStrutture(val, update) {
      update(() => {
        this.struttureSearchValue = val;
      });
    }
  }
};
</script>

<style scoped></style>

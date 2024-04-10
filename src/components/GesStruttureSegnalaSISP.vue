<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog class="col-12" @hide="$emit('hide')" v-model="show">
    <q-card class="full-width q-pa-md">
      <q-card-section class="row">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-toggle v-model="sintomi" label="Sintomi" />
      <q-form ref="formsegnala" v-if="sintomi">
        <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <q-input
            v-model="dataEsordioSintomi"
            type="date"
            label="Data esordio sintomi malattia*"
            stack-label
            filled
            dense
            no-error-icon
            :rules="[ruleRequired]"
          />
        </div>
        <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <q-input
            v-model="temperatura"
            type="number"
            label="Temperatura"
            stack-label
            filled
            dense
            no-error-icon
          />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Tosse:</strong>
          <q-radio v-model="tosse" val="No" label="No" />
          <q-radio
            v-model="tosse"
            val="Non persistente"
            label="Non persistente"
          />
          <q-radio
            v-model="tosse"
            val="Persistente grassa"
            label="Persistente grassa"
          />
          <q-radio
            v-model="tosse"
            val="Persistente secca"
            label="Persistente secca"
          />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Dispnea:</strong>
          <q-radio v-model="dispnea" val="No" label="No" />
          <q-radio v-model="dispnea" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3"
            >Disturbi gastrointestinali (diarrea, nausea, vomito):</strong
          >
          <q-radio v-model="gastroIntestinali" val="No" label="No" />
          <q-radio v-model="gastroIntestinali" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Congiuntivite bilaterale:</strong>
          <q-radio v-model="congiuntivite" val="No" label="No" />
          <q-radio v-model="congiuntivite" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Dolori osteomuscolari diffusi:</strong>
          <q-radio v-model="doloriOsteomuscolari" val="No" label="No" />
          <q-radio
            v-model="doloriOsteomuscolari"
            val="Prima emergenza"
            label="Prima emergenza"
          />
          <q-radio
            v-model="doloriOsteomuscolari"
            val="Ultime due settimane"
            label="Ultime due settimane"
          />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Ageusia:</strong>
          <q-radio v-model="ageusia" val="No" label="No" />
          <q-radio v-model="ageusia" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Anosmia:</strong>
          <q-radio v-model="anosmia" val="No" label="No" />
          <q-radio v-model="anosmia" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Rinorrea:</strong>
          <q-radio v-model="rinorrea" val="No" label="No" />
          <q-radio v-model="rinorrea" val="Leggero" label="Leggero" />
          <q-radio v-model="rinorrea" val="Forte" label="Forte" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Astenia severa:</strong>
          <q-radio v-model="astenia" val="No" label="No" />
          <q-radio v-model="astenia" val="Nella norma" label="Nella norma" />
          <q-radio
            v-model="astenia"
            val="PiÃ¹ del solito"
            label="PiÃ¹ del solito"
          />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Cefalea:</strong>
          <q-radio v-model="cefalea" val="No" label="No" />
          <q-radio v-model="cefalea" val="Si" label="Si" />
        </div>
        <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
          <strong class="col-3">Faringodinia:</strong>
          <q-radio v-model="faringodinia" val="No" label="No" />
          <q-radio v-model="faringodinia" val="Si" label="Si" />
        </div>
        <q-input
          filled
          class="q-ml-sm q-mr-sm q-mt-sm q-mb-lg"
          dense
          label="Altri sintomi"
          v-model="nomeSintomo"
        >
        </q-input>
      </q-form>
      <q-form ref="formsegnala">
        <q-input
          :rules="[ruleRequired]"
          filled
          class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
          dense
          label="Condizioni cliniche*"
          v-model="condizioniCliniche"
        >
        </q-input>
        <q-input
          :rules="[ruleRequired]"
          filled
          class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
          dense
          label="Luogo paziente*"
          v-model="luogo"
        >
        </q-input>
        <q-input
          :rules="[ruleRequired]"
          filled
          class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
          dense
          label="Contesto - contatto*"
          v-model="contesto"
        >
        </q-input>
        <div class="row">
          <q-btn
            :loading="isSaving"
            color="primary"
            class="q-ml-auto q-mt-sm q-mr-sm q-mb-sm"
            label="Salva"
            @click="onSave"
          ></q-btn>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { TYPES } from "../store";
import {
  APP_CODE,
  EVENT_TYPE_CODES,
  GEST_ST_RES
} from "../services/business_logic";
import { createEvent } from "../services/api";
import { date } from "quasar";
import { notifySuccess } from "../services/utils";
const { formatDate } = date;
export default {
  name: "GesStruttureSegnalaSISP",
  props: ["show", "idSoggetto", "title"],
  data() {
    return {
      isSaving: false,
      sintomi: false,
      condizioniCliniche: "",
      luogo: "",
      contesto: "",
      luogoPrelievo: "",
      dataEsordioSintomi: "",
      temperatura: "",
      // SINTOMI
      tosse: "No",
      dispnea: "No",
      gastroIntestinali: "No",
      congiuntivite: "No",
      doloriOsteomuscolari: "No",
      ageusia: "No",
      anosmia: "No",
      rinorrea: "No",
      astenia: "No",
      cefalea: "No",
      faringodinia: "No",
      nomeSintomo: ""
    };
  },
  computed: {
    subjectId() {
      return this.idSoggetto;
    },
    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },

    selectedStructure() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE]?.elencoStrutturaArea?.find(
        strut => strut.idStruttura === this.$route.params.idStrutturaRes
      );
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  methods: {
    async onSave() {
      const isValid = await this.$refs.formsegnala.validate();
      if (!isValid) return;

      this.isSaving = true;
      if (isValid) {
        let sintomi = "NO";
        let sintomo = null;
        let dataSint = null;
        if (this.sintomi) {
          sintomi = "SI";
          sintomo = {
            flgCefalea: this.cefalea.toUpperCase().replaceAll(" ", "_"),
            flgCongiuntivite: this.congiuntivite
              .toUpperCase()
              .replaceAll(" ", "_"),
            flgDiarrea: this.gastroIntestinali
              .toUpperCase()
              .replaceAll(" ", "_"),
            flgDispnea: this.dispnea.toUpperCase().replaceAll(" ", "_"),
            flgDoloriMusc: this.doloriOsteomuscolari
              .toUpperCase()
              .replaceAll(" ", "_"),
            flgFaringodinia: this.faringodinia
              .toUpperCase()
              .replaceAll(" ", "_"),
            flgGusto: this.ageusia.toUpperCase().replaceAll(" ", "_"),
            flgOlfatto: this.anosmia.toUpperCase().replaceAll(" ", "_"),
            flgRaffreddore: this.rinorrea.toUpperCase().replaceAll(" ", "_"),
            flgStanchezza: this.astenia
              .toUpperCase()
              .replaceAll(" ", "_")
              .replace("PIÃ_DEL_SOLITO", "PIU_SOLITO"),
            flgTosse: this.tosse.toUpperCase().replaceAll(" ", "_"),
            noteSintomo: this.nomeSintomo,
            temperatura: this.temperatura
          };
          dataSint = this.dataEsordioSintomi;
        }

        let profile = null;
        let areaUtente = null;
        if (this.user?.elencoProfilo?.length > 0) {
          profile = this.user?.elencoProfilo.find(
            a => a.nomeProfilo === GEST_ST_RES
          )?.idProfilo;
        }
        if (this.selectedStructure?.elencoArea?.length > 0) {
          areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
        }

        const payload = {

          descrizioneContesto: this.contesto,
          luogoPaziente: this.luogo,
          idSoggetto: this.subjectId,
          idTipoEvento: EVENT_TYPE_CODES.REPORTED,
          dataDimissioni: formatDate(new Date(), "YYYY-MM-DD"),
          dataPrevFineEvento: null,
          note: this.contesto,
          condizioniCliniche: this.condizioniCliniche,
          sintomi: sintomi,
          dataInizioSint: dataSint,
          sintomo: sintomo,

          webappOperazione: APP_CODE.STRUTTURE,
          idProfiloOperazione: profile,
          ruoloOperazione: this.user?.categoriaOpessan,
          utenteOperazione: this.user?.cfUtente,
          idEnteOperazione: this.selectedStructure.idEnte,
          idStrutturaOperazione: this.selectedStructure.idStruttura,
          idAreaOperazione: areaUtente
        };
        try {
          this.sintomi = false;
          //await segnalaSisp(payload)
          await createEvent(payload);
          this.condizioniCliniche = "";
          this.luogo = "";
          this.contesto = "";
          this.dataEsordioSintomi = "";
          this.temperatura = "";
          this.tosse = "No";
          this.dispnea = "No";
          this.gastroIntestinali = "No";
          this.congiuntivite = "No";
          this.doloriOsteomuscolari = "No";
          this.ageusia = "No";
          this.anosmia = "No";
          this.rinorrea = "No";
          this.astenia = "No";
          this.cefalea = "No";
          this.faringodinia = "No";
          this.nomeSintomo = "";
          notifySuccess("Decorso inserito");
          this.$emit("aggiorna-sisp");
        } catch (e) {
          console.error(e);
        }
      }
      this.isSaving = false;
    }
  }
};
</script>

<style scoped></style>

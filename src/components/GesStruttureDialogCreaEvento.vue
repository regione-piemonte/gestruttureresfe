<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog v-model="opened" full-width>
    <q-card style="max-width: 800px !important" v-if="!isAvilabilityVisible">
      <q-form ref="form" greedy @submit.prevent>
        <q-card-section class="q-py-none">
          <q-toolbar class="q-px-none">
            <q-toolbar-title>{{ title }}</q-toolbar-title>
            <q-btn v-close-popup round dense flat icon="close" />
          </q-toolbar>
        </q-card-section>
        <q-separator />

        <!-- DATI -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-card-section>
          <!-- TUTTI -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="eventType"
                :options="eventTypeListSorted"
                label="Evento*"
                option-value="idTipoEvento"
                option-label="descTipoEvento"
                filled
                dense
                bottom-slots
                no-error-icon
                :loading="isLoading"
                :rules="[ruleRequired]"
                readonly
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="eventDate"
                filled
                type="date"
                label="Data evento*"
                stack-label
                dense
                no-error-icon
                bottom-slots
                :rules="[ruleRequired]"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="myEventStructure"
                :options="eventStructureListOptions"
                label="Struttura*"
                option-value="idStruttura"
                option-label="nome"
                filled
                dense
                bottom-slots
                no-error-icon
                :loading="isLoadingStructure"
                :rules="[ruleRequired]"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="myEventArea"
                :options="myEventStructureAreaList"
                label="Area*"
                option-value="idArea"
                option-label="nome"
                filled
                dense
                bottom-slots
                no-error-icon
                :loading="isLoadingStructure"
                :rules="[ruleRequired]"
              />
            </div>

            <!-- QUARANTENA -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <div class="col-12" v-if="isQuarantine">
              <q-input
                v-model="quarantineEndDate"
                filled
                type="date"
                label="Data fine isolamento"
                stack-label
                dense
                no-error-icon
                bottom-slots
                :rules="[beforeEventDate]"
              />
            </div>

            <div class="col-12" v-if="isQuarantine">
              <q-separator />
            </div>

            <!-- DATI ISOLAMENTO DOMICILIARE -->
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <template v-if="isHomeIsolationSelected">
              <div class="col-12">
                Indicare presso chi e dove si svolgerÃ  la quarantena
              </div>
              <div class="col-12">
                <q-input
                  v-model="isolationPlace"
                  type="text"
                  label="Quarantena presso"
                  filled
                  dense
                  no-error-icon
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="isolationAddress"
                  type="text"
                  label="Indirizzo di quarantena"
                  filled
                  dense
                  no-error-icon
                />
              </div>

              <div class="col-12">
                <q-select
                  filled
                  v-model="isolationCity"
                  :options="isolationCityOptions"
                  label="Comune di quarantena"
                  option-label="nomeComune"
                  option-value="istatComune"
                  dense
                  options-dense
                  no-error-icon
                  use-input
                  fill-input
                  hide-selected
                  bottom-slots
                  clearable
                  :loading="isLoading"
                  :rules="[ruleRequired]"
                  @filter="onIsolationCityOptionsFilter"
                />
              </div>

              <div class="col-12">
                <mmg-summary-label title>ASL domicilio</mmg-summary-label>
                <mmg-summary-label title bold
                  >{{ subjectDomicileAsl | emptyString }}
                </mmg-summary-label>
              </div>
            </template>

            <!-- DATI ASSEGNAMENTO DOMICILIARE -->
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <template v-if="isHomeAssignmentSelected">
              <div class="col-12">
                Indicare la struttura presso cui verrÃ  assegnato il paziente
              </div>

              <div class="col-12">
                <q-select
                  v-model="eventStructure"
                  label="Struttura*"
                  option-value="idStruttura"
                  option-label="nome"
                  filled
                  dense
                  bottom-slots
                  no-error-icon
                  disable
                  :loading="isLoading"
                  :rules="[ruleRequired]"
                />
              </div>
            </template>
            <!-- <div class="col-12">
                <q-select
                  v-model="eventArea"
                  :options="eventStructureAreaList"
                  label="Area*"
                  option-value="idArea"
                  option-label="nome"
                  filled
                  dense
                  bottom-slots
                  no-error-icon
                  :loading="isLoading"
                  :rules="[ruleRequired]"
                />
              </div> -->

            <template
              v-if="
                isHomeAssignmentSelected ||
                  isHomeIsolationSelected ||
                  isTransferredInternalSelected ||
                  isTransferredExternalSelected ||
                  isTestWaitingSelected ||
                  isHospitalizedSelected
              "
            >
              <div class="col-12">
                <q-separator />
              </div>
            </template>

            <template
              v-if="
                isTransferredInternalSelected ||
                  isTransferredExternalSelected ||
                  isTestWaitingSelected ||
                  isHospitalizedSelected
              "
            >
              <div class="col-12">
                Indicare la struttura presso cui verrÃ  assegnato il paziente
              </div>

              <div class="col-12">
                <q-select
                  v-model="eventStructure"
                  label="Struttura*"
                  option-value="idStruttura"
                  option-label="nome"
                  filled
                  dense
                  bottom-slots
                  no-error-icon
                  disable
                  :loading="isLoading"
                  :rules="[ruleRequired]"
                />
                <!--                <div class="col-4">-->
                <!--                  <q-btn-->
                <!--                    class="q-mx-lg"-->
                <!--                    color="primary"-->
                <!--                    @click="showAvailability"-->
                <!--                    >DisponibilitÃ  posti-->
                <!--                  </q-btn>-->
                <!--                </div>-->
              </div>

              <template
                v-if="
                  isTransferredInternalSelected ||
                    isTransferredExternalSelected ||
                    isTestWaitingSelected ||
                    isHospitalizedSelected
                "
              >
                <div class="col-12">
                  <q-separator />
                </div>
              </template>
            </template>

            <div
              v-if="
                isQuarantine ||
                  isTransferredInternalSelected ||
                  isTransferredExternalSelected ||
                  isTestWaitingSelected ||
                  isHospitalizedSelected
              "
              class="row no-margin no-padding full-width q-col-gutter-md"
            >
              <div class="col-12">
                <q-input
                  v-model.trim="note"
                  type="textarea"
                  label="Note"
                  hint="Puoi andare a capo premendo invio"
                  filled
                  dense
                  autogrow
                  bottom-slots
                  no-error-icon
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model.trim="clinicalConditions"
                  type="textarea"
                  label="Condizioni cliniche"
                  hint="Puoi andare a capo premendo invio"
                  filled
                  dense
                  autogrow
                  bottom-slots
                  no-error-icon
                />
              </div>

              <div class="col-12">
                <q-toggle
                  v-model="hasSymptomsToggle"
                  label="Sintomi"
                  class="text-black"
                  toggle-indeterminate
                />
              </div>

              <q-slide-transition :duration="700" class="col-12">
                <div v-show="hasSymptomsToggle" class="q-py-xs">
                  <div class="col-12">
                    <q-input
                      v-model="symptomsDate"
                      filled
                      type="date"
                      label="Data esordio sintomi"
                      stack-label
                      dense
                      no-error-icon
                      bottom-slots
                      :disable="!hasSymptomsToggle"
                      :rules="[
                        ruleRequiredIfHasSymptoms,
                        symptomsDateBetweenRule
                      ]"
                    />
                  </div>

                  <!--              SINGOLI SINTOMI-->

                  <div class="col-12">
                    <q-input
                      v-model.number="temperature"
                      filled
                      type="number"
                      label="Temperatura"
                      min="0"
                      step=".1"
                      dense
                      no-error-icon
                      bottom-slots
                    />
                  </div>

                  <!-- TOSSE -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Tosse:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="cough" val="NO" label="No" />
                        <q-radio
                          v-model="cough"
                          val="NON_PERSISTENTE"
                          label="Non Persistente"
                        />
                        <q-radio
                          v-model="cough"
                          val="PERSISTENTE_GRASSA"
                          label="Persistente grassa"
                        />
                        <q-radio
                          v-model="cough"
                          val="PERSISTENTE_SECCA"
                          label="Persistente secca"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- DISPNEA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Dispnea:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="dyspnoea" val="NO" label="No" />
                        <q-radio v-model="dyspnoea" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- DISTURBI GASTROINTESTINALI -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Disturbi gastrointestinali (diarrea, nausea, vomito):
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="diarrhea" val="NO" label="No" />
                        <q-radio v-model="diarrhea" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- CONGIUNTIVITE BILATERALE -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Congiuntivite bilaterale:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="conjunctivitis" val="NO" label="No" />
                        <q-radio v-model="conjunctivitis" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- DOLORI OSTEOMUSCOLARI DIFFUSI -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Dolori osteomuscolari diffusi:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="musclePain" val="NO" label="No" />
                        <q-radio
                          v-model="musclePain"
                          val="PRIMA_EMERGENZA"
                          label="Prima emergenza"
                        />
                        <q-radio
                          v-model="musclePain"
                          val="ULTIME_2_SETTIMANE"
                          label="Ultime due settimane"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- AGEUSIA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Ageusia:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="ageusia" val="NO" label="No" />
                        <q-radio v-model="ageusia" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- ANOSMIA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Anosmia:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="anosmia" val="NO" label="No" />
                        <q-radio v-model="anosmia" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- RINORREA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Rinorrea:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="cold" val="NO" label="No" />
                        <q-radio v-model="cold" val="LEGGERO" label="Leggero" />
                        <q-radio v-model="cold" val="FORTE" label="Forte" />
                      </div>
                    </div>
                  </div>

                  <!-- ASTENIA SEVERA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Astenia severa:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="fatigue" val="NO" label="No" />
                        <q-radio
                          v-model="fatigue"
                          val="NELLA_NORMA"
                          label="Nella norma"
                        />
                        <q-radio
                          v-model="fatigue"
                          val="PIU_SOLITO"
                          label="PiÃ¹ del solito"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- CEFALEA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Cefalea:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="headache" val="NO" label="No" />
                        <q-radio v-model="headache" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- FARINGOFINIA -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <div class="row items-center">
                      <div class="col-12 col-sm-3 text-weight-bold">
                        Faringodinia:
                      </div>
                      <div class="col-12 col-sm-9">
                        <q-radio v-model="soreThroat" val="NO" label="No" />
                        <q-radio v-model="soreThroat" val="SI" label="SÃ¬" />
                      </div>
                    </div>
                  </div>

                  <!-- ALTRO -->
                  <!-- --------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <q-input
                      v-model="moreSymptoms"
                      filled
                      type="textarea"
                      label="Altri sintomi"
                      dense
                      autogrow
                      no-error-icon
                    />
                  </div>
                </div>
              </q-slide-transition>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="text-right">
          <q-btn color="primary" :loading="isSaving" @click="onSave"
            >Salva
          </q-btn>
        </q-card-section>
      </q-form>
    </q-card>

    <template v-if="isAvilabilityVisible">
      <!-- <subject-structure-availability-dialog v-model="isAvilabilityVisible" /> -->
    </template>
  </q-dialog>
</template>

<script>
import { notifyError, notifySuccess, sortBy } from "../services/utils";
// import SubjectStructureAvailabilityDialog from './SubjectStructureAvailabilityDialog'
import {
  getUserInfo,
  getCityList,
  getEventTypeList,
  getEventStructureAreaList,
  getQuarantineStructureList,
  createEvent,
  getStructureList
} from "../services/api";
import {
  APP_CODE,
  EVENT_TYPE_CODES,
  GEST_ST_RES
} from "../services/business_logic";
import { date } from "quasar";
import MmgSummaryLabel from "./mmgComponents/MmgSummaryLabel.vue";
import { TYPES } from "../store";

const { getDateDiff, isBetweenDates, formatDate } = date;

export default {
  name: "SubjectEventCreateDialog",
  props: {
    subject: { type: Object, required: false, default: null },
    isQuarantine: { type: Boolean, required: false, default: false },
    isTransfer: { type: Boolean, required: false, default: false }
  },
  components: {
    MmgSummaryLabel
  },
  data() {
    return {
      myEventArea: null,
      isLoadingStructure: false,
      myEventStructure: null,
      eventStructureListFull: [],
      opened: false,
      isLoading: false,
      isSaving: false,
      eventTypeList: [],
      cityList: [],
      quarantineStructureList: [],
      eventStructureList: [],
      eventStructureAreaList: [],
      eventType: null,
      eventDate: null,
      quarantineEndDate: null,
      note: "",
      clinicalConditions: "",
      eventStructure: null,
      eventArea: null,
      isolationPlace: "",
      isolationAddress: "",
      isolationCity: null,
      isolationCitySearchValue: "",
      hasSymptoms: false,
      hasSymptomsToggle: null,
      symptomsDate: null,
      isAvilabilityVisible: null,
      temperature: null,
      cough: null,
      dyspnoea: null,
      diarrhea: null,
      conjunctivitis: null,
      musclePain: null,
      ageusia: null,
      anosmia: null,
      cold: null,
      fatigue: null,
      headache: null,
      soreThroat: null,
      moreSymptoms: ""
    };
  },
  watch: {
    async eventType() {
      this.myEventStructure = null;
      this.isLoadingStructure = true;
      try {
        let params = {
          idTipoEvento: this.eventType?.idTipoEvento
        };

        let structureListPromise = await getStructureList(params);
        this.eventStructureListFull = structureListPromise?.data;
      } catch (e) {
        notifyError(
          e,
          "Non Ã¨ stato possibile caricare l'elenco delle strutture"
        );
      }
      this.isLoadingStructure = false;
    },
    myEventStructure() {
      this.myEventArea = null;
    }
  },
  computed: {
    myEventStructureAreaList() {
      if (this.myEventStructure) {
        return this.myEventStructure?.elencoArea;
      }
      return [];
    },
    eventStructureListOptions() {
      return this.eventStructureListFull;
    },
    selectedStructure() {
      return this.$store.getters[
        TYPES.GETTERS.SELECTED_PROFILE
      ]?.elencoStrutturaArea?.find(
        strut => strut.idStruttura === this.$route.params.idStrutturaRes
      );
    },

    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    ruleRequiredIfHasSymptoms() {
      const message = "Inserire data esordio ed almeno un sintomo";
      const toFill = [
        this.temperature,
        this.cough,
        this.dyspnoea,
        this.diarrhea,
        this.conjunctivitis,
        this.musclePain,
        this.ageusia,
        this.anosmia,
        this.cold,
        this.fatigue,
        this.headache,
        this.soreThroat,
        this.moreSymptoms
      ];

      const dateFilled = !!this.symptomsDate;
      const someFilled = toFill.some(i => !!i && i !== "NO");
      const isOk = dateFilled && someFilled;

      return v => !this.hasSymptoms || isOk || message;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    subjectId() {
      return this.subject?.idSoggetto;
    },
    subjectTaxCode() {
      return this.subject?.codiceFiscale ?? "";
    },
    subjectBirthDate() {
      return this.subject?.dataNascita;
    },
    subjectFirstName() {
      return this.subject?.nome ?? "";
    },
    subjectLastName() {
      return this.subject?.cognome ?? "";
    },
    subjectFullName() {
      return [this.subjectLastName, this.subjectFirstName].join(" ").trim();
    },
    subjectDomicileAddress() {
      return this.subject?.indirizzoDomicilio;
    },
    subjectDomicileCity() {
      return this.subject?.comuneDomicilio;
    },
    subjectDomicileAsl() {
      return this.subject?.aslDomicilio;
    },
    eventTypeListSorted() {
      return sortBy(this.eventTypeList, "descTipoEvento");
    },
    isHomeIsolationSelected() {
      return (
        this.eventType?.idTipoEvento === EVENT_TYPE_CODES.HOME_ISOLATION ||
        this.eventType?.idTipoEvento ===
          EVENT_TYPE_CODES.DISPOSED_HOME_ISOLATION
      );
    },
    isHomeAssignmentSelected() {
      return (
        this.eventType?.idTipoEvento === EVENT_TYPE_CODES.HOME_ASSIGNMENT ||
        this.eventType?.idTipoEvento ===
          EVENT_TYPE_CODES.DISPOSED_HOME_ASSIGNMENT
      );
    },
    isTransferredInternalSelected() {
      return (
        this.eventType?.idTipoEvento === EVENT_TYPE_CODES.TRANSFERRED_INTERNAL
      );
    },
    isTransferredExternalSelected() {
      return (
        this.eventType?.idTipoEvento === EVENT_TYPE_CODES.TRANSFERRED_EXERNAL
      );
    },
    isTestWaitingSelected() {
      return this.eventType?.idTipoEvento === EVENT_TYPE_CODES.TEST_WAITING;
    },
    isHospitalizedSelected() {
      // return this.eventType?.idTipoEvento === EVENT_TYPE_CODES.HOSPITALIZED
      const codes = [
        EVENT_TYPE_CODES.HOSPITALIZED_FOR_COVID,
        EVENT_TYPE_CODES.HOSPITALIZED_WITH_COVID
      ];
      const code = this.eventType?.idTipoEvento;
      return codes.includes(code);
    },
    quarantineStructureListSorted() {
      return sortBy(this.quarantineStructureList, "nome");
    },
    cityListSorted() {
      return sortBy(this.cityList, "nomeComune");
    },
    isolationCityOptions() {
      return this.cityListSorted.filter(c => {
        const toSearch = this.isolationCitySearchValue?.toUpperCase?.() ?? "";
        const searchable = c.nomeComune.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    symptomsDateBetweenRule() {
      const min = new Date("2020-01-01");
      const max = new Date();
      return v =>
        !this.hasSymptoms ||
        isBetweenDates(v, min, max, {
          inclusiveFrom: true,
          inclusiveTo: true
        }) ||
        "Deve essere compresa fra 01 Gen 2020 ed oggi";
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleSymptomsDate() {
      return v => !this.hasSymptoms || !!v || "Campo obbligatorio";
    },
    beforeEventDate() {
      return v => {
        const diff = getDateDiff(v, this.eventDate);
        return !v || diff >= 0 || "Non puÃ² finire prima di iniziare";
      };
    },
    title() {
      return this.isQuarantine ? "Aggiungi isolamento" : "Aggiungi decorso";
    }
  },
  async created() {
    this.isLoading = true;

    const eventTypeListPromise = getEventTypeList();

    const cityListPromise = getCityList();
    const quarantineStructureListPromise = getQuarantineStructureList();

    let params = {
      applicazioneCod: APP_CODE.STRUTTURE
    };

    const userInfoPromise = getUserInfo(params);

    try {
      const { data } = await eventTypeListPromise;
      const { data1 } = await getEventStructureAreaList();
      this.eventStructureAreaList = data1;
      if (this.isQuarantine) {
        this.eventTypeList = data.filter(e =>
          [
            EVENT_TYPE_CODES.HOME_ASSIGNMENT,
            EVENT_TYPE_CODES.HOME_ISOLATION,
            EVENT_TYPE_CODES.DISPOSED_HOME_ISOLATION,
            EVENT_TYPE_CODES.DISPOSED_HOME_ASSIGNMENT
          ].includes(e.idTipoEvento)
        );
      } else {
        this.eventTypeList = data.filter(e =>
          [
            // EVENT_TYPE_CODES.HOSPITALIZED,
            EVENT_TYPE_CODES.HOSPITALIZED_FOR_COVID,
            EVENT_TYPE_CODES.HOSPITALIZED_WITH_COVID,
            EVENT_TYPE_CODES.TRANSFERRED_INTERNAL,
            EVENT_TYPE_CODES.TRANSFERRED_EXERNAL,
            EVENT_TYPE_CODES.DEAD,
            // EVENT_TYPE_CODES.HEALED,
            EVENT_TYPE_CODES.TEST_WAITING,
            EVENT_TYPE_CODES.LEAVED,
            EVENT_TYPE_CODES.DEAD_NO_COVID
          ].includes(e.idTipoEvento)
        );
      }
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare le tipologie di evento");
    }

    try {
      const { data } = await cityListPromise;
      this.cityList = data;
    } catch (err) {
      notifyError("Non Ã¨ stato possibile caricare l'elenco dei comuni");
    }

    try {
      const { data } = await quarantineStructureListPromise;
      this.quarantineStructureList = data;
    } catch (err) {
      notifyError("Non Ã¨ stato possibile caricare l'elenco delle strutture");
    }

    this.eventStructureList = this.$store.getters[
      TYPES.GETTERS.SELECTED_PROFILE
    ].elencoStrutturaArea.filter(this.isAcuta);

    // PRECOMPILIAMO I DATI
    this.isolationPlace = this.subjectFullName;
    this.isolationAddress = this.subjectDomicileAddress;
    this.isolationCity = this.subjectDomicileCity;
    if (this.isTransfer) {
      // this.eventType = this.eventTypeList.find(
      //   e => e.idTipoEvento === EVENT_TYPE_CODES.HOSPITALIZED
      // )

      const codes = [
        EVENT_TYPE_CODES.HOSPITALIZED_FOR_COVID,
        EVENT_TYPE_CODES.HOSPITALIZED_WITH_COVID
      ];
      this.eventType = this.eventTypeList.find(e =>
        codes.includes(e.idTipoEvento)
      );
    }

    // PREIMPOSTIAMO LA DATA DI INIZIO SINTOMI DELL'ULTIMO DECORSO CON SINTOMI
    let events = this.subject?.elencoDecorso ?? [];
    events = sortBy(events, "idDecorso");
    events.forEach(e => {
      this.hasSymptoms = e.sintomi === "SI";
      if (this.hasSymptoms === true) {
        this.hasSymptomsToggle = true;
      }
      if (e.sintomi === "SI") {
        this.symptomsDate = formatDate(e.dataInizioSint, "YYYY-MM-DD");
      }
    });

    this.isLoading = false;
  },
  methods: {
    openDialog(event, struttura) {
      this.opened = true;
      this.eventType = event;
      this.eventStructure = struttura;
    },
    getSymptomPayload() {
      return {
        temperatura: this.temperature,
        flgTosse: this.cough,
        flgDispnea: this.dyspnoea,
        flgDiarrea: this.diarrhea,
        flgCongiuntivite: this.conjunctivitis,
        flgDoloriMusc: this.musclePain,
        flgGusto: this.ageusia,
        flgOlfatto: this.anosmia,
        flgRaffreddore: this.cold,
        flgStanchezza: this.fatigue,
        flgCefalea: this.headache,
        flgFaringodinia: this.soreThroat,
        noteSintomo: this.moreSymptoms
      };
    },
    onIsolationCityOptionsFilter(val, update) {
      update(() => {
        this.isolationCitySearchValue = val;
      });
    },
    async onEventStructureOptionsFilter() {
      const id = this.eventStructure?.idStruttura;
      const areaListPromise = await getEventStructureAreaList(id);
      this.eventStructureAreaList = areaListPromise.data;
    },
    async onSave() {
      if (
        this.isHomeAssignmentSelected ||
        this.isHomeIsolationSelected ||
        this.isTransferredInternalSelected ||
        this.isTransferredExternalSelected ||
        this.isTestWaitingSelected ||
        this.isHospitalizedSelected
      ) {
        if (this.hasSymptomsToggle === null) {
          notifyError(1, "Specifica se i sintomi sono presenti");
          return;
        } else {
          this.hasSymptoms = this.hasSymptomsToggle;
        }
      }
      this.hasSymptoms = this.hasSymptomsToggle;

      const isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;

      // let area = null

      // In caso di Assegnamento domiciliare carichiamo l'area a cui assegnare il paziente
      // if (this.isHomeAssignmentSelected) {
      //   try {
      //     const id = this.eventStructure?.idStruttura
      //     // const { data } = await getEventStructureAreaList(id)
      //     // area = data[0]
      //   } catch (err) {
      //     notifyError('Non Ã¨ stato possibile salvare')
      //     this.isSaving = false
      //     return
      //   }
      // }

      let profile = null;
      let structure = null;
      let areaUtente = null;
      if (this.user?.elencoProfilo?.length > 0) {
        profile = this.user?.elencoProfilo.find(
          a => a.nomeProfilo === GEST_ST_RES
        )?.idProfilo;
      }
      // if (this.user?.elencoStrutturaArea?.length>0) {
      //   structure = this.user?.elencoStrutturaArea[0]?.idStruttura;
      // }
      if (this.selectedStructure?.elencoArea?.length > 0) {
        areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
      }

      const payload = {
        idSoggetto: this.subjectId,
        idTipoEvento: this.eventType?.idTipoEvento,
        dataDimissioni: this.eventDate,
        dataPrevFineEvento: this.quarantineEndDate,
        note: this.note,
        condizioniCliniche: this.clinicalConditions,
        sintomi: this.hasSymptoms ? "SI" : "NO",
        dataInizioSint: this.symptomsDate,
        sintomo: this.hasSymptoms ? this.getSymptomPayload() : null,
        idStruttura: this.myEventStructure?.idStruttura ?? null,
        idArea: this.myEventArea?.idArea ?? null,

        webappOperazione: APP_CODE.STRUTTURE,
        idProfiloOperazione: profile,
        ruoloOperazione: this.user?.categoriaOpessan,
        utenteOperazione: this.user?.cfUtente,
        idEnteOperazione: this.selectedStructure.idEnte,
        idStrutturaOperazione: this.selectedStructure.idStruttura,
        idAreaOperazione: areaUtente
      };

      if (this.isHomeIsolationSelected) {
        payload.decorsoPresso = this.isolationPlace;
        payload.indirizzoDecorso = this.isolationAddress;
        payload.comuneRicoveroIstat = this.isolationCity?.istatComune ?? null;
        payload.comuneRicoveroIstatCompconsto = this.isolationCity;
      }

      if (this.isHomeAssignmentSelected) {
        payload.idStruttura = this.eventStructure?.idStruttura ?? null;
        payload.idArea = null;
      }

      if (
        this.isTransferredInternalSelected ||
        this.isTransferredExternalSelected ||
        this.isTestWaitingSelected ||
        this.isHospitalizedSelected
      ) {
        payload.idStruttura = this.eventStructure?.idStruttura ?? null;
        payload.idArea = null;
      }

      try {
        await createEvent(payload);
        notifySuccess(
          this.isQuarantine ? "Isolamento aggiunto" : "Decorso aggiunto"
        );
        this.$emit("created");
        this.opened = false;
      } catch (err) {
        if (err.response) {
          notifyError(err, err.response.data.message);
        } else {
          notifyError(err, "Non Ã¨ stato possibile salvare");
        }
      }

      this.isSaving = false;
    },
    isAcuta(struttura) {
      return (
        struttura.natura !== "Ricettiva" &&
        struttura.natura !== "RSA" &&
        struttura.natura !== "Caserma"
      );
    },
    showAvailability() {
      this.isAvilabilityVisible = true;
    }
  }
};
</script>

<style scoped></style>

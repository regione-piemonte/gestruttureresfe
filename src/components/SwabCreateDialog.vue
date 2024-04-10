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
            <q-toolbar-title>{{ title }}</q-toolbar-title>
            <q-btn v-close-popup round dense flat icon="close" />
          </q-toolbar>
        </q-card-section>
        <q-separator />

        <!-- DATI -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <template v-if="!isLoading">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <!--       DEBUG-->
              <!-- --------------------------------------------------------------------------------------------------------- -->
              <div
                v-if="
                  !this.actionType &&
                    (this.env.APP_IS_TEST || this.env.APP_IS_DEV)
                "
                class="col-12  "
              >
                <q-select
                  v-model="debugType"
                  label="Debug tipoazione"
                  :options="debugTypeList"
                  filled
                  @input="loadLists"
                  dense
                  option-value="debugTypeCod"
                  option-label="debugTypeDesc"
                  bottom-slots
                  no-error-icon
                  outlined
                />
                <q-separator
                  class="full-width"
                  color="black"
                  spaced
                ></q-separator>
              </div>

              <!--              CRITERI EPIDEMIOLOGICI-->
              <!-- --------------------------------------------------------------------------------------------------------- -->
              <div class="col-12  ">
                <q-select
                  v-model="critEpid"
                  label="Criterio epidemiologico*"
                  :options="filteredCriteriaList"
                  filled
                  dense
                  option-value="criterioEpidemiologicoCod"
                  option-label="criterioEpidemiologicoDesc"
                  bottom-slots
                  no-error-icon
                  :rules="[ruleRequired]"
                  :loading="isLoading"
                  :readonly="readonlyCriteria"
                />
              </div>

              <!--              MOTIVAZIONE-->
              <!-- --------------------------------------------------------------------------------------------------------- -->
              <template v-if="motivationNeeded">
                <div class="col-12">
                  <q-select
                    v-model="covidTestMotivazione"
                    :options="filteredCovidTestMotivazioniList"
                    label="Motivazione test covid*"
                    option-value="tamponeMotivoCod"
                    option-label="tamponeMotivoDesc"
                    filled
                    dense
                    bottom-slots
                    no-error-icon
                    :loading="isLoading"
                    :rules="[ruleRequired]"
                    :readonly="readonlyMotivation"
                  />
                </div>
              </template>

              <!--              TIPOLOGIA TEST COVID-->
              <!-- --------------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-select
                  v-model="testType"
                  :options="filteredSwabType"
                  label="Tipo test* "
                  option-value="testTipoId"
                  option-label="testTipoDesc"
                  filled
                  dense
                  bottom-slots
                  no-error-icon
                  :loading="isLoading"
                  :rules="[ruleRequired]"
                  :readonly="readonlyTestTipe"
                />
              </div>

              <!--              MOSTRO IL RESTO DELLA MODALE SOLO SE IL TIPO Ã¨ COMPILATO-->
              <!-- --------------------------------------------------------------------------------------------------------- -->
              <template v-if="testType && !isLoadingHotspotData">
                <!--              PARAMETRI APPOSITI PER PRENOTAZIONE HOTSPOT-->
                <template v-if="isHotspot === true">
                  <!--                PARAMETRI APPOSITI PER TAMPONE MOLECOLARE-->

                  <!--                  TIPOLOGIA TEST COVID-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <template v-if="iscovidTestTypeVisible">
                    <div class="col-12">
                      <q-select
                        v-model="covidTestType"
                        :options="covidTestTypesListSorted"
                        label="Tipologia test covid"
                        option-value="idTestCovid"
                        option-label="testCovid"
                        filled
                        dense
                        bottom-slots
                        no-error-icon
                        :loading="isLoadingHotspotData"
                        :disable="!isTestTypeSelected"
                      />
                    </div>
                  </template>

                  <!--                  LABORATORIO DI PRIMA ASSEGNAZIONE-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <template v-if="isLaboratoryVisible">
                    <div class="col-12">
                      <q-select
                        v-model="firstAssignmentLab"
                        :options="laboratoryListSorted"
                        label="Laboratorio di prima assegnazione*"
                        option-value="idLaboratorio"
                        option-label="descrizione"
                        filled
                        dense
                        bottom-slots
                        no-error-icon
                        :loading="isLoadingHotspotData"
                        :rules="[ruleRequired]"
                        :disable="!isTestTypeSelected"
                      />
                    </div>
                  </template>

                  <!--                DATI DEL MEDICO-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">Medico richiedente</div>
                  <div class="col-12">
                    <q-input
                      v-model="doctor"
                      type="text"
                      label="Medico richiedente*"
                      filled
                      dense
                      autogrow
                      bottom-slots
                      no-error-icon
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="contact"
                      type="text"
                      label="Contatto richiedente*"
                      filled
                      dense
                      autogrow
                      bottom-slots
                      no-error-icon
                      :rules="[ruleRequired]"
                    />
                  </div>
                </template>

                <!--             VALORI APPOSITI PER DISPONIBILITA SISP-->
                <!-- --------------------------------------------------------------------------------------------------------- -->

                <template v-if="isHotspot === false">
                  <template v-if="iscovidTestTypeVisible">
                    <div class="col-12">
                      <!--                  TIPOLOGIA TEST COVID-->
                      <q-select
                        v-model="covidTestType"
                        :options="covidTestTypesListSorted"
                        label="Tipologia test covid"
                        option-value="idTestCovid"
                        option-label="testCovid"
                        filled
                        dense
                        bottom-slots
                        no-error-icon
                        :loading="isLoadingHotspotData"
                        :disable="!isTestTypeSelected"
                      />
                    </div>
                  </template>
                  <!--                DATA PRESUNTA PRELIEVO-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <template v-if="isNotFastSwabEsitated">
                    <div class="col-12 ">
                      <q-input
                        v-model="date"
                        filled
                        type="date"
                        label="Data prelievo prevista"
                        stack-label
                        dense
                        no-error-icon
                        bottom-slots
                        :rules="[ruleRequired, notPastDate, notAfterMaxDate]"
                      />
                    </div>
                  </template>
                  <!--                LABORATORIO DI PRIMA ASSEGNAZIONE-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <template v-if="isLaboratoryVisible">
                    <div class="col-12">
                      <q-select
                        v-model="firstAssignmentLab"
                        :options="laboratoryListSorted"
                        label="Laboratorio di prima assegnazione*"
                        option-value="idLaboratorio"
                        option-label="descrizione"
                        filled
                        dense
                        bottom-slots
                        no-error-icon
                        :loading="isLoadingHotspotData"
                        :rules="[ruleRequired]"
                      />
                    </div>
                  </template>
                  <template v-if="isNotFastSwabEsitated">
                    <!--                DATI DEL MEDICO-->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <div class="col-12">Medico richiedente</div>
                    <div class="col-12">
                      <q-input
                        v-model="doctor"
                        type="text"
                        label="Medico richiedente*"
                        filled
                        dense
                        autogrow
                        bottom-slots
                        no-error-icon
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="contact"
                        type="text"
                        label="Contatto richiedente*"
                        filled
                        dense
                        autogrow
                        bottom-slots
                        no-error-icon
                        :rules="[ruleRequired]"
                      />
                    </div>
                  </template>
                </template>

                <!--              DATI PER TAMPONI RAPIDI ESITATI-->
                <!-- --------------------------------------------------------------------------------------------------------- -->
                <template v-if="isBrandListVisible && !isNotFastSwabEsitated">
                  <!--                DISPOSITIVO MEDICO DIAGNOSTICO-->
                  <div class="col-12">
                    <q-select
                      v-model="brandSelected"
                      :options="brandListOptions"
                      label="Dispositivo medico-diagnostico*"
                      option-value="testRapidoJrcId"
                      option-label="label"
                      filled
                      dense
                      use-input
                      fill-input
                      hide-selected
                      bottom-slots
                      no-error-icon
                      :loading="isLoadingHotspotData"
                      :rules="[ruleRequired]"
                      @filter="onBrandOptionsFilter"
                      clearable
                    />
                  </div>
                </template>

                <template v-if="!isNotFastSwabEsitated">
                  <!--                RISULTATO DEL TAMPONE-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <q-select
                      v-model="testResult"
                      :options="testResultListSorted"
                      label="Esito test*"
                      option-value="idRisTamp"
                      option-label="risultatoTampone"
                      filled
                      dense
                      bottom-slots
                      no-error-icon
                      :loading="isLoading"
                      :rules="[ruleRequired]"
                    />
                  </div>

                  <!--                DATA ESECUZIONE TAMPONE-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <q-input
                      v-model="testDate"
                      filled
                      type="date"
                      label="Data esecuzione test"
                      stack-label
                      dense
                      no-error-icon
                      bottom-slots
                      :rules="[ruleRequired, notFutureDate]"
                    />
                  </div>

                  <!--                ORA ESECUZIONE TAMPONE-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-12">
                    <q-input
                      v-model="testTime"
                      filled
                      type="time"
                      label="Orario esecuzione test"
                      stack-label
                      dense
                      no-error-icon
                      bottom-slots
                      :rules="[ruleRequired, notFutureTime]"
                    />
                  </div>
                </template>

                <!-- CERTIFICAZIONE CONTATTI -->
                <!-- --------------------------------------------------------------------------------------------------------- -->

                <template
                  v-if="
                    !jrc000 && (isHotspot === true || !isNotFastSwabEsitated)
                  "
                >
                  <div class="col-12">Contatti del paziente</div>
                  <div class="col-12">
                    <template v-if="!phone">
                      <q-banner rounded class="bg-orange-2 q-mb-md ">
                        <div>
                          Attenzione: se non Ã¨ specificato un numero di
                          cellulare, il paziente non potrÃ  ricevere sms.
                        </div>
                      </q-banner>
                    </template>
                    <q-banner class=" bg-blue-2">
                      <div>
                        Attenzione: assicurarsi che il cellulare indicato nei
                        contatti sia valido. Il numero sarÃ  automaticamente
                        aggiornato nell'anagrafica del paziente.
                      </div>

                      <div>
                        <template v-if="alreadyValidated">
                          <div class="q-pt-sm text-bold">
                            Contatto giÃ  validato
                          </div>
                        </template>
                        <template v-else>
                          <q-field
                            color="black"
                            v-model="certified"
                            borderless
                            :rules="[ruleCertified]"
                          >
                            <q-checkbox
                              class="q-pt-sm"
                              v-model="certified"
                              label="Si dichiara di aver provveduto ad informare  il cittadino (ai sensi della normativa privacy) che
                il numero di cellulare e/o l'email indicati in procedura saranno utilizzati anche per ricevere comunicazioni e
                notifiche via SMS/email."
                            />
                          </q-field>
                        </template>
                      </div>
                    </q-banner>
                  </div>

                  <!-- PREFISSO -->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class=" col-6 ">
                    <q-select
                      filled
                      v-model="prefixModel"
                      :options="prefixListOptions"
                      label="Prefisso"
                      option-label="label"
                      option-value="label"
                      dense
                      options-dense
                      no-error-icon
                      @filter="onFilterPrefixOptions"
                      use-input
                      bottom-slots
                      :rules="[rulePrefix]"
                      clearable
                      :loading="isLoading"
                    >
                    </q-select>
                  </div>

                  <!--                CONTATTO TELEFONICO-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-6 ">
                    <q-input
                      class="full-width"
                      v-model="phone"
                      type="text"
                      label="Cellulare del paziente"
                      filled
                      dense
                      bottom-slots
                      no-error-icon
                      :rules="[validPhone, requiredMailOrPhone]"
                    />
                  </div>

                  <!--                CONTATTO MAIL-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <div class="col-12 ">
                    <q-input
                      class="full-width"
                      v-model="mail"
                      type="text"
                      label="Mail del paziente"
                      filled
                      dense
                      bottom-slots
                      no-error-icon
                      :rules="[
                        ruleMail,
                        requiredMailOrPhone,
                        ruleMailForPrefixForeign
                      ]"
                    />
                  </div>

                  <!--                MESSAGGIO APPOSITO PER PRENOTAZIONE A HOTSPOT-->
                  <!-- --------------------------------------------------------------------------------------------------------- -->
                  <template v-if="isHotspot">
                    <div class="col-12">Dati hotspot di prelievo</div>
                    <div class="col-12">
                      <q-banner class="  bg-blue-2"
                        >Attenzione: comunicare al paziente che in caso di
                        prenotazione presso i pitstop Ã¨ obbligatorio recarsi al
                        punto prelievo in auto.
                      </q-banner>
                    </div>

                    <!--                  TIPOOGIA DI HOTSPOT-->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <div class="col-12 q-mt-sm  ">
                      <q-select
                        v-model="hotspotType"
                        :options="hotspotTypeList"
                        label="Tipologia hotspot prelievo*"
                        option-value="hotspotTipoId"
                        option-label="hotspotTipoDesc"
                        filled
                        dense
                        @input="clearHotspot"
                        class="full-width"
                        bottom-slots
                        no-error-icon
                        :loading="isLoading"
                        :rules="[ruleRequired]"
                        :readonly="
                          hotspotTypeList && hotspotTypeList.length === 1
                        "
                      />
                    </div>

                    <!--                  SCELTA HOTSPOT-->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <div class="col-12  ">
                      <q-select
                        v-model="hotspot"
                        :options="hotspotListFilteredWithType"
                        label="Hotspot prelievo*"
                        option-value="hotspotId"
                        option-label="hotspotDesc"
                        filled
                        dense
                        @input="serchAvailability"
                        class="full-width"
                        bottom-slots
                        no-error-icon
                        use-input
                        hide-selected
                        fill-input
                        @filter="filterHotspot"
                        :loading="isLoadingHotspotData"
                        :rules="[ruleRequired]"
                        :disable="isHotspotTypeSelected"
                      >
                        <template v-slot:option="scope">
                          <q-item
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                          >
                            <q-item-section>
                              <q-item-label
                                class="text-bold"
                                lines="1"
                                v-if="scope.opt.isFirst"
                              >
                                {{ scope.opt.aslDesc }}
                              </q-item-label>

                              <q-item-label>{{
                                scope.opt.hotspotDesc
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>

                    <!--                  DATA DISPONIBILITA-->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <div class="col-12">Data disponibilitÃ </div>

                    <div class="col-8  ">
                      <q-date
                        landscape
                        v-model="hotspotDate"
                        :options="hotspotDateList"
                        @input="clearTime"
                        filled
                        dense
                        :disable="calendarDisabled"
                        class="full-width"
                        bottom-slots
                        no-error-icon
                        :loading="isLoading"
                        :rules="[ruleRequired]"
                      />
                    </div>

                    <!--                  ORARIO DISPONIBILITA-->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <div class="col-12 q-mt-sm  ">
                      <q-select
                        v-model="timeSelected"
                        :options="hotspotTimeList"
                        label="Fascia oraria*"
                        option-value="hotspotDispeffId"
                        option-label="hotspotDispeffFascia"
                        filled
                        :disable="dateDisabled"
                        dense
                        class="full-width"
                        bottom-slots
                        no-error-icon
                        :loading="isLoading"
                        :rules="[ruleRequired]"
                      />
                    </div>
                  </template>
                </template>
              </template>
              <template v-if="isLoadingHotspotData">
                <q-inner-loading showing color="primary" />
              </template>
            </div>
          </q-card-section>
        </template>
        <template v-else>
          <q-inner-loading showing color="primary" />
        </template>

        <!--        CONFERMA E SALVA-->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-card-section class="text-right">
          <q-btn
            v-if="!isLoading"
            color="primary"
            :loading="isSaving"
            @click="onSave"
            >{{ saveLabel }}</q-btn
          >
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { groupBy, notifyError, notifySuccess, sortBy } from "../services/utils";
import {
  inserisciTamponeExternal,
  getCovidTestTypesList,
  getLaboratoryList,
  sendSms,
  updateSoggetto,
  getHotspotEffectiveAvailability,
  getHotspotTypeList,
  getValidPhone,
  sendFastSwabSms,
  createFastSwabRequest,
  getAsrList,
  getPrefixList,
  getElencoTestRapidiJrc,
  getTestEsitoList,
  inviaNotifica,
  getCriteriaFullList,
  getHotspotEffectiveAvailabilityByType,
  getActionCodeList,
  updateSoggettoExternal
} from "../services/api";
import { date } from "quasar";
import {
  APP_CODE,
  FAST_SWAB_CODES,
  GEST_EROGATORI,
  GEST_ST_RES,
  JRC_TO_EXCLUDE,
  NATION_CODE_ITALY,
  NOTIFICATION_ACTION_CODES,
  NOTIFICATION_EVENT_CODES,
  NOTIFICATION_PRIORITY_CODES,
  NOTIFICATION_TYPE_CODES,
  NOTIFICATION_USER_TYPE_CODES,
  SWAB_MODAL_TYPE,
  SWAB_TYPE,
  SWAB_TYPE_NEW
} from "../services/business_logic";
import { TYPES } from "../store";

const { getDateDiff, isBetweenDates, formatDate, extractDate } = date;
const EMAIL_REGEX = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

export default {
      name: "SwabCreateDialog",
  props: {
    subject: { type: Object, required: false, default: null },
    actionType: { type: String, required: false, default: null },
    idStrutturaRes: { type: String, required: false, default: null }
  },
  data() {
    return {
      isLoadingHotspotData: false,
      testResult: null,
      testResultList: [],
      brandSelected: null,
      brandList: [],
      brandSelectedSearchValue: "",
      debugTypeList: [
        {
          debugTypeCod: SWAB_MODAL_TYPE.SISP,
          debugTypeDesc: "DisponibilitÃ  SISP"
        },
        {
          debugTypeCod: SWAB_MODAL_TYPE.HOTSPOT,
          debugTypeDesc: "Presso hotspot"
        },
        {
          debugTypeCod: SWAB_MODAL_TYPE.FAST,
          debugTypeDesc: "Esitazione tampone rapido"
        },
        {
          debugTypeCod: SWAB_MODAL_TYPE.SCHOOL,
          debugTypeDesc: "Scuola sentinella"
        }
      ],
      debugType: {
        debugTypeCod: SWAB_MODAL_TYPE.HOTSPOT,
        debugTypeDesc: "Presso hotspot"
      },
      actionDetail: null,
      filteredHotspotList: [],
      isLoading: false,
      isSaving: false,
      covidTestTypesList: [],
      covidTestMotivazioniList: [],
      laboratoryList: [],
      critEpid: null,
      criteriaList: [],
      covidTestType: null,
      covidTestMotivazione: null,
      doctor: null,
      contact: null,
      date: null,
      firstAssignmentLab: null,
      hotspot: null,
      phone: null,
      createdSwab: null,
      hotspotDate: null,
      availability: null,
      timeSelected: null,
      mail: null,
      hotspotType: null,
      hotspotTypeList: [],
      isValid: true,
      testType: null,
      testTypeList: [],
      testDate: null,
      testTime: null,
      createdFastSwab: null,
      // swabSelectedType: null,
      aslList: [],
      certified: false,
      env: null,
      possibleSwabTypes: SWAB_TYPE_NEW,
      prefixModel: null,
      prefixList: [],
      prefixSearchValue: "",
      subjectEdited: false,
      swabTypeModal: SWAB_MODAL_TYPE
    };
  },
  computed: {
    selectedStructure() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE]?.elencoStrutturaArea?.find(
        strut => strut.idStruttura === this.$route.params.idStrutturaRes
      );
    },

    isBrandListVisible() {
      if (this.brandListSorted.length > 0) {
        return true;
      }
      return false;
    },
    isNotFastSwabEsitated() {
      if (this.actionDetail?.prenotazioneTest === true) {
        return true;
      }
      return false;
    },
    isLaboratoryVisible() {
      if (
        this.testType?.esitatoDaLaboratorio === true &&
        this.actionDetail?.primaAssegnazioneLaboratorio === true
      ) {
        return true;
      }
      return false;
    },
    iscovidTestTypeVisible() {
      if (this.covidTestTypesListSorted?.length > 0) {
        return true;
      }
      return false;
    },
    readonlyTestTipe() {
      if (this.filteredSwabType && this.filteredSwabType.length === 1) {
        return true;
      }
      return false;
    },
    readonlyMotivation() {
      if (
        !this.isCriteriaSelected ||
        (this.filteredCovidTestMotivazioniList &&
          this.filteredCovidTestMotivazioniList.length === 1)
      ) {
        return true;
      }
      return false;
    },
    readonlyCriteria() {
      if (this.filteredCriteriaList && this.filteredCriteriaList.length === 1) {
        return true;
      }
      return false;
    },
    isHotspot() {
      if (this.hotspotTypeList?.length > 0) {
        return true;
      }
      return false;
    },

    filteredSwabType() {
      let testTypeList = this.testTypeList;
      return sortBy(testTypeList, "testTipoDesc");
    },
    isCriteriaSelected() {
      if (this.critEpid) {
        return true;
      }
      return false;
    },
    isTestTypeSelected() {
      if (this.testType) {
        return true;
      }
      return false;
    },
    saveLabel() {
      if (this.currentActionType === SWAB_MODAL_TYPE.SISP) {
        return "Autorizza";
      }
      return "Salva";
    },

    motivationNeeded() {
      if (
        this.currentActionType === SWAB_MODAL_TYPE.DISPENSER ||
        this.currentActionType === SWAB_MODAL_TYPE.RSA
      ) {
        return false;
      }
      return true;
    },

    title() {
      if (
        this.currentActionType === SWAB_MODAL_TYPE.FAST ||
        this.currentActionType === SWAB_MODAL_TYPE.DISPENSER ||
        this.currentActionType === SWAB_MODAL_TYPE.RSA
      ) {
        return "Tampone rapido";
      }
      return "Richiedi tampone";
    },

    jrc000() {
      if (this.brandSelected?.idDevice === JRC_TO_EXCLUDE.JRC0000) {
        return true;
      }
      return false;
    },
    notFutureTime() {
      return v => {
        let date = this.testDate;
        let time = this.testTime;
        let now = new Date();

        if (!date || !time) return true;
        let datetime = date + " " + time;
        datetime = extractDate(datetime, "YYYY-MM-DD HH:mm");
        let diff = getDateDiff(datetime, now, "minutes");
        return !v || diff <= 0 || "Seleziona un orario valido";
      };
    },
    notFutureDate() {
      let today = new Date();
      return v => {
        let diff = getDateDiff(v, today);
        return !v || diff <= 0 || "Seleziona una data valida";
      };
    },
    testResultListSorted() {
      let resultFiltered = this.testResultList.filter(a =>
        ["POSITIVO", "NEGATIVO", "INDETERMINATO"].includes(a.risultatoTampone)
      );
      return sortBy(resultFiltered, "risultatoTampone");
    },
    brandListSorted() {
      this.brandList.forEach(a => {
        a.label =
          a.idDevice + " - " + a.commercialName + " - " + a.manufacturerName;
      });
      return sortBy(this.brandList, "commercialName");
    },
    brandListOptions() {
      return this.brandListSorted.filter(c => {
        let toSearch = this.brandSelectedSearchValue?.toUpperCase?.() ?? "";
        let searchable = c.label.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    currentActionType() {
      if (this.actionType) {
        return this.actionType;
      } else {
        return this.debugType.debugTypeCod;
      }
    },
    ruleMailForPrefixForeign() {
      return v =>
        (!!this.phone && this.prefixModel?.countryCode === NATION_CODE_ITALY) ||
        (!this.phone && !v) ||
        !!v ||
        "Mail obbligatoria con cellulare straniero";
    },
    rulePrefix() {
      return v => !!v || (!this.phone && !v) || "Inserire il prefisso";
    },
    prefixListOptions() {
      this.prefixList.forEach(
        a => (a.label = "(" + a.prefix + ")" + " " + a.countryName)
      );

      return this.prefixList.filter(c => {
        let toSearch = this.prefixSearchValue?.toUpperCase?.() ?? "";
        let searchable = c.label.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    requiredMailOrPhone() {
      return v => !!this.phone || !!this.mail || "Inserire almeno un contatto";
    },
    alreadyValidated() {
      if (
        this.subject?.telefonoValidato &&
        this.subject?.telefonoValidato === this.prefixModel?.prefix + this.phone
      ) {
        return true;
      } else {
        return false;
      }
    },

    filteredCovidTestMotivazioniList() {
      if (this.critEpid) {
        let filteredList = [];

        filteredList = this.critEpid?.tamponeMotivoList;

        return sortBy(filteredList, "tamponeMotivoDesc");
      } else return [];
    },
    filteredCriteriaList() {
      return sortBy(this.criteriaList, "criterioEpidemiologicoDesc");
    },

    isHotspotTypeSelected() {
      if (this.hotspotType && this.testType) {
        return false;
      }
      return true;
    },
    ruleMail() {
      return v => !v || EMAIL_REGEX.test(v) || "Deve essere un'email";
    },
    ruleCertified() {
      return v => v === true || "Il contatto deve essere validato";
    },
    calendarDisabled() {
      if (this.hotspot) {
        return false;
      }
      return true;
    },
    dateDisabled() {
      if (this.hotspotDate) {
        return false;
      }
      return true;
    },
    hotspotDateList() {
      let dateList = [];
      let today = new Date();

      if (this.availability) {
        let filteredAvailability = this.availability.filter(
          a =>
            a.hotspotPostiResidui > 0 &&
            getDateDiff(new Date(a.hotspotDispeffFasciaDa), today) >= 0
        );

        filteredAvailability.forEach(a => {
          if (
            !dateList.includes(
              formatDate(new Date(a.hotspotDispeffFasciaDa), "YYYY/MM/DD")
            )
          ) {
            dateList.push(
              formatDate(new Date(a.hotspotDispeffFasciaDa), "YYYY/MM/DD")
            );
          }
        });

        if (dateList.length <= 0) {
          notifyError(1, "Nessuna data disponibile per l'Hotspot selezionato");
        }
      }

      return dateList;
    },
    hotspotTimeList() {
      let timeList = [];
      if (this.hotspotDate) {
        let filterdAvailability = this.availability.filter(
          a =>
            formatDate(new Date(a.hotspotDispeffFasciaDa), "YYYY/MM/DD") ===
              this.hotspotDate && a.hotspotPostiResidui > 0
        );
        filterdAvailability.forEach(a => timeList.push(a));
      }
      timeList.sort(function(a, b) {
        return (
          new Date(a.hotspotDispeffFasciaDa) -
          new Date(b.hotspotDispeffFasciaDa)
        );
      });
      return timeList;
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
    notPastDate() {
      let today = new Date();
      return v => {
        let diff = getDateDiff(v, today);
        return !v || diff >= 0 || "Seleziona una data valida";
      };
    },
    notAfterMaxDate() {
      let today = new Date();
      let maxDate = new Date(today);
      maxDate.setMonth(today.getMonth() + 1);
      return v => {
        let diff = getDateDiff(v, maxDate);
        return !v || diff < 0 || "Seleziona una data entro un mese";
      };
    },
    attrs() {
      let { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      let { ...listeners } = this.$listeners;
      return listeners;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },

    validPhone() {
      return v =>
        (!!v && this.isValid === true) ||
        (!v && !this.prefixModel) ||
        "Inserisci un numero di telefono valido";
    },
    subjectId() {
      return this.subject?.idSoggetto;
    },
    covidTestTypesListSorted() {
      return sortBy(this.covidTestTypesList, "testCovid");
    },
    laboratoryListSorted() {
      return sortBy(this.laboratoryList, "descrizione");
    },
    hotspotListFilteredWithType() {
      let orderedGroupedList = [];
      let filteredGroup = this.filteredHotspotList;
      orderedGroupedList = sortBy(filteredGroup, "idEnte");

      let asrSearched = [];
      orderedGroupedList.forEach(a => {
        if (!asrSearched.includes(a.idEnte)) {
          asrSearched.push(a.idEnte);
          a.isFirst = true;
          a.aslDesc = this.aslList.find(
            b => b.idEnte === a.idEnte
          )?.descrizione;
        }
      });
      return orderedGroupedList;

      return [];
    }
  },
  watch: {
    //PRECOMPILO CON PRIMO SLOT DISPONIBILE
    hotspotTimeList: {
      async handler(newVal, oldVal) {
        if (this.hotspotTimeList?.length > 0) {
          this.timeSelected = this.hotspotTimeList[0];
        }
      }
    },
    //SE HO UNA SOLA DATA PRECOMPILO
    hotspotDateList: {
      async handler(newVal, oldVal) {
        if (this.hotspotDateList.length === 1) {
          this.hotspotDate = this.hotspotDateList[0];
        }
      }
    },
    //CAMBIANDO IL CRITERIO EPIDEMIOLOGICO SVUOTO TUTTO E PRECOMPILO DOVE POSSIBILE
    critEpid: {
      async handler(newVal, oldVal) {
        // this.swabSelectedType = null;
        this.covidTestMotivazione = null;
        this.brandSelected = null;
        this.laboratory = null;
        this.clearHotspot();

        this.testType = null;
        this.testTypeList = this.critEpid?.testTipoList;

        if (this.testTypeList?.length === 1) {
          this.testType = this.testTypeList[0];
        }

        if (
          this.filteredCovidTestMotivazioniList?.length === 1 &&
          this.motivationNeeded
        ) {
          this.covidTestMotivazione = this.filteredCovidTestMotivazioniList[0];
        }
      }
    },

    //QUANDO AGGIORNATO RICHIAMO TUTTE LE API CHE DIPENDONO DA TIPO TEST
    testType: {
      async handler(newVal, oldVal) {
        this.covidTestType = null;
        this.firstAssignmentLab = null;
        this.hotspot = null;
        this.brandSelected = null;

        this.isLoadingHotspotData = true;
        if (this.testType) {
          try {
            let params = {
              soloValidi: true,
              testTipoId: this.testType?.testTipoId
            };
            let { data } = await getElencoTestRapidiJrc(params);
            this.brandList = data;
          } catch (err) {
            notifyError(
              err,
              "Non Ã¨ stato possibile caricare l'elenco dei dispositivi medico-diagnostico"
            );
          }

          try {
            let params = {
              testTipoId: this.testType?.testTipoId,
              primaAssegnazione: true
            };
            let { data } = await getLaboratoryList(params);
            this.laboratoryList = data;
          } catch (err) {
            notifyError(
              "Non Ã¨ stato possibile caricare l'elenco dei laboratori"
            );
          }

          try {
            let params = { testTipoId: this.testType?.testTipoId };
            let { data } = await getCovidTestTypesList(params);
            this.covidTestTypesList = data;
          } catch (err) {
            notifyError(
              "Non Ã¨ stato possibile caricare l'elenco delle tipologie"
            );
          }

          if(this.isHotspot) {
              try {
                  let params = {
                      criterioEpidemiologicoId: this.critEpid.criterioEpidemiologicoId
                  };
                  let {data} = await getHotspotEffectiveAvailabilityByType(
                      this.testType?.testTipoId,
                      params
                  );
                  this.hotspotList = data;
              } catch (err) {
                  notifyError(
                      "Non Ã¨ stato possibile caricare l'elenco degli hotspot"
                  );
              }
          }
          let testResultListPromise = getTestEsitoList();

          try {
            let { data } = await testResultListPromise;
            this.testResultList = data;
          } catch (err) {
            notifyError(
              "Non Ã¨ stato possibile caricare l'elenco dei risultati"
            );
          }
        }
        this.isLoadingHotspotData = false;
      }
    }
  },
  async created() {
    this.env = process.env;

    if (this.subject?.telefonoValidato) {
      this.certified = true;
    } else {
      this.certified = false;
    }
    this.doctor = this.userFullName;

    if (this.user.contatto?.email && this.user.contatto?.telefono) {
      this.contact =
        this.user.contatto.email + " - " + this.user.contatto.telefono;
    } else {
      if (this.user.contatto?.email) {
        this.contact = this.user.contatto.email;
      } else {
        this.contact = this.user.contatto?.telefono;
      }
    }
    this.phone = this.subject.telefonoRecapito;
    this.mail = this.subject.email;
    let now = new Date();
    this.testDate = formatDate(now, "YYYY-MM-DD");
    this.testTime = formatDate(now, "HH:mm");

    //CHIAMATA INIZIALE PER LE VARIE LISTE DOVE POSSIBILE
    await this.loadLists();
  },
  methods: {
    async loadLists() {
      this.critEpid = null;
      this.covidTestMotivazione = null;
      this.testType = null;
      this.prefixModel = null;
      this.covidTestType = null;
      this.firstAssignmentLab = null;
      this.aslList = [];
      this.hotspotType = null;
      this.brandSelected = null;
      this.testResult = null;

      this.isLoading = true;
      // let testTypeListPromise = getTestTypeList();
      let prefixListPromise = getPrefixList();
      let params = null;

      if (this.currentActionType === SWAB_MODAL_TYPE.RSA) {
        params = {
          azioneCod: "GESTRUTTURE_RSA"
        };
      }

      if (this.currentActionType === SWAB_MODAL_TYPE.DISPENSER) {
        params = {
          azioneCod: "GESTRUTTURE_EROGATORI"
        };
      }

      if (this.currentActionType === SWAB_MODAL_TYPE.SISP) {
        params = {
          azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_SISP"
        };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.HOTSPOT) {
        params = { azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_HOTSPOT" };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.FAST) {
        params = { azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_NO_PRENOT" };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.SCHOOL) {
        params = {
          azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_SCUOLA_SENTINELLA"
        };
      }
      let actionCodesPromise = getActionCodeList(params);
      let criteriaPromise = getCriteriaFullList(params);

      try {
        let { data } = await criteriaPromise;
        this.criteriaList = data;

        if (this.criteriaList?.length === 1) {
          this.critEpid = this.criteriaList[0];
        }
      } catch (err) {
        notifyError(
          "Non Ã¨ stato possibile caricare l'elenco dei criteri epidemiologici"
        );
      }

      try {
        let { data } = await actionCodesPromise;
        this.actionDetail = data[0];
      } catch (err) {
        notifyError("Non Ã¨ stato possibile caricare il codice azione");
      }

      try {
        let { data: prefixList } = await prefixListPromise;
        this.prefixList = prefixList;
      } catch (err) {
        notifyError(
          err,
          "Non Ã¨ stato possibile caricare l'elenco dei prefissi "
        );
      }

      params = {};
      if (this.currentActionType === SWAB_MODAL_TYPE.RSA) {
        params = {
          azioneCod: "GESTRUTTURE_RSA"
        };
      }

      if (this.currentActionType === SWAB_MODAL_TYPE.DISPENSER) {
        params = {
          azioneCod: "GESTRUTTURE_EROGATORI"
        };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.SISP) {
        params = {
          azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_SISP"
        };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.HOTSPOT) {
        params = { azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_HOTSPOT" };
      }
      if (this.currentActionType === SWAB_MODAL_TYPE.FAST) {
        params = { azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_NO_PRENOT" };
      }

      if (this.currentActionType === SWAB_MODAL_TYPE.SCHOOL) {
        params = {
          azioneCod: "RICHIESTA_TEST_GESTIONE_PAZIENTI_SCUOLA_SENTINELLA"
        };
      }
      let hotspotTypeListPromise = getHotspotTypeList(params);
      let aslListPromise = getAsrList();

      try {
        let { data } = await aslListPromise;
        this.aslList = data;
      } catch (err) {
        notifyError("Non Ã¨ stato possibile caricare la lista delle asl");
      }

      try {
        let { data } = await hotspotTypeListPromise;
        let hotspotTypeList = data;
        if (hotspotTypeList?.length === 1) {
          this.hotspotType = hotspotTypeList[0];
        }

        let today = new Date();
        let birth = new Date(this.subject.dataNascita);
        let age = getDateDiff(today, birth, "years");

        hotspotTypeList = hotspotTypeList.filter(
          a =>
            (!a.etaMassima || age < a.etaMassima) &&
            (!a.etaMinima || age > a.etaMinima)
        );

        this.hotspotTypeList = hotspotTypeList;
      } catch (err) {
        notifyError(
          "Non Ã¨ stato possibile caricare l'elenco delle tipologie di hotspot"
        );
      }

      //PREIMPOSTO PREFISSO
      this.phone = this.subject?.telefonoRecapito;
      this.prefixModel = this.prefixList.find(
        a => a.countryCode === this.subject.prefissoInternazionale?.countryCode
      );
      if (this.prefixModel && this.phone) {
        this.phone = this.phone.slice(this.prefixModel.prefix.length);
      }

      this.isLoading = false;
    },

    onBrandOptionsFilter(val, update) {
      update(() => {
        this.brandSelectedSearchValue = val;
      });
    },
    onFilterPrefixOptions(val, update) {
      update(() => {
        this.prefixSearchValue = val;
      });
    },

    async checkIfValid() {
      try {
        let response = await getValidPhone(this.phone);
        this.isValid = response.data;
      } catch (e) {}
    },
    clearHotspot() {
      this.hotspot = null;
      this.clearTime();
      this.clearCalendar();
    },
    clearCalendar() {
      this.hotspotDate = null;
    },
    filterHotspot(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();

        this.filteredHotspotList = this.hotspotList.filter(
          v =>
            v.hotspotDesc.toLowerCase().indexOf(needle) > -1 &&
            v.hotspotTipoId === this.hotspotType.hotspotTipoId
        );
      });
    },
    clearTime() {
      this.timeSelected = null;
    },
    async serchAvailability() {
      this.hotspotDate = null;
      this.timeSelected = null;
      let id = this.hotspot.hotspotId;
      if (!this.testType) {
        this.testType = this.testTypeList.find(
          a => a.testTipoCod === SWAB_TYPE.NORMAL
        );
      }
      let params = { testTipoId: this.testType?.testTipoId };
      try {
        let response = await getHotspotEffectiveAvailability(id, params);
        this.availability = response.data;
      } catch (e) {
        this.availability = [];
        notifyError(e, "Non Ã¨ stato possibile ricavare la disponibilitÃ ");
      }
    },

    async sendFastSwabSms() {
      let birthDate = formatDate(new Date(this.subject.dataNascita), "YYYY");
      let testDate = formatDate(this.hotspotDate, "DD/MM/YY");

      let sms = `Tampone COVID n. ${this.createdFastSwab.prenotazioneTamponeId} per: ${this.subject.cognome}-${birthDate}. ${this.hotspot.hotspotDesc} ${testDate}-${this.timeSelected.hotspotDispeffFascia}`;

      let smsPayload = {
        idPrenotazione: this.createdFastSwab.prenotazioneTamponeId,
        testoSms: null
      };
      try {
        let smsPromise = await sendFastSwabSms(smsPayload);
        notifySuccess("Sms inviato");
      } catch (e) {
        notifyError(e, "Non Ã¨ stato possibile inviare l'sms");
      }
    },
    async sendSms() {
      let birthDate = formatDate(new Date(this.subject.dataNascita), "YYYY");

      let testDate = formatDate(this.hotspotDate, "DD/MM/YY");

      let sms = `Tampone COVID n. ${this.createdSwab.idTampone} per: ${this.subject.cognome}-${birthDate}. ${this.hotspot.hotspotDesc} ${testDate}-${this.timeSelected.hotspotDispeffFascia}`;

      let smsPayload = {
        idTampone: this.createdSwab.idTampone,
        testoSms: null
      };
      try {
        let smsPromise = await sendSms(smsPayload);
        notifySuccess("Sms inviato");
      } catch (e) {
        notifyError(e, "Non Ã¨ stato possibile inviare l'sms");
      }
    },

    async onSave() {
      this.isValid = true;

      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;

      //CONTROLLO E CAMBIO CONTATTI
      if (
        (!this.subject?.telefonoValidato || this.prefixModel?.prefix + this.phone !==
          this.subject?.telefonoRecapito ||
          this.mail !== this.subject?.email) &&
        !this.jrc000
      ) {
        await this.changeContacts();
        if (!this.subjectEdited) {
            this.isSaving = false;
          return;
        }
      }

      if (this.isHotspot) {
        //ALLORA VUOL DIRE CHE Ã¨ MOLECOLARE
        if (this.isLaboratoryVisible) {
          let profile = null;
          let structure = null;
          let areaUtente = null;

          if (
            this.currentActionType === SWAB_MODAL_TYPE.RSA &&
            this.user?.elencoProfilo.length > 0
          ) {
            profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_ST_RES)
              ?.idProfilo;
          }
          if (
            this.currentActionType === SWAB_MODAL_TYPE.DISPENSER &&
            this.user?.elencoProfilo.length > 0
          ) {
            profile = this.user?.elencoProfilo.find(
              a => a.nomeProfilo === GEST_EROGATORI
            )?.idProfilo;
          }

          if (this.selectedStructure?.elencoArea?.length > 0) {
            areaUtente = this.selectedStructure?.elencoArea[0]
              ?.idArea;
          }

          let payload = {
            idStruttura: this.idStrutturaRes,
            contattoRichiedente: this.contact,
            criterioEpidemiologicoCovid19: this.critEpid
              .criterioEpidemiologicoDesc,
            criterioEpidemiologicoId: this.critEpid.criterioEpidemiologicoId,
            idLaboratorio: this.firstAssignmentLab.idLaboratorio,
            idSoggetto: this.subjectId,
            idTestCovid: this.covidTestType && this.covidTestType.idTestCovid,
            tamponeMotivoId:
              this.covidTestMotivazione &&
              this.covidTestMotivazione.tamponeMotivoId,
            medicoRichiedente: this.doctor,
            dataPrelievoPrevista: new Date(this.hotspotDate),
            hotspotDispeffId: this.timeSelected.hotspotDispeffId,
            testTipoId: this.testType.testTipoId,
            //SOLO PER GESTRUTTURE
            tamponeAutorizzato: "NO",

            webappRichiedente: APP_CODE.STRUTTURE,
            idProfiloRichiedente: profile,
            ruoloRichiedente: this.user?.categoriaOpessan,
            utenteRichiedente: this.user?.cfUtente,
            idEnteRichiedente: this.selectedStructure?.idEnte,
            idStrutturaRichiedente: this.selectedStructure.idStruttura,
            idAreaRichiedente: areaUtente
          };

          try {
            let { data } = await inserisciTamponeExternal(payload);
            this.createdSwab = data;
            notifySuccess("Tampone aggiunto");
            //invio sms solo se azione lo richiede
            if (this.actionDetail.invioSmsPrenotazione === true) {
              await this.sendSms();
            }
            this.$emit("created");
            this.$emit("input", false);
          } catch (err) {
            if (err.response) {
              notifyError(err, err.response.data.message);
            } else {
              notifyError(err, "Non Ã¨ stato possibile salvare");
            }
          }
        } else {
          let profile = null;
          let structure = null;
          let areaUtente = null;
          if (
            this.currentActionType === SWAB_MODAL_TYPE.RSA &&
            this.user?.elencoProfilo.length > 0
          ) {
            profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_ST_RES)
              ?.idProfilo;
          }
          if (
            this.currentActionType === SWAB_MODAL_TYPE.DISPENSER &&
            this.user?.elencoProfilo.length > 0
          ) {
            profile = this.user?.elencoProfilo.find(
              a => a.nomeProfilo === GEST_EROGATORI
            )?.idProfilo;
          }

          if (this.selectedStructure?.elencoArea?.length > 0) {
            areaUtente = this.selectedStructure?.elencoArea[0]
              ?.idArea;
          }
          let payload = {
            idStruttura: this.idStrutturaRes,
            idSoggetto: this.subjectId,
            hotspotId: this.hotspot.hotspotId,
            hotspotDispeffId: this.timeSelected.hotspotDispeffId,
            testTipoId: this.testType.testTipoId,
            tamponeMotivoId: this.covidTestMotivazione?.tamponeMotivoId,
            criterioEpidemiologicoId: this.critEpid.criterioEpidemiologicoId,
            medicoRichiedente: this.doctor,
            contattoRichiedente: this.contact,
            tamponeAutorizzato: "NO",

            webappOperazione: APP_CODE.STRUTTURE,
            idProfiloOperazione: profile,
            ruoloOperazione: this.user?.categoriaOpessan,
            utenteOperazione: this.user?.cfUtente,
            idEnteOperazione: this.selectedStructure?.idEnte,
            idStrutturaOperazione: this.selectedStructure.idStruttura,
            idAreaOperazione: areaUtente
          };

          try {
            let promise = await createFastSwabRequest(payload);
            this.createdFastSwab = promise.data;
            notifySuccess("Aggiunta richiesta tampone rapido");
            await this.sendFastSwabSms();
            this.$emit("created");
            this.$emit("input", false);
          } catch (err) {
            if (err.response) {
              notifyError(err, err.response.data.title);
            } else {
              notifyError(err, "Non Ã¨ stato possibile salvare");
            }
          }
        }
      }

      if (!this.isHotspot && this.isNotFastSwabEsitated) {
        let date = new Date(this.date);

        let profile = null;
        let structure = null;
        let areaUtente = null;
        if (
          this.currentActionType === SWAB_MODAL_TYPE.RSA &&
          this.user?.elencoProfilo.length > 0
        ) {
          profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_ST_RES)
            ?.idProfilo;
        }
        if (
          this.currentActionType === SWAB_MODAL_TYPE.DISPENSER &&
          this.user?.elencoProfilo.length > 0
        ) {
          profile = this.user?.elencoProfilo.find(
            a => a.nomeProfilo === GEST_EROGATORI
          )?.idProfilo;
        }
        // if (this.user?.elencoStrutturaArea?.length > 0) {
        //   structure = this.user?.elencoStrutturaArea[0]?.idStruttura;
        // }
        if (this.selectedStructure?.elencoArea?.length > 0) {
          areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
        }

        let payload = {
          idStruttura: this.idStrutturaRes,
          contattoRichiedente: this.contact,
          criterioEpidemiologicoCovid19: this.critEpid
            .criterioEpidemiologicoDesc,
          criterioEpidemiologicoId: this.critEpid.criterioEpidemiologicoId,
          idLaboratorio: this.firstAssignmentLab.idLaboratorio,
          idSoggetto: this.subjectId,
          idTestCovid: this.covidTestType && this.covidTestType.idTestCovid,
          tamponeMotivoId:
            this.covidTestMotivazione &&
            this.covidTestMotivazione?.tamponeMotivoId,
          medicoRichiedente: this.doctor,
          dataPrelievoPrevista: date,
          testTipoId: this.testType.testTipoId,
          tamponeAutorizzato: "NO",

          webappRichiedente: APP_CODE.STRUTTURE,
          idProfiloRichiedente: profile,
          ruoloRichiedente: this.user?.categoriaOpessan,
          utenteRichiedente: this.user?.cfUtente,
          idEnteRichiedente: this.selectedStructure?.idEnte,
          idStrutturaRichiedente: this.selectedStructure.idStruttura,
          idAreaRichiedente: areaUtente
        };
        try {
          let { data } = await inserisciTamponeExternal(payload);
          this.createdSwab = data;
          notifySuccess("Tampone aggiunto");
          this.$emit("created");
          this.$emit("input", false);
        } catch (err) {
          if (err.response) {
            notifyError(err, err.response.data.message);
          } else {
            notifyError(err, "Non Ã¨ stato possibile salvare");
          }
        }
      }

      if (!this.isHotspot && !this.isNotFastSwabEsitated) {
        let phone = this.user.contatto?.telefono ?? "";
        let email = this.user.contatto?.email ?? "";

        let profile = null;
        let areaUtente = null;
        if (
          this.currentActionType === SWAB_MODAL_TYPE.RSA &&
          this.user?.elencoProfilo.length > 0
        ) {
          profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_ST_RES)
            ?.idProfilo;
        }
        if (
          this.currentActionType === SWAB_MODAL_TYPE.DISPENSER &&
          this.user?.elencoProfilo.length > 0
        ) {
          profile = this.user?.elencoProfilo.find(
            a => a.nomeProfilo === GEST_EROGATORI
          )?.idProfilo;
        }
        if (this.selectedStructure?.elencoArea?.length > 0) {
          areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
        }

        let payload = {
          idStruttura: this.idStrutturaRes,
          testTipoId: this.testType.testTipoId,
          contattoRichiedente: phone + " - " + email,
          criterioEpidemiologicoCovid19: this.critEpid
            .criterioEpidemiologicoDesc,
          criterioEpidemiologicoId: this.critEpid.criterioEpidemiologicoId,
          idLaboratorio: null,
          idSoggetto: this.subject.idSoggetto,
          tamponeMotivoId: this.covidTestMotivazione?.tamponeMotivoId,
          dataTestStr: this.testDate + " " + this.testTime + ":00",
          medicoRefertante: this.userFullName || "-",
          medicoRichiedente: this.userFullName || "-",
          idRisTamp: this.testResult.idRisTamp,
          testRapidoJrcId: this.brandSelected.testRapidoJrcId,
          tamponeAutorizzato: "NO",

          webappRichiedente: APP_CODE.STRUTTURE,
          webappRefertante: APP_CODE.STRUTTURE,
          idProfiloRichiedente: profile,
          idProfiloRefertante: profile,
          ruoloRichiedente: this.user?.categoriaOpessan,
          ruoloRefertante: this.user?.categoriaOpessan,
          utenteRichiedente: this.user?.cfUtente,
          utenteRefertante: this.user?.cfUtente,
          idEnteRichiedente: this.selectedStructure.idEnte,
          idEnteRefertante: this.selectedStructure.idEnte,
          idStrutturaRichiedente: this.selectedStructure.idStruttura,
          idStrutturaRefertante: this.selectedStructure.idStruttura,
          idAreaRichiedente: areaUtente,
          idAreaRefertante: areaUtente
        };

        try {
          let { data } = await inserisciTamponeExternal(payload);
          notifySuccess("Tampone aggiunto");
          this.$emit("created");
          this.$emit("input", false);

          this.sendNotification();
        } catch (err) {
          if (err.response) {
            notifyError(err, err.response.data.message);
          } else {
            notifyError(err, "Non Ã¨ stato possibile salvare");
          }
        }
      }
      this.isSaving = false;
    },
    async sendNotification() {
      if (this.testResult.risultatoTampone !== "POSITIVO") {
        return;
      }
      let notificationPayload = {
        soggettoId: parseInt(this.subjectId),
        descrizione: `Paziente positivo al tampone rapido. Valutare necessitÃ  di quarantena`,

        cfUtenteRichiesta: this.user.cfUtente,
        cfUtenteDestinatario: this.subject.medico?.cfMedico,
        azione: NOTIFICATION_ACTION_CODES.ACKNOWLEDGMENT,
        priorita: NOTIFICATION_PRIORITY_CODES.HIGH,
        evento: NOTIFICATION_EVENT_CODES.POSITIVE,
        tipoNotifica: NOTIFICATION_TYPE_CODES.INFO,
        tipoUtente: NOTIFICATION_USER_TYPE_CODES.SISP,
        tipoUtenteDest: NOTIFICATION_USER_TYPE_CODES.MMG
      };
      try {
        await inviaNotifica(notificationPayload);
        notifySuccess("Notifica inviata a MMG");
      } catch (err) {
        if (err?.response?.status === 404) {
          notifyError(err, err.response.data.message);
        } else {
          notifyError(err, "Notifica NON inviata a MMG");
        }
        console.error(err);
      }
    },
    async changeContacts() {
      let mail = this.mail;
      if (this.mail === "") {
        mail = null;
      }
      let completeNumber = this.prefixModel?.prefix + this.phone;

      if (this.phone === "") {
        completeNumber = null;
      }

      let profile = null;
      let structure = null;
      let areaUtente = null;
      if (
        this.currentActionType === SWAB_MODAL_TYPE.RSA &&
        this.user?.elencoProfilo.length > 0
      ) {
        profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_ST_RES)
          ?.idProfilo;
      }
      if (
        this.currentActionType === SWAB_MODAL_TYPE.DISPENSER &&
        this.user?.elencoProfilo.length > 0
      ) {
        profile = this.user?.elencoProfilo.find(a => a.nomeProfilo === GEST_EROGATORI)
          ?.idProfilo;
      }

      if (this.selectedStructure?.elencoArea?.length > 0) {
        areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
      }

      let changeContactsPayload = {
        documentoTipoId: this.subject?.documentoTipoId,
        documentoNumero: this.subject?.documentoNumero,
        idAura: this.subject.idAura,
        idTipoSoggetto: this.subject.tipoSoggetto?.idTipoSoggetto,
        idSoggetto: this.subject.idSoggetto,
        idAsr: this.subject.asr?.idAsr,
        codiceFiscale: this.subject.codiceFiscale,
        cognome: this.subject.cognome,
        nome: this.subject.nome,
        dataNascita: this.subject.dataNascita,
        aslResidenza: this.subject.aslResidenza,
        aslDomicilio: this.subject.aslDomicilio,
        comuneResidenzaIstat: this.subject.comuneResidenzaIstat,
        comuneResidenzaIstatCompleto: this.subject.comuneResidenza,
        comuneDomicilioIstat: this.subject.comuneDomicilioIstat,
        comuneDomicilioIstatCompleto: this.subject.comuneDomicilio,
        indirizzoDomicilio: this.subject.indirizzoDomicilio,
        telefonoRecapito: completeNumber,
        email: mail,
        elencoIstitutiScolastico: this.subject.elencoIstitutiScolastico,
        sintomi: this.subject.sintomi,
        decorso: this.subject.elencoDecorso,
        statoContagio: this.subject.statoContagio,
        regioneContagio: this.subject.regioneContagio,
        contattoValidato: this.certified,

        webappOperazione: APP_CODE.STRUTTURE,
        idProfiloOperazione: profile,
        ruoloOperazione: this.user?.categoriaOpessan,
        utenteOperazione: this.user?.cfUtente,
        idEnteOperazione: this.selectedStructure.idEnte,
        idStrutturaOperazione: this.selectedStructure.idStruttura,
        idAreaOperazione: areaUtente
      };

      try {
        let promiseUpdate = await updateSoggettoExternal(changeContactsPayload);
        this.subjectEdited = true;
        notifySuccess("Contatti modificati con successo");
      } catch (e) {
        notifyError(e, e.response?.data?.message);
      }
    }
  }
};
</script>

<style scoped></style>

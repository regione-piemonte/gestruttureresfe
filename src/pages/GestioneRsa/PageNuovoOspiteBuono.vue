<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <ges-strutture-page-title ref="title" @back="onBack">Nuovo ospite {{ nomeStruttura
    }}</ges-strutture-page-title>

    <!-- RICERCA PAZIENTE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md bg-transparent">
      <q-card-section class="bg-white text-h6">
        Cerca ospite
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-tabs v-model="searchTab" align="left">
          <q-tab :name="SEARCH_TABS.TAX_CODE" label="Per codice fiscale" />
          <q-tab :name="SEARCH_TABS.INFO" label="Per nome e cognome" />
        </q-tabs>
      </q-card-section>

      <q-card-section class="q-pa-none bg-white">
        <q-tab-panels v-model="searchTab" animated>
          <q-tab-panel :name="SEARCH_TABS.TAX_CODE">
            <q-form ref="formSearchByTaxCode" greedy @submit="noop">
              <div class="row items-center q-col-gutter-md">
                <!-- CODICE FISCALE -->
                <!-- -------------- -->
                <div class="col-12">
                  <q-input :value="auraSearchTaxCode" :rules="[ruleRequired]" @input="updateAuraSearchTaxCode" type="text"
                    label="Codice fiscale*" filled dense no-error-icon maxlength="16"
                    counter /><!-- @keyup="resetIfSearchedAlready" -->
                </div>

                <div class="col-12">
                  <q-btn color="primary" outline dense :loading="isSearching" @click="searchByTaxCode">
                    Cerca
                  </q-btn>
                </div>
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel :name="SEARCH_TABS.INFO">
            <q-form ref="formSearchByInfo" greedy @submit="noop">
              <div class="row items-center q-col-gutter-md">
                <!-- COGNOME -->
                <!-- ------- -->
                <div class="col-12 col-lg-4">
                  <q-input v-model="auraSearchLastName" type="text" label="Cognome*" filled dense no-error-icon
                    :rules="[ruleRequired]" />
                </div>

                <!-- NOME -->
                <!-- ---- -->
                <div class="col-12 col-lg-4">
                  <q-input v-model="auraSearchFirstName" type="text" label="Nome*" filled dense no-error-icon
                    :rules="[ruleRequired]" />
                </div>

                <!-- DATA DI NASCITA -->
                <!-- --------------- -->
                <div class="col-12 col-lg-4">
                  <q-input v-model="auraSearchBirthDate" type="date" label="Data di nascita*" stack-label filled dense
                    no-error-icon :rules="[ruleRequired]" />
                </div>

                <div class="col-12">
                  <q-btn outline dense color="primary" :loading="isSearchingOnAura" @click="searchByInfo">
                    Cerca
                  </q-btn>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- FEEDBACK -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-md">
      <template v-if="isSubjectNotAssignable">
        <q-banner rounded class="bg-red-2 q-mb-sm">
          <div class="text-body1">
            {{ subjectNotAssignableLabel }}
          </div>
        </q-banner>
      </template>

      <template v-if="isSubjectOnSystem">
        <q-banner rounded class="bg-green-2">
          <div class="text-body1">
            Soggetto trovato
            <br />
          </div>
        </q-banner>
      </template>

      <template v-if="saveErrorMessage !== ''">
        <q-banner rounded class="bg-red-2">
          <div class="text-body1">
            {{ saveErrorMessage }}
            <br />
          </div>
        </q-banner>
      </template>

      <template v-if="!isSubjectOnAura && !isSubjectOnSystem">
        <q-banner rounded class="bg-blue-2">
          <div class="text-body1">
            Soggetto non trovato. <br />
            Controlla che i criteri di ricerca siano corretti oppure inserisci i
            dati anagrafici.
          </div>
        </q-banner>
      </template>
    </div>

    <!-- INSERIMENTO DATI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-form v-if="isSearchedOnAura && !isSearchingOnAura" ref="formSoggetto" greedy @submit="noop">
      <q-card class="q-mt-md">
        <q-card-section class="text-h6">
          Dati anagrafici del soggetto
        </q-card-section>

        <q-card-section class="q-py-xs">
          <div class="row items-center q-col-gutter-md">
            <!-- COGNOME -->
            <!-- ------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-input v-model="lastName" type="text" @input="dataSoggNotValid = false" label="Cognome*" filled
                :disable="isSubjectOnSystem || isSubjectOnAura" dense no-error-icon :rules="[ruleRequired]" />
            </div>

            <!-- NOME -->
            <!-- ---- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-input v-model="firstName" @input="dataSoggNotValid = false" type="text" label="Nome*"
                :disable="isSubjectOnSystem || isSubjectOnAura" filled dense no-error-icon :rules="[ruleRequired]" />
            </div>

            <!-- CODICE FISCALE -->
            <!-- -------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-input type="text" label="Codice fiscale" filled dense v-model="taxCode"
                :disable="(isSubjectOnSystem || isSubjectOnAura) && !!codFisc" no-error-icon maxlength="16" counter
                bottom-slots @input="
                  updateTaxCode();
                dataSoggNotValid = false;
                " />
            </div>

            <!-- DATA DI NASCITA -->
            <!-- --------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-input v-model="birthDate" type="date" label="Data di nascita*" stack-label
                :disable="isSubjectOnSystem || isSubjectOnAura" @input="dataSoggNotValid = false" filled dense
                no-error-icon :rules="[ruleRequired, beforeDate]" />
            </div>

            <!-- TIPO DI DOCUMENTO -->
            <!-- --------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-select v-model="documentType" :options="documentTypeList"
                :disable="(isSubjectOnSystem || isSubjectOnAura) && !!codFisc" :rules="[tipoDocumentoRule]"
                option-value="documentoTipoId" option-label="documentoTipoDesc" label="Tipo documento*" emit-value
                map-options dense filled options-dense no-error-icon bottom-slots clearable />
            </div>

            <!-- NUMERO DOCUMENTO -->
            <!-- --------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-input :value="documentNumber" label="Numero documento*" stack-label
                :disable="(isSubjectOnSystem || isSubjectOnAura) && !!codFisc" :rules="[numeroDocumentoRule]"
                @input="handleDocumentNumberInput" filled dense no-error-icon />
            </div>
            <!-- PREFISSO -->
            <!-- -------- -->
            <div class="col-12 col-md-6 ">
              <q-select filled v-model="prefixModel" :options="prefixListOptions" label="Prefisso" option-label="label"
                option-value="label" dense options-dense no-error-icon @filter="onFilterPrefixOptions" use-input
                bottom-slots :rules="[rulePrefix]" clearable :loading="isLoading">
              </q-select>
            </div>
            <!-- TELEFONO -->
            <!-- -------- -->
            <div class="col-12 col-md-6 ">
              <q-input v-model="phoneNumber" type="tel" label="Telefono" filled dense bottom-slots no-error-icon
                :rules="[requiredMailOrPhone, validPhone]" />
            </div>

            <template v-if="!phoneNumber && !isLoading">
              <q-banner rounded class="bg-orange-2 col q-ml-md">
                <div>
                  Attenzione! Se non Ã¨ specificato un numero di cellulare, il
                  paziente non potrÃ  ricevere sms.
                </div>
              </q-banner>
            </template>

            <!-- EMAIL -->
            <!-- ----- -->
            <div class="col-12  ">
              <q-input v-model="email" type="email" label="Email" filled dense no-error-icon bottom-slots :rules="[
                ruleMail,
                requiredMailOrPhone,
                ruleMailForPrefixForeign
              ]" />
            </div>

            <!--          CERTIFICAZIONE CONTATTI-->
            <!--                        <div v-if="env && env.APP_IS_DEV" class="col-12">-->
            <div class="col-12">
              <q-banner rounded class=" bg-blue-2 ">
                <div>
                  <q-checkbox class="text-body1" v-model="certified" label="Si dichiara di aver provveduto ad informare  il cittadino (ai sensi della normativa privacy)
                    che il numero di cellulare indicato in procedura sarÃ  utilizzato anche per ricevere comunicazioni
                    e notifiche via SMS.">
                  </q-checkbox>
                </div>
              </q-banner>
            </div>

            <div class="col-12 q-py-sm">
              <q-separator />
            </div>

            <!-- TIPO PAZIENTE -->
            <!-- ------------- -->
            <div class="col-12">
              <q-select filled v-model="subjectTypeSelected" :options="subjectTypeOptions" label="Tipo soggetto*"
                option-label="descTipoSoggetto" option-value="idTipoSoggetto" emit-value map-options dense @input="
                  dataSoggNotValid = false;
                tipoSoggNotValid = false;
                " options-dense no-error-icon bottom-slots :loading="isLoading" :rules="[ruleRequired]" />
            </div>

            <!-- ASL RESIDENZA -->
            <!-- ------------- -->
            <div class="col-12 col-md-6">
              <q-select filled v-model="aslResidenceSelected" :options="aslOptions" :disable="aslSelectDisabled"
                label="ASL di residenza*" option-label="descAslEstesa" option-value="descAslEstesa" emit-value
                @input="dataSoggNotValid = false" map-options dense options-dense no-error-icon bottom-slots clearable
                hint="Per i soggetti fuori regione puoi selezionare ''Extra regione''" :loading="isLoading"
                :rules="[ruleRequired]" />
            </div>

            <!-- ASL DOMICILIO -->
            <!-- ------------- -->
            <div class="col-12 col-md-6">
              <q-select @input="onSelectionAslDomicilio()" v-model="aslDomicileSelected" :options="aslOptions"
                :disable="aslSelectDisabled" :loading="isLoading" :rules="[ruleRequired]" option-label="descAslEstesa"
                option-value="descAslEstesa" label="ASL di domicilio*" filled emit-value map-options dense options-dense
                no-error-icon clearable hint="Per i soggetti fuori regione puoi selezionare ''Extra regione''" />
            </div>

            <!-- ASR ASSEGNAZIONE -->
            <!-- ------------- -->
            <template v-if="isAsrDomicileVisible">
              <div class="col-12">
                <q-select @input="dataSoggNotValid = false" v-model="asrDomicileSelected" :options="asrOptions" :disable="isSubjectOnSystem ||
                  isSubjectOnAura ||
                  isAsrDomicilePreselected
                  " :loading="isLoading" :rules="[ruleRequired]" option-label="descrizione" option-value="idAsr"
                  label="ASR di assegnazione*" filled emit-value map-options dense options-dense no-error-icon clearable
                  hint="Per i soggetti ''Extra regione'' Ã¨ necessario selezionare l'ASR a cui assegnare il soggetto" />
              </div>
            </template>

            <!-- COMUNE RESIDENZA -->
            <!-- ---------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-select filled :disable="isSubjectOnSystem || isSubjectOnAura" v-model="cityResidenceSelected"
                :options="cityResidenceOptions" label="Comune residenza*" option-label="nomeComune"
                option-value="istatComune" dense options-dense @input="dataSoggNotValid = false" no-error-icon use-input
                fill-input hide-selected bottom-slots clearable :loading="isLoading"
                @filter="onFilterCityResidenceOptions" :rules="[residenceRule]" />
            </div>

            <!-- COMUNE DOMICILIO -->
            <!-- ---------------- -->
            <div class="col-12 col-md-6 col-lg-4">
              <q-select filled v-model="cityDomicileSelected" :disable="isSubjectOnSystem || isSubjectOnAura"
                :options="cityDomicileOptions" label="Comune domicilio*" option-label="nomeComune"
                option-value="istatComune" dense options-dense @input="dataSoggNotValid = false" no-error-icon use-input
                fill-input hide-selected bottom-slots clearable :loading="isLoading" @filter="onFilterCityDomicileOptions"
                :rules="[domicileRule]" />
            </div>

            <!-- INDIRIZZO DOMICILIO -->
            <!-- ------------------- -->
            <div class="col-12 col-lg-4">
              <q-input v-model="domicileAddress" :disable="isSubjectOnSystem || isSubjectOnAura" type="text"
                label="Indirizzo domicilio" filled dense @input="dataSoggNotValid = false" no-error-icon bottom-slots />
            </div>
          </div>
        </q-card-section>
        <label v-if="dataSoggNotValid" class="q-ml-md text-negative">Ci sono dei campi obbligatori non validi</label>
        <label v-if="tipoSoggNotValid" class="q-ml-md text-negative">Il campo <strong>tipo soggetto</strong> non Ã¨
          valido</label>
        <!-- ------ -->
        <q-card-section class="text-right">
          <q-btn color="primary" :loading="isSaving" @click="save">
            Salva
          </q-btn>
        </q-card-section>
      </q-card>
    </q-form>
    <ges-strutture-res-select-subject ref="selectSubject" @selectedSubject="onSubjectSelected" />
    <template v-if="isOspite">
      <new-association-structure-dialog v-model="isOspite" :subject="subject" :idStrutturaRes="selectedStructure.idStruttura"
        @newAssociation="onNewAssociation">
      </new-association-structure-dialog>
    </template>
  </q-page>
</template>


<script>
import { date } from "quasar";

import { TYPES } from "src/store";

import {
  associaSoggettoStruttura,
  createSoggetto,
  getAslList,
  getAsrList,
  getAuraAssistedDetail,
  getAuraAssistedListByInfo,
  getAuraAssistedListByTaxCode,
  getCityList,
  getDocumentTypeList,
  getSubjectTypeList,
  systemSearchByCf,
  systemSearchByInfo,
  updateSoggetto,
  getPrefixList,
  updateSoggettoExternal,
  getSubjectDetailGesPaz,
  getValidPhoneInternational
} from "src/services/api";

import GesStrutturePageTitle from "components/GesStrutturePageTitle";
import GesStruttureSegnalaSISPNuovoSoggetto from "components/GesStruttureSegnalaSISPNuovoSoggetto";
import GesStruttureResSelectSubject from "components/GesStruttureResSelectSubject";
import NewAssociationStructureDialog from 'src/components/NewAssociationStructureDialog.vue';
import { isBeforeDate, notifyError, notifySuccess, notTooOldDate, sortBy } from 'src/services/utils';
import { APP_CODE, EXTRA_REGIONE, GEST_ST_RES, NO_ASL, NO_SUBJECT_TYPE, SUBJECT_TYPE } from 'src/services/business_logic';

const { formatDate } = date;

const SEARCH_TABS = {
  TAX_CODE: "codice-fiscale",
  INFO: "info"
};

export const scrollToElement = element => {
  element.scrollIntoView({
    block: "start",
    behavior: "smooth"
  });
};

export default {
  name: "PageNuovoOspiteBuono",
  components: {
    GesStruttureResSelectSubject,
    GesStruttureSegnalaSISPNuovoSoggetto,
    GesStrutturePageTitle,
    NewAssociationStructureDialog
  },
  data() {
    return {
      subjectTypeListFilter: [],
      codFisc: "",
      idAura: null,
      saveErrorMessage: "",
      subjectsList: null,
      displaySelectSubject: false,
      segnalaSISP: false,
      dataSoggNotValid: false,
      tipoSoggNotValid: false,
      SEARCH_TABS,
      searchTab: SEARCH_TABS.TAX_CODE,
      auraSearchTaxCode: "",
      auraSearchLastName: "",
      auraSearchFirstName: "",
      auraSearchBirthDate: "",
      isSearching: false,
      isSubjectNotAssignable: false,
      prefixSearchValue: "",
      subjectNotAssignableLabel: "",
      isSubjectOnSystem: false,
      isSubjectOnAura: true,
      isSearchedOnAura: false,
      subjectTypeSelected: null,
      subjectTypeList: [],
      isSaving: false,
      taxCode: "",
      lastName: "",
      firstName: "",
      birthDate: null,
      documentType: null,
      documentNumber: null,
      aslSelectDisabled: false,
      aslResidenceSelected: null,
      aslDomicileSelected: null,
      asrDomicileSelected: null,
      isAsrDomicilePreselected: false,
      cityResidenceSelected: null,
      cityDomicileSelected: null,
      domicileAddress: "",
      phoneNumber: "",
      email: "",
      idSoggetto: "",
      isValidPhone: true,
      isValidDomicile: true,
      isValidResidence: true,
      isValid: true,
      schoolOrderSelected: null,
      schoolOrderOptions: [],
      schoolCityOptions: [],
      schoolCitySelected: null,
      schoolDistrictOptions: [],
      schoolDistrictSelected: null,
      schoolList: [],
      schoolName: null,
      isSchoolModalOpen: false,
      selectedSchoolList: [],
      isLoading: false,
      isSearchingOnAura: false,
      aslList: [],
      asrList: [],
      cityList: [],
      documentTypeList: [],
      prefixModel: null,
      prefixList: [],
      cityResidenceSearchValue: "",
      cityDomicileSearchValue: "",
      isSelectTypeDisabled: false,
      hasEvent: false,
      certified: false,
      searchedOnAura: false,
      columns: [
        {
          name: "add-school",
          required: true,
          label: "",
          align: "left",
          field: row => row,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "name",
          required: true,
          label: "Nome istituto",
          align: "left",
          field: row => row.denominazioneIstituto ?? "-",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "order",
          required: true,
          label: "Ordine istituto",
          align: "left",
          field: row => row.ordineIstituto ?? "-",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "city",
          required: true,
          label: "Comune",
          align: "left",
          field: row => row.comuneIstituto ?? "-",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "district",
          required: true,
          label: "Provincia",
          align: "left",
          field: row => row.provinciaIstituto ?? "-",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "address",
          required: true,
          label: "Indirizzo",
          align: "left",
          field: row => row.indirizzoIstituto ?? "-",
          format: val => `${val}`,
          sortable: true
        }
      ],
      isOspite: false,
      subject: null
    };
  },
  computed: {
    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    soggetto() {
      return this.$store.getters['getSoggettoSelezionato'];
    },
    beforeDate() {
      return v => {
        return (
          (isBeforeDate(v) && notTooOldDate(v)) || "Data nascita non valida"
        );
      };
    },
    prefixListOptions() {
      this.prefixList.forEach(
        a => (a.label = "(" + a.prefix + ")" + " " + a.countryName)
      );

      return this.prefixList.filter(c => {
        const toSearch = this.prefixSearchValue?.toUpperCase?.() ?? "";
        const searchable = c.label.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    rulePrefix() {
      return v => !!v || (!this.phoneNumber && !v) || "Inserire il prefisso";
    },
    tipoDocumentoRule() {
      return v => !!this.taxCode || !!this.documentType || "Campo obbligatorio";
    },
    numeroDocumentoRule() {
      return v =>
        !!this.taxCode || !!this.documentNumber || "Campo obbligatorio";
    },
    residenceRule() {
      return v => this.isValidResidence || "Campo obbligatorio!";
    },
    domicileRule() {
      return v => this.isValidDomicile || "Campo obbligatorio!";
    },
    validPhone() {
      return v =>
        (!!v && this.isValidPhone === true) ||
        !this.certified ||
        "Inserisci un numero di telefono valido";
    },
    italianPhone() {
      return this.prefixModel.countryCode === "IT";
    },
    ruleMail() {
      return v => !v || EMAIL_REGEX.test(v) || "Deve essere un'email";
    },
    ruleMailForPrefixForeign() {
      return v =>
        (!!this.phoneNumber && this.italianPhone) ||
        (!this.phoneNumber && !v) ||
        !!v ||
        !this.certified ||
        "Mail obbligatoria con cellulare straniero";
    },
    requiredMailOrPhone() {
      return v =>
        !!this.phoneNumber ||
        !!this.email ||
        this.certified === false ||
        "Inserire almeno un contatto";
    },
    selectedSchoolListToShow() {
      for (let i = 0; i < this.selectedSchoolList.length; i++) {
        const labelName =
          this.selectedSchoolList[i].denominazioneIstituto ?? "-";
        const labelOrder =
          this.selectedSchoolList[i].ordineIstituto?.toLowerCase() ?? "-";
        const labelDistrict =
          this.selectedSchoolList[i].provinciaIstituto ?? "-";
        const labelCity = this.selectedSchoolList[i].comuneIstituto ?? "-";
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectedSchoolList[i].label =
          labelName +
          " (" +
          labelOrder +
          "). Provincia: " +
          labelDistrict +
          ". Comune: " +
          labelCity;
      }
      return this.selectedSchoolList;
    },
    isSchoolRelated() {
      if (this.subjectTypeSelected) {
        return (
          this.subjectTypeOptions.find(
            a => a.idTipoSoggetto === this.subjectTypeSelected
          ).tipologia === "SCUOLA"
        );
      }
      return false;
    },
    subjectTypeListSorted() {
      return sortBy(this.subjectTypeList, "descTipoSoggetto");
    },
    subjectTypeOptions() {
      const currentType = this.subjectTypeList.find(
        type => type.idTipoSoggetto === this.subjectTypeSelected
      );

      let result = this.subjectTypeList.filter(type => {
        return (
          type.descTipoSoggetto.toLowerCase().includes("operatore") ||
          type.descTipoSoggetto.toLowerCase().includes("visitatore") ||
          type.descTipoSoggetto.toLowerCase().includes("ospite")
        );
      });

      if (
        currentType &&
        !result.find(type => type.idTipoSoggetto === currentType.idTipoSoggetto)
      ) {
        result = [...result, currentType];
      } else if (this.subjectTypeSelected === 99) {
        result = [...result, NO_SUBJECT_TYPE];
      }

      sortBy(result, "descTipoSoggetto");

      return result;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    aslListSorted() {
      return sortBy(this.aslList, "descAslEstesa");
    },
    aslOptions() {
      let result = this.aslList.filter(a => a.codRegione === "010");
      result = [...result, NO_ASL];
      return sortBy(result, "descAslEstesa");
    },
    asrListSorted() {
      return sortBy(this.asrList, "descrizione");
    },
    asrOptions() {
      return this.asrListSorted;
    },
    cityListSorted() {
      return sortBy(this.cityList, "nomeComune");
    },
    cityResidenceOptions() {
      return this.cityListSorted.filter(c => {
        const toSearch = this.cityResidenceSearchValue?.toUpperCase?.() ?? "";
        const searchable = c.nomeComune.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    cityDomicileOptions() {
      return this.cityListSorted.filter(c => {
        const toSearch = this.cityDomicileSearchValue?.toUpperCase?.() ?? "";
        const searchable = c.nomeComune.toUpperCase();
        return searchable.includes(toSearch);
      });
    },
    isAsrDomicileVisible() {
      return (
        this.aslDomicileSelected === NO_ASL.descAslEstesa ||
        this.aslDomicileSelected === EXTRA_REGIONE
      );
    },
    selectedStructure() {
      return this.$store.getters[
        TYPES.GETTERS.SELECTED_PROFILE
      ]?.elencoStrutturaArea?.find(
        strut => strut.idStruttura === this.$route.params.id
      );
    },
    idStruttura() {
      return this.selectedStructure.idStrutturaRes;
    },
    nomeStruttura() {
      return this.selectedStructure?.nome;
    },
    idAsrStruttura() {
      return this.asrOptions.find(
        asr => asr.idEnte === this.selectedStructure?.idEnte
      ).idAsr;
    }
  },
  methods: {
    async checkIfValid() {
      if (!this.certified) {
        this.isValidPhone = true;
      } else if (
        this.certified &&
        (!this.phoneNumber || this.phoneNumber === "")
      ) {
        this.isValidPhone = false;
      } else if (this.prefixModel) {
        try {
          await getValidPhoneInternational(
            this.prefixModel.prefix + this.phoneNumber
          );
          this.isValidPhone = true;
        } catch (e) {
          this.isValidPhone = false;
        }
      } else {
        this.isValidPhone = false;
      }
    },
    handleDocumentNumberInput(value) {
      this.documentNumber = value?.toUpperCase() ?? "";
    },
    onSubjectSelected(subject) {
      this.prefillFormInputs(subject);
    },
    updateAuraSearchTaxCode(val) {
      this.auraSearchTaxCode = val?.toUpperCase() ?? "";
    },
    resetIfSearchedAlready() {
      this.documentNumber = null;
      this.documentType = null;
      this.idSoggetto = "";
      this.taxCode = "";
      this.lastName = "";
      this.firstName = "";
      this.birthDate = null;
      this.aslResidenceSelected = null;
      this.aslDomicileSelected = null;
      this.cityResidenceSelected = null;
      this.cityDomicileSelected = null;
      this.prefixModel = null;
      this.domicileAddress = "";
      this.phoneNumber = "";
      this.email = "";
      this.subjectTypeSelected = null;
      this.idTipoSoggetto = NO_SUBJECT_TYPE.idTipoSoggetto;
      this.isSelectTypeDisabled = false;
    },
    onFilterPrefixOptions(val, update) {
      update(() => {
        this.prefixSearchValue = val;
      });
    },
    onBack() {
      this.$router.back();
    },
    async save() {
      this.isValid = true;
      await this.checkIfValid();
      let payload = {}
      if (this.segnalaSISP) {
        const isSISPValid = await this.$refs.sisp.isValid();
        if (!isSISPValid) return;
      }

      /* VALIDAZIONE EXTRA REGIONE */
      if (
        this.aslDomicileSelected !== "Extra regione" &&
        this.cityDomicileSelected === null
      ) {
        this.isValidDomicile = false;
      } else {
        this.isValidDomicile = true;
      }

      if (
        this.aslResidenceSelected !== "Extra regione" &&
        this.cityResidenceSelected === null
      ) {
        this.isValidResidence = false;
      } else {
        this.isValidResidence = true;
      }

      const isValid =
        (await this.$refs.formSoggetto.validate()) &&
        this.isValidPhone &&
        this.isValidResidence &&
        this.isValidDomicile;

      const prefix = this.prefixModel?.prefix;
      const number = this.phoneNumber;

      let completeNumber = null;

      if (prefix && prefix !== "" && number && number !== "") {
        completeNumber = (this.prefixModel?.prefix ?? "") + (number ?? "");
      }

      if (isValid) {
        this.isSaving = true;

        try {
          if (this.isSubjectOnSystem) {
            if (!this.isSelectTypeDisabled) {
              if (
                this.subjectTypeSelected === 0 ||
                this.subjectTypeSelected === null
              ) {
                this.tipoSoggNotValid = true;
                return;
              } else {
                const subjectType =
                  this.subjectTypeSelected === NO_SUBJECT_TYPE.idTipoSoggetto
                    ? null
                    : this.subjectTypeSelected;

                const aslResidence =
                  this.aslResidenceSelected === NO_ASL.descAslEstesa
                    ? EXTRA_REGIONE
                    : this.aslResidenceSelected;

                const aslDomicile =
                  this.aslDomicileSelected === NO_ASL.descAslEstesa
                    ? EXTRA_REGIONE
                    : this.aslDomicileSelected;
                // eslint-disable-next-line no-unused-vars

                let profile = null;
                let structure = null;
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
                  contattoValidato: this.certified,
                  documentoNumero: this.documentNumber,
                  documentoTipoId: this.documentType,
                  idAura: this.idAura,
                  idTipoSoggetto: subjectType,
                  idAsr: this.asrDomicileSelected,
                  codiceFiscale: this.taxCode,
                  idSoggetto: this.idSoggetto,
                  cognome: this.lastName,
                  nome: this.firstName,
                  dataNascita: this.birthDate
                    ? new Date(this.birthDate).getTime()
                    : "",
                  aslResidenza: aslResidence,
                  aslDomicilio: aslDomicile,
                  comuneResidenzaIstat: this.cityResidenceSelected?.istatComune,
                  comuneResidenzaIstatCompleto: this.cityResidenceSelected,
                  comuneDomicilioIstat: this.cityDomicileSelected?.istatComune,
                  comuneDomicilioIstatCompleto: this.cityDomicileSelected,
                  indirizzoDomicilio: this.domicileAddress,
                  telefonoRecapito:
                    completeNumber === "" ? null : completeNumber,
                  email: this.email === "" ? null : this.email,

                  webappOperazione: APP_CODE.STRUTTURE,
                  idProfiloOperazione: profile,
                  ruoloOperazione: this.user?.categoriaOpessan,
                  utenteOperazione: this.user?.cfUtente,
                  idEnteOperazione: this.selectedStructure?.idEnte,
                  idStrutturaOperazione: this.selectedStructure.idStruttura,
                  idAreaOperazione: areaUtente
                };

                if (subjectType) {
                  await updateSoggetto(this.idSoggetto, subjectType);
                }

                await updateSoggettoExternal(payload);

                notifySuccess("Modifica avvenuta");
              }
            }
            // console.log(this.idSoggetto)
            //SE LA TIPOLOGIA DI SOGGETTO Ã¨ OSPITE, PASSO A TRUE IL FLAG RELATIVO, SE NO FALSE
            let flagOspite = false;
            let subjectTypeSelected = this.subjectTypeOptions.find(
              a => a.idTipoSoggetto === this.subjectTypeSelected
            );
            if (subjectTypeSelected?.tipologia === SUBJECT_TYPE.ospite) {
              flagOspite = true;
              this.subject = {
                idSoggetto: this.idSoggetto,
                nome: this.nome,
                cognome: this.cognome
              };
              this.isOspite = true;
            } else {

              const stiId = this.$route.params.id;
              const { data: response } = await associaSoggettoStruttura(
                this.idSoggetto,
                stiId.toString(),
                flagOspite,
                payload
              );
              try {
                if (response.messaggio) {
                  notifyError(1, response.messaggio);
                  return;
                }
              } catch (e) {
                // flusso normale
              }
              if (this.segnalaSISP) {
                await this.$refs.sisp.segnala(this.idSoggetto);
              }

              this.$router.back();
            }
          }

        } catch (e) {
          notifyError(1, e?.response?.data?.message);
          console.error(e);
        }
        try {
          if (!this.isSubjectOnSystem) {
            let profile = null;
            let structure = null;
            let areaUtente = null;
            if (this.user?.elencoProfilo?.length > 0) {
              profile = this.user?.elencoProfilo.find(
                a => a.nomeProfilo === GEST_ST_RES
              )?.idProfilo;
            }

            if (this.selectedStructure?.elencoArea?.length > 0) {
              areaUtente = this.selectedStructure?.elencoArea[0]?.idArea;
            }

            const subjectType =
              this.subjectTypeSelected === NO_SUBJECT_TYPE.idTipoSoggetto
                ? null
                : this.subjectTypeSelected;

            const aslResidence =
              this.aslResidenceSelected === NO_ASL.descAslEstesa
                ? EXTRA_REGIONE
                : this.aslResidenceSelected;

            const aslDomicile =
              this.aslDomicileSelected === NO_ASL.descAslEstesa
                ? EXTRA_REGIONE
                : this.aslDomicileSelected;
            const payload = {
              contattoValidato: this.certified,
              documentoNumero: this.documentNumber,
              documentoTipoId: this.documentType,
              idTipoSoggetto: subjectType,
              idAsr: this.asrDomicileSelected,
              codiceFiscale: this.taxCode,
              cognome: this.lastName,
              nome: this.firstName,
              dataNascita: this.birthDate
                ? new Date(this.birthDate).getTime()
                : "",
              aslResidenza: aslResidence,
              aslDomicilio: aslDomicile,
              comuneResidenzaIstat: this.cityResidenceSelected?.istatComune,
              comuneResidenzaIstatCompleto: this.cityResidenceSelected,
              comuneDomicilioIstat: this.cityDomicileSelected?.istatComune,
              comuneDomicilioIstatCompleto: this.cityDomicileSelected,
              indirizzoDomicilio: this.domicileAddress,
              telefonoRecapito: completeNumber === "" ? null : completeNumber,
              email: this.email === "" ? null : this.email,

              webappOperazione: APP_CODE.STRUTTURE,
              idProfiloOperazione: profile,
              ruoloOperazione: this.user?.categoriaOpessan,
              utenteOperazione: this.user?.cfUtente,
              idEnteOperazione: this.selectedStructure?.idEnte,
              idStrutturaOperazione: this.selectedStructure?.idStruttura,
              idAreaOperazione: areaUtente
            };
            if (this.idAura !== null) {
              payload.idAura = this.idAura;
            }
            if (
              this.subjectTypeSelected === 0 ||
              this.subjectTypeSelected === null ||
              this.lastName === "" ||
              this.firstName === "" ||
              this.aslDomicileSelected === null ||
              this.aslResidenceSelected === null ||
              (this.cityDomicileSelected === null &&
                this.aslDomicileSelected !== "Extra regione") ||
              (this.cityResidenceSelected === null &&
                this.aslResidenceSelected !== "Extra regione")
            ) {
              this.dataSoggNotValid = true;
              return;
            }
            let { data: subject } = await createSoggetto(payload);
            if (this.segnalaSISP) {
              await this.$refs.sisp.segnala(subject.idSoggetto);
            }
            // Se arriva questo tipo di messaggio =>
            // Il paziente non Ã¨ assegnabile
            // e quindi mostriamo un errore
            if (subject?.message?.toUpperCase()?.includes("NON APPARTIENE")) {
              this.isSubjectNotAssignable = true;
              this.subjectNotAssignableLabel = subject.message;
              this.isSaving = false;
              scrollToElement(this.$refs.title.$el);
              return;
            }

            //SE LA TIPOLOGIA DI SOGGETTO Ã¨ OSPITE, PASSO A TRUE IL FLAG RELATIVO, SE NO FALSE

            let flagOspite = false;
            let subjectTypeSelected = this.subjectTypeOptions.find(
              a => a.idTipoSoggetto === this.subjectTypeSelected
            );

            if (subjectTypeSelected?.tipologia === SUBJECT_TYPE.ospite) {
              flagOspite = true;
              this.subject = subject;
              this.isOspite = true;
            } else {
              const stiId = this.$route.params.id;
              const { data } = await associaSoggettoStruttura(
                subject.idSoggetto,
                stiId.toString(),
                flagOspite
              );
              try {
                if (data.messaggio) {
                  notifyError(1, data.messaggio);
                  this.isSaving = false;
                  return;
                }
              } catch (e) {
                // flusso normale
              }
              this.$router.back();
            }
          }
        } catch (e) {
          notifyError(1, e?.response?.data?.message);
          console.error(e);
        }
      } else {
        notifyError(1, "Controlla i campi!");
      }
      this.isSaving = false;
    },
    noop() { },
    async searchByTaxCode() {
      this.aslSelectDisabled = false;
      this.idAura = null;
      this.resetIfSearchedAlready();
      this.searchedOnAura = false;
      const isValid = await this.$refs.formSearchByTaxCode.validate();
      if (!isValid) return;
      const stiId = this.$route.params.id;
      this.isSubjectOnAura = true;
      this.isSubjectOnSystem = false;
      this.isSearchingOnAura = true;
      let subjectAuraListItem = null;
      this.isSearchedOnAura = true;
      try {
        const { data: subjectOnSystem } = await systemSearchByCf(
          this.auraSearchTaxCode,
          stiId
        );
        if (subjectOnSystem === "") {
          this.isSubjectOnSystem = false;
        } else {
          const { data: subjectGesPaz } = await getSubjectDetailGesPaz(
            subjectOnSystem.idSoggetto
          );
          subjectOnSystem.prefissoInternazionale =
            subjectGesPaz.prefissoInternazionale;
          subjectOnSystem.contattoValidato = subjectGesPaz.contattoValidato;
          this.isSearchingOnAura = false;
          this.isSubjectOnSystem = true;
          this.isSubjectOnAura = false;
          this.isSearchedOnAura = true;

          this.prefillFormInputs(subjectOnSystem);
        }
      } catch (e) {
        console.error(e);
      }

      if (!this.isSubjectOnSystem) {
        try {
          const { data } = await getAuraAssistedListByTaxCode(
            this.auraSearchTaxCode
          );
          subjectAuraListItem = data?.[0] ?? null;

          if (subjectAuraListItem === null) {
            this.isSearchingOnAura = false;
            this.isSubjectOnSystem = false;
            this.isSubjectOnAura = false;
            this.isSearchedOnAura = true;
            this.prefixModel = this.prefixList.find(
              prefix => prefix.countryCode === "IT"
            );
          } else {
            const subjectList = [];
            for (const auraItem of data) {
              const id = auraItem.profiloAnagrafico;

              try {
                const { data: assisted } = await getAuraAssistedDetail(id);
                this.isSubjectOnAura = true;
                const subjectAuraDetail = assisted;
                assisted.idAura = id;
                subjectList.push(subjectAuraDetail);
              } catch (err) {
                notifyError(
                  err,
                  "Non abbiamo trovato questo assistito su AURA"
                );
              }
            }
            this.$refs.selectSubject.setShow(true);
            this.$refs.selectSubject.setList(subjectList);
          }
        } catch (err) {
          this.isSearchingOnAura = false;
          this.isSubjectOnSystem = false;
          this.isSubjectOnAura = false;
          this.isSearchedOnAura = true;
          notifyError(err, "Non abbiamo trovato questo assistito su AURA");
        }
      }
      this.isSearchingOnAura = false;
    },
    async searchByInfo() {
      this.aslSelectDisabled = false;
      this.idAura = null;
      this.resetIfSearchedAlready();
      const isValid = await this.$refs.formSearchByInfo.validate();
      if (!isValid) return;
      // cerca su piattaforma
      // cerca su aura
      if (!isValid) return;
      const stiId = this.$route.params.id;
      this.isSubjectOnAura = true;
      this.isSubjectOnSystem = false;
      this.isSearchingOnAura = true;
      let subjectAuraListItem = null;
      this.isSearchedOnAura = true;
      try {
        const { data: subjectOnSystem } = await systemSearchByInfo(
          this.auraSearchFirstName,
          this.auraSearchLastName,
          this.auraSearchBirthDate,
          stiId
        );

        if (subjectOnSystem === "") {
          this.isSubjectOnSystem = false;
        } else {
          this.isSearchingOnAura = false;
          this.isSubjectOnSystem = true;
          this.isSubjectOnAura = false;
          this.isSearchedOnAura = true;

          if (subjectOnSystem.length === 1) {
            this.prefillFormInputs(subjectOnSystem[0]);
          } else {
            this.subjectsList = subjectOnSystem;
            this.$refs.selectSubject.setShow(true);
            this.$refs.selectSubject.setList(subjectOnSystem);
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (!this.isSubjectOnSystem) {
        try {
          const { data } = await getAuraAssistedListByInfo(
            this.auraSearchLastName,
            this.auraSearchFirstName,
            this.auraSearchBirthDate
          );
          subjectAuraListItem = data?.[0] ?? null;

          if (subjectAuraListItem === null) {
            this.isSearchingOnAura = false;
            this.isSubjectOnSystem = false;
            this.isSubjectOnAura = false;
            this.isSearchedOnAura = true;
          } else {
            const subjectList = [];
            for (const auraItem of data) {
              const id = auraItem.profiloAnagrafico;

              try {
                const { data: assisted } = await getAuraAssistedDetail(id);
                this.isSubjectOnAura = true;
                const subjectAuraDetail = assisted;
                assisted.idAura = id;
                subjectList.push(subjectAuraDetail);
              } catch (err) {
                notifyError(
                  err,
                  "Non abbiamo trovato questo assistito su AURA"
                );
              }
            }
            this.$refs.selectSubject.setShow(true);
            this.$refs.selectSubject.setList(subjectList);
          }
        } catch (err) {
          this.isSearchingOnAura = false;
          this.isSubjectOnSystem = false;
          this.isSubjectOnAura = false;
          this.isSearchedOnAura = true;
          notifyError(err, "Non abbiamo trovato questo assistito su AURA");
        }
      }
      this.isSearchingOnAura = false;
    },
    prefillFormInputs(subject) {
      this.certified = subject.contattoValidato;

      this.documentNumber = subject.documentoNumero;
      this.documentType = subject.documentoTipoId;

      this.idAura = subject.idAura;
      this.idSoggetto = subject.idSoggetto;
      this.taxCode = subject.codiceFiscale;
      this.codFisc = subject.codiceFiscale;
      this.lastName = subject.cognome;
      this.firstName = subject.nome;
      this.birthDate = formatDate(subject.dataNascita ?? 0, "YYYY-MM-DD");

      this.aslResidenceSelected =
        subject.aslResidenza === "" ? EXTRA_REGIONE : subject.aslResidenza;
      this.aslDomicileSelected =
        subject.aslDomicilio === "" ? EXTRA_REGIONE : subject.aslDomicilio;

      if (
        this.isSubjectOnAura &&
        (!subject.aslResidenza || !subject.aslDomicilio)
      ) {
        this.asrDomicileSelected = null;
      } else {
        this.asrDomicileSelected = subject.idAsr ?? this.idAsrStruttura;
      }

      this.aslSelectDisabled =
        this.isSubjectOnSystem ||
        (this.isSubjectOnAura && !!this.asrDomicileSelected);

      this.cityResidenceSelected = subject.comuneResidenza;
      this.cityDomicileSelected = subject.comuneDomicilio;
      this.domicileAddress = subject.indirizzodomicilio;
      this.phoneNumber = subject.telefonoRecapito;
      this.email = subject.email;
      this.subjectTypeSelected = subject.idTipoSoggetto
        ? subject.idTipoSoggetto
        : 99;

      // PREIMPOSTO PREFISSO
      this.prefixModel = this.prefixList.find(
        a => a.countryCode === subject.prefissoInternazionale?.countryCode
      );
      if (this.prefixModel && this.phoneNumber) {
        this.phoneNumber = this.phoneNumber.replace(
          this.prefixModel.prefix,
          ""
        );
      }
    },
    updateTaxCode() {
      this.taxCode = this.taxCode.toUpperCase();
    },
    onFilterCityResidenceOptions(val, update) {
      update(() => {
        this.cityResidenceSearchValue = val;
      });
    },
    onFilterCityDomicileOptions(val, update) {
      update(() => {
        this.cityDomicileSearchValue = val;
      });
    },
    onSelectionAslDomicilio() {
      this.dataSoggNotValid = false;

      // Prepopolare il valore della prop selected se si tratta di "Extra regione"
      if (this.isAsrDomicileVisible) {
        this.asrDomicileSelected = this.idAsrStruttura;
        this.isAsrDomicilePreselected = true;
        console.log(
          "Struttura selezionata sulla base del confronto con lo store =>",
          this.asrDomicileSelected
        );
      } else {
        this.asrDomicileSelected = null;
      }
    },
    onNewAssociation() {
      this.onBack();
    },
  },
  async created() {
    this.$root.$emit("titolo-res");
    const subjectTypeListPromise = getSubjectTypeList();
    const aslListPromise = getAslList();
    const asrListPromise = getAsrList();
    const cityListPromise = getCityList();
    const documentTypeListPromise = getDocumentTypeList();
    const prefixListPromise = getPrefixList();

    try {
      const { data: prefixList } = await prefixListPromise;
      this.prefixList = prefixList;
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare l'elenco dei prefissi ");
    }

    try {
      const { data: subjectTypeList } = await subjectTypeListPromise;
      
      this.subjectTypeList = subjectTypeList.filter(f => f.tipologia === 'OSPITE')
      
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare i tipi di paziente");
    }

    try {
      const { data: aslList } = await aslListPromise;
      this.aslList = aslList;
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare l'elenco delle ASL");
    }

    try {
      const { data: asrList } = await asrListPromise;
      const asrListFiltered = asrList.filter(asr => asr.idEnte !== null);
      this.asrList = asrListFiltered;
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare l'elenco delle ASR");
    }

    try {
      const { data: cityList } = await cityListPromise;
      this.cityList = cityList;
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare l'elenco dei comuni");
    }

    try {
      const { data: documentTypeList } = await documentTypeListPromise;
      this.documentTypeList = documentTypeList;
    } catch (err) {
      notifyError(err, "Non Ã¨ stato possibile caricare l'elenco dei documenti");
    }
  },

};
</script>

<style scoped></style>

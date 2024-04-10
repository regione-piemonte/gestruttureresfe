<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <ges-strutture-page-title @back="onBack">
          Dettaglio ospite o personale
        </ges-strutture-page-title>
      </div>
      <div class="col-auto q-gutter-x-md">

        <template class="q-mr-auto q-mt-sm">
          <q-btn-dropdown color="primary" class="q-mt-sm" label="Nuovo decorso">
            <q-list>
              <q-item v-for="event in eventTypeList" class="items-center" :key="event.idTipoEvento" clickable
                @click="openEventDialog(event)">
                {{ event.descTipoEvento }}
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
        <template class="q-ml-auto q-mt-sm">
          <q-btn color="primary" class="q-mt-sm" @click="openDialogRimuovi()">
            Rimuovi da struttura
          </q-btn>
        </template>
        <template class="q-ml-auto q-mt-sm">
          <q-btn color="primary" class="q-mt-sm" @click="showTestRapido = true">
            Tampone rapido
          </q-btn>
        </template>
      </div>

      <template v-if="showTestRapido">
        <swab-create-dialog v-model="showTestRapido" :subject="subject" :is-hotspot="false"
          :action-type="modalSwabTypeList.RSA" @created="aggiornaTamp" :idStrutturaRes="idStruttura">
        </swab-create-dialog>
      </template>

      <!-- <template v-if="removeFromStructure">
        <delete-association-structure-dialog
          v-model="removeFromStructure"
          :subject="subject"
          :idStrutturaRes="idStruttura"
          @deletedAssociation="onDeletedAssociation"
        >
        </delete-association-structure-dialog>
      </template> -->
      <!-- MODAL RIMUOVI NON DEFINITIVA -->
      <q-dialog v-model="dialogRimuoviSoggetto" full-width>
        <q-card style="max-width: 800px !important">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>Rimuovi soggetto</q-toolbar-title>
              <q-btn v-close-popup round dense flat icon="close" />
            </q-toolbar>
          </q-card-section>
          <q-separator />
          <!-- DATI -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <template>
            <q-card-section>
              Sei sicuro di voler rimuovere il soggetto dalla struttura?
            </q-card-section>
          </template>
          <!--        CONFERMA E SALVA-->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <q-card-section class="text-right">
            <div class="row  q-col-gutter-md reverse">
              <div class="col-md-auto col-12">
                <q-btn color="negative" :loading="isDeleting" class="full-width" @click="removeFromStructureMethod()">Rimuovi</q-btn>
              </div>
              <div class="col-md-auto col-12">
                <q-btn color="primary" outline v-close-popup class="full-width">Indietro</q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Test modal unificata DEBUG -->
      <template v-if="removeFromStructure">
        <movimenti-dialog v-model="removeFromStructure" :subject="subject" :idStrutturaRes="idStruttura"
          :title="'Movimento uscita da struttura'" :tipologia="'DELETE_ASSOCIATION_STRUCTURE'"
          @deletedAssociation="onDeletedAssociation" :newMovimento="newMovimento">
        </movimenti-dialog>
      </template>

      <ges-strutture-dialog-crea-evento :subject="subject" ref="dialogCreaEvento" @created="aggiornaSisp" />
      <div :hidden="isSegnalazioneAperta" class="col-auto q-gutter-x-md q-ml-sm">
        <template class="q-ml-auto q-mt-sm ">
          <q-btn color="primary" class="q-mt-sm" @click="showSISP = true">
            Segnala al sisp
          </q-btn>
        </template>
      </div>
      <div v-if="isSegnalazioneDaCompletare" class="col-auto q-gutter-x-md q-ml-sm">
        <template class="q-ml-auto q-mt-sm ">
          <q-btn color="primary" class="q-mt-sm" @click="showIntegraSISP = true">
            Integra segnalazione al SISP
          </q-btn>
        </template>
      </div>
      <ges-strutture-segnala-s-i-s-p :id-soggetto="$route.params.id" title="Segnala al SISP" @aggiorna-sisp="aggiornaSisp"
        :show="showSISP" @hide="showSISP = false"></ges-strutture-segnala-s-i-s-p>
      <ges-strutture-segnala-s-i-s-p :id-soggetto="$route.params.id" title="Integra segnalazione al SISP"
        @aggiorna-sisp="aggiornaSisp" :show="showIntegraSISP"
        @hide="showIntegraSISP = false"></ges-strutture-segnala-s-i-s-p>
    </div>

    <template v-if="isSegnalazioneDaCompletare">
      <q-banner rounded class="bg-red-2 q-mt-md">
        <div class="text-body1">
          Il SISP ha richiesto per questo paziente un integrazione della
          segnalazione
        </div>
      </q-banner>
    </template>
    <!-- AZIONI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template> </template>

    <!-- NUOVA VISUALIZZAZIONE PAZIENTE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-lg">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-x-xl">
          <!-- PAZIENTE -->
          <!-- -------- -->
          <div class="col-12 col-md-auto self-center">
            <div class="row q-col-gutter-x-lg no-margin">
              <div class="col-12 col-md-auto" :class="{ 'text-center': $q.screen.gt.sm }">
                <div>
                  <q-icon name="person" size="xl" />
                </div>
                <div>
                  <mmg-summary-label caption>
                    {{ subjectTypeLabel | emptyString }}
                  </mmg-summary-label>
                </div>
              </div>

              <div class="col-12 col-md">
                <mmg-summary-label title bold>
                  {{ subjectFullName | emptyString }}
                </mmg-summary-label>
                <mmg-summary-label caption>
                  {{ subjectTaxCode | emptyString }}
                </mmg-summary-label>
                <mmg-summary-label caption>
                  {{ subjectBirthDate | date }}
                </mmg-summary-label>

                <mmg-summary-label caption bold>
                  <span v-if="isSubjectPhoneValid" class="col-xs-4 col-md-2">
                    {{ subjectPhoneNumber }} (validato {{ validatorType }})
                  </span>
                  <span v-else class="col-xs-4 col-md-2">{{
                    subjectPhoneNumber
                  }}</span>
                </mmg-summary-label>

                <mmg-summary-label caption bold>
                  <mmg-label-email :email="subjectEmail" class="no-decoration" />
                </mmg-summary-label>
              </div>
            </div>
          </div>

          <div class="col-auto gt-sm">
            <q-separator vertical class="full-height" />
          </div>

          <div class="col-12 col-md" :class="{ 'q-px-none': $q.screen.gt.sm }">
            <div class="row items-center q-col-gutter-md q-py-sm q-px-md">
              <!-- ULTIMO EVENTO -->
              <!-- ------------- -->
              <div class="col-12 col-md">
                <div class="row items-center q-col-gutter-md">
                  <div class="col-auto">
                    <q-icon name="house" size="md" />
                  </div>

                  <div class="col">
                    <mmg-summary-label caption>
                      Ultimo evento
                    </mmg-summary-label>
                    <mmg-summary-label title bold>
                      {{ subjectEventLastTypeLabel | emptyString }}
                    </mmg-summary-label>
                    <mmg-summary-label caption>
                      {{ subjectEventLastDate | datetime }}
                    </mmg-summary-label>
                  </div>
                </div>
              </div>

              <!-- ULTIMO TAMPONE -->
              <!-- -------------- -->
              <div class="col-12 col-md">
                <div class="row items-center q-col-gutter-md">
                  <div class="col-auto">
                    <q-icon name="mdi-test-tube" size="md" />
                  </div>

                  <div class="col">
                    <mmg-summary-label caption>
                      Ultimo tampone rapido
                    </mmg-summary-label>
                    <mmg-summary-label title bold>
                      <mmg-swab-result-label :code="subjectSwabLastCode" />
                    </mmg-summary-label>
                    <mmg-summary-label caption>
                      {{ subjectSwabLastDate | datetime }}
                    </mmg-summary-label>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-md bg-grey-2 no-margin q-pb-sm">
              <div class="col-12 col-md">
                <mmg-summary-label caption>
                  Domicilio
                </mmg-summary-label>
                <mmg-summary-label caption bold>
                  {{ subjectDomicileFull | emptyString }}
                </mmg-summary-label>
              </div>
              <div class="col-12 col-md">
                <mmg-summary-label caption>
                  Residenza
                </mmg-summary-label>
                <mmg-summary-label caption bold>
                  {{ subjectResidenceFull | emptyString }}
                </mmg-summary-label>
              </div>
            </div>
            <div v-if="subjectSchool && subjectSchool.length > 0" class="col-12 q-ma-md">
              <mmg-summary-label caption>
                Istituto
              </mmg-summary-label>
              <div v-for="school in subjectSchool" :key="school.idIstituto">
                <div class="clickable cursor-pointer text-blue-6 text-lowercase " @click="openSchoolModal(school)">
                  {{ school.denominazioneIstituto | emptyString }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-md bg-transparent">
      <!-- DATI PAZIENTE -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
      <!-- TABS -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" align="left">
          <q-tab :name="TABS.EVENT_LIST" label="Eventi" />
          <q-tab :name="TABS.SWAB_LIST" label="Tamponi" />
          <q-tab :name="TABS.SEROLOGICAL_LIST" label="Test sierologici" />
        </q-tabs>
      </q-card-section>
      <q-card-section class="no-padding bg-white">
        <q-tab-panels v-model="tab" animated>
          <!-- DECORSI -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <q-tab-panel :name="TABS.EVENT_LIST" class="no-padding">
            <template v-if="subjectEventList.length <= 0">
              <div class="q-pa-md text-body1">
                Il paziente non ha ancora eventi
              </div>
            </template>

            <div v-for="(event, index) in subjectEventListSorted" :key="event.id">
              <mmg-event-list-item :event="event" class="q-py-md" @date-updated="onEventDateUpdated" />
              <q-separator v-if="index < subjectEventList.length - 1" />
            </div>
          </q-tab-panel>

          <!-- TAMPONI -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <q-tab-panel v-if="subject !== null" :name="TABS.SWAB_LIST" class="no-padding">
            <template v-if="batchedSwabList.length <= 0">
              <div class="q-pa-md text-body1">
                Il paziente non ha ancora tamponi
              </div>
            </template>

            <div v-for="(swab, index) in batchedSwabList" :key="swab.id">
              <mmg-swab-list-item :swab="swab" class="q-py-md" />
              <q-separator v-if="index < batchedSwabList.length - 1" />
            </div>

            <!--            <q-separator-->
            <!--              style="border-width: 2px; border-bottom-style: dotted"-->
            <!--            />-->

            <!--            <template v-if="nonBatchedSwabList.length <= 0">-->
            <!--              <div class="q-pa-md text-body1">-->
            <!--                Il paziente non ha ancora tamponi-->
            <!--              </div>-->
            <!--            </template>-->

            <!--            <div v-for="(swab, index) in nonBatchedSwabList" :key="swab.id">-->
            <!--              <mmg-swab-list-item :swab="swab" class="q-py-md" />-->
            <!--              <q-separator v-if="index < nonBatchedSwabList.length - 1" />-->
            <!--            </div>-->
          </q-tab-panel>

          <!-- TEST SIEROLOGICI -->
          <!-- ---------------- -->
          <q-tab-panel :name="TABS.SEROLOGICAL_LIST" class="no-padding">
            <template v-if="subjectSerologicalTestList.length <= 0">
              <div class="q-pa-md text-body1">
                Il paziente non ha test sierologici
              </div>
            </template>

            <div v-for="(test, index) in subjectSerologicalTestList" :key="test.id">
              <mmg-serological-test-list-item :test="test" class="q-py-md" />
              <q-separator v-if="index < subjectSerologicalTestList.length - 1" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import GesStrutturePageTitle from "components/GesStrutturePageTitle";
import MmgSummaryLabel from "components/mmgComponents/MmgSummaryLabel";
import MmgLabelEmail from "components/mmgComponents/MmgLabelEmail";
import {
  disassociaSoggettoStruttura,
  getEventTypeList,
  getSerologicalTestListExternal,
  getSubjectDetailGesPaz,
  getTestTipoList
} from "src/services/api";
import MmgSwabResultLabel from "components/mmgComponents/MmgSwabResultLabel";
import { notifyError, notifySuccess, sortBy } from "src/services/utils";
import MmgEventListItem from "components/mmgComponents/MmgEventListItem";
import GesStruttureSegnalaSISP from "components/GesStruttureSegnalaSISP";
import MmgSwabListItem from "components/mmgComponents/MmgSwabListItem";
import { TEST_TYPE_CODES } from "src/services/business_logic";
import MmgSerologicalTestListItem from "src/components/mmgComponents/MmgSerologicalTestListItem.vue";
import GesStruttureDialogCreaEvento from "src/components/GesStruttureDialogCreaEvento.vue";
import { TYPES } from "src/store";
import SwabCreateDialog from "../components/SwabCreateDialog";
import { SWAB_MODAL_TYPE } from "../services/business_logic";
import DeleteAssociationStructureDialog from "../components/DeleteAssociationStructureDialog";
import MovimentiDialog from 'src/components/MovimentiDialog.vue';

const SEGNALAZIONE_APERTA = [11, 14];
const SEGNALAZIONE_DA_COMPLETARE = 14;

const TABS = {
  EVENT_LIST: "eventi",
  USCA_REQUEST_LIST: "usca",
  USCA_REQUEST_STANDALONE_LIST: "usca-autonome",
  SWAB_LIST: "tamponi",
  DIARY: "diario",
  DRUG_CONSENT_LIST: "consensi",
  CONTACT_LIST: "contatti",
  SUBJECT_HISTORY: "cronologia",
  ADI_COVID_LIST: "adicovid",
  SEROLOGICAL_LIST: "sierologici"
};

export default {
  name: "PageVisuraDettaglio",
  components: {
    DeleteAssociationStructureDialog,
    SwabCreateDialog,
    MmgSwabListItem,
    GesStruttureSegnalaSISP,
    MmgEventListItem,
    MmgSerologicalTestListItem,
    MmgSwabResultLabel,
    MmgLabelEmail,
    MmgSummaryLabel,
    GesStrutturePageTitle,
    GesStruttureDialogCreaEvento,
    MovimentiDialog
  },
  data() {
    return {
      modalSwabTypeList: SWAB_MODAL_TYPE,
      tab: TABS.EVENT_LIST,
      showTestRapido: false,
      TABS,
      subject: null,
      serologicalTestList: [],
      showSISP: false,
      isSegnalazioneAperta: false,
      isSegnalazioneDaCompletare: false,
      showIntegraSISP: false,
      eventTypeList: [],
      removeFromStructure: false,
      newMovimento: {
        dataFine: null,
        motivazioneSelezionata: '',
        destinazioneSelezionata: '',
        condizioneSelezionata: '',
        note: '',
        flag: false
      },
      dialogRimuoviSoggetto: false,
      isDeleting: false
    };
  },
  computed: {
    idStruttura() {
      return this.$route.params.idStrutturaRes;
    },
    subjectId() {
      return Number(this.$route.params.id);
    },
    subjectSchool() {
      return this.subject?.elencoIstitutiScolastico;
    },
    subjectTaxCode() {
      return this.subject?.codiceFiscale ?? "";
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
    subjectTypeLabel() {
      return this.subject?.tipoSoggetto?.descTipoSoggetto ?? "Cittadino";
    },
    subjectDomicileCity() {
      return this.subject?.comuneDomicilio?.nomeComune ?? "";
    },
    subjectDomicileAddress() {
      return this.subject?.indirizzoDomicilio ?? "";
    },
    subjectDomicileAsl() {
      return this.subject?.aslDomicilio ?? "";
    },
    subjectDomicileFull() {
      const address = this.subjectDomicileAddress;
      const city = this.subjectDomicileCity;
      const asl = this.subjectDomicileAsl ? `(${this.subjectDomicileAsl})` : "";

      return [address, city, asl].filter(el => !!el).join(", ");
    },
    subjectResidenceCity() {
      return this.subject?.comuneResidenza?.nomeComune ?? "";
    },
    subjectResidenceAsl() {
      return this.subject?.aslResidenza ?? "";
    },
    subjectResidenceFull() {
      const city = this.subjectResidenceCity;
      const asl = this.subjectResidenceAsl
        ? `(${this.subjectResidenceAsl})`
        : "";

      return [city, asl].filter(el => !!el).join(", ");
    },
    subjectPhoneNumber() {
      return this.subject?.telefonoRecapito ?? "-";
    },
    subjectEmail() {
      return this.subject?.email ?? "-";
    },
    subjectBirthDate() {
      return this.subject?.dataNascita;
    },
    subjectEventList() {
      return this.subject?.elencoDecorso ?? [];
    },
    subjectEventListSorted() {
      return sortBy(this.subjectEventList, "dataEvento", true, true);
    },
    subjectEventLast() {
      return this.subjectEventListSorted[0];
    },
    subjectEventLastTypeLabel() {
      return this.subjectEventLast?.decodeTipoEvento?.descTipoEvento;
    },
    subjectEventLastDate() {
      return this.subjectEventLast?.dataDimissioni;
    },
    subjectSwabLast() {
      return this.subjectSwabList[0];
    },
    subjectDiary() {
      return this.diaryList?.[0] ?? {};
    },
    subjectDiaryPages() {
      return this.subjectDiary?.dettagli ?? [];
    },
    subjectDiaryPagesSorted() {
      return sortBy(this.subjectDiaryPages, "data", true, true);
    },
    uscaRequestListSorted() {
      const requestList = this.uscaRequestList.filter(
        r => r.richiestaMmg !== false
      );
      return sortBy(requestList, "data", true, true);
    },
    uscaRequestLast() {
      return this.uscaRequestListSorted[0];
    },
    uscaRequestStandaloneList() {
      return this.uscaRequestList.filter(r => r.richiestaMmg === false);
    },
    uscaRequestStandaloneListSorted() {
      return sortBy(this.uscaRequestStandaloneList, "data", true, true);
    },
    canCreateEvent() {
      return this.subjectEventList.length <= 0;
    },
    subjectContactListFrom() {
      return this.subject?.elencoContattiDa ?? [];
    },
    subjectContactListTo() {
      return this.subject?.elencoContattiA ?? [];
    },
    subjectContactList() {
      return [...this.subjectContactListFrom, ...this.subjectContactListTo];
    },
    subjectContactListSorted() {
      return sortBy(this.subjectContactList, "dataCreazione", true, true);
    },
    subjectAdiCovidList() {
      return this.subjectDiaryPages.map(p => p.adicovid).filter(a => !!a);
    },
    subjectAdiCovidListSorted() {
      return sortBy(this.subjectAdiCovidList, "dataAdiCovidInizio", true, true);
    },
    hasOpenAdiCovid() {
      // Un ADI COVID Ã¨ da considerarsi "aperto" quando non ha ancora la data fine
      return this.subjectAdiCovidList.some(a => !a.dataAdiCovidFine);
    },
    subjectSerologicalTestList() {
      return this.serologicalTestList.filter(
        test => test.testTipo.testTipoCod === TEST_TYPE_CODES.SIEROLOGICO
      );
    },
    subjectSwabList() {
      const swabList = [];

      if (this.subject && this.subject?.elencoTampone !== null) {
        for (const swab of this.subject.elencoTampone ?? []) {
          swab.batch = true;
          swab.testRichiestaDesc = this.testTipoList?.find(
            testTipo => testTipo.testRichiestaTipoId === swab.testRichiestaTipoId
          );

          swabList.push(swab);
        }
      }
      if (this.subject?.serologicalTestList !== null) {
        for (const swab of this.serologicalTestList) {
          if (swab.testTipo.testTipoCod !== TEST_TYPE_CODES.SIEROLOGICO) {
            swabList.push(swab);
          }
        }
      }
      if (swabList?.length > 0) {
        swabList.sort((a, b) => {
          const dateA = a.dataTest || a.testDataEsecuzione;
          const dateB = b.dataTest || b.testDataEsecuzione;

          return dateB - dateA;
        });
      }
      return swabList;
    },
    batchedSwabList() {
      return this.subjectSwabList.filter(swab => swab.batch);
    },
    nonBatchedSwabList() {
      return this.subjectSwabList.filter(swab => !swab.batch);
    },
    subjectSwabLastCode() {
      return (
        this.subjectSwabLast?.risTampone?.idRisTamp ||
        this.subjectSwabLast?.testEsito?.testEsitoCod
      );
    },
    subjectSwabLastDate() {
      return (
        this.subjectSwabLast?.dataTest ||
        this.subjectSwabLast?.testDataEsecuzione
      );
    },
    isSubjectPhoneValid() {
      if (this.subject?.telefonoValidato) {
        return true;
      }
      return false;
    },
    validatorType() {
      if (this.subject?.telefonoValidato) {
        if (this.subject.fonteValidazione === "OPERATORE") {
          return "da operatore";
        }
        if (this.subject.fonteValidazione === "CITTADINO") {
          return "da cittadino";
        }
        if (this.subject.fonteValidazione === "CITTADINO_DELEGATO") {
          return "da cittadino delegato";
        }
      }
      return "";
    },
    selectedStructure() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE]?.elencoStrutturaArea?.find(
        strutt => strutt.idStruttura === this.$route.params.idStrutturaRes
      );
    }
  },
  methods: {
    openDialogRimuovi() {
      this.dialogRimuoviSoggetto = true;
    },
    async removeFromStructureMethod() {
      this.isDeleting = true;
      // this.newMovimento = {
      //   dataFine: null,
      //   motivazioneSelezionata: null,
      //   destinazioneSelezionata: null,
      //   condizioneSelezionata: null,
      //   note: '',
      //   flag: false
      // };
      // this.removeFromStructure = true;
      let payload = {};
      try {
        let promise = await disassociaSoggettoStruttura(
          this.subject.idSoggetto,
          this.$route.params.idStrutturaRes,
          payload
        );
        notifySuccess("Soggetto rimosso dalla struttura");
        // this.$emit("deletedAssociation");
        this.$router.back();
      } catch (e) {
        let message =
          "Non Ã¨ stato possibile rimuovere il soggetto dalla struttura";
        notifyError(e, message);
      }
      this.isDeleting = false;
      this.dialogRimuoviSoggetto = false;
    },
    onDeletedAssociation() {
      this.onBack();
    },
    openEventDialog(event) {
      this.$refs.dialogCreaEvento.openDialog(event, this.selectedStructure);
    },
    aggiornaTamp() {
      //const t = this

      // eslint-disable-next-line no-unused-expressions
      this.loadSubjectDetail();

      this.showTestRapido = false;
      this.tab = TABS.SWAB_LIST;
    },
    aggiornaSisp() {
      const t = this;
      window.setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        t.loadSubjectDetail();
      }, 2);
      this.showIntegraSISP = false;
      this.showSISP = false;
      this.tab = TABS.EVENT_LIST;
    },
    updateAuraSearchTaxCode(val) {
      this.auraSearchTaxCode = val?.toUpperCase() ?? "";
    },
    onBack() {
      this.$router.back();
    },
    async loadEventTypeList() {
      try {
        const { data } = await getEventTypeList();

        this.eventTypeList = data.filter(eventType => {
          return (
            eventType.descTipoEvento === "Ricoverato" ||
            eventType.descTipoEvento === "Trasferito esterno struttura" ||
            eventType.descTipoEvento === "Deceduto" ||
            eventType.descTipoEvento === "Dimesso"
          );
        });
      } catch (e) {
        notifyError("Impossibile caricare la lista dei decorsi");
        console.log(e);
      }
    },

    onEventDateUpdated() {
      this.loadSubjectDetail();
      this.tab = TABS.EVENT_LIST;
    },
    async loadSubjectDetail() {
      try {
        this.isSegnalazioneAperta = false;
        this.isSegnalazioneDaCompletare = false;
        const response = await getSubjectDetailGesPaz(this.$route.params.id);

        this.subject = response?.data;
        this.serologicalTestList = response?.data?.elencoSierologici ?? [];

        SEGNALAZIONE_APERTA.forEach(item => {
          if (this.subject?.elencoDecorso &&
            this.subject?.elencoDecorso[0]?.decodeTipoEvento.idTipoEvento === item
          ) {
            this.isSegnalazioneAperta = true;
          }
        });
        if (
          this.subject?.elencoDecorso &&
          this.subject?.elencoDecorso[0]?.decodeTipoEvento.idTipoEvento ===
          SEGNALAZIONE_DA_COMPLETARE
        ) {
          this.isSegnalazioneDaCompletare = true;
        }

        this.serologicalTestList.sort(function (a, b) {
          if (a.testDataEsecuzione > b.testDataEsecuzione) {
            return -1;
          }
          if (a.testDataEsecuzione < b.testDataEsecuzione) {
            return 1;
          }
          return 0;
        });

        if (this.subject && this.subject.elencoTampone && this.subject.elencoTampone.length > 0) {
          this.subject.elencoTampone.sort((a, b) => {
            if (a.dataInserimentoRichiesta > b.dataInserimentoRichiesta) {
              return -1;
            }
            if (a.dataInserimentoRichiesta < b.dataInserimentoRichiesta) {
              return 1;
            }
            return 0;
          });
        }
        return this.subject;
      } catch (err) {
        notifyError(err, "Non Ã¨ stato possibile ottenere i dati del paziente");
      }
    },
    async loadTestRichiestaTipo() {
      try {
        const { data: testRichiestaTipo } = await getTestTipoList();

        this.testTipoList = testRichiestaTipo;
      } catch (e) {
        console.log(e);
      }
    }
  },
  async created() {
    /* const { data } = await getSubjectDetailGesPaz(this.$route.params.id)
    this.subjectBirthDate = data.dataNascita
    this.subjectFullName = data.nome + ' ' + data.cognome
    this.subjectTaxCode = data.codiceFiscale
    this.phoneNumber = data.telefonoRecapito
    this.subjectEmail = data.email
    this.subjectDomicileFull = data.comuneDomicilioDesc + '(ASL: ' + data.aslaslDomicilio + ')'
    this.subjectResidenceFull = data.comuneResidenza.nomeComune + '(ASL: ' + data.aslaslResidenza + ')'
    this.subjectSwabLastDate = data.elencoTampone[0].dataTest
    this.subjectSwabLastCode = data.elencoTampone[0].idTampone */
    this.$root.$emit("titolo-res");
    const detailPromise = this.loadSubjectDetail();
    const testRichiestaTipoPromise = this.loadTestRichiestaTipo();
    const eventTypeListPromise = this.loadEventTypeList();


    await detailPromise;
    await testRichiestaTipoPromise;
    await eventTypeListPromise;
  }
};
</script>

<style scoped></style>

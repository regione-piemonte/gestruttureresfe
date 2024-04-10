<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <ges-strutture-page-title @back="onBack">
          Dettaglio ospite
        </ges-strutture-page-title>
      </div>
    </div>

    <!-- NUOVA VISUALIZZAZIONE PAZIENTE -->
    <q-card class="q-mt-lg">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-x-xl">
          <!-- PAZIENTE -->
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
            <div class="row q-col-gutter-md bg-grey-2 no-margin q-pb-xl q-pt-lg">
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
              <div class="col-12 col-md" v-if="this.condizioneDesc !== ''">
                <mmg-summary-label caption>
                  Condizione
                </mmg-summary-label>
                <mmg-summary-label caption bold>
                  {{ condizioneDesc }}
                </mmg-summary-label>
                <mmg-summary-label caption bold>
                  {{ condizioneData | date }}
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
      <!-- TABS -->
      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" align="left">
          <!-- <q-tab :name="TABS.LISTA_MOVIMENTI" label="Movimenti" /> -->
          <q-tab :name="TABS.RENDICONTAZIONE" label="Rendicontazione" />
        </q-tabs>
      </q-card-section>
      <q-card-section class="no-padding bg-white">
        <q-tab-panels v-model="tab" animated>
          <!-- MOVIMENTI -->
          <!-- <q-tab-panel :name="TABS.LISTA_MOVIMENTI" class="no-padding">
            <template v-if="subjectMovimentiList.length <= 0">
              <div class="q-pa-md text-body1">
                Il paziente non ha ancora movimenti
              </div>
            </template>

            <template v-else>
              <q-table :columns="columnsMovimenti" :data="subjectMovimentiList" row-key="data_Movimento"
                :loading="tableLoadingMovimenti" :rows-per-page-options="tablePageOptionsMovimenti">
                <template v-slot:body-cell-dataMovimento="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.dataMovimento | date }}</div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-tipoMovimento="props">
                  <q-td :props="props">
                    <div>
                      <div
                        v-if="props.row.covidrsaDTipoMovOspite.flgIngresso && !props.row.covidrsaDTipoMovOspite.flgUscita">
                        <q-icon flat color="primary q-bar--standard" name="login" />
                      </div>
                      <div
                        v-if="!props.row.covidrsaDTipoMovOspite.flgIngresso && props.row.covidrsaDTipoMovOspite.flgUscita">
                        <q-icon flat color="primary q-bar--standard" name="logout" />
                      </div>
                      <div
                        v-if="!props.row.covidrsaDTipoMovOspite.flgIngresso && !props.row.covidrsaDTipoMovOspite.flgUscita">
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-descrizioneMovimento="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.covidrsaDTipoMovOspite.tipoMovOspiteDesc }}</div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-nomeStruttura="props">
                  <q-td :props="props">
                    <div>
                      <div v-if="props.row.strutturaOd">{{ props.row.strutturaOd.nome | emptyString }}</div>
                      <div v-else> - </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-condizioneMovimento="props">
                  <q-td :props="props">
                    <div>
                      <div v-if="props.row.covidrsaDCondizioniOspite">{{
                        props.row.covidrsaDCondizioniOspite.condizioniOspiteDesc | emptyString }}</div>
                      <div v-else> - </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-preservaPosto="props">
                  <q-td :props="props">
                    <div>

                      <q-checkbox name="predefinito" v-model="props.row.flgPreservaPosto" disable />

                    </div>
                  </q-td>
                </template> -->
          <!-- Bottone elimina -->
          <!-- <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div>
                      <q-btn flat color="red" icon="delete" @click="onClickDelete(props.row)" />
                    </div>
                  </q-td>
                </template>

              </q-table>
            </template>
          </q-tab-panel> -->

          <!-- RENDICONTAZIONE -->
          <q-tab-panel v-if="subject !== null" :name="TABS.RENDICONTAZIONE" class="no-padding">
            <template v-if="subjectRendicontazioneList.length <= 0">
              <div class="q-pa-md text-body1">
                Il paziente non ha ancora rendicontazione
              </div>
            </template>
            <template v-else>
              <q-table :columns="columnsRendicontazioni" :data="subjectRendicontazioneList" row-key="rendicontazioneId"
                :rows-per-page-options="tablePageOptionsMovimenti" :loading="tableLoadingRendicontazioni">
                <!-- :selected-rows-label="getSelectedString"
                selection="multiple" :selected.sync="selected"  -->
                <template v-slot:body-cell-data_rendicontazione="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.dataRendicontazione | dateMonthYear }}</div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-stato_rendicontazione="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.covidrsaDStatoRendicontazione.statoRendDesc }}</div>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-importo_retta="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.importoRetta | formatNumber }} &euro;</div>
                    </div>
                  </q-td>
                </template>
                <!-- <template v-slot:body-cell-importo_extra="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.importoExtra | formatNumber }} &euro;</div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-importo_sconto="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.importoSconto | formatNumber }} &euro;</div>
                    </div>
                  </q-td>
                </template> -->
                <!-- <template v-slot:header-cell-gg_assenza_presenza="props">
                  <q-th :props="props">
                    {{ props.col.label }}
                    <q-icon color="primary" name="info" size="1.5em"
                      title="Giorni rispettvamente di Assenza e di Presenza, all'interno della struttura" />
                  </q-th>
                </template>
                <template v-slot:body-cell-gg_assenza_presenza="props">
                  <q-td :props="props">
                    <div>
                      <div>{{ props.row.ggAssenza }}/{{ props.row.ggPresenza }}</div>
                    </div>
                  </q-td>
                </template> -->
                <!-- Bottoni modifica ed elimina -->
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div>
                      <template v-if="props.row.covidrsaDStatoRendicontazione.flgModificabile !== false">
                        <q-btn flat color="primary" icon="edit" @click="OnClickUpdate(props.row)"
                          :disable="props.row.covidrsaDStatoRendicontazione.flgModificabile === false" />
                      </template>
                      <template v-else>
                        <q-btn flat color="primary" icon="visibility" @click="OnClickUpdate(props.row)" />
                      </template>
                      <q-btn flat color="primary" icon="attach_file" @click="OnClickFiles(props.row)"
                        :disable="props.row.files.length <= 0" :title="showTitle(props.row)" />
                    </div>
                  </q-td>
                </template>
              </q-table>
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <dialog-modifica-rendicontazione :title="titolo" :subjectUpdate="rendicontazioneModifica"
      :showDialog.sync="showDialogModifica" @hide="hideDialogModificaRendicontazione()"
      @updateRendicontazione="updateRendicontazione()" :fasciaLocale="fasciaSelezionata"
      :condizioneLocale="condizioneSelezionata" :contoLocale="contoSelezionato" :dataCondizione="dataCondizione"
      :radioChoice="radioChoiceTx" :note="note" @cambioStato="cambioStato()"></dialog-modifica-rendicontazione>

    <!-- DIALOG SHOW FILES RENDICONTAZIONE -->
    <template v-if="showDialogFilesRendicontazione">
      <q-dialog v-model="showDialogFilesRendicontazione">
        <q-card class="full-width">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>Lista files rendicontazione</q-toolbar-title>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-toolbar>
          </q-card-section>
          <q-separator />
          <q-card-section>
            Rendicontazione del soggetto <strong>{{ getSoggettoRendicontazione }}</strong> effettuata in data <strong>{{
              getDataRendicontazione | dateMonthYear }}</strong>
          </q-card-section>
          <q-card-section>
            <div class="row col-md-12">
              <div class="col-md-12">
                <q-table :columns="columsFiles" :data="files" row-key="rendicontazioneFileId" hide-bottom>
                  <template v-slot:body-cell-data_creazione="props">
                    <q-td :props="props">
                      <div>
                        <div>{{ props.row.dataCreazione | date }}</div>
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-file_name="props">
                    <q-td :props="props">
                      <div>
                        <div><strong>{{ props.row.fileToBeSaved.filename }}</strong></div>
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                      <div>
                        <q-btn flat color="primary" icon="attach_file" @click="openFile(props.row)" />
                        <q-tooltip>Apri il file</q-tooltip>
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

    <!-- Dialog elimina movimento -->
    <!-- <template v-if="showDialogDeleteMovimento">
      <q-dialog v-model="showDialogDeleteMovimento">
        <q-card class="full-width">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>Elimina movimento</q-toolbar-title>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-toolbar>
          </q-card-section>
          <q-separator />
          <q-card-section>
            Desideri rimuovere il movimento in data <strong>{{ movimentoRow.dataMovimento | dateComplete }}</strong> con
            descrizione <strong>{{ movimentoRow.covidrsaDTipoMovOspite.tipoMovOspiteDesc }}</strong> dall'ospite
            <strong>{{
              subjectFullName | emptyString }}</strong>?
          </q-card-section> -->
    <!-- CONFERMA E SALVA -->
    <!-- <q-card-section class="text-right">
            <div class="row  q-col-gutter-md reverse">
              <div class="col-md-auto col-12">
                <q-btn color="negative" class="full-width" @click="onDelete()">Rimuovi</q-btn>
              </div>
              <div class="col-md-auto col-12">
                <q-btn color="primary" outline v-close-popup class="full-width">Indietro</q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template> -->

    <!-- <div class="row items-center q-mt-sm q-col-gutter-md q-pb-md">
      <div class="col-auto q-ml-auto">
        <q-banner class="text-white bg-red " dense rounded
          v-if="disableCambiaStato && showBanner && (subjectRendicontazioneList.length > 0)">
          {{ tooltipMessage }}
        </q-banner>
      </div> -->
      <!-- <div class="col-auto q-ml-auto" v-if="tab === this.TABS.LISTA_MOVIMENTI">
        <q-btn color="primary" @click="showDialogNuovoMovimento()">
          Nuovo movimento
        </q-btn>
      </div> -->
      <!-- <div class="col-auto q-ml-auto" v-if="tab === this.TABS.RENDICONTAZIONE">
        <q-btn-dropdown color="secondary" label="Cambia stato" :disable="disableCambiaStato">
          <q-list> -->
            <!-- <q-item clickable v-close-popup @click="onUpdate()" :loading="isSaving">
              <q-item-section>
                <q-item-label>Salva in bozza</q-item-label>
              </q-item-section>
            </q-item> -->
            <!-- <div v-for="(stato, i) in returnListaStatiRend" :key="i">
              <q-item clickable v-close-popup @click="openDialogConferma(stato)">
                <q-item-section>
                  <q-item-label>Salva come: {{ stato.statoRendDesc }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list> -->
          <!-- LASCIARE il tooltip cosÃ¬, sennÃ² l'evento sul btn non funziona -->
          <!-- <q-tooltip v-model="showBanner" anchor="bottom left" v-if="disableCambiaStato" content-class="bg-white"> -->
            <!-- {{ tooltipMessage }} -->
          <!-- </q-tooltip>
        </q-btn-dropdown>
      </div> -->
    <!-- </div> -->
    <!-- <movimenti-dialog v-model="dialogNuovoMovimento" :subject="subject" :idStrutturaRes="strutturaSelezionata.idStruttura"
      :title="'Inserimento nuovo movimento'" :tipologia="'NEW_MOVIMENTO'" @newMovimento="onNewMovimento()"
      :newMovimento="newMovimento">
    </movimenti-dialog> -->
    <!-- <dialog-cambia-stato-rendicontazione :showDialog="showDialogCambiaStato" :title="'Cambia stato rendicontazione'"
      :rendicontazioneToUpdate="rendicontazioneObject" @hide="showDialogCambiaStato = false" @cambioStato="cambioStato()">
    </dialog-cambia-stato-rendicontazione> -->
    <!-- Dialog conferma per cambio di stato della rendicontazione -->
    <q-dialog v-model="showDialogConfermaCambioStato" @hide="onHide()">
      <q-card class="full-width">
        <q-card-section class="q-py-none">
          <q-toolbar class="q-px-none">
            <q-toolbar-title>Cambio stato rendicontazione</q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-toolbar>
        </q-card-section>
        <q-separator />
        <q-card-section>
          Attenzione proseguendo con il salvataggio la rendicontaizione non potrÃ  piÃ¹ essere modificata. I documenti
          verranno trasmessi a Finpiemonte al termine del trimestre di rendicontazione corrente
        </q-card-section>

        <!-- CONFERMA E SALVA -->
        <q-card-section class="text-right">
          <div class="row  q-col-gutter-md reverse">
            <div class="col-md-auto col-12">
              <q-btn color="primary" class="full-width" :loading="isSaving" @click="cambiaStato()">CONFERMA</q-btn>
            </div>
            <div class="col-md-auto col-12">
              <q-btn color="primary" outline v-close-popup class="full-width">INDIETRO</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import GesStrutturePageTitle from "components/GesStrutturePageTitle";
import MmgSummaryLabel from "components/mmgComponents/MmgSummaryLabel";
import MmgLabelEmail from "components/mmgComponents/MmgLabelEmail";
import {
  getContiStrutturaRendicontazione,
  getEventTypeList,
  getFile,
  getListFile,
  getSerologicalTestListExternal,
  getStatiRendicontazione,
  getStrutturaWelfareFasce,
  getSubjectDetailGesPaz,
  getTestTipoList,
  postRemoveMovimentoOspite,
  postStatiRendicontazione
} from "src/services/api";
import DeleteAssociationStructureDialog from 'src/components/DeleteAssociationStructureDialog.vue';
import { TYPES } from 'src/store';
import { notifyError, notifySuccess, sortBy } from 'src/services/utils';
import MmgSwabResultLabel from 'src/components/mmgComponents/MmgSwabResultLabel.vue';
import MovimentiDialog from 'src/components/MovimentiDialog.vue';
import DialogModificaRendicontazione from 'src/components/GestioneRsa/Dialogs/DialogModificaRendicontazione.vue';
import DialogCambiaStatoRendicontazione from 'src/components/GestioneRsa/Dialogs/DialogCambiaStatoRendicontazione.vue';



const SEGNALAZIONE_APERTA = [11, 14];
const SEGNALAZIONE_DA_COMPLETARE = 14;

const TABS = {
  LISTA_MOVIMENTI: "movimenti",
  RENDICONTAZIONE: "rendicontazione",
};

export default {
  name: "PageDettaglioOspiteBuono",
  components: {
    DeleteAssociationStructureDialog,
    GesStrutturePageTitle,
    MmgSummaryLabel,
    MmgLabelEmail,
    MmgSwabResultLabel,
    MovimentiDialog,
    DialogModificaRendicontazione,
    DialogCambiaStatoRendicontazione,
  },
  data() {
    return {
      tab: TABS.RENDICONTAZIONE,
      TABS,
      subject: null,
      profile: null,
      serologicalTestList: [],
      removeFromStructure: false,
      selected: [],
      // columnsMovimenti: [
      //   {
      //     name: 'dataMovimento',
      //     field: 'dataMovimento',
      //     label: 'Data Movimento',
      //     required: true,
      //     sortable: true,
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: 'tipoMovimento',
      //     field: 'tipoMovimento',
      //     label: 'Tipo Movimento',
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: 'descrizioneMovimento',
      //     field: 'descrizioneMovimento',
      //     label: 'Descrizione Movimento',
      //     required: true,
      //     sortable: true,
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: 'nomeStruttura',
      //     field: 'struttura',
      //     label: 'Struttura',
      //     required: true,
      //     sortable: true,
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: 'condizioneMovimento',
      //     field: 'condizioneMovimento',
      //     label: 'Condizione',
      //     required: true,
      //     sortable: true,
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: 'preservaPosto',
      //     field: 'preservaPosto',
      //     label: 'Preserva Posto',
      //     align: 'left',
      //     headerClasses: 'text-bold'
      //   },
      //   {
      //     name: "action",
      //     label: 'Azioni',
      //     align: "left",
      //     field: "action",
      //     required: false,
      //     sortable: false,
      //     headerClasses: 'text-bold'
      //   }
      // ],
      columnsRendicontazioni: [
        { name: 'selection', required: true, align: 'left', },
        {
          name: 'data_rendicontazione',
          field: 'dataRendicontazione',
          label: 'Data Rendicontazione',
          required: true,
          sortable: true,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'stato_rendicontazione',
          field: 'statoRendicontazione',
          label: 'Stato Rendicontazione',
          required: true,
          sortable: true,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'importo_retta',
          field: 'importoRetta',
          label: 'Importo Fattura',
          required: true,
          sortable: true,
          align: 'left',
          headerClasses: 'text-bold'
        },
        // {
        //   name: 'importo_extra',
        //   field: 'importoExtra',
        //   label: 'Importo Extra',
        //   required: true,
        //   sortable: true,
        //   align: 'left',
        //   headerClasses: 'text-bold'
        // },
        // {
        //   name: 'importo_sconto',
        //   field: 'importoSconto',
        //   label: 'Importo Sconto',
        //   required: true,
        //   sortable: true,
        //   align: 'left',
        //   headerClasses: 'text-bold'
        // },
        // {
        //   name: 'gg_assenza_presenza',
        //   field: 'ggAssenzaPresenza',
        //   label: 'Giorni A/P',
        //   required: true,
        //   sortable: true,
        //   align: 'left',
        //   headerClasses: 'text-bold'
        // },
        {
          name: "action",
          label: 'Azioni',
          align: "center",
          field: "action",
          required: false,
          sortable: false,
          headerClasses: 'text-bold'
        }
      ],
      columsFiles: [
        {
          name: "data_creazione",
          field: "dataCreazione",
          label: 'Data Crezione',
          align: "left",
          required: false,
          sortable: false,
          headerClasses: 'text-bold'
        },
        {
          name: "file_name",
          field: "filename",
          label: 'Nome file',
          align: "left",
          required: false,
          sortable: false,
          headerClasses: 'text-bold'
        },
        {
          name: "action",
          label: 'Azioni',
          align: "center",
          field: "action",
          required: false,
          sortable: false,
          headerClasses: 'text-bold'
        },
      ],
      tablePageOptionsMovimenti: [0], // modo 1
      tableLoadingMovimenti: false,
      // showDialogDeleteMovimento: false,
      // movimentoRow: null,
      // newMovimento: {
      //   dataFine: null,
      //   motivazioneSelezionata: '',
      //   destinazioneSelezionata: '',
      //   condizioneSelezionata: '',
      //   note: '',
      //   flag: false
      // },
      // dialogNuovoMovimento: false,
      tableLoadingRendicontazioni: false,
      showDialogModifica: false,
      rendicontazioneModifica: {},
      showDialogCambiaStato: false,
      rendicontazioneObject: [],
      showDialogFilesRendicontazione: false,
      rendicontazioneSoggettoForFile: '',
      rendicontazioneDataForFile: '',
      showTooltip: false,
      tooltipMessage: '',
      filesList: [],
      listaStatiRendicontazione: [],
      showBanner: false,
      contoSelezionato: null,
      fasciaSelezionata: null,
      condizioneSelezionata: null,
      dataCondizione: '',
      fasce: [],
      listaContiStruttura: [],
      radioChoiceTx: '',
      note: '',
      condizioneDesc: '',
      condizioneData: '',
      filesPrimoIngresso: [],
      filesOspiteInStruttura: [],
      isSaving: false,
      showDialogConfermaCambioStato: false,
      statoSwap: null,
      titolo: 'Modifica rendicontazione'
    };
  },
  computed: {
    strutturaSelezionata() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE];
    },
    subjectSchool() {
      return this.sogget?.elencoIstitutiScolastico;
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
    subjectMovimentiList() {
      return this.subject?.elencoMovimentoOspite ?? [];
    },
    subjectMovimentiListSorted() {
      return sortBy(this.subjectMovimentiList, "dataMovimento", true, true);
    },
    subjectRendicontazioneList() {
      return this.subject?.elencoRendicontazione ?? [];
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
    soggetto() {
      return this.$store.getters['getSoggettoSelezionato'];
    },
    getSoggettoRendicontazione() {
      return this.rendicontazioneSoggettoForFile ?? '';
    },
    getDataRendicontazione() {
      return this.rendicontazioneDataForFile ?? '';
    },
    disableCambiaStato() {
      let flag = false;
      // Deve essere selezionata almeno una rendicontazione
      if (this.selected.length <= 0) {
        this.tooltipMessage = 'Devi selezionare almeno una rendicontazione!';
        flag = true;
      }
      else {
        // Le rendicontazioni devono essere tutte nello stesso stato
        const tipoRendicontazioni = this.selected.map((e) => e.statoRendId);
        if (tipoRendicontazioni.length === 0) {
          this.tooltipMessage = 'Devi selezionare almeno una rendicontazione!';
          flag = true;
        } else {
          if (!(tipoRendicontazioni.every((element) => element === tipoRendicontazioni[0]))) {
            this.tooltipMessage = 'Devi selezionare rendicontazioni nello stesso stato!';
            flag = true;
            return flag;
          }
        }
        // controllo il se il profilo Ã¨ RSA
        if (this.profile.nomeProfilo === "RSA" && this.profile != null && this.profile != undefined) {
          // Controllo se lo stato Ã¨ modificabile dall'RSA
          for (let i = 0; i < this.selected.length; i++) {
            let statoRendicontazioneId = this.selected[i].statoRendId;
            let oggettoStatoRendicontazione = this.listaStatiRendicontazione.filter((e) => e.statoRendId === statoRendicontazioneId);
            // Ha workflow?
            if (oggettoStatoRendicontazione[0].workflowRendicontazione.length > 0) {
              for (let index = 0; index < oggettoStatoRendicontazione[0].workflowRendicontazione.length; index++) {
                if (oggettoStatoRendicontazione[0].workflowRendicontazione[index].flgStruttura == false) {
                  this.tooltipMessage = 'Lo stato della rendicontazione non Ã¨ modificabile dalla struttura!';
                  flag = true;
                  return flag;
                }
              }
            } else {
              this.tooltipMessage = 'Non esistono stati in cui puÃ² essere modificata la rendicontazione!';
              flag = true;
              return flag;
            }
          }
        }
        // Controllo se le rendicontazioni hanno i file obbligatori
        // altrimento non Ã¨ possibile carmbiargli stato
        // let listaFileNonObbligatori = this.filesList.filter((e) => e.fileTipoObbligatorio == false);
        // let listaFileObbligatori = this.filesList.filter((e) => e.fileTipoObbligatorio == true);
        // let listaFilesRendicontazione = [];
        // for (let index = 0; index < this.selected.length; index++) {
        //   listaFilesRendicontazione = this.selected[index].files;
        //   if (listaFilesRendicontazione.length === 0) {
        //     this.tooltipMessage = 'La rendicontazione non ha i file obbligatori!';
        //     flag = true;
        //     return flag;
        //   }
        //   for (let j = 0; j < listaFilesRendicontazione.length; j++) {
        //     //Se file non obbligatori
        //     let counterNonObbligatori = 0;
        //     for (let k = 0; k < listaFileNonObbligatori.length; k++) {
        //       if (listaFileNonObbligatori[k].fileTipoId === listaFilesRendicontazione[j].fileTipoId) {
        //         flag = false;
        //       }
        //     }
        //     if (!flag) {
        //       continue;
        //     }
        //     //Se file obbligatori
        //     let counter = 0;
        //     for (let k = 0; k < listaFileObbligatori.length; k++) {
        //       if (listaFileObbligatori[k].fileTipoId === listaFilesRendicontazione[j].fileTipoId) {
        //         counter++;
        //       }
        //     }
        //     if (counter !== listaFileObbligatori.length - 1) {
        //       this.tooltipMessage = 'La rendicontazione non ha i file obbligatori!';
        //       flag = true;
        //       return flag;
        //     }
        //   }
        // }
      }
      return flag;
    },
    returnListaStatiRend() {
      this.getListaStatiRendicontazioneForChange();
      return this.listaStatiRendicontazioneForUpdate ? this.listaStatiRendicontazioneForUpdate : null;
    },
  },
  methods: {
    // CAMBIA STATO
    openDialogConferma(stato) {
      this.showDialogConfermaCambioStato = true;
      this.statoSwap = stato;
    },
    onHide() {
      this.showDialogConfermaCambioStato = false;
    },
    async cambiaStato() {
      this.isSaving = true;
      try {
        const oldStato = this.selected[0].statoRendId;
        let rendicontazioniId = [];
        for (let index = 0; index < this.selected.length; index++) {
          rendicontazioniId.push(this.selected[index].rendicontazioneId);
        }
        let payload = {
          oldStato: oldStato,
          newStato: this.statoSwap.statoRendId,
          rendicontazioniId: rendicontazioniId
        }
        await postStatiRendicontazione(payload);
        this.showDialogConfermaCambioStato = false;
        this.cambioStatoUpdate();
        notifySuccess("Stato della rendicontazione modificato con successo");
      } catch (e) {
        let message =
          "Non Ã¨ stato possibile modificare lo stato della rendicontazione";
        notifyError(e, message);
      }
      this.isSaving = false;
      this.showDialogLocale = false;
    },
    getListaStatiRendicontazioneForChange() {
      this.listaStatoSelezionato = '';
      if (this.selected.length > 0) {
        // Ottengo l'oggetto statoRendicontazione con all'interno il suo flow
        let statoRendicontazioneIdIn = this.selected[0].statoRendId;
        let statoRendicontazione = this.listaStatiRendicontazione.filter(f => f.statoRendId == statoRendicontazioneIdIn);
        // Check flgStruttura=true, Ã¨ un cambia stato che puÃ² effettuare la struttura?
        let forStruttura = [];
        statoRendicontazione[0]?.workflowRendicontazione.forEach(element => {
          if (element.flgStruttura) {
            forStruttura.push(element);
          }
        });
        // Cerco stati associati a quelli possibili
        let statiPossibili = [];
        forStruttura.forEach(element => {
          this.listaStatiRendicontazione.forEach(e => {
            if (element.statoRendIdNew == e.statoRendId) {
              statiPossibili.push(e);
            }
          });
        });
        this.listaStatiRendicontazioneForUpdate = [...statiPossibili];
      }
      // return this.listaStatiRendicontazione ?? null;
    },
    // -------------------------------------------------------------------------------------------------------------------------
    // MOVIMENTI
    // showDialogNuovoMovimento() {
    //   this.newMovimento = {
    //     dataFine: null,
    //     motivazioneSelezionata: null,
    //     destinazioneSelezionata: null,
    //     condizioneSelezionata: null,
    //     note: '',
    //     flag: false
    //   };
    //   this.dialogNuovoMovimento = true;
    // },
    // onClickDelete(row) {
    //   this.movimentoRow = row;
    //   this.showDialogDeleteMovimento = true;
    // },
    // async onDelete() {
    //   try {
    //     let payload = {
    //       movimentoOspiteId: this.movimentoRow.movimentoOspiteId
    //     };
    //     await postRemoveMovimentoOspite(payload);
    //     this.showDialogDeleteMovimento = false;
    //     notifySuccess("Movimento dell'ospite rimosso con successo");
    //     this.loadSubjectDetail();
    //   } catch (err) {
    //     notifyError(
    //       err,
    //       "Si Ã¨ verificato un errore durante l'eliminazione del movimento"
    //     );
    //   }
    //   this.tableLoading = false;
    // },
    // onNewMovimento() {
    //   this.dialogNuovoMovimento = false;
    //   this.loadSubjectDetail();
    // },
    // ALTRO
    onDeletedAssociation() {
      this.onBack();
    },
    openEventDialog(event) {
      this.$refs.dialogCreaEvento.openDialog(event, this.selectedStructure);
    },
    updateAuraSearchTaxCode(val) {
      this.auraSearchTaxCode = val?.toUpperCase() ?? "";
    },
    onBack() {
      this.$store.dispatch("setSoggettoSelezionato", { soggettoSelezionato: null });
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
      this.tab = TABS.LISTA_MOVIMENTI;
    },
    async loadSubjectDetail() {
      try {
        this.tableLoadingMovimenti = true;
        const response = await getSubjectDetailGesPaz(this.soggetto.idSoggetto);
        this.subject = response?.data;
        // for (let m of this.subject.elencoMovimentoOspite) {
        //   m.dataMovimento = new Date(m.dataMovimento);
        // }
        if (this.subject.ultimoMovimento) {
          this.condizioneDesc = this.subject.ultimoMovimento.covidrsaDTipoMovOspite.tipoMovOspiteDesc;
          this.condizioneData = new Date(this.subject.ultimoMovimento.dataMovimento);
        }

        this.tableLoadingMovimenti = false;
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
    },
    // RENDICONTAZIONE
    OnClickUpdate(row) {

      this.rendicontazioneModifica = row;
      this.rendicontazioneModifica.soggetto = {};
      this.rendicontazioneModifica.soggetto.nome = this.subjectFirstName;
      this.rendicontazioneModifica.soggetto.cognome = this.subjectLastName;
      this.fasciaSelezionata = {};
      this.contoSelezionato = {};
      this.condizioneSelezionata = null;
      // Ottengo fascia e conto giÃ  esistenti per la rendicontazione
      if (this.rendicontazioneModifica.strContoId) {
        this.contoSelezionato = this.listaContiStruttura.find((e) => e.strContoId === this.rendicontazioneModifica.strContoId);
        if (this.contoSelezionato === undefined) {
          this.contoSelezionato = {};
        }
      } else {
        this.contoSelezionato = {};
      }
      if (this.rendicontazioneModifica.welfareFasciaId) {
        this.fasciaSelezionata = this.fasce.find((e) => e.welfareFasciaId === this.rendicontazioneModifica.welfareFasciaId);
        if (this.fasciaSelezionata === undefined) {
          this.fasciaSelezionata = '';
        }
      } else {
        this.fasciaSelezionata = '';
      }
      if (this.rendicontazioneModifica?.movimentoOspiteUscita?.covidrsaDTipoMovOspite) {
        this.condizioneSelezionata = this.rendicontazioneModifica.movimentoOspiteUscita.covidrsaDTipoMovOspite;
        const data = new Date(this.rendicontazioneModifica.movimentoOspiteUscita.dataMovimento);
        const anno = data.getFullYear();
        const mese = data.getMonth() + 1;
        const giorno = data.getDate(); // Cambiato da getDay() a getDate()
        this.dataCondizione = `${anno}/${String(mese).padStart(2, '0')}/${String(giorno).padStart(2, '0')}`;
      } else {
        const oggi = new Date(this.rendicontazioneModifica.dataRendicontazione);
        const anno = oggi.getFullYear();
        const mese = String(oggi.getMonth() + 1).padStart(2, '0');
        this.dataCondizione = `${anno}/${mese}/01`;
      }
      if (this.rendicontazioneModifica.flgPrimoIngresso) {
        this.radioChoiceTx = 'primoIngresso';
      } else {
        this.radioChoiceTx = 'inStruttura';
      }
      if (this.rendicontazioneModifica) {
        this.note = this.rendicontazioneModifica.note;
      }
      this.showDialogModifica = true;
    },
    hideDialogModificaRendicontazione() {
      this.selected = [];
      this.showDialogModifica = false;
      this.fasciaSelezionata = null;
      this.contoSelezionato = null;
    },
    OnClickFiles(row) {
      this.files = row.files;
      this.rendicontazioneDataForFile = row.dataRendicontazione;
      this.rendicontazioneSoggettoForFile = this.subjectFirstName + ' ' + this.subjectLastName;
      this.showDialogFilesRendicontazione = true;
    },
    async openFile(row) {
      const fileId = row.fileId;
      let response = await getFile(fileId);
    },
    showTitle(row) {
      if (row.files.length <= 0) {
        return "Questa rendicontazione non ha files associati!";
      } else {
        return "";
      }
    },
    updateRendicontazione() {
      this.showDialogModifica = false;
      this.tableLoadingRendicontazioni = true;
      this.loadSubjectDetail();
      this.tab = TABS.RENDICONTAZIONE;
      this.tableLoadingRendicontazioni = false;
    },
    cambioStatoUpdate() {
      this.showDialogCambiaStato = false;
      this.tableLoadingRendicontazioni = true;
      this.selected = [];
      this.loadSubjectDetail();
      this.tab = TABS.RENDICONTAZIONE;
      this.tableLoadingRendicontazioni = false;
    },
    showDialogCambiaStatoRendicontazioni() {
      this.rendicontazioneObject = JSON.parse(JSON.stringify(this.selected));
      this.showDialogCambiaStato = true;
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.subjectRendicontazioneList.length}`
    },
  },
  // CREATED
  async created() {
    const detailPromise = this.loadSubjectDetail();
    const testRichiestaTipoPromise = this.loadTestRichiestaTipo();
    const eventTypeListPromise = this.loadEventTypeList();
    await detailPromise;
    await testRichiestaTipoPromise;
    await eventTypeListPromise;

    // Ottengo il profilo dell'utente loggato
    this.profile = this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE];

    let stati = await getStatiRendicontazione();
    this.listaStatiRendicontazione = stati.data;
    await this.$store.dispatch("setStatiRendicontazione", { statiRendicontazione: stati.data });    
    //Lista dei file da caricare
    let f = await getListFile();
    this.filesList = f.data.filter(file => file.fileTipoGruppo == "RBR");
    await this.$store.dispatch("setFileList", { fileList: f.data });    
    //Ottengo la lista dei conti della struttura
    let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
    this.listaContiStruttura = subjectList;
    await this.$store.dispatch("setListaContiStruttura", { conti: subjectList });    
    //Ottengo le fasce della rendicontazione
    let data = await getStrutturaWelfareFasce();
    this.fasce = data.data;
    this.fasce = this.fasce.fascia;
    await this.$store.dispatch("setListaWelfareFasce", { fasce: data.data }); 
  },
  // FILTER
  filters: {
    formatNumber(value) {
      const formatter = new Intl.NumberFormat('it-IT');
      return formatter.format(value);
    }
  },
};
</script>

<style scoped></style>

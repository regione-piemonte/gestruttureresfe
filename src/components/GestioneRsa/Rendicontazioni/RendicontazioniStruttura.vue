<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <div>
        <template v-if="rendicontazioniData.length <= 0">
            <div class="q-pa-md text-body1 text-weight-medium">
                La struttura non ha ancora rendicontazioni
            </div>
        </template>
        <template v-else>
            <q-table :columns="columns" :data="tableData" row-key="rendicontazioneId" :pagination.sync="tablePagination"
                @request="onLoadSubjects" :loading="tableLoading" :rows-per-page-options="tablePageOptions" >
                <!-- @row-click="onRowClick" :selected-rows-label="getSelectedString" selection="multiple" :selected.sync="selected"> -->

                <template v-slot:top>
                    <div class="row full-width">
                        <div class="col-5 q-pa-sm">
                            <q-input filled dense debounce="300" v-model="searchValue" @input="onLoading"
                                placeholder="Cerca ..." class="full-width" autofocus
                                hint="Puoi cercare per codice fiscale, cognome e nome soggetto">
                                <q-icon slot="append" name="search" />
                            </q-input>
                        </div>
                        <div class="col-2 q-pa-sm">
                            <q-input filled dense debounce="300" v-model="dataRendicontazioneDa" type="month"
                                placeholder="Start Date" hint="Da data rendicontazione" @input="onLoading" />
                        </div>
                        <div class="col-2 q-pa-sm">
                            <q-input filled dense debounce="300" v-model="dataRendicontazioneA" type="month"
                                placeholder="End Date" hint="A data rendicontazione" @input="onLoading" />
                        </div>
                        <div class="col-3 q-pa-sm">
                            <q-select class="col-md-4" v-model="listaStatoSelezionato" hint="Puoi cercare per stato"
                                :options="getListaStatiRendicontazione" option-value="statoRendId"
                                option-label="statoRendDesc" label="Stati rendicontazione" dense filled options-dense
                                no-error-icon bottom-slots clearable input-debounce="0" @input="onLoading" map-options />
                        </div>
                    </div>
                </template>

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
                <template v-slot:body-cell-nominativo="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.soggetto.nome }} {{ props.row.soggetto.cognome }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-codiceFiscale="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.soggetto.codiceFiscale }}</div>
                            <div>{{ props.row.soggetto.dataNascita | date }}</div>
                        </div>
                    </q-td>
                </template>
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
            <div class="row items-center q-mt-sm q-col-gutter-md">
                <!-- <div class="col-auto q-mr-auto q-ml-auto">
                    <q-banner class="text-white bg-red " dense rounded v-if="disableCambiaStato && showBanner">
                        {{ tooltipMessage }}
                    </q-banner>
                </div> -->
                <div class="col-auto q-ml-auto">
                    <q-btn color="green" @click="exportTableCSV()" type="button" class="q-pr-sm"
                        @mouseover="showBanner = false" @mouseleave="showBanner = false">
                        Esporta CSV
                    </q-btn>
                </div>
                <!-- <div class="col-auto q-ml-none"> -->
                    <!-- <q-btn-dropdown color="secondary" label="Cambia stato" :disable="disableCambiaStato"
                        @mouseover="showBanner = true" @mouseleave="showBanner = false">
                        <q-list>
                            <div v-for="(stato, i) in returnListaStatiRend" :key="i">
                                <q-item clickable v-close-popup @click="openDialogConferma(stato)">
                                    <q-item-section>
                                        <q-item-label>Salva come: {{ stato.statoRendDesc }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </q-list>
                    </q-btn-dropdown> -->
                    <!-- LASCIARE il tooltip cosÃ¬, sennÃ² l'evento sul btn non funziona -->
                    <!-- <q-tooltip v-model="showBanner" anchor="bottom left" v-if="disableCambiaStato" content-class="bg-white"> -->
                        <!-- {{ tooltipMessage }} -->
                    <!-- </q-tooltip> -->
                <!-- </div> -->
            </div>
            <dialog-modifica-rendicontazione :title="'Modifica rendicontazione'" :subjectUpdate="rendicontazioneModifica"
                :showDialog.sync="showDialogModifica" @hide="hideDialogModificaRendicontazione()"
                @updateRendicontazione="updateRendicontazione()" :fasciaLocale="fasciaSelezionata"
                :contoLocale="contoSelezionato" :condizioneLocale="condizioneSelezionata" :dataCondizione="dataCondizione"
                :radioChoice="radioChoiceTx" :note="note" ref="dialogModificaRendicontazione"
                @cambioStato="cambioStatoUpdate()">
            </dialog-modifica-rendicontazione>
            <!-- <dialog-cambia-stato-rendicontazione :showDialog="showDialogCambiaStato" :title="'Cambia stato rendicontazione'"
                :rendicontazioneToUpdate="rendicontazioneObject" @hide="showDialogCambiaStato = false"
                @cambioStato="cambioStatoUpdate()">
            </dialog-cambia-stato-rendicontazione> -->

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
                            Rendicontazione del soggetto <strong>{{ getSoggettoRendicontazione }}</strong> effettuata in
                            data
                            <strong>{{ getDataRendicontazione | dateMonthYear }}</strong>
                        </q-card-section>
                        <q-card-section>
                            <div class="row col-md-12">
                                <div class="col-md-12">
                                    <q-table :columns="columsFiles" :data="files" row-key="rendicontazioneFileId"
                                        hide-bottom>
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
                                                    <q-btn flat color="primary" icon="attach_file"
                                                        @click="openFile(props.row)" />
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
                        Attenzione proseguendo con il salvataggio la rendicontaizione non potrÃ  piÃ¹ essere modificata. I
                        documenti
                        verranno trasmessi a Finpiemonte al termine del trimestre di rendicontazione corrente
                    </q-card-section>

                    <!-- CONFERMA E SALVA -->
                    <q-card-section class="text-right">
                        <div class="row  q-col-gutter-md reverse">
                            <div class="col-md-auto col-12">
                                <q-btn color="primary" class="full-width" :loading="isSaving"
                                    @click="cambiaStato()">CONFERMA</q-btn>
                            </div>
                            <div class="col-md-auto col-12">
                                <q-btn color="primary" outline v-close-popup class="full-width">INDIETRO</q-btn>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </template>
    </div>
</template>
<script>

import { getContiStrutturaRendicontazione, getFile, getListFile, getRendicontazioniCsv, getRendicontazioniStruttura, getStatiRendicontazione, getStrutturaWelfareFasce, getWelfareFasce, postStatiRendicontazione } from 'src/services/api'
import { downloadCsv, notifyError, notifySuccess } from 'src/services/utils'
import { ACCESSO_DETTAGLIO_OSPITE, DETTAGLIO_OSPITE } from 'src/router/routes'
import DialogModificaRendicontazione from '../Dialogs/DialogModificaRendicontazione.vue'
import DialogCambiaStatoRendicontazione from '../Dialogs/DialogCambiaStatoRendicontazione.vue'
import { TYPES } from 'src/store'

export default {
    components: { DialogModificaRendicontazione, DialogCambiaStatoRendicontazione },
    name: 'RendicontazioniStruttura',
    data() {
        return {
            profile: null,
            showDialogFilesRendicontazione: false,
            rendicontazioneModifica: {},
            showDialogModifica: false,
            selected: [],
            columns: [
                {
                    name: 'data_rendicontazione',
                    field: 'dataRendicontazione',
                    label: 'Data',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'stato_rendicontazione',
                    field: 'statoRendicontazione',
                    label: 'Stato',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'nominativo',
                    field: 'nominativo',
                    label: 'Nominativo',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'codiceFiscale',
                    field: 'codiceFiscale',
                    label: 'CF',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'importo_retta',
                    field: 'importoRetta',
                    label: 'Importo fattura',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                // {
                //     name: 'importo_extra',
                //     field: 'importoExtra',
                //     label: 'Importo Extra',
                //     required: true,
                //     sortable: true,
                //     align: 'left',
                //     headerClasses: 'text-bold'
                // },
                // {
                //     name: 'importo_sconto',
                //     field: 'importoSconto',
                //     label: 'Importo Sconto',
                //     required: true,
                //     sortable: true,
                //     align: 'left',
                //     headerClasses: 'text-bold'
                // },
                // {
                //     name: 'gg_assenza_presenza',
                //     field: 'ggAssenzaPresenza',
                //     label: 'Giorni A/P',
                //     required: true,
                //     sortable: true,
                //     align: 'left',
                //     headerClasses: 'text-bold'
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
            files: [],
            tableData: [],
            rendicontazioniData: [],
            tableLoading: false,
            tablePageOptions: [10, 25, 50, 100, 500, 0], // modo 1
            tablePagination: {
                rowsPerPage: 10,
                page: 1,
                sortBy: 'nome',
                descending: false,
                rowsNumber: null
            },
            searchValue: '',
            backData: null,
            dataRendicontazioneDa: '',
            dataRendicontazioneA: '',
            // showDialogCambiaStato: false,
            rendicontazioneObject: [],
            listaStatiRendicontazione: [],
            listaStatiRendicontazioneForUpdate: [],
            listaStatoSelezionato: null,
            showTooltip: false,
            showBanner: false,
            rendicontazioneSoggettoForFile: '',
            rendicontazioneDataForFile: '',
            tooltipMessage: '',
            filesList: [],
            contoSelezionato: null,
            fasciaSelezionata: null,
            condizioneSelezionata: null,
            dataCondizione: '',
            fasce: [],
            listaContiStruttura: [],
            radioChoiceTx: '',
            note: '',
            filesPrimoIngresso: [],
            filesOspiteInStruttura: [],
            isSaving: false,
            showDialogConfermaCambioStato: false,
            statoSwap: null,
            statoPerCsv: null
        }
    },
    filters: {
        formatNumber(value) {
            const formatter = new Intl.NumberFormat('it-IT');
            return formatter.format(value);
        }
    },
    async created() {
        // Evento per titolo
        this.$root.$emit('titolo-accesso-struttura');

        try {
            // Chimata a db per ottenere i dati dei soggetti della struttura 
            await this.onLoadSubjects({ pagination: this.tablePagination });
            this.rendicontazioniData = [...this.tableData];

            //Stati rendicontazione
            let stati = await getStatiRendicontazione();
            this.listaStatiRendicontazione = stati.data;
            await this.$store.dispatch("setStatiRendicontazione", { statiRendicontazione: stati.data });    
            //Lista dei file da caricare
            let f = await getListFile();
            this.filesList = f.data.filter(file => file.fileTipoGruppo == "RBR");
            this.filesPrimoIngresso = f.data.filter(file => file.fileTipoGruppo == "RBR_MESE_1_PRIMO_INGRESSO");
            this.filesOspiteInStruttura = f.data.filter(file => file.fileTipoGruppo == "RBR_MESE_1");
            await this.$store.dispatch("setFileList", { fileList: f.data });    
            //Ottengo la lista dei conti della struttura
            let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
            this.listaContiStruttura = subjectList;
            await this.$store.dispatch("setListaContiStruttura", { conti: subjectList });    
            //Ottengo le fasce della rendicontazione
            let data = await getStrutturaWelfareFasce();
            this.fasce = data.data;
            await this.$store.dispatch("setListaWelfareFasce", { fasce: data.data });    
            this.fasce = this.fasce.fascia;
        } catch (err) {
            this.internalError = true
            console.log(err)
        }

        // Ottengo il profilo dell'utente loggato
        this.profile = this.$store.getters[TYPES.GETTERS.SELECTED_PROFILE];
    },
    computed: {
        returnListaStatiRend() {
            this.getListaStatiRendicontazioneForChange();
            return this.listaStatiRendicontazioneForUpdate ? this.listaStatiRendicontazioneForUpdate : null;
        },
        strutturaSelezionata() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE];
        },
        getListaStatiRendicontazione() {
            return this.listaStatiRendicontazione ? this.listaStatiRendicontazione : null;
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
                //     // Controllo se le rendicontazioni hanno i file obbligatori
                //     // altrimento non Ã¨ possibile carmbiargli stato
                //     for (let i = 0; i < this.selected.length; i++) {
                //         let listaFileObbligatori = [];
                //         let listaFilesRendicontazione = [];
                //         if (this.selected[i].flgPrimaRendicontazione) {
                //             if (this.selected[i].flgPrimoIngresso) {
                //                 listaFileObbligatori = this.filesPrimoIngresso.filter((e) => e.fileTipoObbligatorio == true);
                //             } else {
                //                 listaFileObbligatori = this.filesOspiteInStruttura.filter((e) => e.fileTipoObbligatorio == true);
                //             }
                //         } else {
                //             listaFileObbligatori = this.filesList.filter((e) => e.fileTipoObbligatorio == true);
                //         }
                //         listaFilesRendicontazione = this.selected[i].files;
                //         if (listaFilesRendicontazione.length === 0) {
                //             this.tooltipMessage = 'La rendicontazione non ha i file obbligatori!';
                //             flag = true;
                //             return flag;
                //         }
                //         let counter = 0;
                //         for (let j = 0; j < listaFilesRendicontazione.length; j++) {

                //             for (let k = 0; k < listaFileObbligatori.length; k++) {
                //                 if (listaFileObbligatori[k].fileTipoId === listaFilesRendicontazione[j].fileTipoId) {
                //                     counter++;
                //                 }
                //             }
                //         }
                //         if (counter !== listaFileObbligatori.length) {
                //             this.tooltipMessage = 'La rendicontazione non ha i file obbligatori!';
                //             flag = true;
                //             return flag;
                //         }
                //     }
            }
            return flag;
        },
    },
    methods: {
        //OLD ------------------------------------------------------------------------------------------------------
        // showDialogCambiaStatoRendicontazioni() {
        //     this.rendicontazioneObject = JSON.parse(JSON.stringify(this.selected));
        //     this.showDialogCambiaStato = true;
        // },
        // ---------------------------------------------------------------------------------------------------------
        showTitle(row) {
            if (row.files.length <= 0) {
                return "Questa rendicontazione non ha files associati!";
            } else {
                return "";
            }
        },
        getSelectedString() {
            return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.tableData.length}`
        },
        // Soggetti della struttura
        async onLoadSubjects(props) {
            const { page, rowsPerPage, sortBy, descending } = props.pagination;
            this.tableLoading = true;
            try {
                let sortByVarible = sortBy;
                if (sortByVarible === 'nominativo') {
                    sortByVarible = 'nome,cognome';
                }
                if (sortByVarible === 'codiceFiscale') {
                    sortByVarible = 'codice_fiscale,data_nascita';
                }
                let paginationParams = {
                    rowPerPage: rowsPerPage === 0 ? props.pagination.rowsNumber : rowsPerPage,
                    pageNumber: page,
                    orderby: sortByVarible,
                    descending: descending
                }
                if (this.searchValue !== '') {
                    paginationParams.filter = this.searchValue
                }
                // Aggiungo filtri per periodo rendicontazione
                paginationParams.dataRendicontazioneDa = this.dataRendicontazioneDa ? this.dataRendicontazioneDa + '-01' : '';
                paginationParams.dataRendicontazioneA = this.dataRendicontazioneA ? this.dataRendicontazioneA + '-01' : '';
                if (this.listaStatoSelezionato !== null) {
                    paginationParams.statoRend = this.listaStatoSelezionato.statoRendId;
                }
                let { headers, data: subjectList } = await getRendicontazioniStruttura(
                    paginationParams
                );
                this.tableData = subjectList;
                this.tablePagination.page = page;
                this.tablePagination.rowsPerPage = rowsPerPage;
                this.tablePagination.sortBy = sortBy;
                this.tablePagination.descending = descending;
                this.tablePagination.rowsNumber = headers["rows-number"];
            } catch (err) {
                notifyError(
                    err,
                    "Si Ã¨ verificato un errore durante il caricamento delle rendicontazioni"
                );
            }
            this.tableLoading = false;
        },
        onLoading() {
            // Chimata a db per ottenere i dati dei soggetti della struttura 
            this.onLoadSubjects({ pagination: this.tablePagination });
            if (this.listaStatoSelezionato !== null) {
                this.statoPerCsv = this.listaStatoSelezionato.statoRendId;
            }
            this.selected = [];
        },
        // onRowClick(evt, row) {
        //     // Navigazione verso la rotta
        //     this.$store.dispatch("setSoggettoSelezionato", { soggettoSelezionato: row });
        //     this.$router.push(DETTAGLIO_OSPITE);
        // }
        dateToStringYearMonth(date) {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}}`;
        },
        OnClickUpdate(row) {
            this.rendicontazioneModifica = row;
            this.fasciaSelezionata = {};
            this.contoSelezionato = {};
            this.condizioneSelezionata = null;
            let listaContiStruttura = this.listaContiStruttura.filter(conto => conto.isValid !== false);
            // Ottengo fascia e conto giÃ  esistenti per la rendicontazione
            if (this.rendicontazioneModifica.strContoId) {
                this.contoSelezionato = listaContiStruttura.find((e) => e.strContoId === this.rendicontazioneModifica.strContoId);
                if (this.contoSelezionato === undefined) {
                    this.contoSelezionato = null;
                }
            } else {
                this.contoSelezionato = null;
            }
            if (this.rendicontazioneModifica.welfareFasciaId) {
                this.fasciaSelezionata = this.fasce.find((e) => e.welfareFasciaId === this.rendicontazioneModifica.welfareFasciaId);
                if (this.fasciaSelezionata === undefined) {
                    this.fasciaSelezionata = null;
                }
            } else {
                this.fasciaSelezionata = null;
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
        OnClickFiles(row) {
            this.files = row.files;
            this.rendicontazioneDataForFile = row.dataRendicontazione;
            this.rendicontazioneSoggettoForFile = row.soggetto.nome + ' ' + row.soggetto.cognome;
            this.showDialogFilesRendicontazione = true;
        },
        async openFile(row) {
            const fileId = row.fileId;
            let response = await getFile(fileId);
        },
        isObserverEmpty(obj) {
            if (!obj || typeof obj !== 'object') {
                return true; // Se l'oggetto Ã¨ null, undefined o non Ã¨ un oggetto, consideralo vuoto
            }

            // Otteniamo le chiavi delle proprietÃ  dell'oggetto Observer
            const keys = Object.keys(obj);

            // Verifichiamo se l'oggetto Ã¨ vuoto controllando la lunghezza delle chiavi
            return keys.length === 0;
        },
        // MODIFICA RENDICONTAZIONE ----------------------------------------------------------------------------------
        async hideDialogModificaRendicontazione() {
            this.selected = [];
            await this.onLoadSubjects({ pagination: this.tablePagination });
            this.showDialogModifica = false;
        },
        async updateRendicontazione() {
            this.showDialogModifica = false;
        },
        // CAMBIA STATO -----------------------------------------------------------------------------------------------
        openDialogConferma(stato) {
            this.showDialogConfermaCambioStato = true;
            this.statoSwap = stato;
        },
        onHide() {  // Richiamato dall'evento "onHide" da DialogModificaRendicontazione
            this.showDialogConfermaCambioStato = false;
        },
        cambioStatoUpdate() { // Richiamato dall'evento "cambioStato" da DialogModificaRendicontazione
            this.hideDialogModificaRendicontazione();
        },
        async cambiaStato() { // Metodo per cambio stato rendicontazione dalla pagina rendicontazioni
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
                // this.showDialogCambiaStato = false;
                this.showDialogConfermaCambioStato = false;
                this.selected = [];
                this.onLoadSubjects({ pagination: this.tablePagination });
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
            // this.listaStatoSelezionato = '';
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
        },
        // -------------------------------------------------------------------------------------------------------------------------
        // CSV ---------------------------------------------------------------------------------------------------------------------
        exportTableCSV() {
            this.exportTable({ pagination: this.tablePagination });
        },
        async exportTable(props) {
            try {
                const { page, rowsPerPage, sortBy, descending } = props.pagination;
                let sortByVarible = sortBy;
                if (sortByVarible === 'nominativo') {
                    sortByVarible = 'nome,cognome';
                }
                if (sortByVarible === 'codiceFiscale') {
                    sortByVarible = 'codice_fiscale,data_nascita';
                }
                let paginationParams = {
                    rowPerPage: rowsPerPage === 0 ? props.pagination.rowsNumber : rowsPerPage,
                    pageNumber: page,
                    orderby: sortByVarible,
                    descending: descending
                }
                if (this.searchValue !== '') {
                    paginationParams.filter = this.searchValue
                }
                // Aggiungo filtri per periodo rendicontazione
                paginationParams.dataRendicontazioneDa = this.dataRendicontazioneDa ? this.dataRendicontazioneDa + '-01' : '';
                paginationParams.dataRendicontazioneA = this.dataRendicontazioneA ? this.dataRendicontazioneA + '-01' : '';
                if (this.statoPerCsv !== null) {
                    paginationParams.statoRend = this.statoPerCsv;
                }
                this.statoPerCsv = null;

                const { data: csv } = await getRendicontazioniCsv(paginationParams);

                downloadCsv(csv, 'Rendicontazioni.csv')
            } catch (e) {
                console.log(e)
                notifyError(1, 'Errore nel download')
            }
        },
        // -------------------------------------------------------------------------------------------------------------------------
    }
}
</script>
  
<style></style>
  
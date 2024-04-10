<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <q-page padding>
        <template v-if="richiesteApprovvigionamento.length <= 0">
            <div class="row items-center q-mt-sm q-pl-md q-pr-md q-col-gutter-md q-mb-md">
                <!-- Parte nuova richiesta -->
                <div class="col-auto q-ml-auto">
                    <q-btn color="primary" @click="openModalNewRichiesta()" :disable="checkInCorso || checkPersoneInStruttura">
                        Nuova richiesta
                        <q-tooltip v-if="checkPersoneInStruttura && !checkInCorso" max-width="300px" anchor="top middle" self="bottom middle">
                            <div class="text-body2">
                                Non Ã¨ possibile effettuare la richiesta perchÃ¨ la struttura non risulta avere posti occupati.
                            </div>
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>
            <div class="q-pa-md text-body1 text-weight-medium">
                La struttura non ha ancora effettuato richieste
            </div>
        </template>
        <template v-else>

            <div class="row items-center q-mt-sm q-pl-md q-pr-md q-col-gutter-md q-mb-md">
                <div class="col-auto q-ml-auto">
                    <q-btn color="primary" @click="openModalNewRichiesta()" :disable="checkInCorso || checkPersoneInStruttura">
                        Nuova richiesta
                        <q-tooltip v-if="checkInCorso && !checkPersoneInStruttura" max-width="300px" anchor="top middle" self="bottom middle">
                            <div class="text-body2">
                                Non Ã¨ possibile effettuare una nuova richiesta fino al {{ ultimaData |
                                    date }}
                            </div>
                        </q-tooltip>
                        <q-tooltip v-if="checkPersoneInStruttura && !checkInCorso" max-width="300px" anchor="top middle" self="bottom middle">
                            <div class="text-body2">
                                Non Ã¨ possibile effettuare la richiesta perchÃ¨ la struttura non risulta avere posti occupati.
                            </div>
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>

            <!-- Tabella richiesta approvvigionamento -->
            <q-table :columns="columnsTamponi" :data="richiesteApprovvigionamento" row-key="name" :loading="tableLoading"
                :rows-per-page-options="tablePageOptions">

                <template v-slot:body-cell-data_richiesta="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.dataRichiesta | date }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-data_approvvigionamento="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.dataApproviggionamento | date }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                        <div>
                            <q-btn flat color="primary" icon="edit" @click="updateRichiesta(props.row)"
                                v-if="props.row.modificabile" />
                            <q-btn flat color="red" icon="delete" @click="deleteRichiesta(props.row)"
                                v-if="props.row.modificabile" />
                        </div>
                    </q-td>
                </template>
            </q-table>
        </template>
        <q-dialog v-model="showModalNewRichiesta" @hide="onHide()">
            <q-card class="full-width">
                <q-card-section class="q-py-none">
                    <q-toolbar class="q-px-none">
                        <q-toolbar-title>{{ type === 'modifica' ? 'Modifica richiesta approvvigionamento' : 'Nuova richiesta approvvigionamento'}}</q-toolbar-title>
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-toolbar>
                </q-card-section>
                <q-separator />

                <q-card-section>
                    <div class="row">
                        <!-- <div class="col-12" v-if="type === 'new'">
                            <q-input v-model="numeroTamponi" label="Numero Test" filled dense :rules="[ruleRequired]"
                                type="number" step="1" min="0" />
                        </div> -->
                        <div class="col-2">
                        </div>
                        <div class="col-3">
                            <div class="q-pt-sm">Numero tamponi: </div>
                        </div>
                        <div class="col-2">
                            <q-radio v-model="radioChoice" val="numeroTamponi" :label="numeroTamponi + ''" />
                        </div>
                        <div class="col-2">
                            <q-radio v-model="radioChoice" val="numeroTamponiDoppio" :label="numeroTamponiDoppio + ''" />
                        </div>
                        <div class="col-3">
                        </div>
                    </div>
                </q-card-section>
                <q-card-section class="text-right">
                    <div class="row  q-col-gutter-md reverse">
                        <div class="col-md-auto col-12">
                            <q-btn color="primary" class="full-width" @click="confermaApprovvigionamento()"
                                :loading="onConferma">CONFERMA</q-btn>
                        </div>
                        <div class="col-md-auto col-12">
                            <q-btn color="primary" outline v-close-popup class="full-width">INDIETRO</q-btn>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showDialogDelete" @hide="onHideDelete()">
            <q-card class="full-width">
                <q-card-section class="q-py-none">
                    <q-toolbar class="q-px-none">
                        <q-toolbar-title>Elimina richiesta</q-toolbar-title>
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-toolbar>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    Desideri eliminare la richiesta
                    effettuata dalla struttura <strong>{{ nomeStruttura }}</strong>?
                </q-card-section>
                <!-- CONFERMA E SALVA -->
                <q-card-section class="text-right">
                    <div class="row  q-col-gutter-md reverse">
                        <div class="col-md-auto col-12">
                            <q-btn color="negative" class="full-width" @click="deleteRichiestaConferma()"
                                :loading="onDelete">ELIMINA</q-btn>
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
import { getNumeroPersoneInStruttura, getRichiesteTamponi, getUltimaDataTamponi, postElimnaRichiesteTamponi, postRichiesteTamponi } from 'src/services/api'
import { notifyError, notifySuccess } from 'src/services/utils';
import { TYPES } from 'src/store';

export default {
    name: 'ApprovvigionamentoTamponi',
    // props: {
    //  
    // },
    data() {
        return {
            columnsTamponi: [
                {
                    name: 'numero_test',
                    field: 'numeroTest',
                    label: 'Numero Tamponi',
                    required: true,
                    sortable: false,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'data_richiesta',
                    field: 'dataRichiesta',
                    label: 'Data Richiesta',
                    required: true,
                    sortable: false,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'data_approvvigionamento',
                    field: 'dataApprovvigionamento',
                    label: 'Data Approvvigionamento',
                    required: true,
                    sortable: false,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: "action",
                    label: 'Azioni',
                    align: "left",
                    field: "action",
                    required: false,
                    sortable: false,
                    headerClasses: 'text-bold'
                }
            ],
            showModalNewRichiesta: false,
            showDialogDelete: false,
            numeroTamponi: null,
            numeroTamponiDoppio: null,
            radioChoice: '',
            richiesteApprovvigionamento: [],
            onConferma: false,
            onDelete: false,
            type: '',
            mainLoading: false,
            ultimaData: '',
            tablePageOptions: [10, 25, 50, 100, 500, 0],
            updateSwap: null
        }
    },
    async created() {
        // this.$root.$emit('titolo-res')
        try {
            this.mainLoading = false;
            this.tableLoading = true;

            await this.getRichieste();

            const response = await getUltimaDataTamponi();
            this.ultimaData = response.data;

            const { data: numeroPersoneInStruttura } = await getNumeroPersoneInStruttura();
            this.numeroTamponi = numeroPersoneInStruttura;
            if(this.numeroTamponi == 0) {
                this.numeroTamponiDoppio = 0;
            } else {
                this.numeroTamponiDoppio = this.numeroTamponi * 2;
            }

            this.tableLoading = false;
        } catch (err) {
            this.mainLoading = true;
            this.tableLoading = false;
            this.internalError = true
            console.log(err)
        }
        this.mainLoading = true;
    },
    computed: {
        ruleRequired() {
            return v => !!v || "Campo obbligatorio";
        },
        checkInCorso() {
            const countInCorso = this.richiesteApprovvigionamento.filter(e => e.modificabile === true);
            return countInCorso.length > 0 ? true : false;
        },
        checkPersoneInStruttura() {
            if(this.numeroTamponi !== null) {
                if(this.numeroTamponi == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        nomeStruttura() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].stiNome;
        }
        // ultimaDataApprovvigionamento() {
        //     let ultimaData = '';
        //     if (this.richiesteApprovvigionamento.length > 0) {
        //         ultimaData = this.richiesteApprovvigionamento[0].dataApproviggionamento;
        //     }
        //     return ultimaData;
        // }
    },
    methods: {
        // TAMPONI--------------------------------------------------------------------------
        /**
         * Methodo per la modifica, bottone modifica
         * @param row oggetto del record della tabella delle richieste tamponi
         */
        updateRichiesta(row) {
            // this.numeroTamponi = row.numeroTest;
            this.updateSwap = row;
            this.type = 'modifica';
            if(row.numeroTest === this.numeroTamponi) {
                this.radioChoice = 'numeroTamponi';
            } else if(row.numeroTest === this.numeroTamponiDoppio) {
                this.radioChoice = 'numeroTamponiDoppio';
            }
            this.showModalNewRichiesta = true;
        },
        /**
         * Methodo per l'eliminazione , bottone delete
         * @param row oggetto del record della tabella delle richieste tamponi
         */
        deleteRichiesta(row) {
            this.updateSwap = row;
            this.showDialogDelete = true;
        },
        /**
         * Ottengo l'ultima data possibile per modificare una richiesta
         */
        // async getUltimaData() {
        //     if(this.richiesteApprovvigionamento.length > 0) {
        //         const ultimaData = await getUltimaDataTamponi();
        //         return ultimaData;
        //     } else {
        //         return '';
        //     }
        // },
        /**
         * Methodo per la creazione di una nuova richiesta, bottone NUOVA RICHIESTA
         */
        openModalNewRichiesta() {
            // this.numeroTamponi = null;
            this.radioChoice = '';
            this.type = 'new';
            this.showModalNewRichiesta = true;
        },
        /**
         * Metodo alla conferma, post per la modifica/creazione della richeista
         */
        async confermaApprovvigionamento() {
            this.onConferma = true;
            const regex = /^[0-9]+$/; // regex solo numero interi
            if (!regex.test(this.numeroTamponi)) {  // Check: numero tamponi deve essere numero intero
                this.onConferma = false;
                let e = null;
                let message =
                    "Puoi inserire solo numeri interi";
                notifyError(e, message);
                return;
            }
            if (this.numeroTamponi <= 0) {
                this.onConferma = false;
                let e = null;
                let message =
                    "Inserisci almeno un tampone nella richiesta";
                notifyError(e, message);
                return;
            }
            try {
                this.onConferma = true;
                let payload = {
                    numeroTest: this.radioChoice === 'numeroTamponi' ? this.numeroTamponi : this.numeroTamponiDoppio
                };
                if (this.type === 'modifica') {
                    payload.richiestaTestId = this.updateSwap.richiestaTestId;
                }
                await postRichiesteTamponi(payload);
                this.onConferma = false;
                this.showModalNewRichiesta = false;
                await this.getRichieste();
                notifySuccess(this.type === 'modifica' ? "Richiesta modificata con successo" : "Richiesta creata con successo");
            } catch (e) {
                let errorDesc = e.response.data.descrizione;
                let message = '';
                message = this.type === 'modifica' ? "Non Ã¨ stato possibile modificare la richiesta" : "Non Ã¨ stato possibile creare la richiesta";
                message = `${message}: ${errorDesc}`;
                this.onConferma = false;
                notifyError(e, message);
            }
            this.onConferma = false;
        },
        async deleteRichiestaConferma() {
            this.onDelete = true;
            try {
                this.onDelete = true;
                let payload = {
                    richiestaTestId: this.updateSwap.richiestaTestId
                };
                await postElimnaRichiesteTamponi(payload);
                this.onDelete = false;
                this.showDialogDelete = false;
                await this.getRichieste();
                notifySuccess("Richiesta di approvvigionamento eliminata con successo");
            } catch (e) {
                this.showDialogDelete = false;
                let message = 'Non Ã¨ stato possibile eliminare la richiesta di approvvigionamento';
                this.onDelete = false;
                notifyError(e, message);
            }
            this.onConferma = false;
        },
        onHide() {
            // this.numeroTamponi = null;
            this.onConferma = false;
            this.tableLoading = false;
            this.showModalNewRichiesta = false;
        },
        onHideDelete() {
            // this.numeroTamponi = null;
            this.onDelete = false;
            this.tableLoading = false;
            this.showDialogDelete = false;
        },
        /**
         * Get per le richieste tamponi
         */
        async getRichieste() {
            this.tableLoading = true;
            let { headers, data: subjectList } = await getRichiesteTamponi();
            this.richiesteApprovvigionamento = subjectList;
            this.tableLoading = false;
        },
    }
}
</script>

<style></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <div>
        <template v-if="ospitiData.length <= 0">
            <div class="q-pa-md text-body1 text-weight-medium">
                La struttura non ha ancora ospiti
            </div>
        </template>
        <template v-else>
            <q-table :columns="columns" :data="tableData" row-key="idSoggetto" :pagination.sync="tablePagination"
                @request="onLoadSubjects" :loading="tableLoading" :rows-per-page-options="tablePageOptions"
                @row-click="onRowClick">

                <template v-slot:top>
                    <q-input filled dense debounce="300" v-model="searchValue" @input="onLoading" placeholder="Cerca ..."
                        class="full-width" autofocus hint="Puoi cercare per codice fiscale, cognome e nome soggetto">
                        <q-icon slot="append" name="search" />
                    </q-input>
                </template>

                <template v-slot:body-cell-nominativo="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.nome }} {{ props.row.cognome }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-codiceFiscale="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.codiceFiscale }}</div>
                            <div>{{ props.row.dataNascita | date }}</div>
                        </div>
                    </q-td>
                </template>
                <!-- <template v-slot:body-cell-presenza_inizio="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.presenzaInizio | dateMonthYear }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-presenza_fine="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.presenzaFine | dateMonthYear }}</div>
                        </div>
                    </q-td>
                </template> -->
                <template v-slot:body-cell-periodo_teorico="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.presenzaInizio | dateMonthYear }} - {{ props.row.presenzaFine |
                                dateMonthYear }}</div>
                        </div>
                    </q-td>
                </template>
                <template v-slot:header-cell-data_dimissioni_definitiva="props">
                    <q-th :props="props">
                        {{ props.col.label }}
                        <q-icon name="info" size="22px" color="primary">
                            <q-tooltip max-width="350px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Il termine del buono puÃ² essere anticipato per: <br>
                                    - Passaggio in convenzionamento <br>
                                    - Dimissione definitiva <br>
                                    - Decesso <br>
                                    - Trasferimento in altra struttura
                                </div>
                            </q-tooltip>
                        </q-icon>
                    </q-th>
                </template>
                <template v-slot:body-cell-data_dimissioni_definitiva="props">
                    <q-td :props="props">
                        <div>
                            <div>{{ props.row.dataDimissioniDefinitiva | date }}</div>
                        </div>
                    </q-td>
                </template>
            </q-table>
        </template>
    </div>
</template>
<script>

import { getSoggettiRendicontazione } from 'src/services/api'
import { notifyError } from 'src/services/utils'
import { ACCESSO_DETTAGLIO_OSPITE, DETTAGLIO_OSPITE } from 'src/router/routes'

export default {
    name: 'OspitiStruttura',
    data() {
        return {
            columns: [
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
                // {
                //     name: 'presenza_inizio',
                //     field: 'presenzaInizio',
                //     label: 'Inizio validitÃ  Buono',
                //     required: true,
                //     sortable: true,
                //     align: 'left',
                //     headerClasses: 'text-bold'
                // },
                // {
                //     name: 'presenza_fine',
                //     field: 'presenzaFine',
                //     label: 'Fine validitÃ  Buono',
                //     required: true,
                //     sortable: true,
                //     align: 'left',
                //     headerClasses: 'text-bold'
                // },
                {
                    name: 'periodo_teorico',
                    field: 'periodoTeorico',
                    label: 'Periodo teorico validitÃ  temporale buono',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
                {
                    name: 'data_dimissioni_definitiva',
                    field: 'dataDimissioniDefinitiva',
                    label: 'Termine anticipato validitÃ  buono',
                    required: true,
                    sortable: true,
                    align: 'left',
                    headerClasses: 'text-bold'
                },
            ],
            tableData: [],
            ospitiData: [],
            tableLoading: false,
            tablePageOptions: [2, 5, 10, 25, 50, 100, 500, 0], // modo 1
            tablePagination: {
                rowsPerPage: 5,
                page: 1,
                sortBy: 'nome',
                descending: false,
                rowsNumber: null
            },
            searchValue: '',
            backData: null,
        }
    },
    async created() {
        // Evento per titolo
        this.$root.$emit('titolo-accesso-struttura');

        try {
            // Chimata a db per ottenere i dati dei soggetti della struttura 
            await this.onLoadSubjects({ pagination: this.tablePagination });
            this.ospitiData = [...this.tableData];
        } catch (err) {
            this.internalError = true
            console.log(err)
        }
    },
    computed: {
        strutturaSelezionata() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE];
        }
    },
    methods: {
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
                if (sortByVarible === 'periodo_teorico') {
                    sortByVarible = 'presenza_inizio,presenza_fine';
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
                let { headers, data: subjectList } = await getSoggettiRendicontazione(
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
                    "Si Ã¨ verificato un errore durante il caricamento dei soggetti"
                );
            }
            this.tableLoading = false;
        },
        onLoading() {
            // Chimata a db per ottenere i dati dei soggetti della struttura 
            this.onLoadSubjects({ pagination: this.tablePagination });
        },
        onRowClick(evt, row) {
            // Navigazione verso la rotta
            this.$store.dispatch("setTabSelezionataBuono", { tabSelezionataBuono: 'ospiti' });
            this.$store.dispatch("setSoggettoSelezionato", { soggettoSelezionato: row });
            this.$router.push(DETTAGLIO_OSPITE);
        }
    }
}
</script>
  
<style></style>
  
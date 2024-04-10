<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <q-dialog v-model="showDialogLocale" @hide="onHide()">
        <q-card class="full-width q-pa-sm">
            <q-card-section class="q-py-none">
                <q-toolbar class="q-px-none">
                    <q-toolbar-title>{{ title }}</q-toolbar-title>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-toolbar>
            </q-card-section>
            <q-separator />
            <q-form ref="formNewConto">
                <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
                    <div class="row">
                        <div class="col-6 q-py-sm">
                            <q-toggle v-model="contoToUpdate.flgDefault" label="Predefinito" :disable="flgDefault" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <q-input v-model="contoToUpdate.strContoIban" type="text" label="IBAN" filled dense
                                :rules="[ruleRequired, checkIban]" maxlength="27"
                                :disable="this.provenienza === 'update'" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <q-input v-model="contoToUpdate.strContoIstituto" type="text" label="Istituto" filled dense
                                :rules="[ruleRequired]" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <q-input v-model="contoToUpdate.strContoDesc" type="text" label="Descrizione" filled dense
                                :rules="[ruleRequired]" />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Assegnare una denominazione a piacere del conto (non Ã¨ necessario indicare il destinatario).
                                </div>
                            </q-tooltip>
                        </div>
                    </div>
                    <!-- <div class="row">
                        <div class="col-6 q-pr-sm">
                            <q-input v-model="contoToUpdate.validitaInizio" type="date" label="Data inizio validitÃ " filled
                                dense no-error-icon :rules="[ruleRequired, validateDateInizio]" stack-label />
                        </div>
                        <div class="col-6 q-pl-sm">
                            <q-input v-model="contoToUpdate.validitaFine" type="date" label="Data fine validitÃ " filled
                                dense no-error-icon :rules="[validateDateFine]" stack-label />
                        </div>
                    </div> -->
                </div>
                <div class="row">
                    <q-btn :loading="isSaving" color="primary" class="q-ml-auto q-mt-sm q-mr-sm q-mb-sm" label="Salva"
                        @click="onSave"></q-btn>
                </div>
            </q-form>
        </q-card>
    </q-dialog>
</template>


<script>
import { date } from 'quasar';
import { postContiStruttura } from 'src/services/api';
import { isDateGreaterThanDate, notifyError, notifySuccess } from 'src/services/utils';
const { formatDate } = date;

export default {
    name: "NuovoContoDialog",
    data() {
        return {
            showDialogLocale: false,
            isSaving: false,
        };
    },
    watch: {
        showDialog(newVal) {
            // Aggiorna la copia locale quando la prop showDialog cambia
            this.showDialogLocale = newVal;
        },
    },
    props: {
        showDialog: {
            type: Boolean,
            required: true,
            default: null
        },
        title: {
            type: String,
            required: true,
            default: null
        },
        provenienza: {
            type: String,
            required: true,
            default: null
        },
        contoToUpdate: {
            type: Object,
            required: true,
            default: null
        },
        flgDefault: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    computed: {
        ruleRequired() {
            return v => !!v || "Campo obbligatorio";
        },
        checkIban() {
            const ibanRegex = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
            // Questa regex segue il formato standard per gli IBAN italiani. 
            // Ecco come funziona la regex:
            // ^ indica l'inizio del testo.
            // IT indica le due lettere ISO che rappresentano l'Italia.
            // \d{2} corrisponde a due cifre di controllo.
            // [A-Z] corrisponde a una lettera maiuscola.
            // \d{10} corrisponde a dieci cifre che rappresentano il numero di conto bancario.
            // [0-9A-Z]{12} corrisponde a dodici cifre o lettere maiuscole che rappresentano 
            //      l'identificativo dell'istituto bancario.
            // $ indica la fine del testo.
            return v => ibanRegex.test(v.toUpperCase()) || 'Formato IBAN non valido'
        },
        validateDateInizio(v) {
            return v => this.dateInizioOptions(v) || "La data di inizio deve essere precedente alla data di fine";
        },
        validateDateFine(v) {
            return v => this.dateFineOptions(v) || "La data di fine deve essere successiva alla data di inizio";
        },
    },
    methods: {
        async onSave() {
            const isValid = await this.$refs.formNewConto.validate();
            if (!isValid) {
                return;
            } else {
                try {
                    this.isSaving = true;
                    // Servizio per salvataggio
                    if (this.provenienza === 'new') {
                        delete this.contoToUpdate.strContoId;
                    }
                    await postContiStruttura(this.contoToUpdate);
                    if (this.provenienza === 'update') {
                        this.$emit("updateConto");
                        notifySuccess("Conto della struttura aggiornato con successo");
                    } else if (this.provenienza === 'new') {
                        this.$emit("newConto");
                        notifySuccess("Conto aggiunto alla struttura con successo");
                    }
                } catch (e) {
                    if (this.provenienza === 'update') {
                        let message =
                            "Non Ã¨ stato possibile aggiornare il conto della struttura";
                    } else if (this.provenienza === 'new') {
                        let message =
                            "Non Ã¨ stato possibile aggiungere il nuovo conto alla struttura";
                    }
                    notifyError(e, message);
                }
            }
            this.isSaving = false;
            this.showDialogLocale = false;
        },
        formatDataStringIt(dateString) {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            return formattedDate;
        },
        dateForModal(dataToChange) {
            let fine = dataToChange.split('/');
            let dataFine = new Date(fine[2] + '-' + fine[1] + '-' + fine[0]);
            let dataRet = formatDate(dataFine, "YYYY-MM-DD");
            return dataRet;
        },
        dateFineOptions(date) {
            return !isDateGreaterThanDate(new Date(this.contoToUpdate.validitaInizio), new Date(date)) || date == null || date == '';
        },
        dateInizioOptions(date) {
            return this.contoToUpdate.validitaFine ? !isDateGreaterThanDate(new Date(date), new Date(this.contoToUpdate.validitaFine)) : true;
        },
        onHide() {
            this.showDialogLocale = false;
            this.$emit('hide');
        }
    }
};
</script>

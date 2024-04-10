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

                <template v-if="!isLoading">
                    <q-card-section>
                        {{ labelMessage }}
                        <strong>{{ subjectFullName }}</strong> alla struttura
                        <strong>{{ selectedStructure.nome }}</strong>?
                    </q-card-section>
                </template>
                <template v-else>
                    <q-inner-loading showing color="primary" />
                </template>
                <template v-if="!isLoading">
                    <q-card-section v-if="(subjectStrutturaAssistenza == strutturaOperazione && tipologia === 'DELETE_ASSOCIATION_STRUCTURE')
                        || tipologia === 'NEW_ASSOCIATION_STRUCTURE' || tipologia === 'NEW_MOVIMENTO'">
                        <div class="row col-md-12">
                            <div :class="classMotivazioneDate">
                                <q-input class="col-md-4" v-model="newMovimento.dataFine" type="date" :label="labelDate" stack-label
                                    @input="dataSoggNotValid = false" filled dense no-error-icon :rules="[ruleRequired]" />
                            </div>
                            <div :class="classMotivazioneDate">
                                <q-select class="col-md-4" v-model="newMovimento.motivazioneSelezionata" :options="mot"
                                    :rules="[ruleRequired]" option-label="tipoMovOspiteDesc" label="Motivazione*" emit-value
                                    map-options dense filled options-dense no-error-icon bottom-slots clearable
                                    @input="selezionaMotivazione" />
                            </div>
                            <div class="col-md-2 q-pr-lg" v-if="tipologia === 'DELETE_ASSOCIATION_STRUCTURE' ||
                                (tipologia === 'NEW_MOVIMENTO' && motivazioneFlagUscitaTrue)">
                                <q-toggle v-model="newMovimento.flag" label="Preserva Posto" />
                            </div>
                            <div class="col-md-12 q-pr-lg">
                                <template v-if="hintMovimenti && tipologia === 'NEW_MOVIMENTO'">
                                    <q-banner class="bg-light-blue-3 q-mb-md">{{ newMovimento.motivazioneSelezionata.tipoMovOspiteHint }}</q-banner>
                                </template>
                            </div>
                            <div class="col-md-12 q-pr-lg" v-if="dest && dest.length > 0">
                                <q-select class="col-md-4" v-model="newMovimento.destinazioneSelezionata" :options="struttureOptions"
                                    option-value="idStruttura" option-label="nome" :label="labelStrutture" emit-value
                                    map-options dense filled options-dense no-error-icon bottom-slots clearable use-input
                                    input-debounce="0" @filter="filtraStrutture" />
                            </div>
                            <div class="col-md-12 q-pr-lg" v-if="motivazioneFlagUscita">
                                <q-select class="col-md-4" v-model="newMovimento.condizioneSelezionata" :options="condizioniOptions"
                                    option-value="condizioniOspiteId" option-label="condizioniOspiteDesc"
                                    label="Condizione*" emit-value map-options dense filled options-dense no-error-icon
                                    bottom-slots clearable use-input input-debounce="0" :rules="[ruleRequired]" />
                            </div>
                            <div class="col-md-12 q-pr-lg">
                                <q-input v-model="newMovimento.note" filled type="textarea" label="Note*" :rules="[ruleRequired]" />
                            </div>
                        </div>
                    </q-card-section>
                </template>
                <template v-else>
                    <q-inner-loading showing color="primary" />
                </template>

                <!-- CONFERMA E SALVA --------------------START------------------------------------------- -->
                <q-card-section class="text-right">
                    <div class="row  q-col-gutter-md reverse">
                        <div class="col-md-auto col-12">
                            <template v-if="tipologia === 'DELETE_ASSOCIATION_STRUCTURE'">
                                <q-btn v-if="!isLoading" color="negative" :loading="isDeleting" class="full-width"
                                    @click="onDelete">Rimuovi</q-btn>
                            </template>
                            <template v-if="tipologia === 'NEW_ASSOCIATION_STRUCTURE'">
                                <q-btn v-if="!isLoading" color="secondary" :loading="isAssociation" class="full-width"
                                    @click="onAssociation">Aggiungi</q-btn>
                            </template>
                            <template v-if="tipologia === 'NEW_MOVIMENTO'">
                                <q-btn v-if="!isLoading" color="secondary" :loading="isNewMovimento" class="full-width"
                                    @click="onNewMovimento">Aggiungi</q-btn>
                            </template>
                        </div>
                        <div class="col-md-auto col-12">
                            <q-btn v-if="!isLoading" color="primary" outline v-close-popup
                                class="full-width">Indietro</q-btn>
                        </div>
                    </div>
                </q-card-section>
                <!-- CONFERMA E SALVA --------------------END------------------------------------------- -->
            </q-form>
        </q-card>
    </q-dialog>
</template>
  
<script>
import { TYPES } from "../store";
import { associaMovimentoOspite, associaSoggettoStruttura, disassociaSoggettoStruttura, getCondizioniOspite, getMotivazioneFullList, getStruttureByNatura } from "../services/api";
import { notifyError, notifySuccess, sortBy } from "../services/utils";
import { date } from 'quasar';

export default {
    name: "MovimentiDialog",
    props: {
        subject: { type: Object, required: false, default: null },
        newMovimento: { type: Object, required: false, default: null },
        idStrutturaRes: { type: String, required: false, default: null }, //Id della struttura
        title: { type: String, required: true, default: 'No title' }, //Titolo per la modal
        tipologia: { type: String, required: true, default: null }, //Tipologia per differenziare le modal
    },
    data() {
        return {
            labelForDate: '',
            labelMessaggioIniziale: '',
            labelStruttura: '',
            classForMotivazioneDate: '',
            isLoading: false,
            dest: [],
            struttureSearchValue: "",
            listaCondizioniOspite: [],
            mot: [],
            // DeleteAssociationStructure
            isDeleting: false,
            // NewAssociationStrutucture
            isAssociation: false,
            // NewMovimento
            isNewMovimento: false
        }
    },
    computed: {
        classMotivazioneDate() {
            switch (this.tipologia) {
                case "DELETE_ASSOCIATION_STRUCTURE":
                    this.classForMotivazioneDate = "col-md-5 q-pr-lg";
                    break;
                case "NEW_ASSOCIATION_STRUCTURE":
                    this.classForMotivazioneDate = "col-md-6 q-pr-lg";
                    break;
                case "NEW_MOVIMENTO":
                    this.classForMotivazioneDate = "col-md-5 q-pr-lg";
                    break;
                default:
                    this.classForMotivazioneDate = 'col-md-auto q-pr-lg';
            }
            return this.classForMotivazioneDate;
        },
        labelStrutture() {
            switch (this.tipologia) {
                case "DELETE_ASSOCIATION_STRUCTURE":
                    this.labelStruttura = "Destinazione";
                    break;
                case "NEW_ASSOCIATION_STRUCTURE":
                    this.labelStruttura = "Provenienza";
                    break;
                case "NEW_MOVIMENTO":
                    this.labelStruttura = "Struttura";
                    break;
                default:
                    this.labelStruttura = '';
            }
            return this.labelStruttura;
        },
        labelMessage() {
            switch (this.tipologia) {
                case "DELETE_ASSOCIATION_STRUCTURE":
                    this.labelMessaggioIniziale = "Desideri rimuovere l'assegnazione del soggetto ";
                    break;
                case "NEW_ASSOCIATION_STRUCTURE":
                    this.labelMessaggioIniziale = "Desideri assegnare il soggetto ";
                    break;
                case "NEW_MOVIMENTO":
                    this.labelMessaggioIniziale = "Desideri assegnare un nuovo movimento al soggetto ";
                    break;
                default:
                    this.labelMessaggioIniziale = '';
            }
            return this.labelMessaggioIniziale;
        },
        labelDate() {
            switch (this.tipologia) {
                case "DELETE_ASSOCIATION_STRUCTURE":
                    this.labelForDate = 'Data Uscita*';
                    break;
                case "NEW_ASSOCIATION_STRUCTURE":
                    this.labelForDate = 'Data Ingresso*';
                    break;
                case "NEW_MOVIMENTO":
                    this.labelForData = 'Data movimento*';
                    break;
                default:
                    this.labelForData = '';
            }
            return this.labelForData;
        },
        motivazioneFlagUscita() {
            if (this.newMovimento.motivazioneSelezionata) {
                if (this.newMovimento.motivazioneSelezionata.flgUscita == false) {
                    return true;
                }
            }
            return false;
        },
        motivazioneFlagUscitaTrue() {
            if (this.newMovimento.motivazioneSelezionata) {
                if (this.newMovimento.motivazioneSelezionata.flgUscita == true) {
                    return true;
                }
            }
            return false;
        },
        ruleRequired() {
            return v => !!v || "Campo obbligatorio";
        },
        // Ritorno dati della struttura
        selectedStructure() {
            return this.$store.getters[
                TYPES.GETTERS.SELECTED_PROFILE
            ]?.elencoStrutturaArea?.find(
                strut => strut.idStruttura === this.idStrutturaRes
            );
        },
        hintMovimenti() {
            return this.newMovimento.motivazioneSelezionata?.tipoMovOspiteHint ?? false;
        },
        // Nome del soggetto della struttura
        subjectFullName() {
            return this.subject?.nome + " " + this.subject?.cognome;
        },
        strutturaOperazione() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].idStruttura;
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

        attrs() {
            let { ...attrs } = this.$attrs;
            return attrs;
        },
        listeners() {
            let { ...listeners } = this.$listeners;
            return listeners;
        },

        subjectId() {
            return this.subject?.idSoggetto;
        },
        subjectStrutturaAssistenza() {
            return this.subject?.idStrutturaAssistenza;
        },
        struttureOptions() {
            return this.dest.filter(c => {
                const toSearch = this.struttureSearchValue?.toUpperCase?.() ?? "";
                const searchable = c.nome.toUpperCase();
                return searchable.includes(toSearch);
            });
        },
        condizioniOptions() {
            return this.listaCondizioniOspite;
        }
    },
    watch: {},
    async created() {
        this.isLoading = true;
        let promise = await getMotivazioneFullList();
        let motiva = promise.data;
        switch (this.tipologia) {
            case "DELETE_ASSOCIATION_STRUCTURE":
                this.mot = motiva.filter(f => f.flgUscita && !f.flgIngresso);
                break;
            case "NEW_ASSOCIATION_STRUCTURE":
                this.mot = motiva.filter(f => f.flgIngresso && !f.flgUscita);
                break;
            case "NEW_MOVIMENTO":
                this.mot = motiva;
                break;
            default:
                break;
        }
        let getDataCondizioni = await getCondizioniOspite();
        this.listaCondizioniOspite = getDataCondizioni.data;
        this.isLoading = false;
    },
    methods: {
        async onDelete() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) return;
            let payload = {}
            this.isDeleting = true;
            if (this.subjectStrutturaAssistenza == this.strutturaOperazione) {
                payload = {
                    dataMovimento: new Date(this.dataFine),
                    tipoMovOspiteId: this.newMovimento.motivazioneSelezionata.tipoMovOspiteId,
                    flgPreservaPosto: this.newMovimento.flag,
                    idStrutturaOd: this.newMovimento.destinazioneSelezionata,
                    note: this.newMovimento.note
                }
            }
            try {
                let promise = await disassociaSoggettoStruttura(
                    this.subject.idSoggetto,
                    this.idStrutturaRes,
                    payload
                );
                notifySuccess("Soggetto rimosso dalla struttura");
                this.$emit("deletedAssociation");
            } catch (e) {
                let message =
                    "Non Ã¨ stato possibile rimuovere il soggetto dalla struttura";
                notifyError(e, message);
            }

            this.isDeleting = false;
        },
        async onAssociation() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) return;

            this.isAssociation = true;
            let payload = {
                dataMovimento: new Date(this.dataFine),
                tipoMovOspiteId: this.newMovimento.motivazioneSelezionata.tipoMovOspiteId,
                flgPreservaPosto: true,
                idStrutturaOd: this.newMovimento.destinazioneSelezionata,
                note: this.note
            }
            try {
                let promise = await associaSoggettoStruttura(
                    this.subject.idSoggetto,
                    this.idStrutturaRes,
                    true,
                    payload
                );
                notifySuccess("Soggetto aggiunto dalla struttura");
                this.$emit("newAssociation");
            } catch (e) {
                let message =
                    "Non Ã¨ stato possibile aggiungere il soggetto dalla struttura";
                notifyError(e, message);
            }

            this.isAssociation = false;
        },
        async onNewMovimento() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) return;

            this.isNewMovimento = true;
            let payload = {
                idSoggetto: this.subject.idSoggetto,
                dataMovimento: new Date(this.newMovimento.dataFine),
                tipoMovOspiteId: this.newMovimento.motivazioneSelezionata.tipoMovOspiteId,
                flgPreservaPosto: this.newMovimento.flag,
                note: this.newMovimento.note,
                idStrutturaOd: this.newMovimento.destinazioneSelezionata,
                condizioniOspiteId: this.newMovimento.condizioneSelezionata
            }
            try {
                console.log(payload); //DEBUG
                await associaMovimentoOspite(payload);
                notifySuccess("Movimento aggiuto con successo all'ospite");
                this.$emit("newMovimento");
            } catch (e) {
                let message =
                    "Non Ã¨ stato possibile aggiungere il movimento all'ospite";
                notifyError(e, message);
            }

            this.isNewMovimento = false;
        },
        async selezionaMotivazione() {
            if (this.newMovimento.motivazioneSelezionata?.tipoMovOspiteNaturaSod.length > 0) {
                this.isLoading = true;
                let nature = '';
                for (let i = 0; i < this.newMovimento.motivazioneSelezionata.tipoMovOspiteNaturaSod.length; i++) {
                    if (i == this.newMovimento.motivazioneSelezionata.tipoMovOspiteNaturaSod.length - 1) {
                        nature += this.newMovimento.motivazioneSelezionata.tipoMovOspiteNaturaSod[i].naturaStrutturaOd;
                    } else {
                        nature += this.newMovimento.motivazioneSelezionata.tipoMovOspiteNaturaSod[i].naturaStrutturaOd + ',';
                    }
                }
                let promise = await getStruttureByNatura(nature);
                let d = promise.data;

                this.dest = d;
                // this.dest = sortBy(this.dest, "nome")
                this.isLoading = false;
            } else {
                this.dest = [];
            }
        },
        filtraStrutture(val, update) {
            update(() => {
                this.struttureSearchValue = val;
            });
        }
    }
};
</script>
  
<style scoped></style>
  
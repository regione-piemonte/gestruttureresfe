<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <q-dialog v-model="showDialogLocale" @hide="onHide()">
        <q-card class="full-width">
            <q-card-section class="q-py-none">
                <q-toolbar class="q-px-none">
                    <q-toolbar-title>{{ title }}</q-toolbar-title>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-toolbar>
            </q-card-section>
            <q-separator />
            <!-- <q-card-section>
                Desideri rimuovere il conto <strong>{{ contoToDelete.strContoDesc }}</strong>
                dalla struttura <strong>{{ nomeStruttura }}</strong>?
            </q-card-section> -->
            <q-form ref="formCambiaStato">
                <q-card-section>
                    <div class="row col-md-12">
                        <div class="col-md-12 q-pr-lg">
                            <q-select class="col-md-4" v-model="listaStatoSelezionato"
                                :options="getListaStatiRendicontazione" option-value="statoRendId"
                                option-label="statoRendDesc" label="Stati rendicontazione*" emit-value map-options dense
                                filled options-dense no-error-icon bottom-slots clearable use-input input-debounce="0"
                                :rules="[ruleRequired]" v-if="getListaStatiRendicontazione !== null" />
                        </div>
                    </div>
                </q-card-section>

                <!-- CONFERMA E SALVA -->
                <q-card-section class="text-right">
                    <div class="row  q-col-gutter-md reverse">
                        <div class="col-md-auto col-12">
                            <q-btn color="primary" class="full-width" :loading="isSaving" @click="onSave">Salva</q-btn>
                        </div>
                        <div class="col-md-auto col-12">
                            <q-btn color="primary" outline v-close-popup class="full-width">Indietro</q-btn>
                        </div>
                    </div>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>
</template>

 
<script>
import { TYPES } from 'src/store';
import { notifyError, notifySuccess } from 'src/services/utils';
import { getStatiRendicontazione, postRemoveContiStruttura, postStatiRendicontazione } from 'src/services/api';

export default {
    name: "CambiaStatoRendicontazioneDialog",
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
        rendicontazioneToUpdate: {
            required: true,
            default: null
        }
    },
    data() {
        return {
            showDialogLocale: false,
            listaStatiRendicontazione: [],
            listaStatoSelezionato: '',
            isSaving: false,
        };
    },
    watch: {
        showDialog(newVal) {
            // Aggiorna la copia locale quando la prop showDialog cambia
            this.showDialogLocale = newVal;
        },
    },
    computed: {
        ruleRequired() {
            return v => !!v || "Campo obbligatorio";
        },
        nomeStruttura() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].stiNome;
        },
        getListaStatiRendicontazione() {
            this.listaStatoSelezionato = '';

            this.listaStatiRendicontazione = this.$store.getters['getListaStatiRendicontazione'];

            if (this.rendicontazioneToUpdate != null && this.rendicontazioneToUpdate.length > 0
                && this.listaStatiRendicontazione != undefined) {
                // Ottengo l'oggetto statoRendicontazione con all'interno il suo flow
                let statoRendicontazioneIdIn = this.rendicontazioneToUpdate[0].statoRendId;
                let statoRendicontazione = this.listaStatiRendicontazione.filter(f => f.statoRendId == statoRendicontazioneIdIn);
                // Check flgStruttura=true, Ã¨ un cambia stato che puÃ² effettuare la struttura?
                let forStruttura = [];
                statoRendicontazione[0].workflowRendicontazione.forEach(element => {
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
                this.listaStatiRendicontazione = statiPossibili;
            }
            return this.listaStatiRendicontazione ?? null;
        }
    },
    methods: {
        async onSave() {
            const isValid = await this.$refs.formCambiaStato.validate();
            if (!isValid) {
                return;
            } else {
                this.isSaving = true;
                try {
                    const oldStato = this.rendicontazioneToUpdate[0].statoRendId;
                    let rendicontazioniId = [];
                    for (let index = 0; index < this.rendicontazioneToUpdate.length; index++) {
                        rendicontazioniId.push(this.rendicontazioneToUpdate[index].rendicontazioneId);
                    }

                    let payload = {
                        oldStato: oldStato,
                        newStato: this.listaStatoSelezionato,
                        rendicontazioniId: rendicontazioniId
                    }

                    await postStatiRendicontazione(payload);
                    this.$emit("cambioStato");
                    notifySuccess("Stato della rendicontazione modificato con successo");
                } catch (e) {
                    let message =
                        "Non Ã¨ stato possibile modificare lo stato della rendicontazione";
                    notifyError(e, message);
                }
            }
            this.isSaving = false;
            this.showDialogLocale = false;
        },
        async loadStatiRendicontazione() {
            try {
                const response = await getStatiRendicontazione();
                let arrayResponse = [...response?.data];
                return arrayResponse;
            } catch (err) {
                notifyError(err, "Non Ã¨ stato possibile ottenere gli stati della rendicontazione");
            }
        },
        onHide() {
            this.listaStatoSelezionato = '';
            this.showDialogLocale = false;
            this.$emit('hide');
        }
    },
    async created() {
        this.listaStatiRendicontazione = await this.loadStatiRendicontazione();
        await this.$store.dispatch('setListaStatiRendicontazione', { listaStatiRendicontazione: this.listaStatiRendicontazione });
    },
};
</script>

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
            <q-card-section>
                Desideri invalidare il conto <strong>{{ contoToDelete.strContoDesc }}</strong>
                dalla struttura <strong>{{ nomeStruttura }}</strong>?
            </q-card-section>
            <!-- CONFERMA E SALVA -->
            <q-card-section class="text-right">
                <div class="row  q-col-gutter-md reverse">
                    <div class="col-md-auto col-12">
                        <q-btn color="negative" class="full-width" @click="onDelete">DISATTIVA</q-btn>
                    </div>
                    <div class="col-md-auto col-12">
                        <q-btn color="primary" outline v-close-popup class="full-width">INDIETRO</q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>


<script>
import { TYPES } from 'src/store';
import { notifyError, notifySuccess } from 'src/services/utils';
import { postInvalidaContiStruttura, postRemoveContiStruttura } from 'src/services/api';

export default {
    name: "EliminaContoDialog",
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
        contoToDelete: {
            type: Object,
            required: true,
            default: null
        }
    },
    data() {
        return {
            showDialogLocale: false,
        };
    },
    watch: {
        showDialog(newVal) {
            // Aggiorna la copia locale quando la prop showDialog cambia
            this.showDialogLocale = newVal;
        },
    },
    computed: {
        nomeStruttura() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].stiNome;
        }
    },
    methods: {
        async onDelete() {
            this.showDialogLocale = false;
            try {
                let payload = {
                    strContoId: this.contoToDelete.strContoId
                }
                await postInvalidaContiStruttura(payload);
                this.$emit("removeConto");
                notifySuccess("Conto rimosso dalla struttura con successo");
            } catch (e) {
                let message =
                    "Non Ã¨ stato possibile invalidare il conto della struttura";
                notifyError(e, message);
            }
        },
        onHide() {
            this.showDialogLocale = false;
            this.$emit('hide');
        }
    }
};
</script>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
    <q-dialog v-model="showDialogLocale" @hide="onHide()">
        <q-card class=" q-pl-md" style="width: 800px; max-width: 80vw;">
            <q-card-section class="q-py-none">
                <q-toolbar class="q-px-none">
                    <q-toolbar-title>{{ checkModificabile === false ? 'Visualizzazione rendicontazione' : title
                    }}</q-toolbar-title>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-toolbar>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <!-- Modifica della rendicontazione effettuata in data <strong>{{ dataRendicontazione | dateMonthYear }}</strong>
                effettuata dall'ospite <strong>{{ nomeSoggetto }}</strong>&nbsp;<strong>{{ cognomeSoggetto }}</strong>
                nella struttura <strong>{{ nomeStruttura }}</strong> -->
                <p> Ospite: <strong>{{ nomeSoggetto }}</strong>&nbsp;<strong>{{ cognomeSoggetto }}</strong></p>
                <p> Struttura: <strong>{{ nomeStruttura }}</strong></p>
            </q-card-section>
            <q-card-section>
                <q-form ref="formUpdateRendicontazione">
                    <div class="row col-md-12">
                        <div class="col-md-6 q-pr-lg">
                            <p> Stato rendicontazione: <strong>{{ statoRendDescLabel }}</strong></p>
                        </div>
                        <div class="col-md-6 q-pr-lg">
                            <p> Mese rendicontazione: <strong>{{ subjectUpdate.dataRendicontazione | dateMonthYear
                            }}</strong></p>
                        </div>
                    </div>
                    <!-- FASCE -->
                    <div class="row col-md-12">
                        <div class="col-md-6 q-pr-md">
                            <q-select class="col-md-4" v-model="fasciaLocale" :options="fasce"
                                option-label="welfareFasciaDesc" label="Fasce rendicontazione*" emit-value map-options dense
                                filled options-dense no-error-icon bottom-slots clearable input-debounce="0"
                                :rules="[ruleRequired]" :readonly="checkModificabile === false" />
                        </div>
                        <div class="col-md-6 q-pr-md" v-if="fasciaLocale">
                            <q-input v-model="fasciaLocale.tariffaMensileMassima" type="text" readonly
                                label="Valore economico" filled dense />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Importo indicato dalla struttura, per la fascia selezionata, in sede di adesione al
                                    buono
                                </div>
                            </q-tooltip>
                        </div>
                    </div>
                    <!-- IMPORTI -->
                    <div class="row col-md-12">
                        <div class="col-md-6 q-pr-md">
                            <q-input v-model.number="subjectUpdate.importoRetta" type="number" step="0.5" min="0"
                                label="Importo Fattura" filled dense :rules="[ruleRequiredNumbers]"
                                :readonly="checkModificabile === false" />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Inserire importo complessivo della fattura comprensivo dei 600 del buono
                                </div>
                            </q-tooltip>
                        </div>
                        <div class="col-md-6 q-pr-md">
                            <q-btn flat color="yellow-9 " icon="warning" @click="" />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Importo obbligatorio per il passaggio di stato a "pronta all'invio" (importo maggiore o uguale a 600â¬)
                                </div>
                            </q-tooltip>
                        </div>
                        <!-- CONTI -->
                        <div class="col-md-6 q-pr-md"
                            v-if="checkModificabile === false && subjectUpdate.strContoId != null">
                            <q-select class="col-md-4" v-model="contoLocale" :options="listaContiStruttura"
                                option-label="strContoDesc" label="Conti struttura*" emit-value map-options dense filled
                                options-dense no-error-icon bottom-slots clearable input-debounce="0"
                                :rules="[ruleRequired]" :readonly="checkModificabile === false" />
                        </div>
                    </div>
                    <!-- RADIO BUTTON -->
                    <div class="row col-md-12" v-if="subjectUpdate.flgPrimaRendicontazione === true">
                        <q-radio v-model="radioChoice" v-if="subjectUpdate.flgTrasferito === false" val="inStruttura"
                            label="Ospite giÃ  presente in struttura" :disable="checkModificabile === false" />
                        <div>
                            <q-radio v-model="radioChoice" val="primoIngresso" label="Primo Ingresso"
                                :disable="checkModificabile === false" />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Si intende nuovo ingresso in struttura, l'ingresso avvenuto dopo la presentazione della
                                    domanda del buono di residenzialitÃ 
                                </div>
                            </q-tooltip>
                        </div>
                    </div>
                    <!-- FILES -->
                    <!-- <div class="row justify-end ">
                        <div class=" q-py-md q-px-md text-bold text-h6 text-right">
                            <q-btn @click="openFile()" color="primary">
                                SCARICA DICHIARAZIONE RSA
                            </q-btn>
                        </div>
                    </div> -->
                    <template v-if="subjectUpdate.flgPrimaRendicontazione === false">
                        <div class="row col-md-12 q-pt-md q-pr-md" v-for="(file, i) in files" :key="i">
                            <q-file class="col-10 fileNonObbligatori" dense outlined input-class="text-black text-bold"
                                v-model="file.value" :label="checkExistFile(file)" label-color="black" clearable
                                :readonly="checkModificabile === false">
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                </template>
                                <q-tooltip max-width="300px" anchor="top right" self="bottom middle"
                                    v-if="file.fileTipoHint">
                                    <div class="text-body2">
                                        {{ file.fileTipoHint }}
                                    </div>
                                </q-tooltip>
                            </q-file>
                            <!-- Elimina file -->
                            <div class="col-md-1 q-pl-md">
                                <q-btn flat color="red" icon="delete" @click="deleteFile(file)"
                                    v-if="checkFileDaEliminare(file)" :disable="checkModificabile === false" />
                            </div>
                            <!-- Icona file obbligatorio -->
                            <div class="col-md-1 q-pl-md" v-if="checkHintFileObbligatorio('normal', file.fileTipoId)">
                                <q-btn flat color="yellow-9 " icon="warning" @click="" />
                                <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                    <div class="text-body2">
                                        File obbligatorio per il passaggio di stato della rendicontazione a "pronta
                                        all'invio".
                                    </div>
                                </q-tooltip>
                            </div>
                        </div>
                    </template>
                    <template
                        v-if="subjectUpdate.flgPrimaRendicontazione === true && radioChoice === 'inStruttura' && subjectUpdate.flgTrasferito === false">
                        <div class="row col-md-12 q-pt-md q-pr-md" v-for="(file, i) in filesOspiteInStruttura" :key="i">
                            <q-file class="col-10 fileNonObbligatori" dense outlined input-class="text-black text-bold"
                                v-model="file.value" :label="checkExistFile(file)" label-color="black" clearable
                                :readonly="checkModificabile === false">
                                <!-- :rules="file.fileTipoCod === 'RBRM1_FATTURA_MESE_PRECEDENTE' 
                                && ruleFileNotEmptyOspiteInStrutturaF() ? [ruleFileNotEmptyOspiteInStruttura] : []"> -->
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                </template>
                                <q-tooltip max-width="300px" anchor="top right" self="bottom middle"
                                    v-if="file.fileTipoHint">
                                    <div class="text-body2">
                                        {{ file.fileTipoHint }}
                                    </div>
                                </q-tooltip>
                            </q-file>
                            <!-- Elimina file -->
                            <div class="col-md-1 q-pl-md">
                                <q-btn flat color="red" icon="delete" @click="deleteFile(file)"
                                    v-if="checkFileDaEliminare(file)" :disable="checkModificabile === false" />
                            </div>
                            <!-- Icona file obbligatorio -->
                            <div class="col-md-1 q-pl-md" v-if="checkHintFileObbligatorio('inStruttura', file.fileTipoId)">
                                <q-btn flat color="yellow-9 " icon="warning" @click="" />
                                <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                    <div class="text-body2">
                                        File obbligatorio per il passaggio di stato della rendicontazione a "pronta
                                        all'invio".
                                    </div>
                                </q-tooltip>
                            </div>
                        </div>
                    </template>
                    <template v-if="subjectUpdate.flgPrimaRendicontazione === true && radioChoice === 'primoIngresso'">
                        <div class="row col-md-12 q-pt-md q-pr-md" v-for="(file, i) in filesPrimoIngresso" :key="i">
                            <q-file class="col-10 fileNonObbligatori" dense outlined input-class="text-black text-bold"
                                v-model="file.value" :label="checkExistFile(file)" label-color="black" clearable
                                :readonly="checkModificabile === false">
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                </template>
                                <q-tooltip max-width="300px" anchor="top right" self="bottom middle"
                                    v-if="file.fileTipoHint">
                                    <div class="text-body2">
                                        {{ file.fileTipoHint }}
                                    </div>
                                </q-tooltip>
                            </q-file>
                            <!-- Elimina file -->
                            <div class="col-md-1 q-pl-md">
                                <q-btn flat color="red" icon="delete" @click="deleteFile(file)"
                                    v-if="checkFileDaEliminare(file)" :disable="checkModificabile === false" />
                            </div>
                            <!-- Icona file obbligatorio -->
                            <div class="col-md-1 q-pl-md"
                                v-if="checkHintFileObbligatorio('primoIngresso', file.fileTipoId)">
                                <q-btn flat color="yellow-9 " icon="warning" @click="" />
                                <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                    <div class="text-body2">
                                        File obbligatorio per il passaggio di stato della rendicontazione a "pronta
                                        all'invio".
                                    </div>
                                </q-tooltip>
                            </div>
                        </div>
                    </template>
                    <!-- CONDIZIONI -->
                    <div class="row col-md-12 q-pt-lg">
                        <div class="col-md-6 q-pr-md q-pb-none">
                            <p class="q-pl-sm"> Condizioni di uscita dal buono (opzionale) </p>
                            <q-select class="q-pr-md q-pb-none" v-model="condizioneLocale" :options="condizioniUscitaBuono"
                                option-label="tipoMovOspiteDesc" label="Condizione" emit-value map-options dense filled
                                options-dense no-error-icon bottom-slots clearable input-debounce="0"
                                :readonly="checkModificabile === false" />
                            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
                                <div class="text-body2">
                                    Da compilare solo nel caso di perdita del diritto alla fruizione del Buono, per
                                    dimissione definitiva e liberazione del posto letto o passaggio in
                                    convenzionamento.
                                </div>
                            </q-tooltip>
                        </div>
                        <div class="col-md-6 q-pr-md q-pb-none">
                            <p v-if="condizioneLocale" class="q-pl-sm"> Data uscita dal buono </p>
                            <q-input class="q-ma-none q-pb-none" filled dense v-model="dataCondizione" mask="date"
                                :rules="['date']" v-if="condizioneLocale" :readonly="checkModificabile === false" readonly>
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                            <q-date v-model="dataCondizione" :options="optionsFn" today-btn>
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                                <q-tooltip max-width="300px" anchor="top middle" self="bottom middle"
                                    v-if="subjectUpdate.flgPrimaRendicontazione === true">
                                    <div class="text-body2">
                                        Se la condizione di uscita dal buono Ã¨ antecedente al primo giorno mese di
                                        decorrenza dello stesso, indicare come data di uscita dal buono il primo giorno del
                                        mese. (es: validitÃ  buono settembre 2023, uscita dal buono 25 agosto: indicare come
                                        data di uscita dal buono 1 settembre 2023)
                                    </div>
                                </q-tooltip>
                            </q-input>
                        </div>
                        <div class="col-md-12 q-pt-sm q-pb-none q-pr-md" v-if="condizioneLocale">
                            <q-banner dense rounded class="bg-blue-2 q-pl-none q-pt-none q-pb-none q-pr-sm">
                                <q-field color="black" v-model="presaVisione" borderless :rules="[ruleCertified]">
                                    <q-checkbox class="q-pt-md" v-model="presaVisione" :label="titleForCondizioneUscita" />
                                </q-field>
                            </q-banner>
                        </div>
                    </div>
                    <div class="row col-md-12 q-pt-lg">
                        <div class="col-md-12 q-pr-md q-pb-none">
                            <q-input class="my-custom-textarea" v-model="note" filled type="textarea" label="Note"
                                :readonly="checkModificabile === false" />
                        </div>
                    </div>
                </q-form>
            </q-card-section>
            <!-- Banner -->
            <!-- <q-card-section v-if="checkFileObbligatoriHint() && subjectUpdate.flgPrimaRendicontazione === false">
                <div class="row col-md-12">
                    <div class="col-md-auto">
                        <q-banner class="bg-blue-2 q-pl-md" dense rounded>
                            <strong>Ricordati di caricare la fattura prima di effettuare un cambio di stato!</strong>
                        </q-banner>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-if="checkFileObbligatoriHintPrimoMese()
                && subjectUpdate.flgPrimaRendicontazione === true
                && radioChoice === 'primoIngresso'">
                <div class="row col-md-12">
                    <div class="col-md-auto">
                        <q-banner class="bg-blue-2 q-pl-md" dense rounded>
                            <strong>Attenzione</strong> Ã¨ obbligatorio caricare la fattura del mese precendente!
                        </q-banner>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-if="checkFileObbligatoriHintInStruttura()
                && subjectUpdate.flgPrimaRendicontazione === true
                && radioChoice === 'inStruttura'">
                <div class="row col-md-12">
                    <div class="col-md-auto">
                        <q-banner class="bg-blue-2 q-pl-md" dense rounded>
                            <strong>Attenzione</strong> Ã¨ obbligatorio caricare la fattura del mese precendente!
                        </q-banner>
                    </div>
                </div>
            </q-card-section> -->
            <!-- CONFERMA E SALVA -->
            <q-card-section class="text-right">
                <div class="row  q-col-gutter-md reverse">
                    <div class="col-md-auto col-12">
                        <q-btn-dropdown color="secondary" label="Salva" v-if="checkModificabile !== false">
                            <q-list>
                                <q-item clickable v-close-popup @click="onUpdate('modificaRendicontazione')"
                                    :loading="isSaving">
                                    <q-item-section>
                                        <q-item-label>Salva in bozza</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <div v-for="(stato, i) in returnListaStatiRend" :key="i">
                                    <q-item clickable v-close-popup @click="openDialogConferma(stato)" :loading="isSaving">
                                        <q-item-section>
                                            <q-item-label>Salva come: {{ stato.statoRendDesc }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </q-list>
                        </q-btn-dropdown>
                    </div>
                    <div class="col-md-auto col-12">
                        <q-btn color="primary" outline v-close-popup class="full-width">Indietro</q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <!-- Dialog conferma per cambio di stato della rendicontazione -->
        <q-dialog v-model="showDialogConfermaCambioStato" @hide="onHideCambioStato()">
            <q-card>
                <q-card-section class="q-py-none">
                    <q-toolbar class="q-px-none">
                        <q-toolbar-title>Cambio stato rendicontazione</q-toolbar-title>
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-toolbar>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <template v-if="checkHintInformativaUtente">
                        <q-banner dense rounded class="bg-blue-2 q-pl-none q-pt-none q-pb-none q-pr-sm">
                            <q-field color="black" v-model="presaVisioneConferma" borderless :rules="[ruleCertified]">
                                <q-checkbox class="q-pt-md" v-model="presaVisioneConferma" :label="informativaUtente" />
                            </q-field>
                        </q-banner>
                    </template>
                    <template v-if="checkGeneraDichiarazione">
                        <div class="row col-md-12 q-pt-lg">
                            <p><strong>Testo della dichiarazione</strong></p>
                            <div class="col-md-12 q-pr-sm">
                                <!-- <q-input class="my-custom-textarea-text" v-html="testoRendicontazioneHtml" filled type="textarea"
                                    label="Testo DIchiarazione" readonly /> -->
                                <q-scroll-area style="height: 300px;">
                                    <div v-html="testoRendicontazioneHtml"></div>
                                </q-scroll-area>
                            </div>
                            <div class="col-md-12">
                                <q-field color="black" v-model="presaVisioneConfermaTesto" borderless
                                    :rules="[ruleCertified]">
                                    <q-checkbox class="q-pt-md" full-width v-model="presaVisioneConfermaTesto"
                                        label="Conferma la presa visione del testo della dichiarazione" />
                                </q-field>
                            </div>
                        </div>
                    </template>
                </q-card-section>
                <!-- <q-card-section>
                    Attenzione proseguendo con il salvataggio la rendicontaizione non potrÃ  piÃ¹ essere modificata. I
                    documenti
                    verranno trasmessi a Finpiemonte al termine del trimestre di rendicontazione corrente
                </q-card-section> -->

                <!-- CONFERMA E SALVA -->
                <q-card-section class="text-right">
                    <div class="row  q-col-gutter-md reverse">
                        <div class="col-md-auto col-12">
                            <q-btn color="primary" class="full-width" :loading="isSaving"
                                @click="cambiaStato()">CONFERMA</q-btn>
                        </div>
                        <div class="col-md-auto col-12">
                            <!-- <q-btn color="primary" outline v-close-popup class="full-width">INDIETRO</q-btn> -->
                            <q-btn color="primary" class="full-width" outline
                                @click="closeCambiaStatoPopUp()">INDIETRO</q-btn>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-dialog>
</template>


<script>
import { TYPES } from 'src/store';
import { file2Base64, notifyError, notifySuccess } from 'src/services/utils';
import { getContiStrutturaRendicontazione, getDichiarazioneRsa, getListFile, getMotivazioneFullList, getStatiRendicontazione, getStrutturaWelfareFasce, getTestoDichiarazione, getWelfareFasce, postFileRendicontazione, postRendicontazioniStruttura, postStatiRendicontazione } from 'src/services/api';

export default {
    name: "ModificaRendicontazioneContoDialog",
    props: {
        showDialog: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
            default: null
        },
        subjectUpdate: {
            required: true,
            default: null
        },
        fasciaLocale: {
            required: true,
            default: null
        },
        contoLocale: {
            required: true,
            default: null
        },
        condizioneLocale: {
            required: true,
            default: null
        },
        dataCondizione: {
            required: true,
            default: ''
        },
        radioChoice: {
            required: true,
            default: ''
        },
        note: {
            required: true,
            default: ''
        }
    },
    data() {
        return {
            showDialogLocale: false,
            fasce: [],
            files: [],
            filesPrimoIngresso: [],
            filesOspiteInStruttura: [],
            statiRendicontazione: [],
            listaContiStruttura: [],
            isLoading: false,
            condizioniUscitaBuono: [],
            presaVisione: false,
            presaVisioneConferma: false,
            presaVisioneConfermaTesto: false,
            testoRendicontazioneHtml: ``,
            titleForCondizioneUscita: `Attenzione ! in caso di cessazione dell'inserimento, la revoca del buono decorre dal mese successivo 
                (se l'evento avviene a partire dal giorno 16 del mese) oppure dal mese corrente 
                (se l'evento avviene entro il giorno 15: in questo caso non si devono allegare i titoli di spesa del mese corrente; 
                    occorre utilizzare l'opzione "salva come: Non rendicontabile")`,
            isSaving: false,
            showDialogConfermaCambioStato: false,
            statoSwap: null,
            newIdRendicontazione: null,
            informativaUtente: '',
            errorPostRend: false,
        };
    },
    watch: {
        showDialog(newVal) {
            // Aggiorna la copia locale quando la prop showDialog cambia
            this.showDialogLocale = newVal;
        },
    },
    computed: {
        checkGeneraDichiarazione() {
            if (this.subjectUpdate) {
                const statoRendicontazione = this.statiRendicontazione.filter((e) => e.statoRendId === this.subjectUpdate.statoRendId);
                if (statoRendicontazione.length > 0) {
                    let workflowRendicontazione = statoRendicontazione[0].workflowRendicontazione;
                    for (let i = 0; i < workflowRendicontazione.length; i++) {
                        if (this.statoSwap != null) {
                            if (workflowRendicontazione[i].statoRendIdNew === this.statoSwap.statoRendId) {
                                if (workflowRendicontazione[i].flgGeneraDichiarazione) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        },
        checkModificabile() {
            if (this.subjectUpdate.statoRendId !== undefined) {
                return this.subjectUpdate.covidrsaDStatoRendicontazione.flgModificabile;
            } else {
                return true;
            }
        },
        ruleCertified() {
            return v => v === true || "Conferma la presa visione";
        },
        ruleFileNotEmpty() {
            return v => (!!v && v.size > 0) || "File vuoto"
        },
        ruleFileNotEmptyOspiteInStruttura() {
            return file => (!!file && file.size > 0) || "Caricare la fattura del mese precedente a quello in cui si sta rendicontando"
        },
        ruleRequired() {
            return v => !!v || "Campo obbligatorio";
        },
        ruleRequiredNumbers() {
            return v => v !== null && v !== undefined && v !== '' && (typeof v !== 'number' || v >= 0) || "Campo obbligatorio";
        },
        nomeStruttura() {
            return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE].stiNome;
        },
        nomeSoggetto() {
            return this.subjectUpdate?.soggetto?.nome ?? '';
        },
        cognomeSoggetto() {
            return this.subjectUpdate?.soggetto?.cognome ?? '';
        },
        dataRendicontazione() {
            return this.subjectUpdate?.dataRendicontazione ?? '';
        },
        statoRendDescLabel() {
            if (this.subjectUpdate?.covidrsaDStatoRendicontazione === undefined) {
                return '';
            } else {
                return this.subjectUpdate?.covidrsaDStatoRendicontazione.statoRendDesc ?? '';
            }
        },
        returnListaStatiRend() {
            return this.getListaStatiRendicontazione().length > 0 ? this.getListaStatiRendicontazione() : null;
        },
        checkHintInformativaUtente() {
            this.informativaUtente = '';
            let statoRendicontazione = this.statiRendicontazione.filter((e) => e.statoRendId === this.subjectUpdate.statoRendId);
            if (statoRendicontazione.length > 0 && this.statoSwap !== null) {
                let workflow = statoRendicontazione[0].workflowRendicontazione;
                for (let i = 0; i < workflow.length; i++) {
                    if (workflow[i].statoRendIdNew === this.statoSwap.statoRendId) {
                        this.informativaUtente = workflow[i].informativaUtente;
                        return true;
                    }
                }
            }
            return false;
        },
    },
    methods: {
        // CAMBIA STATO
        closeCambiaStatoPopUp() {
            this.showDialogConfermaCambioStato = false; //Chiudo la pop-up di conferma cambio stato
        },
        async openDialogConferma(stato) {
            this.errorPostRend = false;
            //Check radio button
            if (this.radioChoice === '' && this.subjectUpdate.flgPrimaRendicontazione === true) {
                let e = null;
                let message =
                    "Seleziona una opzione fra: Primo Ingresso o Ospite giÃ  presente in struttura";
                notifyError(e, message);
                return;
            }
            //Check presa visione
            if (!this.presaVisione && this.condizioneLocale !== null) {
                let e = null;
                let message =
                    "Conferma la presa visione del messaggio";
                notifyError(e, message);
                return;
            }
            // UPDATE
            const isValid = await this.$refs.formUpdateRendicontazione.validate();
            if (!isValid) {
                return;
            } else {
                this.isSaving = true;
                await this.onUpdate('cambioStato');  //Update della rendicontazione
                if (this.errorPostRend) {
                    return;
                }
                this.isSaving = false;
                this.statoSwap = stato;
                if (this.checkGeneraDichiarazione) {
                    let idRendicontazione = null;
                    if (this.newIdRendicontazione === null) {
                        idRendicontazione = this.subjectUpdate.rendicontazioneId;
                    } else {
                        idRendicontazione = this.newIdRendicontazione;
                    }
                    let data = await getTestoDichiarazione(idRendicontazione);
                    this.testoRendicontazioneHtml = data.data;
                }
                this.showDialogConfermaCambioStato = true; //Apro la pop-up di conferma cambio stato
            }
        },
        onHideCambioStato() {
            this.presaVisione = false;
            this.presaVisioneConferma = false;
            this.presaVisioneConfermaTesto = false;
            this.showDialogConfermaCambioStato = false;
        },
        async cambiaStato() {
            this.isSaving = true;
            if (this.checkGeneraDichiarazione) {
                if (!this.presaVisioneConfermaTesto) {
                    this.isSaving = false;
                    let e = null;
                    let message =
                        "Conferma la presa visione";
                    notifyError(e, message);
                    return;
                }
            }
            if (!this.presaVisioneConferma) {
                this.isSaving = false;
                let e = null;
                let message =
                    "Conferma la presa visione";
                notifyError(e, message);
                return;
            }
            try {
                const oldStato = this.subjectUpdate.statoRendId;
                let rendicontazioniId = [];
                rendicontazioniId.push(this.newIdRendicontazione);
                let payload = {
                    oldStato: oldStato,
                    newStato: this.statoSwap.statoRendId,
                    rendicontazioniId: rendicontazioniId
                }
                await postStatiRendicontazione(payload);

                //Azzero i dati -------------
                for (let file of this.files) {
                    if (file.value) {
                        file.value = null;
                    }
                }
                for (let file of this.filesPrimoIngresso) {
                    if (file.value) {
                        file.value = null;
                    }
                }
                for (let file of this.filesOspiteInStruttura) {
                    if (file.value) {
                        file.value = null;
                    }
                }
                this.radioChoice = '';
                this.condizioneLocale = null;
                this.dataCondizione = '';
                this.presaVisione = false;
                this.note = '';
                // ---------------------------
                this.$emit("cambioStato");
                this.$emit("updateRendicontazione");
                notifySuccess("Rendicontazione modificata con successo");
                notifySuccess("Stato della rendicontazione modificato con successo");
            } catch (e) {
                let errorDesc = e.response.data.descrizione;
                let errorDetail = e.response.data.detail //List[]
                //Format data
                const data = new Date(this.dataRendicontazione);
                const mesiAbbreviati = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
                const meseAbbreviato = mesiAbbreviati[data.getMonth()];
                const anno = data.getFullYear();
                const dataFormattata = `${meseAbbreviato} ${anno}`;
                //Format string
                let resultString = errorDesc.replace(/rendicontazione per \d+/, '');
                // Error message
                let message = `Rendicontazione effettuata in ${dataFormattata} del soggetto ${this.nomeSoggetto} ${this.cognomeSoggetto}: 
                    ${resultString}`;
                notifyError(e, message);
            }
            this.isSaving = false;
            this.showDialogConfermaCambioStato = false; //Chiudo la pop-up di conferma cambio stato
        },
        getListaStatiRendicontazione() {
            this.listaStatoSelezionato = '';
            if (this.subjectUpdate != null && this.statiRendicontazione.length > 0) {
                // Ottengo l'oggetto statoRendicontazione con all'interno il suo flow
                let statoRendicontazione = this.statiRendicontazione.filter(f => f.statoRendId == this.subjectUpdate.statoRendId);
                // Check flgStruttura=true, Ã¨ un cambio stato che puÃ² effettuare la struttura?
                let forStruttura = [];
                statoRendicontazione[0]?.workflowRendicontazione.forEach(element => {
                    if (element.flgStruttura) {
                        forStruttura.push(element);
                    }
                });
                // Cerco stati associati a quelli possibili
                let statiPossibili = [];
                forStruttura.forEach(element => {
                    this.statiRendicontazione.forEach(e => {
                        if (element.statoRendIdNew == e.statoRendId) {
                            statiPossibili.push(e);
                        }
                    });
                });
                return statiPossibili;
            }
            return [];
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
        // -------------------------------------------------------------------------------------------------------------------------
        async onUpdate(provenienza) {
            //Check radio button
            if (this.radioChoice === '' && this.subjectUpdate.flgPrimaRendicontazione === true) {
                let e = null;
                let message =
                    "Seleziona una opzione fra: Primo Ingresso o Ospite giÃ  presente in struttura";
                notifyError(e, message);
                return;
            }
            //Check presa visione
            if (!this.presaVisione && this.condizioneLocale !== null && this.subjectUpdate.flgUltimaRendicontazione === false) {
                let e = null;
                let message =
                    "Conferma la presa visione del messaggio";
                notifyError(e, message);
                return;
            }
            // UPDATE
            const isValid = await this.$refs.formUpdateRendicontazione.validate();
            if (!isValid) {
                return;
            } else {
                this.isLoading = true;
                let response = null;
                try {
                    let filesOld = [];
                    let filesCaricati = [];
                    for (let file of this.files) {
                        if (file.value) {
                            let f = {
                                filename: file.value.name,
                                base64String: await file2Base64(file.value),
                                fileTipoId: file.fileTipoId
                            };
                            filesCaricati.push(f);
                        }
                    }
                    for (let file of this.filesPrimoIngresso) {
                        if (file.value) {
                            let f = {
                                filename: file.value.name,
                                base64String: await file2Base64(file.value),
                                fileTipoId: file.fileTipoId
                            };
                            filesCaricati.push(f);
                        }
                    }
                    for (let file of this.filesOspiteInStruttura) {
                        if (file.value) {
                            let f = {
                                filename: file.value.name,
                                base64String: await file2Base64(file.value),
                                fileTipoId: file.fileTipoId
                            };
                            filesCaricati.push(f);
                        }
                    }
                    filesOld = this.subjectUpdate.files;
                    let filesToSend = [];   // Lista file invariati
                    let filesToSendObject = [];   // Lista file invariati
                    // Ottengo file non ricaricati ma esistenti precedentemente
                    for (let j = 0; j < filesOld.length; j++) {
                        let count = 0;
                        for (let i = 0; i < filesCaricati.length; i++) {
                            if (filesOld[j].fileTipoId !== filesCaricati[i].fileTipoId) {
                                count++;
                            }
                        }
                        if (count === filesCaricati.length) {
                            filesToSend.push(filesOld[j]);
                        }
                    }
                    filesToSend = filesToSend.map((e) => e.rendicontazioneFileId);

                    for (let i = 0; i < filesToSend.length; i++) {
                        let obj = {
                            rendicontazioneFileId: filesToSend[i]
                        };
                        filesToSendObject.push(obj);
                    }
                    // Controllo flgPrimoIngresso
                    let primoIngresso = false;
                    if (this.radioChoice === 'primoIngresso') {
                        primoIngresso = true;
                    }
                    //movimentoOspiteUscita
                    let movimentoOspiteUscita = null;
                    if (this.dataCondizione && this.condizioneLocale) {
                        movimentoOspiteUscita = {
                            tipoMovOspiteId: this.condizioneLocale.tipoMovOspiteId,
                            dataMovimento: this.dataCondizione.replace(/\//g, "-")
                        }
                    }
                    let idRendicontazione = null;
                    if (this.newIdRendicontazione === null) {
                        idRendicontazione = this.subjectUpdate.rendicontazioneId;
                    } else {
                        idRendicontazione = this.newIdRendicontazione;
                    }
                    let payload = {
                        rendicontazioneId: idRendicontazione,
                        idStruttura: this.subjectUpdate.idStruttura,
                        idSoggetto: this.subjectUpdate.idSoggetto,
                        dataRendicontazione: this.subjectUpdate.dataRendicontazione,
                        importoRetta: this.subjectUpdate.importoRetta,
                        // importoExtra: this.subjectUpdate.importoExtra,
                        // importoSconto: this.subjectUpdate.importoSconto,
                        flgPrimoIngresso: primoIngresso,
                        // strContoId: this.contoLocale.strContoId,
                        welfareFasciaId: this.fasciaLocale.welfareFasciaId,
                        adesioneBuonoRes: true,
                        statoRendId: this.subjectUpdate.statoRendId,
                        files: filesToSendObject,
                        movimentoOspiteUscita: movimentoOspiteUscita,
                        buonoresId: this.subjectUpdate.buonoresId
                    }
                    if (this.note !== '') {
                        payload.note = this.note;
                    }
                    response = await postRendicontazioniStruttura(payload);
                    this.newIdRendicontazione = response.data;
                    // Post dei file caricati
                    if (filesCaricati.length > 0) {
                        for (let i = 0; i < filesCaricati.length; i++) {
                            let payloadFile = {
                                rendicontazioneId: response.data,
                                fileToBeSaved: {
                                    filename: filesCaricati[i].filename,
                                    base64String: filesCaricati[i].base64String,
                                    fileTipoId: filesCaricati[i].fileTipoId,
                                }
                            }
                            await postFileRendicontazione(payloadFile);
                        }
                    }
                    // Controllo provenienza: modifica rendicontazione o cambio stato
                    if (provenienza === 'modificaRendicontazione') {
                        // Azzero i dati ----------------------------
                        for (let file of this.files) {
                            if (file.value) {
                                file.value = null;
                            }
                        }
                        for (let file of this.filesPrimoIngresso) {
                            if (file.value) {
                                file.value = null;
                            }
                        }
                        for (let file of this.filesOspiteInStruttura) {
                            if (file.value) {
                                file.value = null;
                            }
                        }
                        this.radioChoice = '';
                        this.condizioneLocale = null;
                        this.dataCondizione = '';
                        this.presaVisione = false;
                        this.note = '';
                        // -----------------------------------------------
                        this.$emit("updateRendicontazione");
                        notifySuccess("Rendicontazione modificata con successo");
                    }
                } catch (e) {
                    // await this.onHide(); //Azzero tutto
                    this.errorPostRend = true;
                    let message =
                        "Non Ã¨ stato possibile modificare la rendicontazione";
                    notifyError(e, message);
                }
            }
            this.isLoading = false;
        },
        onHide() {
            this.presaVisione = false;
            this.radioChoice = '';
            this.note = '';
            this.condizioneLocale = null;
            this.contoLocale = null;
            this.fasciaLocale = null;
            this.subjectUpdate = {};
            this.newIdRendicontazione = null;
            // Azzero i dati 
            for (let file of this.files) {
                if (file.value) {
                    file.value = null;
                }
            }
            for (let file of this.filesPrimoIngresso) {
                if (file.value) {
                    file.value = null;
                }
            }
            for (let file of this.filesOspiteInStruttura) {
                if (file.value) {
                    file.value = null;
                }
            }
            this.showDialogLocale = false;
            this.$emit('hide');
            this.$emit("updateRendicontazione");
        },
        async openFile() {
            const fileId = this.subjectUpdate.rendicontazioneId;
            let response = await getDichiarazioneRsa(fileId);
        },
        deleteFile(file) {
            let tipoFileIdFile = file.fileTipoId;
            let fileId = null;
            if (tipoFileIdFile !== undefined) {
                for (let i = 0; i < this.subjectUpdate.files.length; i++) {
                    if (this.subjectUpdate.files[i].fileTipoId === tipoFileIdFile) {
                        fileId = this.subjectUpdate.files[i].rendicontazioneFileId;
                    }
                }
                if (fileId !== null) {
                    let swapFile = this.subjectUpdate.files.filter((e) => e.rendicontazioneFileId !== fileId);
                    this.subjectUpdate.files = swapFile;
                }
            }
        },
        // ALTRO ---------------------------------------------------------------------------
        checkHintFileObbligatorio(type, fileTipoId) {
            let listaFileObbligatori = [];
            switch (type) {
                case 'normal':
                    listaFileObbligatori = this.files.filter((e) => e.fileTipoObbligatorio === true);
                    break;
                case 'inStruttura':
                    listaFileObbligatori = this.filesOspiteInStruttura.filter((e) => e.fileTipoObbligatorio === true);
                    break;
                case 'primoIngresso':
                    listaFileObbligatori = this.filesPrimoIngresso.filter((e) => e.fileTipoObbligatorio === true);
                    break;
                default:
                    break;
            }
            for (let i = 0; i < listaFileObbligatori.length; i++) {
                if (fileTipoId === listaFileObbligatori[i].fileTipoId) {
                    for (let j = 0; j < this.subjectUpdate.files.length; j++) {
                        if (this.subjectUpdate.files[j].fileTipoId === fileTipoId) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        },
        // ruleFileNotEmptyOspiteInStrutturaF() {
        //     let fatturaMesePrecedente = this.filesOspiteInStruttura.filter(file => file.fileTipoCod == "RBRM1_FATTURA_MESE_PRECEDENTE");
        //     for (let i = 0; i < this.subjectUpdate.files.length; i++) {
        //         if (this.subjectUpdate.files[i].fileTipoId === fatturaMesePrecedente[0].fileTipoId) {
        //             return false;
        //         }
        //     }
        //     return true;
        // },
        primoGiornoMese() {
            const oggi = new Date(this.subjectUpdate.dataRendicontazione);
            const anno = oggi.getFullYear();
            const mese = String(oggi.getMonth() + 1).padStart(2, '0');
            const dataString = `${anno}/${mese}/01`;
            return dataString;
        },
        optionsFn(date) {
            const oggi = new Date(this.subjectUpdate.dataRendicontazione);
            const anno = oggi.getFullYear();
            const mese = oggi.getMonth() + 1;
            const primoGiorno = new Date(anno, mese - 1, 1);
            const ultimoGiorno = new Date(anno, mese, 0);
            const primoGiornoStringa = `${anno}/${String(mese).padStart(2, '0')}/01`;
            const ultimoGiornoStringa = `${anno}/${String(mese).padStart(2, '0')}/${ultimoGiorno.getDate()}`;

            return date >= primoGiornoStringa && date <= ultimoGiornoStringa;
        },
        checkExistFile(file) {
            // Momentaneo aggiunta mese precente
            let mesePrecedente = '';
            const oggi = new Date(this.subjectUpdate.dataRendicontazione);
            const mese = oggi.getMonth(); // Ottieni il mese corrente (0-11)
            const anno = oggi.getFullYear(); // Ottieni l'anno corrente
            // Calcola il mese precedente
            const mesePrecedenteData = new Date(anno, mese - 1, 1);
            // Array di nomi dei mesi abbreviati
            const nomiMesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
            // Ottieni il nome abbreviato del mese precedente
            const nomeMesePrecedente = nomiMesi[mesePrecedenteData.getMonth()];
            mesePrecedente = `${nomeMesePrecedente} ${anno}`;

            let files = this.subjectUpdate.files;
            if (files !== undefined) {
                for (let i = 0; i < files.length; i++) {
                    if (file.fileTipoId == files[i].fileTipoId) {
                        return file.fileTipoDesc + '. File giÃ  caricato, nome: ' + files[i].fileToBeSaved.filename;
                    }
                }
            }
            // Momentaneo aggiunta mese precente
            if (file.fileTipoCod === 'RBRM1_FATTURA_MESE_PRECEDENTE') {
                return file.fileTipoDesc + ` (${mesePrecedente})`;
            }
            return file.fileTipoDesc;
        },
        checkFileObbligatoriHint() {
            if (this.subjectUpdate.files !== null && this.subjectUpdate.files !== undefined) {
                let files = this.subjectUpdate.files;
                let filesObbligatori = this.files.filter((e) => e.fileTipoObbligatorio === true);
                let count = 0;
                for (let i = 0; i < files.length; i++) {
                    for (let j = 0; j < filesObbligatori.length; j++) {
                        if (filesObbligatori[j].fileTipoId === files[i].fileTipoId) {
                            count++;
                        }
                    }
                }
                if (count === filesObbligatori.length) {
                    return false;
                }
                return true;
            }
        },
        checkFileObbligatoriHintPrimoMese() {
            if (this.subjectUpdate.files !== null && this.subjectUpdate.files !== undefined) {
                let files = this.subjectUpdate.files;
                let filesObbligatori = this.filesPrimoIngresso.filter((e) => e.fileTipoObbligatorio === true);
                let count = 0;
                for (let i = 0; i < files.length; i++) {
                    for (let j = 0; j < filesObbligatori.length; j++) {
                        if (filesObbligatori[j].fileTipoId === files[i].fileTipoId) {
                            count++;
                        }
                    }
                }
                if (count === filesObbligatori.length) {
                    return false;
                }
                return true;
            }
        },
        checkFileObbligatoriHintInStruttura() {
            if (this.subjectUpdate.files !== null && this.subjectUpdate.files !== undefined) {
                let files = this.subjectUpdate.files;
                let filesObbligatori = this.filesOspiteInStruttura.filter((e) => e.fileTipoObbligatorio === true);
                let count = 0;
                for (let i = 0; i < files.length; i++) {
                    for (let j = 0; j < filesObbligatori.length; j++) {
                        if (filesObbligatori[j].fileTipoId === files[i].fileTipoId) {
                            count++;
                        }
                    }
                }
                if (count === filesObbligatori.length) {
                    return false;
                }
                return true;
            }
        },
        checkFileDaEliminare(file) {
            if (this.subjectUpdate.files !== null && this.subjectUpdate.files !== undefined) {
                let filesRendicontazione = this.subjectUpdate.files;
                for (let i = 0; i < filesRendicontazione.length; i++) {
                    if (file.fileTipoId === filesRendicontazione[i].fileTipoId) {
                        return true;
                    }
                }
                return false;
            }
        },
        setTwoNumberDecimal(i, event) {
            this.fasce[i].value = parseFloat(this.fasce[i].value).toFixed(2);
        },
    },
    beforeUpdate() {
        this.fasce = this.$store.getters['getListaWelfareFasce'];
        this.fasce = this.fasce.fascia;

        let f = this.$store.getters['getFileList'];
        this.files = f.filter(file => file.fileTipoGruppo == "RBR");
        this.filesPrimoIngresso = f.filter(file => file.fileTipoGruppo == "RBR_MESE_1_PRIMO_INGRESSO");
        this.filesOspiteInStruttura = f.filter(file => file.fileTipoGruppo == "RBR_MESE_1");

        this.statiRendicontazione = this.$store.getters['getStatiRendicontazione'];
        this.statiRendicontazione = this.$store.getters['getStatiRendicontazione'];

        this.listaContiStruttura = this.$store.getters['getListaContiStruttura'];
        this.listaContiStruttura = this.listaContiStruttura.filter(conto => conto.isValid !== false);
    },
    async created() {
        try {
            //Ottengo le fasce della rendicontazione
            // let data = await getWelfareFasce();
            // let data = await getStrutturaWelfareFasce();
            // this.fasce = data.data;
            // this.fasce = this.fasce.fascia;

            //Lista dei file da caricare
            // let f = await getListFile();
            // this.files = f.data.filter(file => file.fileTipoGruppo == "RBR");
            // this.filesPrimoIngresso = f.data.filter(file => file.fileTipoGruppo == "RBR_MESE_1_PRIMO_INGRESSO");
            // this.filesOspiteInStruttura = f.data.filter(file => file.fileTipoGruppo == "RBR_MESE_1");

            //Ottengo stati della rendicontazione
            // let stati = await getStatiRendicontazione();
            // this.statiRendicontazione = stati.data;

            //Ottengo la lista dei conti della struttura
            // let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
            // this.listaContiStruttura = subjectList;
            // this.listaContiStruttura = this.listaContiStruttura.filter(conto => conto.isValid !== false);
            // Aggiungo validitaFine nel caso non arrivi da BE
            // this.listaContiStruttura.forEach(element => {
            //     if (!element.validitaFine) {
            //         element.validitaFine = "";
            //     }
            // });

            //Ottengo lista delle motivazioni di uscita dal buono
            let promise = await getMotivazioneFullList();
            let motiva = promise.data;
            this.condizioniUscitaBuono = motiva.filter((e) => e.flgUscita === true);

            //Ottengo la lista degli stati della rendicontazione
            // this.statiRendicontazione = await this.loadStatiRendicontazione();
            // await this.$store.dispatch('setListaStatiRendicontazione', { statiRendicontazione: this.statiRendicontazione });
            // this.statiRendicontazione = await this.getListaStatiRendicontazione();
        } catch (e) {
            let r = {
                descrizione:
                    "Si Ã¨ verificato un errore interno, se il problema persiste contattare l'assistenza"
            };
            if (e.response) {
                r = e.response.data;
            }
            let message = r.descrizione;
            notifyError(e, message);
        }
    },
};
</script>
<style>
.fileNonObbligatori {
    /* padding-bottom: 20px; */
    padding-bottom: 10px;
}

.my-custom-textarea {
    /* width: 300px; */
    /* Imposta la larghezza desiderata */
    height: 150px;
    /* Imposta l'altezza desiderata */
}

.my-custom-textarea-text {
    width: 300px;
    /* Imposta la larghezza desiderata */
    /* height: 150px; */
    /* Imposta l'altezza desiderata */
}
</style>
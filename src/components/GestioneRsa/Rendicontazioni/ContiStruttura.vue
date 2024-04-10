<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <div class="row q-pt-lg q-pl-sm">
      <div class="col-md-4">
        <q-input  v-model="email" label-slot :readonly="readonlyEmail" :error="errMail" error-message="Mail non valida">
          <template v-slot:label>
            <div class="row items-center all-pointer-events">
              <q-icon class="q-mr-xs" color="primary" size="24px" name="mail" />
              Email
            </div>
            <q-tooltip max-width="300px" anchor="top middle" self="bottom middle">
              <div class="text-body2">
                Email comunicazioni buono resindenzialit&agrave;
              </div>
            </q-tooltip>
          </template>
          <template v-slot:append>
            <q-btn round dense flat icon="edit" color="primary" @click="modificaEmail()" v-if="email && emailExists && !changeEmail"/>
            <q-btn round dense flat icon="check" color="green" @click="confermaModificaEmail()" v-if="email && emailExists && changeEmail"
            :loading="changeEmailLoading"/>
            <q-btn round dense flat icon="close" color="red" @click="annullaModificaEmail()" v-if="email && emailExists && changeEmail"/>
          </template>
        </q-input>
      </div>
    </div>
    <template v-if="tableData.length <= 0">
      <div class="q-pa-md text-body1 text-weight-medium">
        La struttura non ha ancora conti correnti
      </div>
    </template>
    <template v-else>
      <div class="q-pt-md q-pl-sm">
        <p>Conti Attivi</p>
      </div>
      <q-table :columns="columns" :data="contiValidi" row-key="name" :loading="tableLoading"
        :rows-per-page-options="tablePageOptions">

        <!-- Predefinitio -->
        <template v-slot:body-cell-flag_default="props">
          <q-td :props="props">
            <div>
              <q-checkbox name="predefinito" v-model=props.row.flgDefault disable />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div>
              <q-btn flat color="primary" icon="edit" @click="OnClickUpdate(props.row)" />
              <q-btn flat color="red" icon="delete" @click="OnClickRemove(props.row)" :disable="props.row.flgDefault">
                <q-tooltip v-if="props.row.flgDefault" max-width="300px" anchor="top middle" self="bottom middle">
                  <div class="text-body2">
                    Non Ã¨ possibile disattivare un conto predefinito
                  </div>
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
      <elimina-conto-dialog title="Disattiva Conto" :showDialog="openDialogRemoveConto"
        @hide="openDialogRemoveConto = false" :contoToDelete="modelConto"
        @removeConto="onDeleteConto()"></elimina-conto-dialog>
      <dialog-nuovo-conto title="Aggiorna Conto" :showDialog="openDialogUpdateConto" @hide="openDialogUpdateConto = false"
        :contoToUpdate="modelConto" :provenienza="'update'" @updateConto="onUpdateConto()"
        :flgDefault="flgDefault"></dialog-nuovo-conto>
    </template>
    <template v-if="contiNonValidi.length > 0">
      <div class="q-pt-md q-pl-sm">
        <p>Conti Inattivi</p>
      </div>
      <q-table :columns="columnsInvalidati" :data="contiNonValidi" row-key="name" :loading="tableLoading"
        :rows-per-page-options="tablePageOptions">

      </q-table>
    </template>
  </div>
</template>

<script>

import { getContiStrutturaRendicontazione, getEmailStruttura, postEmailStruttura } from 'src/services/api'
import { notifyError, notifySuccess } from 'src/services/utils'
import DialogNuovoConto from 'src/components/GestioneRsa/Dialogs/DialogNuovoConto.vue'
import EliminaContoDialog from 'src/components/GestioneRsa/Dialogs/DialogEliminaConto.vue'
import { date } from 'quasar';
import { EMAIL_REGEX } from "src/services/business_logic";
const { formatDate } = date;


export default {
  name: 'ContiStruttura',
  components: { DialogNuovoConto, EliminaContoDialog },
  data() {
    return {
      columns: [
        {
          name: 'flag_default',
          field: 'flgDefault',
          label: 'Predefinito',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'str_conto_iban',
          field: 'strContoIban',
          label: 'IBAN',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'str_conto_istituto',
          field: 'strContoIstituto',
          label: 'Istituto',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'str_conto_desc',
          field: 'strContoDesc',
          label: 'Descrizione',
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
      columnsInvalidati: [
        // {
        //     name: 'flag_default',
        //     field: 'flgDefault',
        //     label: 'Predefinito',
        //     required: true,
        //     sortable: false,
        //     align: 'left',
        //     headerClasses: 'text-bold'
        // },
        {
          name: 'str_conto_iban',
          field: 'strContoIban',
          label: 'IBAN',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'str_conto_istituto',
          field: 'strContoIstituto',
          label: 'Istituto',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        {
          name: 'str_conto_desc',
          field: 'strContoDesc',
          label: 'Descrizione',
          required: true,
          sortable: false,
          align: 'left',
          headerClasses: 'text-bold'
        },
        // {
        //     name: "action",
        //     label: 'Azioni',
        //     align: "left",
        //     field: "action",
        //     required: false,
        //     sortable: false,
        //     headerClasses: 'text-bold'
        // }
      ],
      tableData: [],
      contiValidi: [],
      contiNonValidi: [],
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
      openDialogUpdateConto: false,
      openDialogRemoveConto: false,
      predefinito: false,
      disableCheckbox: true,
      modelConto: {
        strContoId: Number,
        flgDefault: false,
        strContoIban: '',
        strContoIstituto: '',
        strContoDesc: '',
      },
      flgDefault: false,
      email: null,
      emailSwap: null,
      emailExists: false,
      changeEmail: false,
      changeEmailLoading: false,
      readonlyEmail: true,

    }
  },
  async created() {
    // Evento per titolo
    this.$root.$emit('titolo-accesso-struttura');

    try {
      // Chimata a db per ottenere i dati dei soggetti della struttura
      await this.onLoadSubjects();

      let {data: email} =  await getEmailStruttura();
      console.log('email');//DEBUG
      console.log(email);//DEBUG
      this.email = email.strutturaEmail;
      this.emailSwap = this.email;
      if(email) {
        this.emailExists = true;
      }

    } catch (err) {
      this.internalError = true
      console.log(err)
    }
  },
  computed: {
    errMail() {
      return !EMAIL_REGEX.test(this.email) ? true: false;
    },
  },
  methods: {
    modificaEmail() {
      this.changeEmail = true;
      this.readonlyEmail = false;
    },
    async confermaModificaEmail() {
      this.changeEmailLoading = true;
      try {
        let payload = {
          strutturaEmail: this.email
        }
        let {data: response} = await postEmailStruttura(payload);
        this.email = response.strutturaEmail;
        this.emailSwap = this.email;
        this.changeEmail = false;
        this.readonlyEmail = true;
        this.changeEmailLoading = false;
        notifySuccess('Modifica della mail avvenuta con successo');
      } catch (err) {
        this.changeEmail = false;
        this.readonlyEmail = true;
        notifyError(
          err,
          "Si Ã¨ verificato un errore durante la modifica della email"
        );
      }
      this.changeEmailLoading = false;
    },
    annullaModificaEmail() {
      this.email = this.emailSwap;
      this.changeEmail = false;
      this.changeEmailLoading = false;
      this.readonlyEmail = true;
    },
    // Soggetti della struttura
    async onLoadSubjects() {
      this.tableLoading = true;
      try {
        let { headers, data: subjectList } = await getContiStrutturaRendicontazione();
        this.tableData = subjectList;
        this.contiValidi = this.tableData.filter((e) => e.isValid !== false);
        this.contiNonValidi = this.tableData.filter((e) => e.isValid === false);
        // await this.$store.dispatch("setListaContiStruttura", { conti: subjectList });
      } catch (err) {
        notifyError(
          err,
          "Si Ã¨ verificato un errore durante il caricamento dei soggetti"
        );
      }
      this.tableLoading = false;
    },
    async onLoading() {
      // Chimata a db per ottenere i dati dei soggetti della struttura
      await this.onLoadSubjects();
    },
    onUpdateConto() {
      this.openDialogUpdateConto = false;
      this.onLoadSubjects();
    },
    onDeleteConto() {
      this.openDialogRemoveConto = false;
      this.onLoadSubjects();
    },
    OnClickUpdate(conto) {
      this.openDialogUpdateConto = true;
      const jsonString = JSON.stringify(conto);
      const data = JSON.parse(jsonString);
      this.modelConto = data;
      this.flgDefault = this.modelConto.flgDefault;
      this.modelConto.validitaInizio = this.dateForModal(this.formatDataStringIt(this.modelConto.validitaInizio));
      this.modelConto.validitaFine = this.dateForModal(this.formatDataStringIt(this.modelConto.validitaFine));
    },
    OnClickRemove(conto) {
      this.openDialogRemoveConto = true;
      const jsonString = JSON.stringify(conto);
      const data = JSON.parse(jsonString);
      this.modelConto = data;
      this.modelConto.validitaInizio = this.dateForModal(this.formatDataStringIt(this.modelConto.validitaInizio));
      this.modelConto.validitaFine = this.dateForModal(this.formatDataStringIt(this.modelConto.validitaFine));
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
    }
  },
  mounted() {
    this.tableLoading = true;
    this.tableLoading = false;
  }
}
</script>

<style></style>

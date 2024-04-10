<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico
    :open="open"
    @closeDialog="closeDialog"
    @confirmDialog="sendPayload"
    generic
  >
    <template slot="head">
      <div class="text-h6" v-text="stiNome" />
    </template>

    <template slot="body">
      <q-splitter :value="splitterModel" disable style="height: 300px">
        <template slot="before">
          <q-tabs
            v-model="currentTab"
            vertical
            class="full-height"
            active-color="white"
            active-bg-color="primary"
            indicator-color="transparent"
          >
            <q-tab
              :name="1"
              label="Dati struttura"
              style="justify-content: initial"
            />

            <q-tab
              :name="2"
              label="Assistenza medica"
              style="justify-content: initial"
            />

            <q-tab
              :name="3"
              label="Direttore struttura"
              style="justify-content: initial"
            />

            <q-tab
              :name="4"
              label="Direttore sanitario"
              style="justify-content: initial"
            />

            <q-tab
              :name="5"
              label="Coordinatore inf."
              style="justify-content: initial"
            />
          </q-tabs>
        </template>

        <template slot="after">
          <q-tab-panels
            v-model="currentTab"
            class="full-width full-height"
            animated
            vertical
          >
            {{ currentTab }}
            <q-tab-panel :name="1">
              <q-form ref="formStr" class="q-gutter-lg">
                <q-input
                  v-model="stiTelefono"
                  @input="errPhone(stiTelefono, currentTab)"
                  label="Telefono"
                  class="q-pb-none"
                  type="tel"
                  mask="### ### ####"
                  dense
                  outlined
                  :error="stiTelefonoError"
                  error-message="telefono non valido"
                />
                <!--   @blur="checkValidPhone('stiTelefono')"-->
                <q-input
                  v-model="stiEmail"
                  label="1Â° Email"
                  class="q-pb-none"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  :error="errFirstMail"
                  error-message="Email non valida"
                />

                <q-input
                  v-model="stiEmail2"
                  label="2Â° Email"
                  class="q-pb-none"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  :error="errSecondMail"
                  error-message="Email non valida"
                />

                <q-input
                  v-model="stiPec"
                  label="Pec"
                  class="q-pb-none"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  :error="errPecMail"
                  error-message="Email non valida"
                />

                <q-checkbox
                  v-model="stiMensaInternaPresente"
                  label="Mensa interna"
                  class="text-body2"
                  dense
                />

<!--                <q-checkbox-->
<!--                  v-model="stiAdesioneDgr10"-->
<!--                  label="DGR 10"-->
<!--                  class="text-body2"-->
<!--                  dense-->
<!--                />   -->
                <q-checkbox
                  v-model="stiAbilitatoSollievo"
                  label="Adesione postiletto sollievo"
                  class="text-body2"
                  dense
                />      <q-checkbox
                  v-model="stiAbilitatoDimProt"
                  label="Adesione postiletto dimissioni protette"
                  class="text-body2"
                  dense
                />      <q-checkbox
                  v-model="stiAbilitatoCavs"
                  label="Adesione postiletto CAVS"
                  class="text-body2"
                  dense
                />      <q-checkbox
                  v-model="stiAbilitatoLungodeg"
                  label="Adesione postiletto lungodegenze"
                  class="text-body2"
                  dense
                />      <q-checkbox
                  v-model="stiAbilitatoHospice"
                  label="Adesioni postiletto hospice"
                  class="text-body2"
                  dense
                />
              </q-form>
            </q-tab-panel>

            <q-tab-panel :name="2">
              <div class="q-gutter-lg">
                <q-checkbox
                  v-model="stiAsmedMmg"
                  label="Assistenza medica garantita da MMG"
                  class="text-body2"
                  dense
                />

                <q-select
                  v-model="assmedId"
                  label="Assistenza medica da altro medico"
                  class="text-body2"
                  :options="dropdowns.assistenzaMedica"
                  option-label="assmedDesc"
                  option-value="assmedId"
                  emit-value
                  map-options
                  outlined
                  dense
                />

                <q-checkbox
                  v-model="stiAsmedMista"
                  label="Assistenza medica mista"
                  class="text-body2"
                  dense
                />

                <q-checkbox
                  v-model="stiPersInfNotturno"
                  label="Personale infermieristico notturno"
                  class="text-body2"
                  dense
                />
              </div>
            </q-tab-panel>

            <q-tab-panel :name="3">
              <q-form ref="formDirStr" class="q-gutter-lg">
                <q-checkbox
                  v-model="stiDirStrPresente"
                  label="Presenza"
                  class="text-body2"
                  dense
                  disable
                />
                <!--                TODO-->

                <q-input
                  v-model="stiDirStrNome"
                  label="Nome direttore"
                  dense
                  outlined
                  :error="errDirector"
                  error-message="Campo obbligatorio"
                />
                <!--                TODO-->

                <q-input
                  v-model="stiDirStrEmail"
                  class="q-pb-none"
                  label="Email"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  error-message="Mail non valida"
                  :error="errMailDirector"
                />

                <q-input
                  v-model="stiDirStrTelReperibilita"
                  @input="errPhone(stiDirStrTelReperibilita, currentTab)"
                  label="Tel. reperibilitÃ "
                  class="q-pb-none"
                  type="tel"
                  mask="### ### ######"
                  dense
                  outlined
                  :error="stiDirStrTelReperibilitaError"
                  error-message="Telefono non valido"
                ></q-input>
              </q-form>
              <!--                  @blur="checkValidPhone('stiDirStrTelReperibilita')"-->
              <!--                 @input="inputPhone('stiDirStrTelReperibilita', $event)"-->
            </q-tab-panel>

            <q-tab-panel :name="4">
              <q-form ref="formDirSanit" class="q-gutter-lg">
                <q-checkbox
                  v-model="stiDirSanitPresente"
                  label="Presenza"
                  class="text-body2"
                  dense
                />

                <q-input
                  v-model="stiDirSanitNome"
                  label="Nome direttore"
                  dense
                  outlined
                />

                <q-input
                  v-model="stiDirSanitEmail"
                  class="q-pb-none"
                  label="Email"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  :error="errMailSanitaryDirector"
                  error-message="Mail non valida"
                />

                <q-input
                  v-model="stiDirSanitTelReperibilita"
                  @input="errPhone(stiDirSanitTelReperibilita, currentTab)"
                  label="Tel. reperibilitÃ "
                  class="q-pb-none"
                  type="tel"
                  mask="### ### ######"
                  dense
                  outlined
                  :error="stiDirSanitTelReperibilitaError"
                  error-message="Telefono non valido"
                />
              </q-form>
              <!--                 :error="phoneError['stiDirSanitTelReperibilita']"-->
              <!--              @input="inputPhone('stiDirSanitTelReperibilita', $event)"-->
              <!--                 @blur="checkValidPhone('stiDirSanitTelReperibilita')"-->
            </q-tab-panel>

            <q-tab-panel :name="5">
              <q-form ref="formCoordInf" class="q-gutter-lg">
                <q-checkbox
                  v-model="stiCoordInfPresente"
                  label="Presenza"
                  class="text-body2"
                  dense
                />

                <q-input
                  v-model="stiCoordInfNome"
                  label="Nome direttore"
                  dense
                  outlined
                />

                <q-input
                  v-model="stiCoordInfEmail"
                  class="q-pb-none"
                  label="Email"
                  dense
                  outlined
                  @blur="checkedFields = true"
                  :error="errMailCoord"
                  error-message="Mail non valida"
                />

                <q-input
                  v-model="stiCoordInfTelReperibilita"
                  @input="errPhone(stiCoordInfTelReperibilita, currentTab)"
                  label="Tel. reperibilitÃ "
                  class="q-pb-none"
                  type="tel"
                  mask="### ### ######"
                  dense
                  outlined
                  error-message="Telefono non valido"
                  :error="stiCoordInfTelReperibilitaError"
                />
              </q-form>
              <!--               @blur="checkValidPhone('stiCoordInfTelReperibilita')"-->
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </template>
  </dialog-generico>
</template>

<script>
import { dialogMixin } from "src/mixins/dialog_mixin";
import DialogGenerico from "./Rilevazioni/DialogGenerico.vue";
import {
  aggiornaInfoStruttura,
  getValidPhoneInternational
} from "src/services/api";
import { EMAIL_REGEX } from "src/services/business_logic";
import { notifyError, removeSpaces } from "src/services/utils";
export default {
  name: "DialogInfoStruttura",
  mixins: [dialogMixin],
  components: { DialogGenerico },
  props: {},
  data() {
    return {
      stiTelefonoValid: true,
      stiDirStrTelReperibilitaValid: true,
      stiDirSanitTelReperibilitaRuleValid: true,
      stiCoordInfTelReperibilitaValid: true,

      phoneErrorDirectorBool: false,
      phoneErrorDirectorSanitaBool: false,
      stiId: null,
      stiTelefono: "",
      stiEmail: "",
      stiEmail2: "",
      stiPec: "",
      stiAsmedMmg: null,
      assmedId: null,
      stiAsmedMista: null,
      stiPersInfNotturno: null,
      stiMensaInternaPresente: null,
      // stiAdesioneDgr10: null,
        stiAbilitatoSollievo: null,
        stiAbilitatoDimProt: null,
        stiAbilitatoCavs: null,
        stiAbilitatoLungodeg: null,
        stiAbilitatoHospice: null,
      stiDirStrPresente: null,
      stiDirStrNome: "",
      stiDirStrEmail: "",
      stiDirStrTelReperibilita: "",
      stiDirSanitPresente: null,
      stiDirSanitNome: "",
      stiDirSanitEmail: "",
      stiDirSanitTelReperibilita: "",
      stiCoordInfPresente: null,
      stiCoordInfNome: "",
      stiCoordInfEmail: "",
      stiCoordInfTelReperibilita: "",
      currentTab: 1,
      splitterModel: 35,
      phoneError: {
        stiTelefono: false,
        stiDirStrTelReperibilita: false,
        stiDirSanitTelReperibilita: false,
        stiCoordInfTelReperibilita: false
      },
      checkedFields: false,
      phoneErrorMessage: ""
    };
  },
  computed: {
    stiCoordInfTelReperibilitaError() {
      let error = false;
      if (
        (this.stiCoordInfTelReperibilitaValid === false &&
          this.stiCoordInfTelReperibilita) ||
        (this.stiCoordInfPresente === true &&
          (this.stiCoordInfTelReperibilita === null ||
            this.stiCoordInfTelReperibilita === ""))
      ) {
        error = true;
      }
      return error;
    },
    stiDirSanitTelReperibilitaError() {
      let error = false;
      if (
        (this.stiDirSanitTelReperibilitaRuleValid === false &&
          this.stiDirSanitTelReperibilita) ||
        (this.stiDirSanitPresente === true &&
          (this.stiDirSanitTelReperibilita === null ||
            this.stiDirSanitTelReperibilita === ""))
      ) {
        error = true;
      }
      return error;
    },
    stiDirStrTelReperibilitaError() {
      let error = false;
      if (
        (this.stiDirStrTelReperibilitaValid === false &&
          this.stiDirStrTelReperibilita) ||
        (this.stiDirStrPresente === true &&
          (this.stiDirStrTelReperibilita === null ||
            this.stiDirStrTelReperibilita === ""))
      ) {
        error = true;
      }
      return error;
    },
    //TODO
    errDirector() {
      let error = false;
      if (!this.stiDirStrNome || this.stiDirStrNome === "") {
        error = true;
      }
      return error;
    },
    stiTelefonoError() {
      let error = false;
      if (this.stiTelefonoValid === false) {
        error = true;
      }
      return error;
    },
    errFirstMail() {
      let error = false;
      if (
        !!this.stiEmail &&
        !!this.stiEmail.length &&
        !EMAIL_REGEX.test(this.stiEmail)
      ) {
        error = true;
      }
      if (!this.stiEmail) {
        error = true;
      }

      return error;
    },
    errSecondMail() {
      let error = false;
      if (
        !!this.stiEmail2 &&
        !!this.stiEmail2.length &&
        !EMAIL_REGEX.test(this.stiEmail2)
      ) {
        error = true;
      }

      return error;
    },
    errPecMail() {
      let error = false;
      if (
        !!this.stiPec &&
        !!this.stiPec.length &&
        !EMAIL_REGEX.test(this.stiPec)
      ) {
        error = true;
      }
      //TODO
      if (!this.stiPec) {
        error = true;
      }

      return error;
    },
    errMailDirector() {
      let error = false;
      if (
        (this.stiDirStrPresente &&
          (this.stiDirStrEmail === null ||
            this.stiDirStrEmail === "" ||
            !EMAIL_REGEX.test(this.stiDirStrEmail))) ||
        (!this.stiDirStrPresente &&
          !!this.stiDirStrEmail &&
          !!this.stiDirStrEmail.length &&
          !EMAIL_REGEX.test(this.stiDirStrEmail))
      ) {
        error = true;
      }

      return error;
    },
    errMailSanitaryDirector() {
      let error = false;
      if (
        (this.stiDirSanitPresente &&
          (this.stiDirSanitEmail === null ||
            this.stiDirSanitEmail === "" ||
            !EMAIL_REGEX.test(this.stiDirSanitEmail))) ||
        (!this.stiDirSanitPresente &&
          !!this.stiDirSanitEmail &&
          !!this.stiDirSanitEmail.length &&
          !EMAIL_REGEX.test(this.stiDirSanitEmail))
      ) {
        error = true;
      }
      return error;
    },
    errMailCoord() {
      let error = false;
      if (
        (this.stiCoordInfPresente &&
          (this.stiCoordInfEmail === null ||
            this.stiCoordInfEmail === "" ||
            !EMAIL_REGEX.test(this.stiCoordInfEmail))) ||
        (!this.stiCoordInfPresente &&
          !!this.stiCoordInfEmail &&
          !!this.stiCoordInfEmail.length &&
          !EMAIL_REGEX.test(this.stiCoordInfEmail))
      ) {
        error = true;
      }
      return error;
    }
  },
  created() {},
  methods: {
    inputPhone(field, value) {
      this[field] = removeSpaces(value);
    },

    async errPhone(field, tab) {
      let validApi;
      let isValid = false;

      try {
        validApi = await getValidPhoneInternational(field);
        isValid = true;
      } catch (e) {
        isValid = false;
      }

      if (tab === 1) {
        this.stiTelefonoValid = isValid;
      }
      if (tab === 3) {
        this.stiDirStrTelReperibilitaValid = isValid;
      }
      if (tab === 4) {
        this.stiDirSanitTelReperibilitaRuleValid = isValid;
      }
      if (tab === 5) {
        this.stiCoordInfTelReperibilitaValid = isValid;
      }
    },
    async checkValidPhone(singleField) {
      for (const field in this.phoneError) {
        if (!singleField || singleField === field) {
          if (this[field].length >= 0) {
            this.phoneError[field] = await this.errPhone(field);
          }
        }
      }
    },
    async sendPayload() {
      this.checkedFields = true;

      let validForms = false;

      if (
        !this.stiCoordInfTelReperibilitaError &&
        !this.stiDirSanitTelReperibilitaError &&
        !this.stiDirStrTelReperibilitaError &&
        !this.stiTelefonoError &&
        !this.errMailDirector &&
        !this.errMailCoord &&
        !this.errMailSanitaryDirector &&
        !this.errPecMail &&
        !this.errFirstMail &&
        !this.errSecondMail &&
        !this.errDirector
      ) {
        validForms = true;
      }

      // if (this.emailFieldsValid && this.phoneFieldsValid) {

      if (validForms) {
        const payload = {
          idStruttura: this.idStruttura,
          stiId: this.stiId,
          stiTelefono: this.stiTelefono,
          stiEmail: this.stiEmail,
          stiEmail2: this.stiEmail2,
          stiPec: this.stiPec,
          stiAsmedMmg: this.stiAsmedMmg,
          assmedId: this.assmedId,
          stiAsmedMista: this.stiAsmedMista,
          stiPersInfNotturno: this.stiPersInfNotturno,
          stiMensaInternaPresente: this.stiMensaInternaPresente,

          // stiAdesioneDgr10: this.stiAdesioneDgr10,
            stiAbilitatoSollievo: this.stiAbilitatoSollievo,
            stiAbilitatoDimProt: this.stiAbilitatoDimProt,
            stiAbilitatoCavs: this.stiAbilitatoCavs,
            stiAbilitatoLungodeg: this.stiAbilitatoLungodeg,
            stiAbilitatoHospice: this.stiAbilitatoHospice,

          stiDirStrPresente: this.stiDirStrPresente,
          stiDirStrNome: this.stiDirStrNome,
          stiDirStrEmail: this.stiDirStrEmail,
          stiDirStrTelReperibilita: this.stiDirStrTelReperibilita,
          stiDirSanitPresente: this.stiDirSanitPresente,
          stiDirSanitNome: this.stiDirSanitNome,
          stiDirSanitEmail: this.stiDirSanitEmail,
          stiDirSanitTelReperibilita: this.stiDirSanitTelReperibilita,
          stiCoordInfPresente: this.stiCoordInfPresente,
          stiCoordInfNome: this.stiCoordInfNome,
          stiCoordInfEmail: this.stiCoordInfEmail,
          stiCoordInfTelReperibilita: this.stiCoordInfTelReperibilita
        };

        const eventData = {
          payload: payload,
          func: aggiornaInfoStruttura,
          callbackDialog: this.closeDialog
        };

        await this.confirmDialog(eventData);
        this.open=false
      } else {
        notifyError(1, "Ricontrolla i campi prima di procedere.");
      }
    },
    prefillFormInputs(payload) {
      this.stiId = payload.stiId;
      this.stiTelefono = payload.stiTelefono;
      this.stiEmail = payload.stiEmail;
      this.stiEmail2 = payload.stiEmail2;
      this.stiPec = payload.stiPec;
      this.stiAsmedMmg = payload.stiAsmedMmg;
      this.assmedId = payload.assmedId;
      this.stiAsmedMista = payload.stiAsmedMista;
      this.stiPersInfNotturno = payload.stiPersInfNotturno;
      this.stiMensaInternaPresente = payload.stiMensaInternaPresente ?? false;

      // this.stiAdesioneDgr10 = payload.stiAdesioneDgr10 ?? false;
      this.stiAbilitatoSollievo = payload.stiAbilitatoSollievo ?? false;
      this.stiAbilitatoDimProt = payload.stiAbilitatoDimProt ?? false;
      this.stiAbilitatoCavs = payload.stiAbilitatoCavs ?? false;
      this.stiAbilitatoLungodeg = payload.stiAbilitatoLungodeg ?? false;
      this.stiAbilitatoHospice = payload.stiAbilitatoHospice ?? false;
      //TODO
      //this.stiDirStrPresente = payload.stiDirStrPresente;
      this.stiDirStrPresente = true;
      this.stiDirStrNome = payload.stiDirStrNome;
      this.stiDirStrEmail = payload.stiDirStrEmail;
      this.stiDirStrTelReperibilita = payload.stiDirStrTelReperibilita;
      this.stiDirSanitPresente = payload.stiDirSanitPresente;
      this.stiDirSanitNome = payload.stiDirSanitNome;
      this.stiDirSanitEmail = payload.stiDirSanitEmail;
      this.stiDirSanitTelReperibilita = payload.stiDirSanitTelReperibilita;
      this.stiCoordInfPresente = payload.stiCoordInfPresente;
      this.stiCoordInfNome = payload.stiCoordInfNome;
      this.stiCoordInfEmail = payload.stiCoordInfEmail;
      this.stiCoordInfTelReperibilita = payload.stiCoordInfTelReperibilita;

      this.currentTab = 1;

      this.errPhone(payload.stiTelefono, 1);
      this.errPhone(payload.stiDirStrTelReperibilita, 3);
      this.errPhone(payload.stiDirSanitTelReperibilita, 4);
      this.errPhone(this.stiCoordInfTelReperibilita, 5);
    },
    clearFormInputs() {
      this.phoneError.stiTelefono = false;
      this.phoneError.stiDirStrTelReperibilita = false;
      this.phoneError.stiDirSanitTelReperibilita = false;
      this.phoneError.stiCoordInfTelReperibilita = false;
      this.checkedFields = false;
    }
  }
};
</script>

<style></style>

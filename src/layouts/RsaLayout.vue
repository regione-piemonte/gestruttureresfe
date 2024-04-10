<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-layout view="lHh Lpr fff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <!--Test Rapidi Strutture Residenziali - Auto Screening-->
          {{ appTitle }}
          <div class="text-caption q-mb-xs">
            Piattaforma Covid 19 Piemonte
          </div>
        </q-toolbar-title>

        <div class="col-12 col-sm-auto q-gutter-x-md" v-if="helpButtonEnabled">
          <ges-strutture-help-btn
            @show-manual="showManual"
            @show-manual-new="showManualNew"
            @show-manual-adesione="showManualAdes"
            @show-manual-rendicontazione="showManualRend"
            @show-assistance="showAssistance"
            @show-faq="showFAQ"
            @show-video="showVideo"
          />
        </div>
        <ges-strutture-header></ges-strutture-header>
      </q-toolbar>
      <q-bar
        class="bg-secondary text-body1 text-bold"
        v-if="getProvenienza == 'rilevazioni'"
      >
        Piattaforma regionale della residenzialitÃ 
      </q-bar>
      <q-bar
        class="bg-secondary text-body1 text-bold"
        v-if="getProvenienza == 'adesioni'"
      >
        Piattaforma regionale delle adesioni
      </q-bar>
    </q-header>
    <template v-if="isModalOpen">
      <q-dialog v-model="isModalOpen" full-width>
        <q-card style="max-width: 800px !important;">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Video tutorial</div>
            <q-space />
            <q-btn v-close-popup round dense flat icon="close" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="q-pa-md">
              <q-video

                src="https://vm-podcast.csi.it/mlab/projects/video/2023/Tutorial_Sanita_Scelta_Sociale_2023_02_07/out/Tutorial_Sanita_Scelta_Sociale_RESIDENZIALITA.mp4"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          MenÃ¹
        </q-item-label>

        <ges-strutture-menu-list-item
          v-for="item in labelList"
          :key="item.title"
          :sub-menu="item.submenu"
          :link="item.link"
          :title="item.title"
          :icon="item.icon"
          :provenienza="item.provenienza"
          :profiles="item.profiles"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <the-footer show-contacts show-dirmei-logo></the-footer>
  </q-layout>
</template>

<script>
import TheFooter from "components/TheFooter";
import GesStruttureHeader from "components/GesStruttureHeader";
import { openURL } from "quasar";
import { TYPES } from "../store";
import {
  ASSISTANCE_CODES,
  PAGE_LINKS,
  PROFILI_EROGATORI,
  PROFILI_RSA,
  TITLE_GEST_EROGATORI,
  TITLE_GEST_RSA,
  TITLE_GEST_RSA_MENU,
  TITLE_GEST_ST_RES,
  TITLE_GEST_ADESIONE,
  TITLE_INDEX,
  TITLE_GEST_BUONO,
  TITLE_GEST_STRUTTURA
} from "src/services/business_logic";
import GesStruttureMenuListItem from "components/GesStruttureMenuListItem";
import GesStruttureHelpBtn from "components/GesStruttureHelpBtn";

export default {
  name: "MainLayout",
  components: {
    GesStruttureHelpBtn,
    GesStruttureMenuListItem,
    GesStruttureHeader,
    TheFooter
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: PAGE_LINKS,
      appTitle: "",
      assistanceCode: "",
      isModalOpen: false
    };
  },
  created() {
    this.$root.$on("titolo-soggetti", () => {
      this.appTitle = TITLE_GEST_EROGATORI;
    });
    this.$root.$on("titolo-res", () => {
      this.appTitle = TITLE_GEST_ST_RES;
      this.assistanceCode = ASSISTANCE_CODES.GEST_ST_RES;
    });
    this.$root.$on("titolo-rsa", () => {
      this.appTitle = TITLE_GEST_RSA;
      this.assistanceCode = ASSISTANCE_CODES.GEST_RSA;
    });
    this.$root.$on("titolo-adesione", () => {
      this.appTitle = TITLE_GEST_ADESIONE;
      this.assistanceCode = ASSISTANCE_CODES.GEST_ADESIONE;
    });
    this.$root.$on("titolo-buono", () => {
      this.appTitle = TITLE_GEST_BUONO;
      this.assistanceCode = ASSISTANCE_CODES.GEST_BUONO;
    });
    this.$root.$on("titolo-accesso-struttura", () => {
      this.appTitle = TITLE_GEST_STRUTTURA;
      this.assistanceCode = ASSISTANCE_CODES.GEST_STRUTTURA;
    });
    this.$root.$on("titolo-rsa-menu", () => {
      this.appTitle = TITLE_GEST_RSA_MENU;
    });
  },
  computed: {
    helpButtonEnabled() {
      return !this.$route.meta?.helpButtonDisabled;
    },
    currentUser() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    activeProfiles() {
      return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES];
    },
    labelList() {
      let returnList = this.essentialLinks?.filter(link =>
        this.activeProfiles?.find(profile =>
          link.profiles?.includes(profile.nomeProfilo)
        )
      );
      return returnList ?? [];
    },
    getProvenienza() {
      return this.$store.getters["getProvenienza"];
    },
    attrs() {
      let { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      let { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  methods: {
    showFAQ() {
      let baseUrl = process.env.APP_ASSISTANCE_BASE_URL.replaceAll('"', "");

      let url = "";
      if (this.getProvenienza == "rilevazioni") {
        url = `${baseUrl}/#/faq?servizio=${this.assistanceCode}`;
      } else if (this.getProvenienza == "adesioni") {
        url = `${baseUrl}/#/faq?servizio=${this.assistanceCode}`;
      } else if (this.getProvenienza == "buono") {
        // url = `${baseUrl}/#/faq?servizio=${this.assistanceCode}`;
        url = `https://www.regione.piemonte.it/web/temi/diritti-politiche-sociali/politiche-sociali/bonus-residenzialita-domande-risposte-utili-per-strutture-socioassistenziali`;
      } else if (this.getProvenienza == null) {
        url = `${baseUrl}/#/faq?servizio=${this.assistanceCode}`;
      }

      openURL(
        url
      );
    },

    showManual() {
      openURL(
        "/manualigescovid/gestruttureres/Manuale_Utente_Struttura_Residenziale_COVID.pdf"
      );
    },
    showManualAdes() {
      openURL(
        "/manualigescovid/rsa/Manuale_Utente_Adesione_Residenzialita.pdf"
      );
    },
    showManualRend() {
      openURL(
        "/manualigescovid/rsa/Manuale_Utente_Rendicontazione_Residenzialita.pdf"
      );
    },
    showManualNew() {
      openURL("/manualigescovid/rsa/Manuale_Utente_RSA.pdf");
    },
    showVideo() {
      this.isModalOpen = true;
    },
    showAssistance() {
      let baseUrl = process.env.APP_ASSISTANCE_BASE_URL.replaceAll('"', "");

      let url = "";
      if (this.getProvenienza == "rilevazioni") {
        url = `${baseUrl}/assistenza/shib/${this.assistanceCode}`;
      } else if (this.getProvenienza == "adesioni") {
        url = `${baseUrl}/assistenza/shib/${this.assistanceCode}`;
      } else if (this.getProvenienza == "buono") {
        url = `${baseUrl}/#/assistenza/${this.assistanceCode}`;
      } else if (this.getProvenienza == null) {
        url = `${baseUrl}/assistenza/shib/${this.assistanceCode}`;
      }

      window.open(url);
    }
  }
};
</script>

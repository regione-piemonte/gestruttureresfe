<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-layout view="lHh Lpr fff">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          <!--Test Rapidi Strutture Residenziali - Auto Screening-->
          {{ appTitle }}
          <div class="text-caption q-mb-xs">
            Piattaforma Covid 19 Piemonte
          </div>
        </q-toolbar-title>

        <div class="col-12 col-sm-auto q-gutter-x-md">
          <ges-strutture-help-btn @show-manual="showManual" @show-manual-new="showManualNew"
            @show-manual-adesione="showManualAdes" @show-assistance="showAssistance" @show-faq="showFAQ" />
        </div>
        <ges-strutture-header></ges-strutture-header>
      </q-toolbar>

    </q-header>

    <q-drawer v-if="menuEnabled" v-model="leftDrawerOpen" :show-if-above="false" bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          MenÃ¹
        </q-item-label>

        <ges-strutture-menu-list-item v-for="item in labelList" :key="item.title" :sub-menu="item.submenu"
          :provenienza="item.provenienza" :link="item.link" :title="item.title" :icon="item.icon"
          :profiles="item.profiles" />

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <the-footer></the-footer>
  </q-layout>
</template>

<script>
import TheFooter from 'components/TheFooter'
import GesStruttureHeader from 'components/GesStruttureHeader'
import { openURL } from 'quasar'
import { TYPES } from '../store'
import {
  ASSISTANCE_CODES,
  PAGE_LINKS, PROFILI_EROGATORI, PROFILI_RSA,
  TITLE_GEST_ADESIONE,
  TITLE_GEST_BUONO,
  TITLE_GEST_EROGATORI,
  TITLE_GEST_RSA,
  TITLE_GEST_RSA_MENU,
  TITLE_GEST_ST_RES,
  TITLE_INDEX
} from 'src/services/business_logic'
import GesStruttureMenuListItem from "components/GesStruttureMenuListItem";
import GesStruttureHelpBtn from "components/GesStruttureHelpBtn";

export default {
  name: 'MainLayout',
  components: { GesStruttureHelpBtn, GesStruttureMenuListItem, GesStruttureHeader, TheFooter },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: PAGE_LINKS,
      appTitle: ''
    }
  },
  created() {
    this.$root.$on('titolo-soggetti', () => {
      this.appTitle = TITLE_GEST_EROGATORI
    })
    this.$root.$on('titolo-res', () => {
      this.appTitle = TITLE_GEST_ST_RES
    })
    this.$root.$on('titolo-rsa', () => {
      this.appTitle = TITLE_GEST_RSA
    })
    this.$root.$on('titolo-adesione', () => {
      this.appTitle = TITLE_GEST_ADESIONE
    })
    this.$root.$on('titolo-buono', () => {
      this.appTitle = TITLE_GEST_BUONO
    })
    this.$root.$on('titolo-rsa-menu', () => {
      this.appTitle = TITLE_GEST_RSA_MENU
    })

  },
  computed: {
    menuEnabled() {
      return !this.$route.meta?.menuDisabled
    },
    currentUser() {
      return this.$store.getters[TYPES.GETTERS.USER]
    },
    activeProfiles() {
      return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES]
    },
    labelList() {
      let returnList = this.essentialLinks?.filter(link => this.activeProfiles?.find(profile => link.profiles?.includes(profile.nomeProfilo)))
      return returnList ?? []
    }
  },
  methods: {
    showFAQ() {
      let baseUrl = process.env.APP_ASSISTANCE_BASE_URL.replaceAll('"', '')
      let url = `${baseUrl}/#/faq?servizio=${ASSISTANCE_CODES.GEST_EROGATORI}`;
      openURL(url);
    },

    showManual() {
      openURL('/manualigescovid/gestruttureres/Manuale_Utente_Struttura_Residenziale_COVID.pdf')
    },
    showManualNew() {
      openURL('/manualigescovid/rsa/Manuale_Utente_RSA.pdf')
    },
    showManualAdes() {
      openURL('/manualigescovid/rsa/Manuale_Utente_Adesione_Residenzialita.pdf')
    },
    showAssistance() {
      let baseUrl = process.env.APP_ASSISTANCE_BASE_URL.replaceAll('"', '')

      let url = `${baseUrl}/#/assistenza/${ASSISTANCE_CODES.GEST_EROGATORI}`;
      window.open(url);
    }
  }
}
</script>

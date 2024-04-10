<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-layout view="lHh Lpr fff">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          <!--Test Rapidi Strutture Residenziali - Auto Screening-->
          Gestione Strutture Territoriali
          <div class="text-caption q-mb-xs">
            Piattaforma Covid 19 Piemonte
          </div>
        </q-toolbar-title>


        <ges-strutture-header></ges-strutture-header>
      </q-toolbar>

    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import TheFooter from 'components/TheFooter'
import GesStruttureHeader from 'components/GesStruttureHeader'
import { openURL } from 'quasar'
import { TYPES } from '../store'
import {
  PAGE_LINKS, PROFILI_EROGATORI, PROFILI_RSA,
  TITLE_GEST_EROGATORI,
  TITLE_GEST_RSA,
  TITLE_GEST_RSA_MENU,
  TITLE_GEST_ST_RES,
  TITLE_INDEX
} from 'src/services/business_logic'
import GesStruttureMenuListItem from "components/GesStruttureMenuListItem";

export default {
  name: 'MainLayout',
  components: {GesStruttureMenuListItem, GesStruttureHeader, TheFooter },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: PAGE_LINKS,
      appTitle: ''
    }
  },
  created () {

  },
  computed: {

    currentUser () {
      return this.$store.getters[TYPES.GETTERS.USER]
    },
    activeProfiles () {
      return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES]
    },
    labelList() {
      let returnList = this.essentialLinks?.filter(link => this.activeProfiles?.find(profile =>  link.profiles?.includes(profile.nomeProfilo)))
      return returnList ?? []
    }
  },
  methods: {
    showManual () {
      openURL('/manualigescovid/gestruttureres/Manuale_Utente_Struttura_Residenziale_COVID.pdf')
    }
  }
}
</script>

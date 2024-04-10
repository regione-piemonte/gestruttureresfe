<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <!-- <div
      class="sticky bg-white" >
      <q-tabs
        v-model="tab"
        inline-label
        active-bg-color="primary"
        active-color="white"
        indicator-color="transparent"
        mobile-arrows>
        <q-tab
          v-for="tab in tabLinks"
          v-show="isAuthorized(tab)"
          :key="tab.id"
          :name="tab.title"
          :label="tab.title"
          :icon="tab.icon"
          :ripple="false"
          @click="goToTab(tab.route)"
          class="col-grow"
        />
      </q-tabs>
    </div> -->
    <div class="full-height full-width justify-center">
      <transition :name="transitionName" mode="out-in">
        <router-view class="page-max-width" />
      </transition>
    </div>
  </div>
</template>

<script>
import { RSA, RSA_ASL, RSA_RP } from 'src/services/business_logic'
import { TYPES } from 'src/store'

const TAB_LINKS = [
  {
    id: 0,
    title: 'RESIDENZE',
    icon: 'apartment',
    route: '/gestione_rsa/residenze',
    roles: [RSA, RSA_RP, RSA_ASL]
  }
  // {
  //   id: 1,
  //   title: 'NOTE',
  //   icon: 'sticky_note_2',
  //   route: '/gestione_rsa/note',
  //   roles: [RSA]
  // }
]

export default {
  name: 'PageGestioneRsa',
  data () {
    return {
      tabLinks: TAB_LINKS,
      tab: null,
      transitionName: 'scale'
    }
  },
  created () {
    this.checkRoles()
    this.initTab()
    if(this.getProvenienza=='rilevazioni')
      this.$root.$emit('titolo-rsa')
    if(this.getProvenienza=='adesioni')
      this.$root.$emit('titolo-adesione')
    if(this.getProvenienza=='buono')
      this.$root.$emit('titolo-buono')
    if(this.getProvenienza==null){
      this.$root.$emit('titolo-res')
    }
  },
  watch: {
    $route (to, from) {
      this.initTab(to)
    },
    tab: function (newVal, oldVal) {
      if (oldVal) {
        const oldTabId = this.getTabByPropValue('title', oldVal).id
        const newTabId = this.getTabByPropValue('title', newVal).id

        if (newTabId > oldTabId) {
          this.transitionName = 'slide-next'
        } else {
          this.transitionName = 'slide-prev'
        }
      }
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters[TYPES.GETTERS.USER]
    },
    getProvenienza() {
      return this.$store.getters["getProvenienza"];
    },
  },
  methods: {
    initTab (to) {
      const path = to?.path ?? this.$route.path

      this.tab = this.getTabByPropValue('route', path)?.title
    },
    goToTab (route) {
      this.$router.push(route)
    },
    getTabByPropValue (prop, value) {
      return this.tabLinks.find((tab) => {
        return tab[prop] === value
      })
    },
    isAuthorized (link) {
      const roles = this.currentUser?.elencoProfilo

      return link.roles.some(role => roles.find(r => r.nomeProfilo === role))
    },
    checkRoles () {
      const roles = this.currentUser?.elencoProfilo
      
      if (!roles.some(role => role.nomeProfilo === RSA || role.nomeProfilo === RSA_RP || role.nomeProfilo === RSA_ASL)) {
        this.$router.replace('/strutture')
      }
    }
  }
}
</script>

<style scoped>
  .sticky {
    position: -webkit-sticky;
      position: sticky;
      top: 50px;
      z-index: 2000;
      box-shadow: 0 10px 10px 0 #00000022;
  }
</style>

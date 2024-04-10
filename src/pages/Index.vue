<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>

  <q-page padding>
    <!-- LISTA MESSAGGI -->
<!--    <template v-if="!!communicationList.length">-->
<!--      <communication-list-item-->
<!--        v-for="communication in communicationList"-->
<!--        :key="communication.id"-->
<!--        :communication="communication"-->
<!--        class="q-mb-lg q-mt-md" />-->
<!--    </template>-->
    <div class="flex flex-center row">
    <q-card
      class="q-mx-md q-my-lg column"
      v-for="link in authorizedLinks"
      style="width:300px; height:230px"
      :key="link.link">

      <q-card-section class="items-center q-col-gutter-md col-grow">
        <q-icon
          :name="link.icon"
          size="xl" />
        <div class="text-h6">{{ link.title }}</div>
      </q-card-section>

      <q-separator class="q-my-sm self-end" inset />

      <q-card-actions class="justify-end items-center self-end">
        <q-btn
          class="border-up-none col-shrink self-end"
          @click="navigateTo(link.link, link.profiles)"
          label="Vai al servizio"
          color="primary"
          flat />
      </q-card-actions>

    </q-card>
    </div>
  </q-page>
</template>

<script>
import { PAGE_LINKS } from 'src/services/business_logic'
import { TYPES } from 'src/store'
import CommunicationListItem from "../components/messages/CommunicationListItem";
import {GEST_EROGATORI, GEST_ST_RES} from "../services/business_logic";
export default {
  name: 'PageIndex',
    components: {CommunicationListItem},
    data () {
    return {
      links: PAGE_LINKS
    }
  },
  created () {
    this.$root.$emit('titolo-indice')
  },
  computed: {
    user () {
      return this.$store.getters[TYPES.GETTERS.USER]
    },
      activeProfiles () {
          return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES]
      },

          // communicationList () {
          //     return this.$store.getters[TYPES.GETTERS.COMMUNICATION_LIST] ?? []
          // },

    authorizedLinks () {
      return this.links.filter(link => {
        return !!this.user?.elencoProfilo?.find(profilo => {
          return link.profiles?.includes(profilo.nomeProfilo)
        })
      })
    }
  },
  methods: {
    async navigateTo (link, profiles) {
        let profile = null
        if(profiles[0]===GEST_EROGATORI) {
            profile = this.activeProfiles.find(a => a.nomeProfilo === GEST_EROGATORI)
        }
        if(profiles[0]===GEST_ST_RES) {
            profile = this.activeProfiles.find(a => a.nomeProfilo === GEST_ST_RES)
        }
        await this.$store.dispatch("setSelectedProfile", { profile: profile });


      this.$router.push(link)
    }
  }
}
</script>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-btn outline dense rounded>
    <q-icon left name="person" />
    <template v-if="!hasUserContacts">
      <q-icon
        name="error"
        color="red"
        size="xs"
        class="absolute-top-left bg-white"
        style="border-radius: 50%; top: -2px; left: -2px;"
      />
    </template>

    <template v-if="$q.screen.gt.sm">
      <template v-if="userFullName">
        {{ userFullName }}
      </template>
      <template v-else>
        {{ userTaxCode }}
      </template>
    </template>

    <q-icon right name="keyboard_arrow_down" />

    <q-menu fit>
      <q-list separator style="min-width: 250px">
        <template v-if="!hasUserContacts">
          <q-item clickable class="bg-blue-1" @click="goToUserProfile">
            <q-item-section>
              Aggiungi il numero di telefono
            </q-item-section>
          </q-item>
        </template>
        <q-item clickable @click="goToUserProfile">
          <q-item-section side>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body1">
              {{ userFullName | emptyString }}
            </q-item-label>
            <q-item-label class="text-caption">
              {{ userTaxCode }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <template v-if="structures.length">
          <q-separator />
          <q-item v-for="structure in structures" :key="structure.length">
            <q-item-section side>
              <q-icon name="domain" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-body1">
                {{ structure.nome | emptyString }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-separator />
        <q-item clickable @click="onLogout">
          <q-item-section side>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body1">
              Esci
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { TYPES } from '../store'
import { logout } from 'src/services/business_logic'

export default {
  name: 'GesStruttureHeader',
  computed: {
    user () {
      return this.$store.getters[TYPES.GETTERS.USER]
    },
    asr () {
      return this.user?.asr?.descrizione || ''
    },
    hasUserContacts () {
      return this.$store.getters[TYPES.GETTERS.HAS_USER_CONTACTS]
    },
    userTaxCode () {
      return this.user?.cfUtente ?? ''
    },
    userFirstName () {
      return this.user?.nome ?? ''
      // return this.user?.contatto?.nome ?? ''
    },
    userLastName () {
      return this.user?.cognome ?? ''
      // return this.user?.contatto?.cognome ?? ''
    },
    userFullName () {
      if (!this.userLastName && !this.userFirstName) return ''
      return `${this.userLastName} ${this.userFirstName}`
    },
    structures () {
      return []
      // return this.user?.elencoStrutturaArea ?? [];
    }
  },
  methods: {
    goToUserProfile () {
    },
    async onLogout () {
      try {
        logout()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-footer>
    <div class="bg-primary q-pa-md">
      <div class="row q-col-gutter-y-md justify-between items-center no-margin">
        <div class="col-12 col-sm-auto text-center">
          <img
            src="../statics/images/logo-regione-piemonte.svg"
            alt="Regione Piemonte"
            class="csi-logo-regione"
          />
        </div>

        <div class="col-12 col-sm-4">
          <div class="row">
            <div class="col-sm-8" style="font-size: 80%;">
              <strong>Assistenza</strong><br>
<!--              telefono:<br> 0110824245<br>-->
              e-mail:<br> <a href="mailto:assistenza_rsa_covid19@csi.it" style="color:white; text-decoration: none;">{{ footerEmail }}</a>

            </div>
            <div class="col-sm-4">
              <img
                src="../statics/images/logo-csi.png"
                alt="Logo CSI"
                class="responsive"
                style="max-width: 96px;"
              />
              <q-list dense class="items-center justify-center">
                <q-item class="items-center justify-center" dense clickable flat  @click.native="viewNotes">
                  Ver. {{notesSorted[0].version}} - {{ versioneBe }}
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="isModalNotesOpen" full-width full-height @hide="onHide">
      <q-card style="max-width: 800px !important;">
        <q-card-section class="q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title>
              NovitÃ 
            </q-toolbar-title>

            <q-btn v-close-popup round dense flat icon="close" />
          </q-toolbar>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-timeline>
            <q-timeline-entry v-for="note in notesSorted" :key="note.version">
              <template v-slot:title> Versione {{ note.version }} - Versione BE {{ versioneBe }} </template>
              <template v-slot:subtitle>
                {{ note.date | date }}
              </template>
              <div v-html="note.text"></div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-footer>

</template>

<script>
import {
  VERSION,
  RELEASES_NOTES,
  RELEASES_NOTES_STORAGE_KEY
} from 'src/services/config'
import { TYPES } from 'src/store'
import {
  GEST_ST_RES,
  E_MAIL_GEST_ST_RES,
  E_MAIL_EROGATORI
} from 'src/services/business_logic'

export default {
  name: 'TheFooterOld',
  // components: {},
  data () {
    return {
      isModalNotesOpen: true,
      queryNoPopup: false,
      versioneBe: '',
      footerEmail: ''
    }
  },
  computed: {
    notes () {
      return RELEASES_NOTES || []
    },
    notesSorted () {
      const result = [...this.notes]

      result.sort((a, b) => {
        return new Date(a) > new Date(b) ? 1 : -1
      })

      return result
    }
  },
  created () {
    const queryNoPopup = location.href.includes('nopopup')
    const isLatestVersionSeen = this.$q.localStorage.getItem(RELEASES_NOTES_STORAGE_KEY) === VERSION
    if (queryNoPopup || isLatestVersionSeen) {
      this.queryNoPopup = queryNoPopup
      this.isModalNotesOpen = false
    }
    this.versioneBe = this.$store.getters[TYPES.GETTERS.USER].versioneBe
    this.footerEmail = this.$store.getters[TYPES.GETTERS.USER_TYPE] === GEST_ST_RES ? E_MAIL_GEST_ST_RES : E_MAIL_EROGATORI
    this.switchTitle()
    // console.log('E-mail impostata =>', this.footerEmail)
  },
  methods: {
    viewNotes () {
      if (!this.queryNoPopup) {
        this.isModalNotesOpen = !this.isModalNotesOpen
      }
    },
    switchTitle () {
      this.$root.$on('titolo-res', () => {
        this.footerEmail = E_MAIL_GEST_ST_RES
      })
      this.$root.$on('titolo-soggetti', () => {
        this.footerEmail = E_MAIL_EROGATORI
      })
    },
    onHide () {
      this.$q.localStorage.set(RELEASES_NOTES_STORAGE_KEY, VERSION)
    }
  }
}
</script>

<style scoped lang="stylus">
.csi-logo-regione {
  width: 100%;
  max-width: 160px;
  height: auto;
}
</style>

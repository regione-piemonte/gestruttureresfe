<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-footer>
    <div class="bg-primary q-pa-lg">
      <div
        class="row  justify-between items-center no-margin text-center"
        :class="{ 'q-col-gutter-y-lg': $q.screen.lt.sm }"
      >
        <div class="col-12 col-sm-auto " v-if="showDirmeiLogo">
          <img
            src="../statics/images/logo-dirmei.svg"
            alt="Logo Dirmei"
            class="csi-logo-dirmei"
          />
        </div>

        <div class="col-12 col-sm-auto">
          <img
            src="../statics/images/logo-regione-piemonte.svg"
            alt="Logo Regione Piemonte"
            class="csi-logo-regione"
          />
        </div>

        <div class="col-12 col-sm-auto ">
          <img
            src="../statics/images/logo-csi.svg"
            alt="Logo CSI"
            class="csi-logo-csi"
          />
        </div>
      </div>
    </div>
    <div class="csi-footer--assistance q-pa-lg" v-if="showContacts">
      <div
        class="row items-start justify-between text-body2"
        :class="{ 'q-col-gutter-y-lg': $q.screen.lt.sm }"
      >
        <div class="col-12 col-sm-auto">
          <div class="text-bold q-mb-xs">ASSISTENZA</div>
          <a href="mailto:residenzialita.dirmei@aslcittaditorino.it"
            >residenzialita.dirmei@aslcittaditorino.it</a
          >
        </div>
        <div class="col-12 col-sm-auto">
          <div class="text-bold q-mb-xs">CONTATTI</div>
          <div>011 - 5663186</div>
          <!-- <div>011.6540176 - 011.5663176</div> -->
<!--          <div>331.6971793</div>-->
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
              <template v-slot:title> Versione {{ note.version }} </template>
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
} from "src/services/config";
import { TYPES } from "src/store";
import {
  GEST_ST_RES,
  E_MAIL_GEST_ST_RES,
  E_MAIL_EROGATORI
} from "src/services/business_logic";

export default {
  name: "TheFooter",
  props: {
    showContacts: { type: Boolean, request: false, default: false },
    showDirmeiLogo: { type: Boolean, request: false, default: false }
  },
  data() {
    return {
      isModalNotesOpen: true,
      queryNoPopup: false,
      versioneBe: "",
      footerEmail: ""
    };
  },
  computed: {
    notes() {
      return RELEASES_NOTES || [];
    },
    notesSorted() {
      const result = [...this.notes];

      result.sort((a, b) => {
        return new Date(a) > new Date(b) ? 1 : -1;
      });

      return result;
    }
  },
  created() {
    const queryNoPopup = location.href.includes("nopopup");
    const isLatestVersionSeen =
      this.$q.localStorage.getItem(RELEASES_NOTES_STORAGE_KEY) === VERSION;
    if (queryNoPopup || isLatestVersionSeen) {
      this.queryNoPopup = queryNoPopup;
      this.isModalNotesOpen = false;
    }
    this.versioneBe = this.$store.getters[TYPES.GETTERS.USER].versioneBe;
    this.footerEmail =
      this.$store.getters[TYPES.GETTERS.USER_TYPE] === GEST_ST_RES
        ? E_MAIL_GEST_ST_RES
        : E_MAIL_EROGATORI;
    this.switchTitle();
  },
  methods: {
    switchTitle() {
      this.$root.$on("titolo-res", () => {
        this.footerEmail = E_MAIL_GEST_ST_RES;
      });
      this.$root.$on("titolo-soggetti", () => {
        this.footerEmail = E_MAIL_EROGATORI;
      });
    },
    onHide() {
      this.$q.localStorage.set(RELEASES_NOTES_STORAGE_KEY, VERSION);
    }
  }
};
</script>

<style scoped lang="stylus">
.csi-logo-regione {
  width: 100%;
  max-width: 160px;
  height: auto;
}
.csi-logo-csi {
  max-width: 170px;
  height: auto;
}
.csi-logo-dirmei {
  max-width: 70px;
  height: auto;
}
.csi-footer--assistance {
  background-color: #253a74;
  color: #FFF;

  a {
    color: #ffffff;
    text-decoration: none;
  }
}
</style>

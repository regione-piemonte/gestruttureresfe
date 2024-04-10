<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page padding>
    <!-- <div class="fit row justify-center items-center q-my-md">
      <q-card style="max-width: 800px;">
        <q-card-section class="row items-end q-py-none q-px-lg" horizontal>
          <q-card-section class="q-pb-none col-sm col-md-7 gt-xs">
            <img alt="Strutture residenziali" class="full-width vertical-bottom q-pr-lg"
              src="../../statics/images/struttura-residenziale.svg" />
          </q-card-section>
          <q-card-section class="col-12 col-sm ">
            <div class="q-py-lg">
              <div class="text-h6 text-bold q-mb-md">
                Rilevazioni settimanali
              </div>
              <div>
                <q-tooltip v-if="!rapidTestAvailable">
                  Non Ã¨ possibile accedere al servizio
                </q-tooltip>

                <q-btn :class="{ 'full-width': $q.screen.lt.sm }" @click="setProfile(false, 'rilevazioni')"
                  color="primary" :disable="!rapidTestAvailable" :disabled="!rapidTestAvailable">
                  Vai al servizio
                </q-btn>
              </div>
            </div>
            <q-separator class="text-accent" />
            <div class="q-py-lg">
              <div class="text-h6 text-bold q-mb-md">Test Rapidi</div>
              <div>
                <q-tooltip v-if="!structuresAvailable">
                  Non Ã¨ possibile accedere al servizio
                </q-tooltip>
                <q-btn :class="{ 'full-width': $q.screen.lt.sm }" color="primary" @click="setProfile(true, null)"
                  :disable="!structuresAvailable">Vai al servizio</q-btn>
              </div>
            </div>
            <q-separator class="text-accent" />
            <div class="q-py-lg">
              <div class="text-h6 text-bold q-mb-md">
                Adesione Buono ResidenzialitÃ  (Scelta sociale)
              </div>
              <div>
                <q-tooltip v-if="!rapidTestAvailable">
                  Non Ã¨ possibile accedere al servizio
                </q-tooltip>

                <q-btn :class="{ 'full-width': $q.screen.lt.sm }" @click="setProfile(false, 'adesioni')" color="primary"
                  :disable="!rapidTestAvailable" :disabled="!rapidTestAvailable">
                  Vai al servizio
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div> -->
    <div class="flex flex-center row">
      <q-card class="q-mx-md q-my-lg column" 
        v-for="link in linksToPages_RowOne" :key="link.title"
        style="width:300px; height:230px">

        <q-card-section class="items-center q-col-gutter-md col-grow">
          <q-icon :name="link.icon" size="xl" />
          <div class="text-h6">{{ link.title }}</div>
        </q-card-section>

        <q-separator class="q-my-sm self-end" inset />

        <q-card-actions class="justify-end items-center self-end">
          <div>
            <q-tooltip v-if="!link.isSwab ? !rapidTestAvailable : !structuresAvailable">
              Non Ã¨ possibile accedere al servizio
            </q-tooltip>

            <q-btn class="border-up-none col-shrink self-end" 
              label="Vai al servizio"
              @click="setProfile(link.isSwab, link.provenienza)" 
              color="primary" flat :disabled="!link.isSwab ? !rapidTestAvailable : !structuresAvailable">
            </q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </div>
    <div class="flex flex-center row">
      <q-card class="q-mx-md q-my-lg column" 
        v-for="link in linksToPages_RowTwo" :key="link.title"
        style="width:300px; height:230px">

        <q-card-section class="items-center q-col-gutter-md col-grow">
          <q-icon :name="link.icon" size="xl" />
          <div class="text-h6">{{ link.title }}</div>
        </q-card-section>

        <q-separator class="q-my-sm self-end" inset />

        <q-card-actions class="justify-end items-center self-end">
          <div>
            <q-tooltip v-if="!link.isSwab ? !rapidTestAvailable : !structuresAvailable">
              Non Ã¨ possibile accedere al servizio
            </q-tooltip>

            <q-btn class="border-up-none col-shrink self-end" 
              label="Vai al servizio"
              @click="setProfile(link.isSwab, link.provenienza)" 
              color="primary" flat :disabled="!link.isSwab ? !rapidTestAvailable : !structuresAvailable">
            </q-btn>
          </div>
       
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { GESTIONE_RSA, LISTA_STRUTTURE, LISTA_STRUTTURE_BUONO } from "src/router/routes";
import { TYPES } from "src/store";
import {
  GEST_ST_RES, PROFILI_RILEVAZIONI,
  PROFILI_RSA
} from "src/services/business_logic";
import {
  GEST_EROGATORI,
  RSA,
  RSA_ASL,
  RSA_RP
} from "../../services/business_logic";

export default {
  name: "PageGestioneRsaMenu",
  data() {
    return {
      GESTIONE_RSA,
      LISTA_STRUTTURE,
      GEST_ST_RES,
      rsaProfileList: [RSA, RSA_RP, RSA_ASL],
      linksToPages_RowOne: [
        {
          title: 'Rilevazioni settimanali',
          icon: 'img:icons/strut_res.svg',
          isSwab: false,
          provenienza: 'rilevazioni'
        },
        {
          title: 'Test Rapidi',
          icon: 'img:icons/strut_res.svg',
          isSwab: true,
          provenienza: null
        }
      ],
      linksToPages_RowTwo: [
        {
          title: 'Adesione Buono ResidenzialitÃ ',
          icon: 'img:icons/strut_res.svg',
          isSwab: false,
          provenienza: 'adesioni'
        },
        {
          title: 'Rendicontazioni Buono ResidenzialitÃ ',
          icon: 'img:icons/strut_res.svg',
          isSwab: false,
          provenienza: 'buono'
        }
      ],
    };
  },
  created() {
    this.$root.$emit("titolo-rsa-menu");
  },
  computed: {
    activeProfiles() {
      return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES];
    },
    structuresAvailable() {
      return this.activeProfiles?.find(
        profile => profile.nomeProfilo === GEST_ST_RES
      );
    },
    rapidTestAvailable() {
      let profiles = this.activeProfiles?.filter(
        profile =>
          PROFILI_RSA.includes(profile.nomeProfilo) &&
          profile.nomeProfilo !== GEST_ST_RES
      );
      return profiles.length > 0;
    }
  },
  methods: {
    async setProfile(isSwab, provenienza) {
      
      let profile = null;
      await this.$store.dispatch("setProvenienza", { provenienza: provenienza });
      if (isSwab) {
        profile = this.activeProfiles.find(a => a.nomeProfilo === GEST_ST_RES);
        await this.$store.dispatch("setSelectedProfile", { profile: profile });
        this.$router.push({ path: LISTA_STRUTTURE.path });
      } else {
        PROFILI_RILEVAZIONI.forEach(a => {
          if (this.activeProfiles.find(b => b.nomeProfilo === a)) {
            profile = this.activeProfiles.find(b => b.nomeProfilo === a)
          }
        })

        await this.$store.dispatch("setSelectedProfile", { profile: profile });
        if (provenienza == 'buono') {
          this.$router.push({ path: LISTA_STRUTTURE_BUONO.path });
        } else {
          this.$router.push({ path: GESTIONE_RSA.path });
        }
      }
    }
  }
};
</script>

<style scoped></style>

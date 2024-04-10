<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div id="the-bootstrap">
    <template v-if="!isLoading">
      <template v-if="user">
        <slot />
      </template>

      <template v-else>
        <div v-if="notAllowed" class="fixed-center">
          <q-banner rounded class="bg-red-2">
            <p class="text-body1">Utente non autorizzato. <br /></p>

            <div class="q-px-md q-py-sm text-right">
              <q-btn flat color="primary" @click="onLogout">
                Esci
              </q-btn>
            </div>
          </q-banner>
        </div>
        <div v-else class="fixed-center">
          <the-bootstrap-unknown-error />
        </div>
      </template>
    </template>

    <q-inner-loading :showing="isLoading">
      <q-spinner color="primary" size="xl" />
    </q-inner-loading>
  </div>
</template>

<script>
import { getUserInfo } from "src/services/api";
import TheBootstrapUnknownError from "components/TheBootstrapUnknownError";
import {
  COMMUNICATION_LIST_INTERVAL,
  logout,
  PROFILI_EROGATORI,
  PROFILI_RSA
} from "src/services/business_logic";
import { INDEX } from "../router/routes";
import { TYPES } from "src/store";

import { APP_CODE } from "../services/business_logic";

// const PROFILO_VALIDO = 'GEST_ST_RES'

export default {
  name: "TheBootstrap",
  components: { TheBootstrapUnknownError },
  data() {
    return {
      loaded: false,
      user: null,
      notAllowed: false,
      isLoading: true
    };
  },
  computed: {
    selectedStructure() {
      return this.$store.getters[TYPES.GETTERS.SELECTED_STRUCTURE];
    }
  },
  beforeMount() {
    //SE HAI REFRESHATO LA PAGINA TI RIMANDO ALLA HOME PERCHÃ¨ MI SERVE SAPERE ENTE/STRUTTURA
    if (!this.selectedStructure) {
      let name = INDEX.name;
      this.$router.push({ name });
    }
  },
  async created() {
    try {
      this.getMessages();
      let params = {
        applicazioneCod: APP_CODE.STRUTTURE
      };
      const { data: user } = await getUserInfo(params).catch(async err => {
        if (err.response.status === 401) {
          this.notAllowed = true;
        }
      });

      if (!this.notAllowed) {
        this.$store.dispatch("setUser", { user });
        if (user !== null) {
          this.$store.dispatch("setActiveProfiles", user?.elencoProfilo);
          if (user?.elencoProfilo?.length > 0) {
            this.user = user;
          } else {
            this.notAllowed = true;
          }
        }

        this.loaded = true;
        this.isLoading = false;
        if (this.$route.path === "/") {
          const isGestRsa = this.user.elencoProfilo.filter(profilo =>
            PROFILI_RSA.includes(profilo.nomeProfilo)
          );
          const isGestErogatori = this.user.elencoProfilo.filter(profilo =>
            PROFILI_EROGATORI.includes(profilo.nomeProfilo)
          );

          if (user?.elencoProfilo?.length > 1) {
            // entrambi i profili validi, vai sulle strutture
            this.$router.push("");
          } else if (isGestRsa.length > 0) {
            // vai sulle strutture
            await this.$store.dispatch("setSelectedProfile", {
              profile: this.user.elencoProfilo[0]
            });
            this.$router.push("/gestione_rsa_servizi");
          } else if (isGestErogatori.length > 0) {
            // vai sui soggetti
            await this.$store.dispatch("setSelectedProfile", {
              profile: this.user.elencoProfilo[0]
            });
            this.$router.push("/soggetti");
          }
        }
      }
    } catch (e) {
      console.error(e);
      this.isLoading = false;
    }
  },
  methods: {
    onLogout() {
      logout();
    },
    getMessages() {
      this.$store.dispatch(TYPES.ACTIONS.LOAD_COMMUNICATION_LIST);

      setInterval(() => {
        this.$store.dispatch(TYPES.ACTIONS.LOAD_COMMUNICATION_LIST);
      }, COMMUNICATION_LIST_INTERVAL);
    }
  }
};
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-page class="flex flex-center" padding>
    <div style="">
      <div class="text-h5 text-bold q-pb-lg">Accesso alla Gestione Strutture Residenziali</div>

      <q-card class="row justify-between">
        <q-card-section class="col-shrink flex flex-center">
          <q-btn
            label="Vai al servizio"
            @click="goToIndex"
            color="primary"
            class="q-px-md q-mx-xl"
            size="lg" />
        </q-card-section>
          <img
          class="col"
            alt="Quasar logo"
            src="~assets/home_gfx.svg">
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToIndex () {
      this.$router.push('/index')
    }
  }
}
</script>

<style>

</style>

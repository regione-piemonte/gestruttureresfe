<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-banner rounded class="bg-red-2">
    <p class="text-body1">
      Non Ã¨ stato possibile ottenere le informazioni sull'utente autenticato.
      <br />
      Potrebbe essere un errore temporaneo, prova ad aggiornare la pagina.
    </p>

    <div class="q-px-md q-py-sm text-right">
      <q-btn flat color="primary" @click="reloadPage">
        Aggiorna
      </q-btn>
    </div>
  </q-banner>
</template>

<script>
export default {
  name: 'TheBootstrapUnknownError',
  methods: {
    reloadPage () {
      window.location.reload()
    }
  }
}
</script>

<style scoped></style>

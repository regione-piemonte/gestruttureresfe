<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <dialog-generico generic :loading="loading" :open="open" @closeDialog="closeDialog" @confirmDialog="confirmDialog">
    <template slot="head">
      <div class="text-h6">Conferma cancellazione</div>
    </template>

    <template slot="body">
      <div>Vuoi davvero cancellare la rilevazione selezionata?</div>
    </template>
  </dialog-generico>
</template>

<script>
import DialogGenerico from './DialogGenerico.vue'
export default {
  name: 'DialogConfermaEliminazione',
  components: { DialogGenerico },
  data () {
    return {
      open: false,
      loading: false,
      callback: null
    }
  },
  methods: {
    openDialog (callback) {
      this.open = true
      this.callback = callback
    },
    closeDialog () {
      this.open = false
    },
    confirmDialog () {
      this.callback()
    }
  }
}
</script>

<style>

</style>

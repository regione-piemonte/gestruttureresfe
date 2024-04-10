<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="row justify-end items-center">
    <div class="text-caption">
      Righe per pagina:
    </div>
    <q-select
      :disable="disable"
      v-model="value.rowPerPage"
      @input="changePagination"
      :options="rowPerPageOptions"
      class="q-ml-sm"
      dense />

    <q-btn
      @click="switchPage(-1)"
      :disable="value.pageNumber === 1 || disable"
      icon="navigate_before"
      dense
      flat
      round
      class="q-pa-xs q-mx-sm" />

    <div class="row items-center">
      {{value.pageNumber}} / {{totalPages}}
    </div>

    <q-btn
      @click="switchPage(1)"
      :disable="value.pageNumber === totalPages || disable"
      icon="navigate_next"
      dense
      flat
      round
      class="q-pa-xs q-mx-sm" />
  </div>
</template>

<script>
const ROW_PER_PAGE_OPTIONS = [
  5,
  10,
  20,
  50,
  100
]

export default {
  name: 'PageSelector',
  props: ['value', 'totalPages', 'disable'],
  data () {
    return {
      rowPerPageOptions: ROW_PER_PAGE_OPTIONS
    }
  },
  methods: {
    switchPage (add) {
      if ((add < 0 && this.value.pageNumber > 1) || (add > 0 && this.value.pageNumber < this.totalPages)) {
        this.value.pageNumber += add
      }
    },
    changePagination () {
      this.value.pageNumber = 1
    }
  }
}
</script>

<style>

</style>

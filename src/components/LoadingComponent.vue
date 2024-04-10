<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <transition name="list-load" mode="out-in">
    <slot v-if="!loading" />

    <div v-else class="column full-height full-width items-center" key="spinner">
      <q-spinner size="32pt" class="q-mt-lg" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingComponent',
  props: {
    loading: { type: Boolean }
  }
}
</script>

<style>

</style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-btn
    rounded
    :unelevated="!active"
    :outline="!active"
    :color="color"
    class="mmg-filter-button"
    :class="classes"
    @click="$emit('click')"
  >
    <slot />
  </q-btn>
</template>

<script>
export default {
  name: 'MmgFilterButton',
  props: {
    active: { type: Boolean, required: false, default: false },
    color: { type: String, required: false, default: null }
  },
  computed: {
    classes () {
      const result = []
      if (this.active) result.push('shadow-2')
      return result
    }
  }
}
</script>

<style scoped lang="sass">
.mmg-filter-button
  transition: all .6s ease
</style>

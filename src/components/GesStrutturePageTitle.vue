<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-item class="q-px-none">
    <template v-if="!noBack">
      <q-item-section side>
        <q-btn
          round
          flat
          dense
          color="black"
          icon="keyboard_arrow_left"
          @click="$emit('back')"
        />
      </q-item-section>
    </template>

    <q-item-section>
      <q-item-label class="text-h6">
        <slot />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'GesStrutturePageTitle',
  props: {
    noBack: { type: Boolean, required: false, default: false }
  }
}
</script>

<style scoped>

</style>

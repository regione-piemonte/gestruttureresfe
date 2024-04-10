<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <a :href="href" @click.stop>{{ email | emptyString }}</a>
</template>

<script>
export default {
  name: 'MmgLabelEmail',
  props: {
    email: { type: String, required: false, default: '-' }
  },
  computed: {
    href () {
      return `mailto:${this.email}`
    }
  }
}
</script>

<style scoped></style>

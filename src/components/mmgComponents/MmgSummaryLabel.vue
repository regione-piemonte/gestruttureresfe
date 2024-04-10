<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MmgSummaryLabel',
  props: {
    title: { type: Boolean, required: false, default: false },
    main: { type: Boolean, required: false, default: false },
    caption: { type: Boolean, required: false, default: false },
    bold: { type: Boolean, required: false, default: false }
  },
  computed: {
    classes () {
      const result = []

      if (this.title) result.push('text-body2')
      // if (this.main) result.push("text-body1");
      if (this.main) result.push('text-body2')
      if (this.caption) result.push('text-caption')
      if (this.bold) result.push('text-weight-bold')

      return result
    }
  }
}
</script>

<style scoped></style>

<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <span class="mmg-swab-result-label" :class="classes">
    <slot>
      {{ label | emptyString }}
    </slot>
  </span>
</template>

<script>

import { SWAB_RESULT_STATUSS, SWAB_RESULT_STATUSS_ALT, SWAB_RESULT_STATUSS_LABEL } from 'src/services/business_logic'

export default {
  name: 'MmgSwabResultLabel',
  props: {
    code: null,
    bold: { type: Boolean, required: false, default: false }
  },
  computed: {
    label () {
      const label = SWAB_RESULT_STATUSS_LABEL[this.code]

      return label
    },
    classes () {
      const result = []

      if (this.code === SWAB_RESULT_STATUSS.PENDING) {
        result.push('text-info')
      } else if (this.code === SWAB_RESULT_STATUSS.POSITIVE || this.code === SWAB_RESULT_STATUSS_ALT.POSITIVE) {
        result.push('text-negative')
      } else if (this.code === SWAB_RESULT_STATUSS.NEGATIVE || this.code === SWAB_RESULT_STATUSS_ALT.NEGATIVE) {
        result.push('text-positive')
      } else if (this.code === SWAB_RESULT_STATUSS.SUSPENDED) {
        result.push('text-black')
      } else if (this.code === SWAB_RESULT_STATUSS.UNSUITABLE || this.code === SWAB_RESULT_STATUSS.NOT_RECEIVED || this.code === SWAB_RESULT_STATUSS.UNKNOWN || this.code === SWAB_RESULT_STATUSS.DOUBT || this.code === SWAB_RESULT_STATUSS_ALT.UNKNOWN || this.code === SWAB_RESULT_STATUSS_ALT.DOUBT) {
        result.push('text-warning')
      }

      if (this.bold) {
        result.push('text-weight-bold')
      }

      return result
    }
  }
}
</script>

<style scoped></style>

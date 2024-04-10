<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="row">
    <template>
      <div>
        <q-icon :size="size" name="person_pin" color="primary">
          <q-tooltip>Soggetto</q-tooltip>
        </q-icon>
      </div>
    </template>
    <!--<template v-if="isOspiteStruttura">
      <div>
        <q-icon :size="size" name="person_pin" color="primary">
          <q-tooltip>Soggetto</q-tooltip>
        </q-icon>
      </div>
    </template>

    <template v-if="isDaCompletare">
      <div class="q-ml-sm">
        <q-icon :size="size" name="warning" color="orange">
          <q-tooltip>Segnalazione da integrare</q-tooltip>
        </q-icon>
      </div>
    </template>

    <template v-if="isOther">
      <div>
        <q-icon :size="size" name="error_outline" color="primary">
        </q-icon>
      </div>
    </template> -->

  </div>
</template>

<script>

export default {
  name: 'MmgSubjectListTableRowIconsSoggetti',
  props: {
    row: { type: Object, required: false, default: null },
    size: { type: String, required: false, default: 'xs' }
  }
  /* computed: {
    //isDaCompletare () { return this.row.idTipoUltimoDecorso === 14 },
    isPersonale () { return this.row.descTipoSogg === 'operatore struttura residenziale anziani' },
    //isOspiteStruttura () { return this.row.descTipoSogg === 'ospite struttura residenziale anziani' },
    //isOther () { return this.row.descTipoSogg !== 'operatore struttura residenziale anziani' && this.row.descTipoSogg !== 'ospite struttura residenziale anziani' }
  } */
}
</script>

<style scoped></style>

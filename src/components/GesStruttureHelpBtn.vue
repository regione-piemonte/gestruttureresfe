<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-btn-dropdown
    rounded
    dropdown-icon="keyboard_arrow_down"
    class="q-mr-sm"
    flat
    round
    icon="help"
  >
    <q-list separator>
      <q-item v-close-popup clickable v-if="getProvenienza=='adesioni'">
        <q-item-section>
          <q-item-label @click="$emit('show-manual-adesione')">Manuale</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable v-if="getProvenienza==null">
        <q-item-section>
          <q-item-label @click="$emit('show-manual')">Manuale</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable v-if="getProvenienza=='rilevazioni'">
        <q-item-section>
          <q-item-label @click="$emit('show-manual-new')">Manuale</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable v-if="getProvenienza=='buono'">
        <q-item-section>
          <q-item-label @click="$emit('show-manual-rendicontazione')">Manuale</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable v-if="getProvenienza=='adesioni'">
        <q-item-section>
          <q-item-label @click="showVideo">Video Tutorial</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable>
        <q-item-section>
          <q-item-label @click="$emit('show-assistance')">Assistenza</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable>
        <q-item-section>
          <q-item-label @click="$emit('show-faq')">FAQ</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-btn-dropdown>
</template>


<script>
export default {
  name: "GesStruttureHelpBtn",
  computed:
  {
    getProvenienza() {
      return this.$store.getters["getProvenienza"];
    }
  }, 
  methods:
  {
    showVideo() {
      this.$emit("show-video");
    },
  }
}
</script>

<style scoped>

</style>

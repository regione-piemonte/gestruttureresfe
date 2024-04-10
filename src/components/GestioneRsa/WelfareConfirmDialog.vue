<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" full-width>
    <q-card style="max-width: 800px !important;">
      <q-card-section class="q-py-none">
        <q-toolbar class="q-px-none">
          <q-toolbar-title>
            Conferma
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6 q-mt-x text-center text-bold">
          Conferma di presa visione 
        </div>
        <div class="row">
          <div class="col-12"></div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row reverse q-col-gutter-md">
          <div class="col-md-auto col-12">
            <q-btn class="full-width" color="primary">
              Conferma
            </q-btn>
          </div>
          <div class="col-md-auto col-12">
            <q-btn class="full-width" color="primary" outline v-close-popup>
              Indietro
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "WelfareConfirmDialog",
  components: {},
  inheritAttrs: false,
  props: {
    fullData: { type: Object, required: false, default: null }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      let { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      let { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  watch: {},
  async created() {},
  methods: {}
};
</script>

<style scoped></style>

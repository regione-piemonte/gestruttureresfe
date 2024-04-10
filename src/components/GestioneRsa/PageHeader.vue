<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div class="column">
    <div class="row items-center q-mb-md">
      <div v-if="!isRoot && !noTitleBar"  class="row items-center">
        <q-btn @click="goBack" icon="arrow_back" no-caps flat round />
        <div class="text-h5 ellipsis">{{rootPageTitle}}</div>
        <div class="text-h5 q-px-sm">/</div>
      </div>
      <div class="col-grow text-h5 ellipsis">{{title}}</div>
      <slot name="header" class="col justify-center"/>
    </div>

    <transition name="fadeHeight" mode="out-in">
      <div v-if="menuOpen" class="row animated" :class="menuClasses">
        <slot name="body" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String },
    menuOpen: { type: Boolean },
    isRoot: { type: Boolean },
    rootPageTitle: { type: Boolean },
    noTitleBar: { type: Boolean }
  },
  computed: {
    menuClasses () {
      if (this.menuOpen) {
        return ['menu-open']
      } else {
        return ['menu-closed']
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  max-height: 48px;
}
.fadeHeight-enter,
.fadeHeight-leave-to
{
  opacity: 0;
  max-height: 0px;
}

@media screen and (max-width: 1024px) {
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    max-height: 96px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }
}

@media screen and (max-width: 600px) {
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    max-height: 192px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }
}
</style>

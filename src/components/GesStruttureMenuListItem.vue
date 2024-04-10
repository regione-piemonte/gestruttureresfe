<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <q-item v-bind="attrs" v-on="listeners" class="lms-menu-list-item" :class="classes"
      @click="setProfile(profiles, link, provenienza)">
      <template v-if="icon">
        <q-item-section avatar side>
          <q-icon :name="icon" />
        </q-item-section>
      </template>

      <q-item-section>
        <template v-if="title">
          <q-item-label class="lms-menu-list-item__title">
            {{ title }}
          </q-item-label>
        </template>

        <template v-if="caption">
          <q-item-label class="lms-menu-list-item__caption">
            {{ caption }}
          </q-item-label>
        </template>
      </q-item-section>
    </q-item>
    <template v-if="isMultiLevelMenu">
      <q-list dense>
        <div class="row items-center lms-menu-list-item--child q-px-sm" v-for="(menu, index) in subMenu" :key="index">
          <div class="col-2 lms-menu-list-item--child-item relative-position"></div>
          <q-item clickable v-on="listeners" :class="classes" class="lms-menu-list-item col" :disable="!activeMenu(menu)"
            @click="setProfile(menu.profiles, menu.link, menu.provenienza)">
            <q-item-section>
              <q-item-label class="lms-menu-list-item__title">
                {{ menu.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </template>
  </div>
</template>

<script>
import { TYPES } from "src/store";
import { GEST_ST_RES, PROFILI_RSA } from "src/services/business_logic";
import { GEST_EROGATORI } from "../services/business_logic";

export default {
  name: "GesStruttureMenuListItem",
  props: {
    title: { type: String, required: false, default: "" },
    caption: { type: String, required: false, default: "" },
    icon: { type: String, required: false, default: "" },
    subMenu: { type: Array, required: false, default: null },
    provenienza: { type: String, required: false, default: "" },
    profiles: { type: Array, required: false, default: null },
    link: { type: String, required: false, default: "" }
  },
  computed: {
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      // if (!("to" in attrs)) attrs.overlay = true;
      if (!("clickable" in attrs)) attrs.clickable = true;
      if (!("active" in attrs)) attrs.active = false;
      if (!("activeClass" in attrs))
        attrs.activeClass = "lms-menu-list-item--active";
      return attrs;
    },
    isMultiLevelMenu() {
      return this.subMenu?.length > 0;
    },
    activeProfiles() {
      return this.$store.getters[TYPES.GETTERS.ACTIVE_PROFILES];
    },
    classes() {
      return {
        "lms-menu-list-item--root": this.isMultiLevelMenu
      };
    }
  },
  methods: {
    async setProfile(profiles, link, provenienza) {
      let profile = null;
      this.$store.dispatch("setTabSelezionataBuono", { tabSelezionataBuono: null });
      await this.$store.dispatch("setProvenienza", { provenienza: provenienza });
      if (profiles[0] === GEST_EROGATORI) {
        profile = this.activeProfiles.find(
          a => a.nomeProfilo === GEST_EROGATORI
        );
      }
      if (profiles[0] === GEST_ST_RES) {
        profile = this.activeProfiles.find(a => a.nomeProfilo === GEST_ST_RES);
      }
      else {
        profiles.forEach(a => {
          if (this.activeProfiles.find(b => b.nomeProfilo === a)) {
            profile = this.activeProfiles.find(b => b.nomeProfilo === a)
          }
        })
      }
      await this.$store.dispatch("setSelectedProfile", { profile: profile });
      if (provenienza == 'rilevazioni')
        this.$root.$emit('titolo-rsa')
      if (provenienza == 'adesioni')
        this.$root.$emit('titolo-adesione')
        if (provenienza == 'buono')
        this.$root.$emit('titolo-buono')
      this.$router.push({ path: link });
    },
    activeMenu(menu) {
      let isActive = false;
      let profiles = menu.profiles;
      profiles.forEach(profile => {
        if (this.activeProfiles.find(a => a.nomeProfilo === profile)) {
          isActive = true;
        }
      });
      return isActive;
    }
  }
};
</script>

<style lang="sass">
.lms-menu-list-item__title
  color: $primary


.lms-menu-list-item__icon
  color: $primary

.lms-menu-list-item__icon-lock
  color: $grey-7
  font-size: 18px !important

.lms-menu-list-item--active
  background-color: $blue-1

  &.lms-menu-list-item--locked
    background-color: $grey-2

.lms-menu-list-item--locked
  .lms-menu-list-item__title
    color: $grey-8

.lms-menu-list-item--root
  position: relative
.lms-menu-list-item--child
  .lms-menu-list-item--child-item
    height: 48px
    &:before
      content: ""
      position: absolute
      top: -2px
      bottom: 50%
      width: 50%
      left: calc(50% - 4px)
      border-left: 2px solid $primary
      border-bottom: 2px solid $primary
  &:not(:last-child)
    .lms-menu-list-item--child-item
      &:after
        content: ""
        position: absolute
        top: -2px
        bottom: 0
        width: 2px
        right: auto
        left:  calc(50% - 4px)
        border-left: 2px solid $primary
</style>

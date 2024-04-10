<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <section class="messages q-mb-md q-gutter-y-md">
    <q-banner dense rounded class="communication-list-item" :class="classes">
      <div class="q-px-sm">
        <q-btn
          round
          flat
          size="sm"
          icon="close"
          class="float-right"
          @click="onClose"
        />

        <!-- NO PREVIEW -->
        <template v-if="!hasPreview">
          <div v-html="text"></div>
        </template>

        <!-- PREVIEW -->
        <template v-if="hasPreview">
          <div v-html="preview"></div>

          <q-slide-transition>
            <div v-show="isShowingMore">
              <div v-html="more"></div>
            </div>
          </q-slide-transition>

          <div>
            <a href="#" class="csi-link" @click.prevent="toggleShowMore">
              <template v-if="!isShowingMore">
                Mostra tutto
              </template>
              <template v-else>
                Mostra meno
              </template>
            </a>
          </div>
        </template>
      </div>
    </q-banner>
  </section>
</template>

<script>
import { TYPES } from 'src/store'

const SHOW_MORE_TAG = '<hr>'
const TYPE_MAP = {
  INFO: 'INFO',
  WARNING: 'WARNING'
}

export default {
  name: 'CommunicationListItem',
  props: {
    communication: { type: Object, required: false, default: null }
  },
  data () {
    return {
      isShowingMore: false
    }
  },
  computed: {
    id () {
      return this.communication?.id ?? ''
    },
    title () {
      return this.communication?.titolo ?? ''
    },
    text () {
      return this.communication?.testo ?? ''
    },
    type () {
      return this.communication?.tipologia_codice ?? ''
    },
    hasPreview () {
      return this.text.includes(SHOW_MORE_TAG)
    },
    preview () {
      return this.text.split(SHOW_MORE_TAG)[0]
    },
    more () {
      /* eslint-disable no-unused-vars */
      const [head, ...tail] = this.text.split(SHOW_MORE_TAG)
      return tail.join(SHOW_MORE_TAG)
    },
    classes () {
      /* eslint-disable prefer-const */
      let result = []
      switch (this.type) {
        case TYPE_MAP.WARNING:
          result.push('bg-orange-3')
          break
        default:
          result.push('bg-blue-2')
      }

      return result
    }
  },
  methods: {
    toggleShowMore () {
      this.isShowingMore = !this.isShowingMore
    },
    onClose () {
      const id = this.id
      this.$store.dispatch(TYPES.ACTIONS.HIDE_COMMUNICATION, { id })
    }
  }
}
</script>

<style lang="scss">
.communication-list-item {
  hr {
    display: none
  }
}
.csi-link {
  color: $primary;
  font-weight: 700;
  text-decoration: none;
  transition: color .4s ease-in-out;

  &:hover {
    color: $pink-8;
  }
}
</style>

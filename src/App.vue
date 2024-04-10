<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div id="q-app">
    <the-bootstrap>
      <router-view />
    </the-bootstrap>
  </div>
</template>
<script>
import TheBootstrap from 'components/TheBootstrap'
export default {
  name: 'App',
  components: { TheBootstrap }
}
</script>

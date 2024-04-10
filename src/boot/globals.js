/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

import Vue from 'vue'
import { date, format } from 'quasar'
const { humanStorageSize } = format
const { formatDate } = date

Vue.filter('date', (v, defaultValue = '-') => {
  return v ? formatDate(v, 'DD MMM YYYY') : defaultValue
})

Vue.filter('dateComplete', (v, defaultValue = '-') => {
  return v ? formatDate(v, 'DD MMMM YYYY') : defaultValue
})

Vue.filter('dateMonthYear', (v, defaultValue = '-') => {
  return v ? formatDate(v, 'MMM YYYY') : defaultValue
})

Vue.filter('time', (v, defaultValue = '-') => {
  return v ? formatDate(v, 'HH:mm') : defaultValue
})

Vue.filter('datetime', (v, defaultValue = '-') => {
  return v ? formatDate(v, 'DD MMM YYYY HH:mm') : defaultValue
})

Vue.filter('number', v => Number(v).toLocaleString())
Vue.filter('emptyString', v => v || '-')
Vue.filter('storageSize', (v, defaultValue = '-') => {
  return v ? humanStorageSize(v) : defaultValue
})

/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

function get (env, stringify = false) {
  const IS_DEV = env === 'dev'
  const IS_TEST = env === 'test'
  const IS_PROD = env === 'prod'

  let envs = {}
  if (IS_DEV) envs = require('./dev.env')
  if (IS_TEST) envs = require('./test.env')
  if (IS_PROD) envs = require('./prod.env')

  envs.APP_ENV = env
  envs.APP_IS_DEV = IS_DEV
  envs.APP_IS_TEST = IS_TEST
  envs.APP_IS_PROD = IS_PROD

  if (!stringify) return envs
  return Object.keys(envs).reduce((out, k) => {
    out[k] = JSON.stringify(envs[k])
    return out
  }, {})
}

function add (env, stringify = false) {
  const envs = get(env, stringify)
  process.env = { ...process.env, ...envs }
}


module.exports = { add, get }

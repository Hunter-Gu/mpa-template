const $path = require('path');

require('colors')

const resolve = function (dir = '') {
  return $path.join(process.cwd(), dir)
}

const DEV_ALIAS = 'development'
const PROD_ALIAS = 'production'
const DEV = 'dev'
const PROD = 'prod'
const IS_DEV = process.env.NODE_ENV === 'production' ? false : true

module.exports = {
  isdev: IS_DEV,
  env: IS_DEV ? DEV : PROD,
  paths: {
    src: resolve('src'),
    build: resolve('build'),
    root: resolve(),
    cache: resolve('build/tmp'),
  },
  [DEV]: {
    env: {
      NODE_ENV: DEV_ALIAS
    },
    port: {{ port }},
    assetsPublicPath: '/static/',
    publicPath: '/static/',
    assetsRoot: resolve('build/dev')
  },
  [PROD]: {
    env: {
      NODE_ENV: PROD_ALIAS
    },
    port: {{ port }},
    assetsPublicPath: '/static/',
    publicPath: '/static/',
    assetsRoot: resolve('build/prod')
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'moment': 'moment',
    'axios': 'axios'
  },
  alias: {
    '@': resolve('src')
  }
}

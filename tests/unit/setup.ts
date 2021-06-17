/* eslint-disable-all typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'
import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import { FiltersPlugin } from '@/plugins/filters'
import { DayJSPlugin } from '@/plugins/dayjs'
// ===
// Utility functions
// ===

// https://vue-test-utils.vuejs.org/
// import vueTestUtils from '@vue/test-utils'
// import { VueClass } from 'vue-class-component/lib/declarations'

// https://lodash.com/
import { camelCase } from 'lodash-es'

// ===
// Configure Axios
// ===

// Force Axios to use the XHR adapter so that it behaves
// more like it would in a browser environment.
axios.defaults.adapter = require('axios/lib/adapters/xhr')

// ===
// Configure Vue
// ===

// Don't warn about not using the production build of Vue, as
// we care more about the quality of errors than performance
// for tests.
Vue.config.productionTip = false
Vue.config.devtools = false

// ===
// Register Vuetify
// ===
Vue.use(Vuetify)

// ===
// Register Filters
// ===
Vue.use(DayJSPlugin)
Vue.use(FiltersPlugin)

// ===
// Register global components
// ===

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, '/', file))
    }
  })
  return arrayOfFiles
}

const globalComponentFiles = getAllFiles(path.join(__dirname, '../../src/components'))
  .filter((filename) => /(ui|layout|common)\/[\w-]+\.vue$/.test(filename))

for (const name of globalComponentFiles) {
  const filePath = name.split('/src')
  // const fileName = name
  const componentName = camelCase(
    name
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '')
  )
  const finalPath = `../../src${filePath[1]}`
  // console.log(finalPath)
  // console.log(componentName)
  const componentConfig = require(finalPath)
  if (componentName) Vue.component(componentName, componentConfig.default || componentConfig)
}

// ===
// Mock window properties not handled by jsdom
// ===

// Object.defineProperty(window, 'localStorage', {
//   value: (function() {
//     let store = {}
//     return {
//       getItem: function(key) {
//         return store[key] || null
//       },
//       setItem: function(key, value) {
//         store[key] = value.toString()
//       },
//       clear: function() {
//         store = {}
//       },
//     }
//   })(),
// })

// ===
// Console handlers
// ===

// Make console.error throw, so that Jest tests fail
// const error = console.error
// console.error = function(message) {
//   error.apply(console, arguments)
//   // NOTE: You can whitelist some `console.error` messages here
//   //       by returning if the `message` value is acceptable.
//   throw message instanceof Error ? message : new Error(message)
// }

// Make console.warn throw, so that Jest tests fail
// const warn = console.warn
// console.warn = function(message) {
//   warn.apply(console, arguments)
//   // NOTE: You can whitelist some `console.warn` messages here
//   //       by returning if the `message` value is acceptable.
//   throw message instanceof Error ? message : new Error(message)
// }

// ===
// Global helpers
// ===

// https://vue-test-utils.vuejs.org/api/#mount
// global.mount = vueTestUtils.mount

// https://vue-test-utils.vuejs.org/api/#shallowmount
// global.shallowMount = vueTestUtils.shallowMount

// A special version of `shallowMount` for view components
// global.shallowMountView = (Component, options = {}) => {
//   return global.shallowMount(Component, {
//     ...options,
//     stubs: {
//       Layout: {
//         functional: true,
//         render(h, { slots }) {
//           return <div>{slots().default}</div>
//         },
//       },
//       ...(options.stubs || {}),
//     },
//   })
// }

// A helper for creating Vue component mocks
// global.createComponentMocks = ({ store, router, style, mocks, stubs }) => {
//   // Use a local version of Vue, to avoid polluting the global
//   // Vue and thereby affecting other tests.
//   // https://vue-test-utils.vuejs.org/api/#createlocalvue
//   const localVue = vueTestUtils.createLocalVue()
//   const returnOptions = { localVue }

//   // https://vue-test-utils.vuejs.org/api/options.html#stubs
//   returnOptions.stubs = stubs || {}
//   // https://vue-test-utils.vuejs.org/api/options.html#mocks
//   returnOptions.mocks = mocks || {}

//   // Converts a `store` option shaped like:
//   //
//   // store: {
//   //   someModuleName: {
//   //     state: { ... },
//   //     getters: { ... },
//   //     actions: { ... },
//   //   },
//   //   anotherModuleName: {
//   //     getters: { ... },
//   //   },
//   // },
//   //
//   // to a store instance, with each module namespaced by
//   // default, just like in our app.
//   if (store) {
//     localVue.use(Vuex)
//     returnOptions.store = new Vuex.Store({
//       modules: Object.keys(store)
//         .map((moduleName) => {
//           const storeModule = store[moduleName]
//           return {
//             [moduleName]: {
//               state: storeModule.state || {},
//               getters: storeModule.getters || {},
//               actions: storeModule.actions || {},
//               namespaced:
//                 typeof storeModule.namespaced === 'undefined'
//                   ? true
//                   : storeModule.namespaced,
//             },
//           }
//         })
//         .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {}),
//     })
//   }

//   // If using `router: true`, we'll automatically stub out
//   // components from Vue Router.
//   if (router) {
//     returnOptions.stubs['router-link'] = true
//     returnOptions.stubs['router-view'] = true
//   }

//   // If a `style` object is provided, mock some styles.
//   if (style) {
//     returnOptions.mocks.$style = style
//   }

//   return returnOptions
// }

// global.createModuleStore = (vuexModule, options = {}) => {
//   vueTestUtils.createLocalVue().use(Vuex)
//   const store = new Vuex.Store({
//     ..._.cloneDeep(vuexModule),
//     modules: {
//       auth: {
//         namespaced: true,
//         state: {
//           currentUser: options.currentUser,
//         },
//       },
//     },
//     // Enable strict mode when testing Vuex modules so that
//     // mutating state outside of a mutation results in a
//     // failing test.
//     // https://vuex.vuejs.org/guide/strict.html
//     strict: true,
//   })
//   axios.defaults.headers.common.Authorization = options.currentUser
//     ? options.currentUser.token
//     : ''
//   if (vuexModule.actions.init) {
//     store.dispatch('init')
//   }
//   return store
// }

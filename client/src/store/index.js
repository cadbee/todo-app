import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import alert from './modules/alert.js';
import validators from "./modules/validators.js";

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    alert,
    validators
  },
  strict: process.env.NODE_ENV !== 'production'
})

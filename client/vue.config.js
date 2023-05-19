const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false
    }
  }
})

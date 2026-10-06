const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://qauto.forstudy.space/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
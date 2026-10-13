const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",

  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);

      const configFile = config.env.configFile;

      if (!["qauto", "qauto2"].includes(configFile)) {
        throw new Error(
          "Specify the environment using --env configFile=qauto or --env configFile=qauto2"
        );
      }

      const configPath = path.resolve(
        __dirname,
        "env",
        `${configFile}.json`
      );

      const environmentConfig = JSON.parse(
        fs.readFileSync(configPath, "utf8")
      );

      config.baseUrl = environmentConfig.baseUrl;
      config.env.email = environmentConfig.email;
      config.env.password = environmentConfig.password;

      return config;
    },
  },
});
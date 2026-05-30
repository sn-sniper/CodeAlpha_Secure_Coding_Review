const security = require("eslint-plugin-security");

module.exports = {
  files: ["**/*.js"],
  ignores: ["node_modules/**", "uploads/**"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "commonjs",
    globals: {
      console: "readonly",
      process: "readonly",
      require: "readonly",
      module: "readonly",
      __dirname: "readonly",
    },
  },
  plugins: { security },
  rules: {
    ...security.configs.recommended.rules,
  },
};

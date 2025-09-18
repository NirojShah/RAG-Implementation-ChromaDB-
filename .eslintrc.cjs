module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module", // set to "script" if using CommonJS
  },
  rules: {
    // disallow console.log but allow console.warn/error/info
    "no-console": ["error", { allow: ["warn", "error", "info"] }],

    // require semicolons at the end of every statement
    semi: ["error", "always"],
  },
};

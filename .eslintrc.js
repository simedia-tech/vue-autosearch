module.exports = {
  root: true,
  env: {
    node: true,
  },
  "extends": [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "vue/component-tags-order": ["error", { "order": ["style", "template", "script"] }],
    "brace-style": ["error", "1tbs"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "arrow-parens": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
  },
};

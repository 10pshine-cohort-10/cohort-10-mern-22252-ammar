import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["dist/**", "node_modules/**", "coverage/**", "*.log"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } },
    rules: { "no-unused-vars": "off", "no-undef": "off" },
  },
];

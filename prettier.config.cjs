/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  arrowParens: 'always',
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  trailingComma: 'es5',
  tabWidth: 2,
}

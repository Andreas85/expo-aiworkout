module.exports = {
  bracketSpacing: true,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tailwind'],
  tailwindPreserveWhitespace: true,
  overrides: [
    {
      files: ['*.json', '*.md', '*.tsx'], // Files where you want double quotes
      options: {
        singleQuote: false,
      },
    },
  ],
};

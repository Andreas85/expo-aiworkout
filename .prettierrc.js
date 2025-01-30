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
      files: ['*.json', '*.md'],
      options: {
        singleQuote: false, // Double quotes for JSON and MD files
      },
    },
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        singleQuote: true, // Keep single quotes for JSX/TSX if needed
      },
    },
  ],
};

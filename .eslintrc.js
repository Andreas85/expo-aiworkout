module.exports = {
  extends: ['expo', 'eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        // Use Prettier's quote handling instead of ESLint's
        singleQuote: true,
      }
    ],
    // Keep your existing rule overrides
    'no-undef': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'import/no-unresolved': 'off',
    'no-extra-boolean-cast': 'off',
    'import/namespace': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'off',
    
    // Modify the quotes rule to avoid conflict with Prettier
    'quotes': ['warn', 'single', { 
      avoidEscape: true,
      allowTemplateLiterals: true 
    }]
  },
};
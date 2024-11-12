module.exports = {
  extends: ['expo', 'eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error',
      {
        endOfLine: 'auto',
      }],
    'no-undef': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'import/no-unresolved': 'off',
    'no-extra-boolean-cast': 'off',
    'import/namespace': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'off',
  },
};

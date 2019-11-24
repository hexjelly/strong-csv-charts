module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'prettier', 'prettier/react'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'prettier', 'react-hooks'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
    "prettier/prettier": "error",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off"
  },
  "ignorePatterns": ["coverage/", "node_modules/"],
};

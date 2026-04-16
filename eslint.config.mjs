// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Vue rules
    'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
    'vue/require-prop-types': 'warn',
    'vue/no-v-html': 'off', // Intentional: CMS content, doc previews
    'vue/require-v-for-key': 'error',
    'vue/valid-v-for': 'error',
    'vue/html-self-closing': 'off',
    'vue/no-mutating-props': 'error',
    'vue/no-multiple-template-root': 'off',
    'vue/no-parsing-error': 'error',
    'vue/valid-v-else': 'error',

    // JavaScript/TypeScript rules
    // Use only the TS version to avoid double warnings
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-control-regex': 'warn',
    'no-unreachable': 'warn',
    'no-undef': 'error',
    'no-useless-escape': 'error',

    // Stylistic rules
    '@stylistic/no-trailing-spaces': 'error',
  },
})

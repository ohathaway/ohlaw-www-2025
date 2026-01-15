// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Vue rules
    'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
    'vue/require-prop-types': 'warn',
    'vue/no-v-html': 'warn',
    'vue/require-v-for-key': 'error',
    'vue/valid-v-for': 'error',
    'vue/html-self-closing': 'off',
    'vue/no-mutating-props': 'error',
    'vue/no-multiple-template-root': 'off', // Vue 3 supports multiple roots
    'vue/no-parsing-error': 'error', // Catch template parsing errors
    'vue/valid-v-else': 'error', // Ensure v-else is adjacent to v-if

    // JavaScript/TypeScript rules
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-control-regex': 'warn',
    'no-unreachable': 'warn',
    'no-undef': 'error',
    'no-useless-escape': 'error',

    // Stylistic rules
    '@stylistic/no-trailing-spaces': 'error',
  },
})

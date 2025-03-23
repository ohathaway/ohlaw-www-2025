import { defineFormKitConfig } from '@formkit/vue'
import { genesisIcons } from '@formkit/icons'
import { library, o2svg } from '@/plugins/fontawesome'
import { createFloatingLabelsPlugin } from '@formkit/addons'
import { createProPlugin, inputs } from '@formkit/pro'

const pro = createProPlugin('fk-a2c0cf2353', inputs)

const at = o2svg(library.definitions.fas.at)
const phone = o2svg(library.definitions.fas.phone)
const user = o2svg(library.definitions.fas.user)

const isCheckboxAndRadioMultiple = (node) =>
  (node.props.type === 'checkbox' || node.props.type === 'radio') && node.props.options

const validZip = (node) => {
  return !isEmpty(node.value.match(/^\d{5}(?:[-\s]\d{4})?$/))
}

function addAsteriskPlugin(node) {
  node.on('created', () => {
    const isRequired = node.props.parsedRules.some((rule) => rule.name === 'required')
    if (!isRequired) return

    const isMultiOption = isCheckboxAndRadioMultiple(node)

    // if we're going to modify the schema then we need
    // to update the schemaMemoKey so we don't get an
    // invalid cached schema.
    node.props.definition.schemaMemoKey = `required_${isMultiOption ? 'multi_' : ''}${
      node.props.definition.schemaMemoKey
    }`

    const schemaFn = node.props.definition.schema
    node.props.definition.schema = (sectionsSchema = {}) => {
      if (isRequired) {
        if (isMultiOption) {
          sectionsSchema.legend = {
            children: ['$label', '*']
          }
        } else {
          sectionsSchema.label = {
            children: ['$label', '*']
          }
        }
      }
      return schemaFn(sectionsSchema)
    }
  })
}

export default {
  config: {
    classes: {
      /*
      inner: {
        'formkit-inner': false,
        'input-group': true
      },
      */
      input: {
        'input-bg-white': true
        // 'form-control': true,
        // 'formkit-input': true
      /*
      },
      prefixIcon: {
        'formkit-prefix-icon': false,
        'input-group-text': true
      },
      wrapper: {
        'formkit-wrapper': false
      */
      }
    }
  },
  icons: {
    ...genesisIcons, at, phone, user
  },
  messages: {
    en: {
      validation: {
        validZip({ node }) {
          return `${node.value} is not a valid zipcode`
        }
      }
    }
  },
  plugins: [
    // addAsteriskPlugin,
    createFloatingLabelsPlugin({ useAsDefault: true }),
    pro
  ],
  rules: { validZip }
}
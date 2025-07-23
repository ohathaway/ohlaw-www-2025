// Import PrimeVue config
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import { ohLawPreset } from '../../primevue.ohlaw'

// Import only the PrimeVue components actually used in the codebase
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Drawer from 'primevue/drawer'
import FloatLabel from 'primevue/floatlabel'
import InputMask from 'primevue/inputmask'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import Menu from 'primevue/menu'
import Message from 'primevue/message'
import PanelMenu from 'primevue/panelmenu'
import ProgressSpinner from 'primevue/progressspinner'
import ProgressBar from 'primevue/progressbar'
import RadioButton from 'primevue/radiobutton'
import Ripple from 'primevue/ripple'
import Slider from 'primevue/slider'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin({
  name: 'primevue',
  parallel: true,
  setup(nuxtApp) {
    // Register the PrimeVue plugin with config
    const preset = definePreset(Aura, ohLawPreset)

    nuxtApp.vueApp.use(PrimeVue, {
      theme: {
        preset
      },
      autoimport: false,
      ripple: true,
      tailwind: true,
      unstyled: false,
    })

  // Register only the components we actually use
  nuxtApp.vueApp.component('Accordion', Accordion)
  nuxtApp.vueApp.component('AccordionPanel', AccordionPanel)
  nuxtApp.vueApp.component('AccordionHeader', AccordionHeader)
  nuxtApp.vueApp.component('AccordionContent', AccordionContent)
  nuxtApp.vueApp.component('Breadcrumb', Breadcrumb)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('Chart', Chart)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('Column', Column)
  nuxtApp.vueApp.component('DataTable', DataTable)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Divider', Divider)
  nuxtApp.vueApp.component('Drawer', Drawer)
  nuxtApp.vueApp.component('FloatLabel', FloatLabel)
  nuxtApp.vueApp.component('InputMask', InputMask)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('Menubar', Menubar)
  nuxtApp.vueApp.component('Message', Message)
  nuxtApp.vueApp.component('PanelMenu', PanelMenu)
  nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
  nuxtApp.vueApp.component('ProgressBar', ProgressBar)
  nuxtApp.vueApp.component('RadioButton', RadioButton)
  nuxtApp.vueApp.component('Slider', Slider)
  nuxtApp.vueApp.component('Tag', Tag)
  nuxtApp.vueApp.component('Timeline', Timeline)

    nuxtApp.vueApp.directive('ripple', Ripple)
    nuxtApp.vueApp.directive('tooltip', Tooltip)
  }
})
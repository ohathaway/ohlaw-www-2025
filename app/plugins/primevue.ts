// Import PrimeVue config
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

// Import only the PrimeVue components actually used in the codebase
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Badge from 'primevue/badge'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Drawer from 'primevue/drawer'
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import InputGroup from 'primevue/inputgroup'
import InputMask from 'primevue/inputmask'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import Menu from 'primevue/menu'
import Message from 'primevue/message'
import PanelMenu from 'primevue/panelmenu'
import Popover from 'primevue/popover'
import ProgressSpinner from 'primevue/progressspinner'
import ProgressBar from 'primevue/progressbar'
import RadioButton from 'primevue/radiobutton'
import Ripple from 'primevue/ripple'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Slider from 'primevue/slider'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabView from 'primevue/tabview'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import Tooltip from 'primevue/tooltip'
import { ohLawPreset } from '../../primevue.ohlaw'

export default defineNuxtPlugin({
  name: 'primevue',
  parallel: true,
  setup(nuxtApp) {
    // Register the PrimeVue plugin with config
    const preset = definePreset(Aura, ohLawPreset)

    nuxtApp.vueApp.use(PrimeVue, {
      theme: {
        preset,
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
    nuxtApp.vueApp.component('Badge', Badge)
    nuxtApp.vueApp.component('Breadcrumb', Breadcrumb)
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('Card', Card)
    nuxtApp.vueApp.component('Chart', Chart)
    nuxtApp.vueApp.component('Checkbox', Checkbox)
    nuxtApp.vueApp.component('Column', Column)
    nuxtApp.vueApp.component('DataTable', DataTable)
    nuxtApp.vueApp.component('DataView', DataView)
    nuxtApp.vueApp.component('Dialog', Dialog)
    nuxtApp.vueApp.component('Divider', Divider)
    nuxtApp.vueApp.component('Drawer', Drawer)
    nuxtApp.vueApp.component('FloatLabel', FloatLabel)
    nuxtApp.vueApp.component('Form', Form)
    nuxtApp.vueApp.component('InputGroup', InputGroup)
    nuxtApp.vueApp.component('InputMask', InputMask)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('Menu', Menu)
    nuxtApp.vueApp.component('Menubar', Menubar)
    nuxtApp.vueApp.component('Message', Message)
    nuxtApp.vueApp.component('PanelMenu', PanelMenu)
    nuxtApp.vueApp.component('Popover', Popover)
    nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
    nuxtApp.vueApp.component('ProgressBar', ProgressBar)
    nuxtApp.vueApp.component('RadioButton', RadioButton)
    nuxtApp.vueApp.component('Select', Select)
    nuxtApp.vueApp.component('SelectButton', SelectButton)
    nuxtApp.vueApp.component('Slider', Slider)
    nuxtApp.vueApp.component('Tab', Tab)
    nuxtApp.vueApp.component('TabList', TabList)
    nuxtApp.vueApp.component('TabPanel', TabPanel)
    nuxtApp.vueApp.component('TabPanels', TabPanels)
    nuxtApp.vueApp.component('Tabs', Tabs)
    nuxtApp.vueApp.component('TabView', TabView)
    nuxtApp.vueApp.component('Tag', Tag)
    nuxtApp.vueApp.component('Timeline', Timeline)

    nuxtApp.vueApp.directive('ripple', Ripple)
    nuxtApp.vueApp.directive('tooltip', Tooltip)
  },
})

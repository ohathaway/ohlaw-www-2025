// For Nuxt 3
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAt,
  faBan,
  faBoxArchive,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faCommentDots,
  faCommentSms,
  faCreditCard,
  faEnvelope,
  faExternalLink,
  faExternalLinkAlt,
  faFax,
  faFileArrowDown,
  faFileCsv,
  faFileContract,
  faFilePdf,
  faFileSignature,
  faFloppyDisk,
  faGaugeHigh,
  faHome,
  faLaptopFile,
  faMailBulk,
  faMap,
  faPenToSquare,
  faPhone,
  faPlus,
  faQuoteLeft,
  faQuoteRight,
  faStar,
  faTrashCan,
  faTriangleExclamation,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendarDays,
  faIdBadge,
  faRectangleXmark,
} from '@fortawesome/free-regular-svg-icons'

// Pro "Sharp Regular" icons are not available in the free npm packages, so we
// register them by hand from the FontAwesome Pro asset definitions.
// prefix 'fasr' === fa-sharp fa-regular
const faSharpRegularSignature = {
  prefix: 'fasr',
  iconName: 'signature',
  icon: [
    640,
    512,
    [],
    'f5b7',
    'M176 128c0-26.5 21.5-48 48-48s48 21.5 48 48l0 7.9c0 27.5-2.3 55-7 82.1l-152.1 47.1-16.9 5.2 0 97.7-96 0 0 48 96 0 0 64 109.6 0c.9-1.6 13-21.7 36.2-60.4 29.6-49.4 51.1-103.3 63.6-159.5l1-4.7 110.8-34.3c-18 50.3-29.7 83.3-35.3 98.9l194.1 0 0-48-125.9 0c21.1-59.1 36-100.8 44.7-125.1-16 5-75.7 23.4-178.9 55.4 2.7-22 4.1-44.2 4.1-66.4l0-7.9c0-53-43-96-96-96s-96 43-96 96l0 64 48 0 0-64zM144 305.7l109.1-33.8c-11.7 43.2-29.4 84.5-52.4 123l-22.3 37.1-34.4 0 0-126.3zM298.9 416l341.1 0 0-48-318.5 0c-6.8 16.3-14.3 32.3-22.6 48z',
  ],
}

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
})

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
  faAt,
  faBan,
  faBoxArchive,
  faCalendarDays,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faCommentDots,
  faCommentSms,
  faCreditCard,
  faPenToSquare,
  faEnvelope,
  faExternalLink,
  faExternalLinkAlt,
  faFax,
  faFileArrowDown,
  faFileContract,
  faFileCsv,
  faFilePdf,
  faFileSignature,
  faFloppyDisk,
  faGaugeHigh,
  faHome,
  faIdBadge,
  faLaptopFile,
  faMailBulk,
  faMap,
  faPenToSquare,
  faPhone,
  faPlus,
  faQuoteLeft,
  faQuoteRight,
  faStar,
  faTrashCan,
  faTriangleExclamation,
  faRectangleXmark,
  faSharpRegularSignature,
  faUser,
)

const o2svg = (faIcon) => {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewbox="0 0 ${faIcon[0]} ${faIcon[1]}"
      class="svg-inline--fa fa-at"
      role="img">
      <path fillColor="currentColor" d="${faIcon[4]}" />
    </svg>
  `
}

export { library, o2svg }

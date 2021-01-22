import { /*docsPage, docsSection,*/ shmpDoc } from './docs.type'
//import SectionManager from './components/SectionManager'
//import PageEdit from './components/PageEdit'
import PageView from './components/PageView'



let config = {
  type: PageView, // top level component for managing data items
  wrappers: [
    "dms-provider",
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: shmpDoc
  }
}

export default [{
  path: "/",
  mainNav: true,
  exact: true,
  auth: false,
  name: 'Mitigate NY',
  icon: '',
  layout: 'Simple',
  component: config
},
{
  path: "/p",
  mainNav: false,
  exact: false,
  auth: false,
  name: 'Home',
  icon: '',
  layout: 'Simple',
  component: config
}]

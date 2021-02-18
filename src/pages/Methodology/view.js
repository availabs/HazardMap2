import React from 'react'

import SectionManager from './components/SectionManager'
import PageEdit from './components/PageEdit'
import PageView from './components/PageView'
import DocsWrapper from './components/DocsWrapper'

import DmsComponents from "components/dms"
import DmsWrappers from "components/dms/wrappers"
import { API_HOST } from 'config'

// import ComponentFactory from 'components/avl-components/ComponentFactory'
// import {
//   addComponents,
//   addWrappers
// } from "components/avl-components/ComponentFactory"

import {
  ComponentFactory,
  addComponents,
  addWrappers
} from "@availabs/avl-components"

addComponents(DmsComponents)
addWrappers(DmsWrappers)

const ctpDoc = {
  app: "ctp",
  type: "doc-page",
  attributes: [
    { key: "section",
      type: "text",
      required: true,
      default: "props:section",
      hidden: true
    },
    { key: "sectionLanding",
      type: "boolean",
      default: false,
      editable: false,
      hidden: true
    },
    { key: "index",
      type: "number",
      default: "props:index",
      editable: false,
      hidden: true
    },
    { key: "title",
      type: "text"
    },
    { key: "content",
      type: "richtext",
      required: true
    },
    { key: "tags",
      type: "text",
      isArray: true
    }
  ]
}


let ViewConfig = {
  type: PageView,
  wrappers: [
    { type: "dms-consumer",
      options: {
        interactOnMount: ["view", "props:dataItems->0.id"]
      }
    },
    "dms-provider",
    "dms-falcor"
  ],
  props: {
    format: ctpDoc
  }
}

const Documentation = () => (<ComponentFactory config={ ViewConfig }/>)

let EditorConfig = {
  type: ({ children }) => <div>{ children }</div>,
  // type: "dms-manager",
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-manager",
    {
      type: "dms-provider",
      options: {
        imgUploadUrl: `${ API_HOST }/img/new`,
      },
      authRules: {
        create: {
          args: ["props:user.authLevel"],
          comparator: al => +al >= 5
        },
        edit: {
          args: ["props:user.authLevel"],
          comparator: al => +al >= 5
        },
        delete: {
          args: ["props:user.authLevel"],
          comparator: al => +al >= 5
        }
      }
    },
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: ctpDoc,
  },
  children: [
    // dms-manager children are special
    // they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: SectionManager,
      props: { dmsAction: "list" }
    },

    { type: PageView,
      props: { dmsAction: "view" }
    },

    { type: PageEdit,
      props: { dmsAction: "create", },
      wrappers: [ "dms-create"]
    },

    { type: PageEdit,
      props: { dmsAction: "edit" },
      wrappers: ["dms-edit"]
    }
  ]
}


const DocsEditor= (props) => (
    <div>
      <ComponentFactory config={ EditorConfig }/>
    </div>
)

export default [{
  icon: 'fa-id-card',
  class: "fa",
  path: '/methodology',
  exact: false,
  mainNav: true,
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-dark',
    position: 'menu-position-side',
    layout: 'menu-layout-compact',
    style: 'color-style-default'
  },
  name: 'Documentation',
  authLevel: 0,
  component: Documentation
},
  {
    icon: 'fa-file-text',
    class: "fa",
    path: '/docs',
    exact: false,
    mainNav: false,
    menuSettings: {
      image: 'none',
      scheme: 'color-scheme-dark',
      position: 'menu-position-side',
      layout: 'menu-layout-compact',
      style: 'color-style-default'
    },
    name: 'Docs Editor',
    authLevel: 0,
    component: DocsEditor
  }];

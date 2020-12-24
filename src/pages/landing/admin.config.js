import AdminHeader from "./components/AdminHeader"
import PageHeader from "./components/PageHeader"

import ListView from "./components/ListView"
import PageView from "./components/PageView"

import WebFormat from "./format.type"

const config = {
  type: "dms-content",
  wrappers: [
    "dms-manager",
    "dms-provider",
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: WebFormat,
    className: "mx-auto container mt-20"
  },
  children: [
    { type: AdminHeader },

    { type: ListView,
      props: { dmsAction: "list" }
    },

    { type: PageView,
      props: { dmsAction: "view" }
    },

    { type: "dms-create",
      props: { dmsAction: "create" }
    },

    { type: "dms-edit",
      props: { dmsAction: "edit" }
    }
  ]
}
export default config;

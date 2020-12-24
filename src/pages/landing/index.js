import React from "react"

import { Redirect } from "react-router-dom"

import admin from "./admin.config"

import view from "./view.config"

const webTest = [
  { path: "/",
    exact: true,
    component: () => <Redirect to="/avl/view/page/home"/>
  },
  { path: "/avl",
    mainNav: false,
    layoutSettings: {
      fixed: true,
      navBar: false,
      headerBar: false
    },
    component: view
  },
  { path: "/avl-dev",
    mainNav: false,
    authLevel: 5,
    layoutSettings: {
      fixed: true,
      navBar: false,
      headerBar: false
    },
    component: admin
  }
]
export default webTest

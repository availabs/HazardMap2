import React from "react"

import {
  NavItem,
  UserMenu,
  UserMenuItem,
  UserMenuSeparator
} from "@availabs/avl-components"

import { useMakeInteraction } from "components/dms/wrappers/dms-provider"

import { useAuth } from "@availabs/ams"

import get from "lodash.get"

import Header from "./Header"

const PageHeaderNavItem = ({ item }) => {
  const { to } = useMakeInteraction("view", item);
  return (
    <NavItem type="top" to={ to }>
      { item.data.page }
    </NavItem>
  )
}

const PageHeader = ({ dataItems = [] }) => {
  const user = useAuth();
    return (
      <div className="fixed top-0 left-0 right-0">
        <Header>
          <div className="flex flex-1">
            { dataItems.length ? null :
              <NavItem to="/" type="top">
                Home
              </NavItem>
            }
            { dataItems.sort((a, b) => a.data.index - b.data.index)
                .map(di =>
                  <PageHeaderNavItem key={ di.id } item={ di }/>
                )
            }
  { /* this is an example to show you can add arbitrary links here */ }
            <NavItem to="/fake" type="top">
              Fake
            </NavItem>
          </div>
          <div className="flex-0 flex items-center justify-end ml-10">
            <UserMenu>
              { get(user, "authLevel", -1) < 5 ? null :
                <UserMenuItem to="/avl-dev">
                  Admin
                </UserMenuItem>
              }
              <UserMenuSeparator />
              <UserMenuItem to="/auth/logout">
                Logout
              </UserMenuItem>
            </UserMenu>
          </div>
        </Header>
      </div>
    )
  }
export default PageHeader;

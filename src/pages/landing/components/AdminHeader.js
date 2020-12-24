import React from "react"

import { Link } from "react-router-dom"

import { HeaderComponent, Input, LinkButton } from "@availabs/avl-components"
import { DmsButton } from "components/dms/components/dms-button"
import { useMakeOnClick } from "components/dms/wrappers/dms-provider"

import Header from "./Header"

const AdminHeader = ({ dataItems, top }) => {
  const [page, setPage] = React.useState("");
  return (
    <div className="fixed top-0 left-0 right-0">
      <Header>
        <div className="flex w-full">
          <div className="flex-1 font-bold text-2xl flex">
            <Link to="/" className="px-4 hover:bg-gray-300 flex items-center">
              <span className="fa fa-home"/>
            </Link>
          </div>

          <div className="flex-0 flex items-center justify-end">
            { top.dmsAction === "list" ?
              <>
                <Input type="text" value={ page } onChange={ setPage }/>
                <DmsButton label="Add New Page"
                  className="whitespace-nowrap ml-2"
                  action={ {
                    disabled: !page,
                    action: "api:create",
                    seedProps: {
                      page,
                      index: dataItems.reduce((a, c) => Math.max(a, +c.data.index), -1) + 1
                    }
                  } }/>
              </> :
              <>
                <DmsButton action="dms:back"/>
                <DmsButton className="ml-1" action="dms:home"/>
              </>
            }
          </div>
        </div>
      </Header>
    </div>
  )
}
export default AdminHeader;

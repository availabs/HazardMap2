import React from "react"

import ReadOnlyEditor from "components/dms/components/editor/editor.read-only"

import get from "lodash.get"

import PageHeader from "./PageHeader"

const PageView = ({ item, dataItems, ...props }) => {
// all data for the current page is stored in item.data
// dataItems is an array of all pages, including the current page (item)
  return (
    <div style={ { transform: "translate(0, 0)" } }>
      <PageHeader dataItems={ dataItems }/>
      <div className="w-full mx-auto max-w-7xl pt-20">
        { get(item, ["data", "sections"], []).map(({ section, content }) =>
            <div className="border rounded p-2 my-2" key={ section }>
              { section }
              <ReadOnlyEditor value={ content }/>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default PageView;

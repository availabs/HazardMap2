import React  from "react"
// import { useTheme } from "components/avl-components/wrappers/with-theme"
import { useTheme } from "@availabs/avl-components"
// import SidebarItem from './Item'

import SidebarItem from "./dms-item"

const DesktopSidebar = ({menuItems=[], fixed, logo='', ...rest}) => {
    const theme = useTheme();
    return(
        <div>
            <div className={`w-${theme.sidebarW} flex-1 flex flex-col pb-4 overflow-y-auto`}>
                <nav>
                    { menuItems.map((page, i) =>
                        <div className={page.sectionClass} key={i}>
                            <SidebarItem to={ page.path } item={ page.item } icon={page.icon} theme={theme} style={page.itemStyle}>
                                { page.name }
                            </SidebarItem>
                            { !page.children ? null :
                                page.children.map((child,x) =>
                                    <div  key={x} className={child.itemClass}>
                                        <SidebarItem key={ x } to={ child.path } item={ child.item } icon={child.icon} theme={theme} style={child.itemsStyle}>
                                            { child.name }
                                        </SidebarItem>
                                    </div>
                                )
                            }
                        </div>
                    )
                    }
                </nav>
            </div>
        </div>
    )
}


export default DesktopSidebar

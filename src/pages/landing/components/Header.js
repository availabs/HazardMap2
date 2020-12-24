import React from "react"

import { useTheme } from "@availabs/avl-components"

const Header = ({ children }) => {
  const theme = useTheme();
  return (
    <div className={ `w-full ${ theme.headerBg }` }>
      <div className="h-16 flex container mx-auto">
        { children }
      </div>
    </div>
  )
}
export default Header;

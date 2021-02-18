import React from "react";

import { useMakeOnClick } from "components/dms/wrappers/dms-provider"

export default ({ item, icon, className, children, theme, type='side', ...rest  }) =>
    <div style={ { ...rest.style, color:'#010101', cursor: "pointer" } }
         onClick={ useMakeOnClick("view", item) }>
        { children }
    </div>

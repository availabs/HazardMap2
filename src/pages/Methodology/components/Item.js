import React from "react";
import { NavLink } from "react-router-dom";
//import Icon from "../Icons";

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default ({ to, icon, className, children, theme, type='side', ...rest  }) => {
    const linkClasses = type === 'side' ? theme.navitemSide : theme.navitemTop,
        activeClasses = type === 'side' ? theme.navitemSideActive : theme.navitemTopActive;
    return (
        <NavLink to={to} style={{...rest.style, color:'#010101', textDecoration: 'none'}}>
            {children}
        </NavLink>
    );


};

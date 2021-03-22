import React  from "react"
import FemaSevereWeatherMapping from './components/FemaSevereWeatherMappingTable'

const Home = ({children,...ref}) =>{

    return (
        <FemaSevereWeatherMapping/>
    )
}

export default {
    path: "/fema_severe_weather_mappings",
    exact: true,
    mainNav: true,
    name: 'FEMA Severe Weather Mapping',
    auth: false,
    component: Home,
    layoutSettings: {
        fixed: true,
        headerBar: false,
        nav: 'top',
    }
}

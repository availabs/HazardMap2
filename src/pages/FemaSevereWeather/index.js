import React  from "react"
import FemaSevereWeatherMappingTable from './components/FemaSevereWeatherMappingTable'

const Home = ({children}) =>{
    return (
        <FemaSevereWeatherMappingTable/>
    )
}

export default {
    path: "/fema_severe_weather_mappings",
    exact: true,
    mainNav: true,
    name: 'FEMA Severe Weather Mapping',
    auth: false,
    component: Home,
    layout: 'Simple'
}

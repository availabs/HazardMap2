import Auth from "pages/auth"
import Home from "pages/home"
import DataDownload from "pages/DataDownload"
import Overview from './pages/Overview/index'
import NoMatch from "pages/404"
import StormEvents from 'pages/StormEvents/index_combined'
import Methodology from 'pages/Methodology/methodology'
import FemaDisasters from 'pages/fema_disasters/index'
import FemaDisasterDeclarations from 'pages/fema_disasters/components/femaDisasterDeclarations'
const Routes = [
  //...Landing,
  Home,
  ...StormEvents,
  DataDownload,
  ...Overview,
  ...Methodology,
  ...FemaDisasters,
        ...FemaDisasterDeclarations,
  Auth,
  NoMatch
]

export default Routes

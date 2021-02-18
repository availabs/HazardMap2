import Auth from "pages/auth"
import Home from "pages/home"
import DataDownload from "pages/DataDownload"
import Overview from './pages/Overview/index'
import NoMatch from "pages/404"
import StormEvents from 'pages/StormEvents/index_combined'
import StormEventsOutlying from 'pages/StormEvents/index_combined_outlaying_regions'
import Methodology from 'pages/Methodology/view'
import FemaDisasters from 'pages/fema_disasters/index'
import FemaDisasterDeclarations from 'pages/fema_disasters/components/femaDisasterDeclarations'
import CMS from 'pages/CMS/edit'
import Rankings from 'pages/Rankings/index'

import Test from 'pages/test'
const Routes = [
  //...Landing,
  Home,
  CMS,
  ...StormEventsOutlying,
  DataDownload,
  ...Overview,
  ...Methodology,
  ...Rankings,
  ...FemaDisasters,
  ...FemaDisasterDeclarations,
  //...Test,
  Auth,
  NoMatch
]

export default Routes

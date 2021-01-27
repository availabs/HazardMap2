import Auth from "pages/auth"
import Home from "pages/home"
import DataDownload from "pages/DataDownload"
import Overview from './pages/Overview/index'
import NoMatch from "pages/404"
import StormEvents from 'pages/StormEvents/index_combined'
import Methodology from 'pages/Methodology/methodology'
import FemaDisasters from 'pages/fema_disasters/index'
import FemaDisasterDeclarations from 'pages/fema_disasters/components/femaDisasterDeclarations'
import CMS from 'pages/CMS/edit'
import Rankings from 'pages/Rankings/index'
<<<<<<< HEAD

=======
import Test from 'pages/test'
>>>>>>> 12800b321c09ac8526166e938a610d3e6bf7ff79
const Routes = [
  //...Landing,
  Home,
  ...StormEvents,
  CMS,
  DataDownload,
  ...Overview,
  ...Methodology,
    ...Rankings,
  ...FemaDisasters,
<<<<<<< HEAD
  ...FemaDisasterDeclarations,
=======
        ...FemaDisasterDeclarations,
        //...Test,
>>>>>>> 12800b321c09ac8526166e938a610d3e6bf7ff79
  Auth,
  NoMatch
]

export default Routes

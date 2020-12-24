import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import falcorCache from "utils/redux-falcor-new/falcorCache"
import { messages } from "@availabs/avl-components"

import { Reducers } from "@availabs/ams"
import overview from "./modules/overview";
import stormEvents from "./modules/stormEvents";
import femaDisasterDeclarations from "./modules/femaDisasterDeclarations";
import geo from "./modules/geo";

const reducer = combineReducers({
  ...Reducers,
  messages,
  stormEvents,
  femaDisasterDeclarations,
  geo,
  overview,
  // graph
  falcorCache
});

export default createStore(reducer, applyMiddleware(thunk))

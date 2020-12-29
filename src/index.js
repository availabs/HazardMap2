import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { API_HOST } from 'config'
import { AUTH_HOST, PROJECT_NAME, CLIENT_HOST } from 'config'

import { falcorGraph } from 'store/falcorGraphNew'
import { FalcorProvider } from 'utils/redux-falcor-new'


import { Provider } from 'react-redux';
import store from 'store';
import {
  //Themes,
  ThemeContext,
  // FalcorProvider,
  // falcorGraph,
  addComponents,
  addWrappers
} from "@availabs/avl-components"

import reportWebVitals from './reportWebVitals';

import DmsComponents from "components/dms"
import DmsWrappers from "components/dms/wrappers"

import {
  Components as AmsComponents,
  Wrappers as AmsWrappers,
  enableAuth
} from "@availabs/ams"

import 'styles/tailwind.css';
import Theme from './Theme'

addComponents(DmsComponents);
addWrappers(DmsWrappers);

addComponents(AmsComponents);
addWrappers(AmsWrappers);

const AuthEnabledApp = enableAuth(App, { AUTH_HOST, PROJECT_NAME, CLIENT_HOST });

ReactDOM.render(
  <React.StrictMode>
   	<Provider store={ store }>
  		<FalcorProvider falcor={ falcorGraph }>
        <ThemeContext.Provider value={ Theme }>
  	    	<AuthEnabledApp />
        </ThemeContext.Provider>
      </FalcorProvider>
  	</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

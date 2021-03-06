import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { syncHistoryWithStore } from 'react-router-redux';

//SW
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import configureStore from './store/configureStore';
import routes from './routes';

//localForage
import localforage from 'localforage';

//Prepare Redux rehydration
import { persistStore } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages'

import { App } from './containers/App';
import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

//Translation
import {IntlProvider, addLocaleData} from 'react-intl';
import messages_es from "./translations/es.json";
import messages_ca from "./translations/ca.json";

import './style.scss';
require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');

import {FormattedHTMLMessage} from 'react-intl';

//SW installation handling version updates!
OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => window.softwareUpdate = true,
});

//Tap event plugin
injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

//AppProvider class with rehydration handling
class AppProvider extends React.Component {
  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    persistStore(store, {
        storage: localforage,
        blacklist: ['routing']
    }, () => {
      console.debug("Rehydration complete")
      this.setState({ rehydrated: true })
    })
  }

  render() {
	//Show loadingAnimation until store is rehydrated
    if(!this.state.rehydrated){
		return (
            <Provider store={store}>
                 <App>
                     <div>
                         <h1>
                            <FormattedHTMLMessage id="Index.startingokw" defaultMessage="Starting orakWlum!"/>
                         </h1>
                         <LoadingAnimation />
                     </div>
                 </App>
            </Provider>
		)
    }

    return (
		<Provider store={store}>
			<Router history={history}>
				<Redirect from="/" to="elements" />
				{routes}
			</Router>
		</Provider>
    )
  }
}

const the_app = <AppProvider />;

const messages = {
    'es': messages_es,
    'ca': messages_ca
};
const language = navigator.language.split(/[-_]/)[0];  // language without region code
addLocaleData({ locale: language, pluralRuleFunction: () => {}, });

//Render the app!
ReactDOM.render(
    <IntlProvider locale={language} messages={messages[language]}>
	<AppProvider />
	</IntlProvider>,
    document.getElementById('root')
);

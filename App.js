import React from 'react';
import { StyleSheet, Text, Platform, I18nManager } from 'react-native';
import Route from './src/routes';
import './ReactotronConfig';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import { Root } from "native-base";
import { Notifications } from 'expo';


export default class App extends React.Component {

  componentWillMount(){
      I18nManager.forceRTL(true);
  }

  componentDidMount() {
	  if (Platform.OS === 'android') {
		  Notifications.createChannelAndroidAsync('orders', {
			  name: 'Orders',
			  priority: 'max',
			  vibrate: [0, 250, 250, 250],
		  })
	  }
  }

	render() {
      return (

          <Provider store={store}>
              <PersistGate persistor={persistedStore}>
                  <Root>
                      <Route/>
                  </Root>
              </PersistGate>
          </Provider>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

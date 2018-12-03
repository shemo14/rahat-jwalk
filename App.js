import React from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import Route from './src/routes';
import './ReactotronConfig';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import { Root } from "native-base";


export default class App extends React.Component {

  componentWillMount(){
      I18nManager.forceRTL(true);
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

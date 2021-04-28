import React from 'react';
import Providers from './navigation';
import firebase from 'firebase/app';
import apiKeys from './config/keys';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase');
    firebase.initializeApp(apiKeys.firebaseConfig);
  }
  return <Providers />;
};

export default App;

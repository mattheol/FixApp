import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import AppTabsClient from './AppTabsClient';
import AppTabsContractor from './AppTabsContractor';
import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import { ProgressBar, Colors } from 'react-native-paper';

const Routes = () => {
  const { user, setUser, type, setType } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = async (userAuth) => {
    if (userAuth) {
      const { type: userType } = (
        await firebase.firestore().collection('users').doc(userAuth.uid).get()
      ).data()!;
      setType(userType);
    }
    setUser(userAuth);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  if (initializing) return <ProgressBar indeterminate color={Colors.blue500} />;
  return (
    <NavigationContainer>
      {!user || type === undefined ? (
        <AuthStack />
      ) : type === 0 ? (
        <AppTabsClient />
      ) : (
        <AppTabsContractor />
      )}
    </NavigationContainer>
  );
};

export default Routes;

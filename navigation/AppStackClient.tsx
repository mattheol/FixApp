import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenClient from '../screens/client/HomeScreenClient';
// import { AuthContext } from '../navigation/AuthProvider';

const Stack = createStackNavigator();

const AppStackClient = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreenClient}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default AppStackClient;

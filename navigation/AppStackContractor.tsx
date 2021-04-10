import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenContractor from '../screens/contractor/HomeScreenContractor';
// import { AuthContext } from '../navigation/AuthProvider';

const Stack = createStackNavigator();

const AppStackContractor = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreenContractor}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default AppStackContractor;

import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import createOrderScreenClient from '../screens/client/createOrderScreenClient';
import HomeScreenClient from '../screens/client/HomeScreenClient';
import TestTab3Client from '../screens/client/TestTab3Client';
import ProfileScreen from '../screens/shared/ProfileScreen';
// import { AuthContext } from '../navigation/AuthProvider';

const Tab = createMaterialBottomTabNavigator();

const AppTabsClient = () => {
  return (
    <Tab.Navigator initialRouteName='HomeScreenClient' activeColor='#fff'>
      <Tab.Screen
        name='Home'
        component={HomeScreenClient}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='NewOrder'
        component={createOrderScreenClient}
        options={{
          tabBarLabel: 'Nowe zlecenie',
          tabBarColor: '#694fad',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='plus' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#77acf1',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='TestTab3'
        component={TestTab3Client}
        options={{
          tabBarLabel: 'TestTab1',
          tabBarColor: '#72147e',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='cog' size={25} style={{ color }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabsClient;

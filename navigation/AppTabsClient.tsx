import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import createOrderScreenClient from '../screens/client/createOrderScreenClient';
import HomeStackClient from '../screens/client/HomeStackClient';
import LogoutScreen from '../screens/shared/LogoutScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

const AppTabsClient = () => {
  return (
    <Tab.Navigator initialRouteName='Home' activeColor='#fff'>
      <Tab.Screen
        name='Home'
        component={HomeStackClient}
        options={{
          tabBarLabel: 'Moje zlecenia',
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
          tabBarLabel: 'Profil',
          tabBarColor: '#80b3ff',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='Logout'
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Wyloguj się',
          tabBarColor: '#fc7575',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='sign-out' size={25} style={{ color }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabsClient;

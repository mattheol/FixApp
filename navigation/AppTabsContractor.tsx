import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import HomeStackContractor from '../screens/contractor/HomeStackContractor';
import OffersStackContractor from '../screens/contractor/OffersStackContractor';
import LogoutScreen from '../screens/shared/LogoutScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

const AppTabsContractor = () => {
  return (
    <Tab.Navigator initialRouteName='Home' activeColor='#fff'>
      <Tab.Screen
        name='Home'
        component={HomeStackContractor}
        options={{
          tabBarLabel: 'Szukaj',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='search' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='MyContracts'
        component={OffersStackContractor}
        options={{
          tabBarLabel: 'Moje oferty',
          tabBarColor: '#694fad',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='calendar' size={25} style={{ color }} />
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

export default AppTabsContractor;

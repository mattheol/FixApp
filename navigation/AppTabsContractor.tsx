import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import HomeStackContractor from '../screens/contractor/HomeStackContractor';
import OffersStackContractor from '../screens/contractor/OffersStackContractor';
import TestTab3Contractor from '../screens/contractor/TestTab2Contractor';
import ProfileScreen from '../screens/shared/ProfileScreen';
// import { AuthContext } from '../navigation/AuthProvider';

const Tab = createMaterialBottomTabNavigator();

const AppTabsContractor = () => {
  return (
    <Tab.Navigator initialRouteName='HomeScreenClient' activeColor='#fff'>
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
        name='TestTab2'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarColor: '#ffd3b4',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='TestTab3'
        component={TestTab3Contractor}
        options={{
          tabBarLabel: 'TestTab1',
          tabBarColor: '#ffaaa7',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='cog' size={25} style={{ color }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabsContractor;

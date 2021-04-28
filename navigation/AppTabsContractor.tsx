import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import HomeScreenContractor from '../screens/contractor/HomeScreenContractor';
import TestTab1Contractor from '../screens/contractor/TestTab1Contractor';
import TestTab3Contractor from '../screens/contractor/TestTab2Contractor';
import ProfileScreen from '../screens/shared/ProfileScreen';
// import { AuthContext } from '../navigation/AuthProvider';

const Tab = createMaterialBottomTabNavigator();

const AppTabsContractor = () => {
  return (
    <Tab.Navigator initialRouteName='HomeScreenClient' activeColor='#fff'>
      <Tab.Screen
        name='Home'
        component={HomeScreenContractor}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='TestTab1'
        component={TestTab1Contractor}
        options={{
          tabBarLabel: 'TestTab1',
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

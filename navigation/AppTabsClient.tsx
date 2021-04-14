import React from 'react';
import HomeScreenClient from '../screens/client/HomeScreenClient';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import TestTab2Client from '../screens/client/TestTab2Client';
import TestTab1Client from '../screens/client/TestTab1Client';
import { FontAwesome } from '@expo/vector-icons';
import TestTab3Client from '../screens/client/TestTab3Client';
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
        name='TestTab1'
        component={TestTab1Client}
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
        component={TestTab2Client}
        options={{
          tabBarLabel: 'TestTab1',
          tabBarColor: '#ffd3b4',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='cog' size={25} style={{ color }} />
          ),
        }}
      />
      <Tab.Screen
        name='TestTab3'
        component={TestTab3Client}
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

export default AppTabsClient;

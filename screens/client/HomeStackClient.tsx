import { createStackNavigator } from '@react-navigation/stack';
import 'firebase/firestore';
import React from 'react';
import { StyleSheet } from 'react-native';
import ContractorProfileScreen from './ContractorProfileScreen';
import OrderDetailsScreenClient from './OrderDetailsScreenClient';
import ViewOrdersScreenClient from './ViewOrdersScreenClient';

const Stack = createStackNavigator();

const HomeStackClient = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName={'ViewOrders'}>
      <Stack.Screen
        name='ViewOrders'
        component={ViewOrdersScreenClient}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='OrderDetails'
        component={OrderDetailsScreenClient}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='ContractorProfile'
        component={ContractorProfileScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackClient;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

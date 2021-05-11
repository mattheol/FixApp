import { createStackNavigator } from '@react-navigation/stack';
import 'firebase/firestore';
import React from 'react';
import { StyleSheet } from 'react-native';
import OrderDetailsScreenContractor from './OrderDetailsScreenContractor';
import SearchOrdersScreenContractor from './SearchOrdersScreenContractor';

const Stack = createStackNavigator();

const HomeStackContractor = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName={'SearchOrders'}>
      <Stack.Screen
        name='SearchOrders'
        component={SearchOrdersScreenContractor}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='OrderDetails'
        component={OrderDetailsScreenContractor}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

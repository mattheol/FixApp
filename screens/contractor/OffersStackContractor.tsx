import { createStackNavigator } from '@react-navigation/stack';
import 'firebase/firestore';
import React from 'react';
import { StyleSheet } from 'react-native';
import OffersScreenContractor from './OffersScreenContractor';
import OrderDetailsScreenContractor from './OrderDetailsScreenContractor';

const Stack = createStackNavigator();

const OffersStackContractor = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName={'OffersList'}>
      <Stack.Screen
        name='OffersList'
        component={OffersScreenContractor}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='OrderDetailsForOffer'
        component={OrderDetailsScreenContractor}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default OffersStackContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

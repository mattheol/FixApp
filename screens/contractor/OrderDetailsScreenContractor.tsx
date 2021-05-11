import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import { Order, User } from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';

const OrderDetailsScreenContractor = ({
  navigation,
  route: {
    params: { orderId },
  },
}) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [client, setClient] = useState<User | undefined>(undefined);
  const fetchOrderAndClient = async () => {
    try {
      const fetchedOrder = (
        await firebase.firestore().collection('orders').doc(orderId).get()
      ).data()!;
      setOrder(fetchedOrder as Order);
      const fetchedClient = (
        await firebase
          .firestore()
          .collection('users')
          .doc(fetchedOrder.clientId)
          .get()
      ).data()!;
      setClient(fetchedClient as User);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrderAndClient().then(() => setLoading(false));
  }, []);
  console.log(order);
  console.log(client);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={{ marginTop: 10 }}>
        Szczegóły zlecenia
      </Text>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
    </ScrollView>
  );
};

export default OrderDetailsScreenContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

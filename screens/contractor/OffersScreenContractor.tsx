import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import { categories, Order, subcategories } from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';

const OffersScreenContractor = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([] as Array<Order>);
  const fetchOrders = async () => {
    try {
      const allOrdersForOffers = (
        await firebase
          .firestore()
          .collection('offers')
          .where('contractorId', '==', user.uid)
          .get()
      ).docs.map((doc) => (doc.data() as any).orderId);
      const fetchedOrders =
        allOrdersForOffers.length > 0
          ? (
              await firebase
                .firestore()
                .collection('orders')
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  'in',
                  allOrdersForOffers
                )
                .get()
            ).docs.map((doc) => {
              const data = doc.data() as any;
              if (!data.contractorId) {
                data.status = 'pending';
              } else if (data.contractorId == user.uid) {
                data.status = 'win';
              } else {
                data.status = 'lost';
              }
              return { orderDocId: doc.id, ...data };
            })
          : [];
      setOrders(fetchedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchOrders().then(() => setLoading(false));
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={{ marginTop: 10 }}>
        Moje oferty
      </Text>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
      {orders?.map((order, i) => {
        const subcategory = subcategories.find(
          (subCat) => subCat.value == order.subcategoryId
        )!;
        const category = categories.find(
          (cat) => cat.value == subcategory.category
        )!;
        let icon, color, status;
        switch (order.status) {
          case 'win':
            icon = 'check';
            color = 'green';
            status = 'Zaakceptowana';
            break;
          case 'lost':
            icon = 'times';
            color = 'red';
            status = 'Odrzucona';
            break;
          case 'pending':
            icon = 'clock-o';
            color = '#FFA500';
            status = 'Oczekująca';
          default:
            break;
        }
        return (
          <Card
            key={i}
            containerStyle={{ marginHorizontal: 0, position: 'relative' }}>
            <View
              style={{
                marginBottom: 5,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontWeight: 'bold' }}>
                {category.label}, {subcategory.label}
              </Text>
              <Button
                icon={{
                  type: 'font-awesome',
                  name: 'chevron-right',
                  color: 'white',
                  size: 10,
                }}
                onPress={() =>
                  navigation.navigate('OrderDetailsForOffer', {
                    orderId: order.orderDocId,
                  })
                }></Button>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text>Status oferty:</Text>
              <FontAwesome
                name={icon}
                size={25}
                style={{
                  color,
                  marginHorizontal: 3,
                }}
              />
              <Text>{status}</Text>
            </View>
            <Card.Divider
              style={{
                marginBottom: 8,
                marginTop: 8,
                height: 1,
                backgroundColor: '#E0E0E0',
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: 14 }}>
                {order.city}, {order.address}
              </Text>
              <Text style={{ fontSize: 14 }}>
                {new Date(order.startTime).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
};

export default OffersScreenContractor;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
});

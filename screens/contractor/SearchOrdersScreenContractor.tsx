import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import { categories, Order, subcategories } from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';

const SearchOrdersScreenContractor = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([] as Array<Order>);
  const fetchOrders = async () => {
    try {
      const fetchedOrders = (
        await firebase
          .firestore()
          .collection('orders')
          // .where('clientId', '!=', '5')
          .orderBy('startTime', 'asc')
          .get()
      ).docs.map((doc) => ({ orderDocId: doc.id, ...(doc.data() as any) }));
      setOrders((fetchedOrders as Array<Order>) || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders().then(() => setLoading(false));
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={{ marginTop: 10 }}>
        Wyszukaj zlecenie
      </Text>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
      {orders?.map((order, i) => {
        const subcategory = subcategories.find(
          (subCat) => subCat.value == order.subcategoryId
        )!;
        const category = categories.find(
          (cat) => cat.value == subcategory.category
        )!;
        return (
          <Card key={i} containerStyle={{ marginHorizontal: 0 }}>
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
                  navigation.navigate('OrderDetails', {
                    orderId: order.orderDocId,
                  })
                }></Button>
            </View>
            <Text style={{ fontSize: 15 }}>{order.description}</Text>
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

export default SearchOrdersScreenContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

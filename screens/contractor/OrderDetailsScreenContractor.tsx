import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text, Input, Button } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import { categories, Order, subcategories, User } from '../../models';
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
  const subcategory = order
    ? subcategories.find((subCat) => subCat.value == order.subcategoryId)!
    : undefined;
  const category =
    order && subcategory
      ? categories.find((cat) => cat.value == subcategory.category)!
      : undefined;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={{ marginTop: 10 }}>
        Szczegóły zlecenia
      </Text>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
      {order && client ? (
        <View>
          <Input
            containerStyle={{ paddingHorizontal: 0, marginTop: 10 }}
            label='Kategoria'
            value={category?.label}
            editable={false}
          />
          <Input
            containerStyle={{ paddingHorizontal: 0 }}
            label='Podkategoria'
            value={subcategory?.label}
            editable={false}
          />
          <Input
            containerStyle={{ paddingHorizontal: 0 }}
            label='Opis'
            value={order.description}
            editable={false}
            multiline={true}
          />
          <Input
            containerStyle={{ paddingHorizontal: 0 }}
            label='Data rozpoczęcia'
            value={new Date(order.startTime).toLocaleDateString()}
            editable={false}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            Dane zleceniodawcy
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar
              rounded
              containerStyle={{ backgroundColor: 'grey', marginRight: 10 }}
              size='large'
              icon={
                !client?.userImg
                  ? { name: 'user', type: 'font-awesome' }
                  : undefined
              }
              source={
                client?.userImg
                  ? {
                      uri: client.userImg,
                    }
                  : undefined
              }
            />
            <View>
              <Text style={{ fontSize: 18 }}>
                {client.firstName + ' ' + client.lastName}
              </Text>
              <Text style={{ fontSize: 18 }}>
                <FontAwesome name='phone' size={20} /> {client.phone}
              </Text>
            </View>
          </View>
          <Divider style={{ height: 2, marginTop: 10 }}></Divider>
          <Button
            raised
            type='solid'
            containerStyle={{ marginTop: 20 }}
            title='Zgłoś się do zlecenia'
            onPress={() =>
              navigation.navigate('OrderDetails', {
                orderId: order.orderDocId,
              })
            }></Button>
        </View>
      ) : null}
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

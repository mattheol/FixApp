import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Text, Input, Button } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { categories, Order, subcategories, User, cities } from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';

const orderSchema = Yup.object().shape({
  description: Yup.string().required('Pole wymagane').max(200),
  startTime: Yup.string().required('Pole wymagane'),
  city: Yup.string().required('Pole wymagane'),
  address: Yup.string().required('Pole wymagane'),
});

const OrderDetailsScreenClient = ({
  navigation,
  route: {
    params: { orderId },
  },
}) => {
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(false);
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
        <Formik
          initialValues={{
            description: order.description,
            startTime: order.startTime,
            city: order.city,
            address: order.address,
          }}
          validationSchema={orderSchema}
          onSubmit={async (values, { resetForm }) => {
            setEditingOrder(false);
            await firebase
              .firestore()
              .collection('orders')
              .doc(orderId)
              .update({
                address: values.address,
                city: values.city,
                description: values.description,
                startTime: values.startTime,
              });
            console.log('submicja');
            setLoading(true);
            fetchOrderAndClient().then(() => setLoading(false));
            console.log('submicja2');
          }}>
          {(props) => (
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
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                label='Opis'
                value={props.values.description}
                onChangeText={(e: any) => {
                  props.setFieldValue('description', e);
                }}
                editable={editingOrder}
                multiline={true}
              />
              {editingOrder ? (
                <View style={{ width: '100%' }}>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode='date'
                    minimumDate={new Date()}
                    // onConfirm={handleConfirm}
                    date={
                      props.values.startTime
                        ? new Date(props.values.startTime)
                        : new Date()
                    }
                    onConfirm={(e) => {
                      props.values.startTime = e.getTime() as any;
                      setDatePickerVisibility(false);
                    }}
                    onCancel={hideDatePicker}
                  />
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={showDatePicker}>
                    <Input
                      errorMessage={
                        props.touched.startTime && props.errors.startTime
                          ? props.errors.startTime
                          : undefined
                      }
                      value={
                        props.values.startTime
                          ? new Date(
                              props.values.startTime
                            ).toLocaleDateString()
                          : ''
                      }
                      containerStyle={{ paddingHorizontal: 0 }}
                      onChangeText={props.handleChange('start_time')}
                      onFocus={() => console.log('press')}
                      editable={false}
                      rightIcon={{ type: 'font-awesome', name: 'calendar' }}
                      label='Data rozpoczęcia'
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Input
                  inputStyle={{ paddingVertical: 10 }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  label='Data rozpoczęcia'
                  value={new Date(props.values.startTime).toLocaleDateString()}
                  editable={false}
                />
              )}
              {editingOrder ? (
                <View style={{ width: '100%' }}>
                  <Text h5 style={styles.h5}>
                    Miasto
                  </Text>
                  <RNPickerSelect
                    style={{
                      inputAndroidContainer: {
                        padding: 0,
                      },
                      viewContainer: {
                        paddingLeft: 0,
                      },
                      inputAndroid: {
                        fontSize: 19,
                        margin: 0,
                        paddingHorizontal: 0,
                        paddingVertical: 15,
                        color: 'black',
                        paddingRight: 30, // to ensure the text is never behind the icon
                      },
                    }}
                    placeholder={{ value: null, label: 'Wybierz miasto' }}
                    onOpen={() => {
                      props.setFieldTouched('city', true);
                    }}
                    onValueChange={(value) => {
                      props.setFieldValue('city', value);
                      props.handleChange('city');
                    }}
                    value={props.values.city}
                    useNativeAndroidPickerStyle={false}
                    items={cities}
                  />
                  {props.touched.city && props.errors.city ? (
                    <Text style={styles.warning}> {props.errors.city} </Text>
                  ) : (
                    <Text style={styles.warning}> </Text>
                  )}
                </View>
              ) : (
                <Input
                  inputStyle={{ paddingVertical: 10 }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  label='Miasto'
                  value={props.values.city}
                  editable={false}
                />
              )}
              <Input
                inputStyle={{ paddingVertical: 10 }}
                containerStyle={{ paddingHorizontal: 0 }}
                label='Adres'
                value={props.values.address}
                onChangeText={(e: any) => {
                  props.setFieldValue('address', e);
                }}
                editable={editingOrder}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'space-between',
                  justifyContent: 'space-between',
                }}>
                <Button
                  raised
                  type='solid'
                  containerStyle={
                    !editingOrder
                      ? { marginTop: 20, width: '100%' }
                      : { display: 'none' }
                  }
                  title='Edytuj zlecenie'
                  onPress={() => {
                    setEditingOrder(!editingOrder);
                    console.log('uruchom edycje');
                  }}></Button>
                <Button
                  raised
                  type='solid'
                  containerStyle={
                    editingOrder
                      ? {
                          marginTop: 20,
                          width: '48%',
                        }
                      : { display: 'none' }
                  }
                  title='Zapisz'
                  onPress={() => {
                    console.log('zapisz');
                    props.handleSubmit();
                  }}></Button>
                <Button
                  raised
                  type='solid'
                  containerStyle={
                    editingOrder
                      ? {
                          marginTop: 20,
                          width: '48%',
                        }
                      : { display: 'none' }
                  }
                  title='Anuluj'
                  onPress={() => {
                    console.log('anuluj edycje');
                    setEditingOrder(!editingOrder);
                    props.resetForm();
                  }}></Button>
              </View>
            </View>
          )}
        </Formik>
      ) : null}
    </ScrollView>
  );
};

export default OrderDetailsScreenClient;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },

  h5: {
    alignSelf: 'flex-start',
    color: '#86939e',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warning: {
    paddingLeft: 10,
    alignSelf: 'flex-start',
    color: '#ff190c',
    fontSize: 12,
  },
});
function setDatePickerVisibility(arg0: boolean) {
  throw new Error('Function not implemented.');
}

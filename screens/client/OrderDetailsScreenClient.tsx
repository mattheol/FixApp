import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Divider,
  Text,
  Input,
  Button,
  ButtonGroup,
  Card,
} from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  categories,
  Order,
  subcategories,
  User,
  cities,
  Offer,
} from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFocusEffect } from '@react-navigation/core';

const orderSchema = Yup.object().shape({
  description: Yup.string().required('Pole wymagane').max(200),
  startTime: Yup.string().required('Pole wymagane'),
  city: Yup.string().required('Pole wymagane'),
  address: Yup.string().required('Pole wymagane'),
});

const tabs = ['Oferty', 'Szczegóły'];

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
  const [tab, setTab] = useState(0);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(false);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [contractors, setContractors] = useState<Array<User>>([]);
  const fetchOrderAndClient = async () => {
    try {
      const fetches = await Promise.all([
        new Promise<Order>(async (resolve) => {
          const data = (
            await firebase.firestore().collection('orders').doc(orderId).get()
          ).data()! as Order;
          resolve(data);
        }),
        new Promise<Array<Offer>>(async (resolve) => {
          const data = (
            await firebase
              .firestore()
              .collection('offers')
              .where('orderId', '==', orderId)
              .get()
          ).docs.map((doc) => ({
            ...(doc.data() as any),
            offerDocId: doc.id,
          })) as Array<Offer>;
          resolve(data);
        }),
      ]);
      setOrder(fetches[0]);
      const fetchedContractors = await Promise.all(
        fetches[1].map(
          (offer) =>
            new Promise<User>(async (resolve) => {
              const data = {
                ...(
                  await firebase
                    .firestore()
                    .collection('users')
                    .doc(offer.contractorId)
                    .get()
                ).data()!,
                userDocId: offer.contractorId,
              } as User;
              resolve(data);
            })
        )
      );
      setContractors(fetchedContractors);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchOrderAndClient().then(() => setLoading(false));
    }, [])
  );

  const subcategory = order
    ? subcategories.find((subCat) => subCat.value == order.subcategoryId)!
    : undefined;
  const category =
    order && subcategory
      ? categories.find((cat) => cat.value == subcategory.category)!
      : undefined;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ButtonGroup
        onPress={(selectedIndex: number) => setTab(selectedIndex)}
        selectedIndex={tab}
        buttons={tabs}
      />
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}

      {tab === 0 ? (
        <View>
          {contractors.length || loading ? (
            contractors.map((contractor, i) => (
              <Card
                key={i}
                containerStyle={{
                  marginHorizontal: 0,
                  paddingVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Avatar
                      rounded
                      containerStyle={{
                        backgroundColor: 'grey',
                        marginRight: 10,
                      }}
                      size='medium'
                      icon={
                        !contractor?.userImg
                          ? { name: 'user', type: 'font-awesome' }
                          : undefined
                      }
                      source={
                        contractor?.userImg
                          ? {
                              uri: contractor.userImg,
                            }
                          : undefined
                      }
                    />
                    <Text style={{ fontSize: 15 }}>
                      {contractor.firstName + ' ' + contractor.lastName}
                    </Text>
                  </View>

                  <Button
                    titleStyle={{ fontSize: 14 }}
                    title='Pokaż profil'
                    iconRight={true}
                    icon={{
                      type: 'font-awesome',
                      name: 'chevron-right',
                      color: 'white',
                      size: 15,
                    }}
                    onPress={() =>
                      navigation.navigate('ContractorProfile', {
                        contractorId: contractor.userDocId,
                      })
                    }></Button>
                </View>
              </Card>
            ))
          ) : (
            <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 10 }}>
              Brak ofert
            </Text>
          )}
        </View>
      ) : order ? (
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
                  flexDirection: 'row',
                }}>
                <Button
                  type='solid'
                  containerStyle={
                    !editingOrder
                      ? { display: 'flex', padding: 10, flex: 1 }
                      : { display: 'none' }
                  }
                  title='Edytuj zlecenie'
                  onPress={() => {
                    setEditingOrder(!editingOrder);
                    console.log('uruchom edycje');
                  }}></Button>
                <Button
                  type='outline'
                  containerStyle={
                    editingOrder
                      ? {
                          display: 'flex',
                          padding: 10,
                          flex: 1,
                        }
                      : { display: 'none' }
                  }
                  title='Anuluj'
                  onPress={() => {
                    console.log('anuluj edycje');
                    setEditingOrder(!editingOrder);
                    props.resetForm();
                  }}></Button>
                <Button
                  containerStyle={
                    editingOrder
                      ? {
                          display: 'flex',
                          padding: 10,
                          flex: 1,
                        }
                      : { display: 'none' }
                  }
                  title='Zapisz'
                  onPress={() => {
                    console.log('zapisz');
                    props.handleSubmit();
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
    flexGrow: 1,
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

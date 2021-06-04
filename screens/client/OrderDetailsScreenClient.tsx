import { useFocusEffect } from '@react-navigation/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Input,
  Text,
} from 'react-native-elements';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Colors, ProgressBar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import ReviewForm from '../../components/ReviewForm';
import {
  categories,
  cities,
  Offer,
  Order,
  Review,
  subcategories,
  User,
} from '../../models';
import { AuthContext } from '../../navigation/AuthProvider';

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
  const [selectedContractor, setSelectedContractor] =
    useState<User | undefined>(undefined);
  const [review, setReview] = useState<Review | undefined>(undefined);
  const [overlayVisibility, setOverlayVisibility] = useState(false);

  const fetchOrderAndOffers = async () => {
    try {
      setSelectedContractor(undefined);
      setReview(undefined);
      const fetchedOrder = (
        await firebase.firestore().collection('orders').doc(orderId).get()
      ).data()! as Order;
      setOrder(fetchedOrder);
      if (!fetchedOrder.contractorId) {
        const fetchedOffers = (
          await firebase
            .firestore()
            .collection('offers')
            .where('orderId', '==', orderId)
            .get()
        ).docs.map((doc) => ({
          ...(doc.data() as any),
          offerDocId: doc.id,
        })) as Array<Offer>;
        const fetchedContractors = await Promise.all(
          fetchedOffers.map(
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
      } else {
        const [fetchedContractor, fetchedReview] = await Promise.all([
          new Promise<User>(async (resolve) => {
            resolve({
              ...(
                await firebase
                  .firestore()
                  .collection('users')
                  .doc(fetchedOrder.contractorId)
                  .get()
              ).data()!,
              userDocId: fetchedOrder.contractorId,
            } as User);
          }),
          new Promise<Review | undefined>(async (resolve) => {
            const data = (
              await firebase
                .firestore()
                .collection('reviews')
                .where('orderId', '==', orderId)
                .where('reviewedId', '==', fetchedOrder.contractorId)
                .get()
            )?.docs.map((doc) => ({
              reviewDocId: doc.id,
              ...(doc.data() as any),
            }))?.[0];
            resolve(data);
          }),
        ]);
        setContractors([fetchedContractor]);
        setReview(fetchedReview);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchOrderAndOffers().then(() => setLoading(false));
    }, [])
  );

  const chooseContractor = async () => {
    Alert.alert(
      // Shows up the alert without redirecting anywhere
      'Potwierdzenie wymagane',
      `${
        selectedContractor!.firstName + ' ' + selectedContractor!.lastName
      } ma zostać wykonawcą zlecenia?`,
      [
        {
          text: 'Tak',
          onPress: async () => {
            setLoading(true);
            await firebase
              .firestore()
              .collection('orders')
              .doc(orderId)
              .update({
                contractorId: selectedContractor?.userDocId,
              });
            fetchOrderAndOffers().then(() => setLoading(false));
          },
        },
        {
          text: 'Anuluj',
          onPress: () => {},
        },
      ]
    );
  };

  const removeContractor = async () => {
    Alert.alert(
      // Shows up the alert without redirecting anywhere
      'Potwierdzenie wymagane',
      `Czy zrezygnować z usług wykonawcy?`,
      [
        {
          text: 'Tak',
          onPress: async () => {
            setLoading(true);
            await firebase
              .firestore()
              .collection('orders')
              .doc(orderId)
              .update({
                contractorId: firebase.firestore.FieldValue.delete(),
              });
            fetchOrderAndOffers().then(() => setLoading(false));
          },
        },
        {
          text: 'Anuluj',
          onPress: () => {},
        },
      ]
    );
  };

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
      <Overlay isVisible={overlayVisibility} overlayStyle={{ width: '80%' }}>
        <View>
          {overlayVisibility ? (
            <ReviewForm
              review={review}
              onFormCancel={() => {
                setOverlayVisibility(false);
              }}
              onFormSubmit={async (rating, description) => {
                setOverlayVisibility(false);
                setLoading(true);
                if (review) {
                  await firebase
                    .firestore()
                    .collection('reviews')
                    .doc(review.reviewDocId)
                    .update({
                      rating,
                      description,
                    });
                  ToastAndroid.show('Zaktualizowano ocenę', ToastAndroid.SHORT);
                  fetchOrderAndOffers().then(() => setLoading(false));
                } else {
                  await firebase.firestore().collection('reviews').doc().set({
                    orderId,
                    reviewedId: order?.contractorId,
                    reviewerId: user.uid,
                    rating,
                    description,
                  });
                  ToastAndroid.show('Dodano ocenę', ToastAndroid.SHORT);
                }
                fetchOrderAndOffers().then(() => setLoading(false));
              }}
            />
          ) : null}
        </View>
      </Overlay>
      {loading ? (
        <ProgressBar indeterminate color={Colors.blue500} />
      ) : tab === 0 ? (
        <View>
          {contractors.length === 1 &&
          contractors[0].userDocId === order?.contractorId ? (
            <>
              <Text
                style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>
                Wykonawca
              </Text>
              <Card
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
                        !contractors[0].userImg
                          ? { name: 'user', type: 'font-awesome' }
                          : undefined
                      }
                      source={
                        contractors[0].userImg
                          ? {
                              uri: contractors?.[0].userImg,
                            }
                          : undefined
                      }
                    />
                    <Text style={{ fontSize: 15 }}>
                      {contractors[0].firstName + ' ' + contractors[0].lastName}
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
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('ContractorProfile', {
                        contractorId: contractors[0].userDocId,
                      });
                    }}></Button>
                </View>
              </Card>
              <Button
                title={review ? 'Edytuj ocenę' : 'Wystaw ocenę'}
                containerStyle={{
                  marginTop: 20,
                }}
                onPress={() => setOverlayVisibility(true)}></Button>
              <Button
                type='outline'
                title='Zrezygnuj z wykonawcy'
                containerStyle={{
                  marginTop: 20,
                }}
                onPress={removeContractor}></Button>
            </>
          ) : contractors.length ? (
            <>
              <Text
                style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>
                Wybierz wykonawcę
              </Text>
              <View>
                {contractors.map((contractor, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (contractor === selectedContractor) {
                        setSelectedContractor(undefined);
                      } else {
                        setSelectedContractor(contractor);
                      }
                    }}>
                    <Card
                      containerStyle={{
                        marginHorizontal: 0,
                        paddingVertical: 8,
                        backgroundColor:
                          contractor === selectedContractor && !loading
                            ? '#c3dbff'
                            : 'white',
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
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('ContractorProfile', {
                              contractorId: contractor.userDocId,
                            });
                          }}></Button>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
              <Button
                title='Zastosuj'
                disabled={!selectedContractor}
                containerStyle={{
                  marginTop: 20,
                }}
                onPress={chooseContractor}></Button>
            </>
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
            fetchOrderAndOffers().then(() => setLoading(false));
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

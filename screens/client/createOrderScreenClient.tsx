import React, { useContext, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../navigation/AuthProvider';
// import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { categories, cities, subcategories } from '../../models';
import firebase from 'firebase';

const orderSchema = Yup.object().shape({
  description: Yup.string().required('Pole wymagane').max(200),
  category: Yup.number().required('Pole wymagane').nullable(),
  subcategoryId: Yup.number().required('Pole wymagane').nullable(),
  startTime: Yup.string().required('Pole wymagane'),
  city: Yup.string().required('Pole wymagane'),
  address: Yup.string().required('Pole wymagane'),
});

const createOrderScreenClient = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  // const [category, setCategory] = useState(null);
  // const [subcategory, setSubcategory] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <Formik
      initialValues={{
        description: undefined,
        category: null,
        subcategoryId: null,
        startTime: '',
        city: undefined,
        address: undefined,
      }}
      validationSchema={orderSchema}
      onSubmit={async (values, { resetForm }) => {
        await firebase.firestore().collection('orders').doc().set({
          address: values.address,
          city: values.city,
          description: values.description,
          startTime: values.startTime,
          subcategoryId: values.subcategoryId,
          clientId: firebase.auth().currentUser!.uid,
        });
        resetForm();
        ToastAndroid.show('Dodano nowe zlecenie', ToastAndroid.SHORT);
        navigation.navigate('Home');
      }}>
      {(props) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text h4>Nowe zlecenie</Text>
          <Text h5 style={styles.h5}>
            Kategoria
          </Text>
          <RNPickerSelect
            style={{
              viewContainer: {
                paddingLeft: 10,
              },
              inputAndroid: {
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderWidth: 0.5,
                borderColor: 'purple',
                borderRadius: 8,
                color: 'black',
                paddingRight: 30,
              },
            }}
            placeholder={{ value: null, label: 'Wybierz kategorie' }}
            onValueChange={(value) => {
              // setCategory(value);
              props.setFieldValue('category', value);
              if (props.values.subcategoryId != null) {
                // setSubcategory(null);
                props.setFieldValue('subcategoryId', null);
              }
              props.setFieldTouched('category', true);
            }}
            value={props.values.category}
            items={categories}
          />
          {props.touched.category && props.errors.category ? (
            <Text style={styles.warning}> {props.errors.category} </Text>
          ) : (
            <Text style={styles.warning}> </Text>
          )}
          <Text h5 style={styles.h5}>
            Podkategoria
          </Text>
          <RNPickerSelect
            style={{
              viewContainer: {
                paddingLeft: 10,
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 15,
                color: 'black',
                paddingRight: 30, // to ensure the text is never behind the icon
              },
            }}
            placeholder={{ value: null, label: 'Wybierz podkategorie' }}
            onOpen={() => {
              props.setFieldTouched('subcategoryId', true);
            }}
            onValueChange={(value) => {
              // setSubcategory(value);
              props.setFieldValue('subcategoryId', value);
              props.handleChange('subcategoryId');
              // console.log(props.touched.subcategory);
              // console.log(props.errors.subcategory);
            }}
            value={props.values.subcategoryId}
            useNativeAndroidPickerStyle={true}
            // value={props.values.subcategory}
            disabled={props.values.category == null}
            items={subcategories.filter(
              (e) => e.category == props.values.category
            )}
          />
          {props.touched.subcategoryId && props.errors.subcategoryId ? (
            <Text style={styles.warning}> {props.errors.subcategoryId} </Text>
          ) : (
            <Text style={styles.warning}> </Text>
          )}
          {/* <DropDownPicker
            items={categories}
            defaultValue={undefined}
            containerStyle={{ height: 40 }}
            style={{ backgroundColor: '#fafafa', width: '100%' }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            onChangeItem={(item) =>
              setState({
                country: item.value,
              })
            }
          /> */}
          <Input
            containerStyle={{ paddingTop: 20 }}
            style={{
              paddingLeft: 10,
            }}
            inputContainerStyle={{ borderWidth: 1, borderRadius: 10 }}
            errorMessage={
              props.touched.description && props.errors.description
                ? props.errors.description
                : undefined
            }
            value={props.values.description}
            onChangeText={(e: any) => {
              // props.handleChange(e);
              props.setFieldValue('description', e);
            }}
            // rightIcon={() => {
            //   return <Text>testtest</Text>;
            // }}
            multiline={true}
            numberOfLines={4}
            label='Opis zlecenia'
            autoCorrect={true}
          />
          {/* <Button title='Show Date Picker' onPress={showDatePicker} /> */}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode='date'
            minimumDate={new Date()}
            // onConfirm={handleConfirm}
            date={
              props.values.startTime != ''
                ? new Date(props.values.startTime)
                : new Date()
            }
            onConfirm={(e) => {
              props.values.startTime = e.getTime() as any;
              setDatePickerVisibility(false);
            }}
            onCancel={hideDatePicker}
          />
          <TouchableOpacity style={{ width: '100%' }} onPress={showDatePicker}>
            <Input
              style={{ paddingLeft: 10 }}
              errorMessage={
                props.touched.startTime && props.errors.startTime
                  ? props.errors.startTime
                  : undefined
              }
              value={
                props.values.startTime != ''
                  ? new Date(props.values.startTime).toDateString()
                  : ''
              }
              onChangeText={props.handleChange('start_time')}
              onFocus={() => console.log('press')}
              editable={false}
              rightIcon={{ type: 'font-awesome', name: 'calendar' }}
              label='Termin rozpoczęcia'
            />
          </TouchableOpacity>

          {/* <Input
            style={{ paddingLeft: 10 }}
            errorMessage={
              props.touched.city && props.errors.city
                ? props.errors.city
                : undefined
            }
            value={props.values.city}
            onChangeText={props.handleChange('city')}
            label='Miasto'
          /> */}
          <Text h5 style={styles.h5}>
            Miasto
          </Text>
          <RNPickerSelect
            style={{
              viewContainer: {
                paddingLeft: 10,
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
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
            useNativeAndroidPickerStyle={true}
            items={cities}
          />
          {props.touched.city && props.errors.city ? (
            <Text style={styles.warning}> {props.errors.city} </Text>
          ) : (
            <Text style={styles.warning}> </Text>
          )}

          <Input
            style={{ paddingLeft: 10 }}
            errorMessage={
              props.touched.address && props.errors.address
                ? props.errors.address
                : undefined
            }
            value={props.values.address}
            onChangeText={props.handleChange('address')}
            label='Adres'
          />
          <Button
            containerStyle={{ width: '100%', padding: 10 }}
            title='Dodaj zlecenie'
            onPress={() => props.handleSubmit()}
          />
        </ScrollView>
      )}
    </Formik>
  );
};

export default createOrderScreenClient;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  h5: {
    alignSelf: 'flex-start',
    paddingLeft: 8,
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

import firebase from 'firebase/app';
import 'firebase/firestore';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import * as Yup from 'yup';
import { AuthContext } from '../../navigation/AuthProvider';
import { ProgressBar, Colors } from 'react-native-paper';

const userInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  lastName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  phone: Yup.string().length(9, 'Numer musi mieć 9 cyfr'),
});

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null as any);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const userInfo = (
      await firebase.firestore().collection('users').doc(user.uid).get()
    ).data()!;
    setUserData(userInfo);
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData();
    setLoading(false);
  }, []);
  if (!userData) {
    return <ProgressBar indeterminate color={Colors.blue500} />;
  }
  if (!editMode) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text h4>Twój Profil</Text>
        <Input
          inputContainerStyle={{ borderBottomWidth: 0 }}
          disabled={true}
          disabledInputStyle={{ opacity: 1 }}
          label='Imię i Nazwisko'
          containerStyle={{ paddingTop: 20 }}
          value={userData.firstName + ' ' + userData.lastName}
          autoCorrect={false}
        />
        <Input
          inputContainerStyle={{ borderBottomWidth: 0 }}
          disabled={true}
          disabledInputStyle={{ opacity: 1 }}
          label='Numer telefonu'
          keyboardType='numeric'
          value={userData.phone || 'Brak'}
          autoCorrect={false}
        />
        <Button
          containerStyle={{ width: '100%' }}
          title='Edytuj dane'
          raised
          icon={{ type: 'font-awesome', name: 'edit', color: 'white' }}
          onPress={() => {
            setEditMode(true);
          }}
        />
      </ScrollView>
    );
  } else {
    return (
      <>
        {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
        <Formik
          initialValues={{
            firstName: (userData.firstName as string) || '',
            lastName: (userData.lastName as string) || '',
            phone: (userData.phone as string) || '',
          }}
          validationSchema={userInfoSchema}
          onSubmit={async (values) => {
            setLoading(true);
            await firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                ...values,
              });
            await fetchUserData();
            setLoading(false);
            setEditMode(false);
          }}>
          {(props) => (
            <ScrollView contentContainerStyle={styles.container}>
              <Text h4>Edycja Profilu</Text>
              <Input
                containerStyle={{ paddingTop: 20 }}
                label='Imię'
                value={props.values.firstName}
                onChangeText={props.handleChange('firstName')}
                errorMessage={
                  props.touched.firstName && props.errors.firstName
                    ? props.errors.firstName
                    : undefined
                }
                autoCorrect={false}
              />
              <Input
                label='Nazwisko'
                value={props.values.lastName}
                onChangeText={props.handleChange('lastName')}
                errorMessage={
                  props.touched.lastName && props.errors.lastName
                    ? props.errors.lastName
                    : undefined
                }
                autoCorrect={false}
              />
              <Input
                label='Numer telefonu'
                keyboardType='numeric'
                maxLength={9}
                value={props.values.phone}
                onChangeText={props.handleChange('phone')}
                errorMessage={
                  props.touched.phone && props.errors.phone
                    ? props.errors.phone
                    : undefined
                }
                autoCorrect={false}
              />
              <View style={{ flexDirection: 'row' }}>
                <Button
                  containerStyle={{ padding: 10, flex: 1 }}
                  type='outline'
                  title='Anuluj'
                  onPress={() => {
                    setEditMode(false);
                  }}
                />
                <Button
                  containerStyle={{ padding: 10, flex: 1 }}
                  title='Zapisz zmiany'
                  onPress={() => props.handleSubmit()}
                />
              </View>
            </ScrollView>
          )}
        </Formik>
      </>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

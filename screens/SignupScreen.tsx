import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, Text } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import * as Yup from 'yup';
import { AuthContext } from '../navigation/AuthProvider';

const registerSchemaCredentials = Yup.object().shape({
  email: Yup.string().email('Niepoprawny email').required('Pole wymagane'),
  password: Yup.string().required('Pole wymagane').min(6, 'Minimum 6 znaków'),
  passwordConfirmation: Yup.string().test(
    'passwords-match',
    'Hasła muszą być takie same',
    function (value) {
      return this.parent.password === value;
    }
  ),
});

const registerSchemaExtra = Yup.object().shape({
  firstName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  lastName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  phone: Yup.string().length(9, 'Numer musi mieć 9 cyfr'),
});

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(0);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const buttons = ['Klient', 'Wykonawca'];
  const { register } = useContext(AuthContext);

  return step === 1 ? (
    <Formik
      key='1'
      initialValues={{
        email: '',
        password: '',
        passwordConfirmation: '',
      }}
      validationSchema={registerSchemaCredentials}
      onSubmit={(values) => {
        setCredentials(values);
        setStep(2);
      }}>
      {(props) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text h4>Rejestracja</Text>
          <Input
            containerStyle={{ paddingTop: 20 }}
            label='Email'
            value={props.values.email}
            onChangeText={props.handleChange('email')}
            errorMessage={
              props.touched.email && props.errors.email
                ? props.errors.email
                : undefined
            }
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
          <Input
            label='Hasło'
            value={props.values.password}
            onChangeText={props.handleChange('password')}
            errorMessage={
              props.touched.password && props.errors.password
                ? props.errors.password
                : undefined
            }
            autoCorrect={false}
            secureTextEntry={true}
          />
          <Input
            label='Powtórz hasło'
            value={props.values.passwordConfirmation}
            onChangeText={props.handleChange('passwordConfirmation')}
            errorMessage={
              props.touched.passwordConfirmation &&
              props.errors.passwordConfirmation
                ? props.errors.passwordConfirmation
                : undefined
            }
            autoCorrect={false}
            secureTextEntry={true}
          />
          <Button
            containerStyle={{ width: '100%', padding: 10 }}
            title='Zatwierdź i przejdź dalej'
            onPress={() => {
              props.handleSubmit();
            }}
          />
        </ScrollView>
      )}
    </Formik>
  ) : (
    <>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
      <Formik
        key='2'
        initialValues={{
          firstName: '',
          lastName: '',
          phone: '',
        }}
        validationSchema={registerSchemaExtra}
        onSubmit={async (values) => {
          setLoading(true);
          await register(
            credentials.email,
            credentials.password,
            values.firstName,
            values.lastName,
            values.phone,
            type
          );
          setLoading(false);
        }}>
        {(props) => (
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ paddingTop: 20, fontSize: 18 }}>
              Typ użytkownika
            </Text>
            <ButtonGroup
              onPress={(selectedIndex: number) => setType(selectedIndex)}
              selectedIndex={type}
              buttons={buttons}
            />
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
            <Button
              containerStyle={{ width: '100%', padding: 10 }}
              title='Zarejestuj się'
              onPress={() => props.handleSubmit()}
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

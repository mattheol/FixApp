import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
// import { AuthContext } from '../navigation/AuthProvider';
import { Colors, ProgressBar } from 'react-native-paper';
import * as Yup from 'yup';
import { AuthContext } from '../navigation/AuthProvider';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Niepoprawny email').required('Pole wymagane'),
  password: Yup.string().required('Pole wymagane'),
});

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
      <Formik
        initialValues={{ email: undefined, password: undefined }}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          setLoading(true);
          await login(values.email, values.password);
          setLoading(false);
        }}>
        {(props) => (
          <ScrollView contentContainerStyle={styles.container}>
            <Text h4>Logowanie</Text>
            <Input
              containerStyle={{ paddingTop: 20 }}
              style={{ paddingLeft: 10 }}
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              errorMessage={
                props.touched.email && props.errors.email
                  ? props.errors.email
                  : undefined
              }
              value={props.values.email}
              onChangeText={props.handleChange('email')}
              placeholder='Email'
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
            />
            <Input
              style={{ paddingLeft: 10 }}
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              errorMessage={
                props.touched.password && props.errors.password
                  ? props.errors.password
                  : undefined
              }
              value={props.values.password}
              onChangeText={props.handleChange('password')}
              placeholder='Hasło'
              secureTextEntry={true}
            />
            <Button
              containerStyle={{ width: '100%', padding: 10 }}
              title='Zaloguj się'
              onPress={() => props.handleSubmit()}
            />
            <Button
              containerStyle={{ width: '100%', padding: 10 }}
              title='Zarejestruj się'
              type='outline'
              onPress={() => navigation.navigate('Signup')}
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

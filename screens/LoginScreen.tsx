import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';

// import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //   const { login } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4>Logowanie</Text>
      <Input
        containerStyle={{ paddingTop: 20 }}
        style={{ paddingLeft: 10 }}
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        onChangeText={(userEmail: string) => setEmail(userEmail)}
        placeholder='Email'
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        style={{ paddingLeft: 10 }}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        onChangeText={(userPassword: string) => setPassword(userPassword)}
        placeholder='Hasło'
        secureTextEntry={true}
      />
      <Button
        containerStyle={{ width: '100%', padding: 10 }}
        title='Zaloguj się'
        // onPress={() => login(email, password)}
      />
      <Button
        containerStyle={{ width: '100%', padding: 10 }}
        title='Zarejestruj się'
        type='outline'
        onPress={() => navigation.navigate('Signup')}
      />
    </ScrollView>
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
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    paddingTop: 20,
  },
});

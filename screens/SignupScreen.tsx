import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Input, Button, Text, ButtonGroup } from 'react-native-elements';

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [login, setLogin] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [phone, setPhone] = useState();
  const [type, setType] = useState(1);
  const buttons = ['Klient', 'Wykonawca'];
  //   const { register } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 ? (
        <>
          <Text h4>Rejestracja</Text>
          <Input
            containerStyle={{ paddingTop: 20 }}
            label='Email'
            onChangeText={(email: string) => {}}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
          <Input
            label='Login'
            onChangeText={(email: string) => {}}
            autoCorrect={false}
          />
          <Input
            label='Hasło'
            onChangeText={(email: string) => {}}
            autoCorrect={false}
            secureTextEntry={true}
          />
          <Input
            label='Powtórz hasło'
            onChangeText={(email: string) => {}}
            autoCorrect={false}
            secureTextEntry={true}
          />
          <Button
            containerStyle={{ width: '100%', padding: 10 }}
            title='Zatwierdź i przejdź dalej'
            onPress={() => setStep(2)}
          />
        </>
      ) : (
        <>
          <Text style={{ paddingTop: 20, fontSize: 18 }}>Typ użytkownika</Text>
          <ButtonGroup
            onPress={(selectedIndex: number) => setType(selectedIndex)}
            selectedIndex={type}
            buttons={buttons}
          />
          <Input
            containerStyle={{ paddingTop: 20 }}
            label='Imię'
            onChangeText={(email: string) => {}}
            autoCorrect={false}
          />
          <Input
            label='Nazwisko'
            onChangeText={(email: string) => {}}
            autoCorrect={false}
          />
          <Input
            label='Numer telefonu'
            keyboardType='numeric'
            maxLength={10}
            onChangeText={(email: string) => {}}
            autoCorrect={false}
          />
          <Button
            containerStyle={{ width: '100%', padding: 10 }}
            title='Zarejestuj się'
          />
        </>
      )}
    </ScrollView>
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

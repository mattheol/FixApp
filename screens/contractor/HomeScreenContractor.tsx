import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

// import { AuthContext } from '../navigation/AuthProvider';

const HomeScreenContractor = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //   const { login } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4>Widok dla zalogowanego wykonawcy</Text>
    </ScrollView>
  );
};

export default HomeScreenContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

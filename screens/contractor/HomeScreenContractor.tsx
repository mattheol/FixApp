import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

import { AuthContext } from '../../navigation/AuthProvider';

const HomeScreenContractor = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4>Widok dla zalogowanego wykonawcy</Text>
      <Button title='Wyloguj się' onPress={() => logout()} />
    </ScrollView>
  );
};

export default HomeScreenContractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

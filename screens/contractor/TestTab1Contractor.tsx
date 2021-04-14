import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

import { AuthContext } from '../../navigation/AuthProvider';

const TestTab1Contractor = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4>Test1</Text>
      <Button title='Wyloguj się' onPress={() => logout()} />
    </ScrollView>
  );
};

export default TestTab1Contractor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
});

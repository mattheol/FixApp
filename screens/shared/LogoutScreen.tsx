import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';

const LogoutScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      Alert.alert(
        // Shows up the alert without redirecting anywhere
        'Potwierdzenie wymagane',
        'Czy chcesz się wylogować?',
        [
          {
            text: 'Tak',
            onPress: () => {
              logout();
            },
          },
          {
            text: 'Nie',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    }, [])
  );
  return <View></View>;
};

export default LogoutScreen;

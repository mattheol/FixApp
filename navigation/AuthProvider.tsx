import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';

export const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        type,
        setType,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            Alert.alert('', 'Podany email lub/i hasło są niepoprawne');
            console.log(e);
          }
        },
        register: async (email, password, firstName, lastName, phone, type) => {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password);
            const currentUser = firebase.auth().currentUser;
            firebase.firestore().collection('users').doc(currentUser!.uid).set({
              firstName,
              lastName,
              phone,
              type,
            });
          } catch (e) {
            Alert.alert('', 'Błąd podczas rejestracji');
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

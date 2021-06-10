import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Avatar,
  Input,
  Text,
  Rating,
  Card,
} from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import * as Yup from 'yup';
import { AuthContext } from '../../navigation/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/core';
import { Review, User } from '../../models';

const userInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  lastName: Yup.string().required('Pole wymagane').min(3, 'Minimum 3 znaki'),
  phone: Yup.string().length(9, 'Numer musi mieć 9 cyfr'),
});

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [reviews, setReviews] = useState<Array<Review>>([]);

  const fetchUserData = async () => {
    const userInfo = (
      await firebase.firestore().collection('users').doc(user.uid).get()
    ).data()! as User;

    if (userInfo.type === 1) {
      const ratingInfo = (
        await firebase
          .firestore()
          .collection('reviews')
          .where('reviewedId', '==', user.uid)
          .get()
      ).docs.map((doc) => ({
        ...(doc.data() as any),
        reviewDocId: doc.id,
      })) as Array<Review>;
      setReviews(ratingInfo);
    } else {
      setReviews([]);
    }
    setUserData(userInfo);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchUserData().then(() => setLoading(false));
    }, [])
  );

  const urlToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async () => {
    if (!image) {
      return;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = firebase.storage().ref(`photos/${filename}`);
    const blob = await urlToBlob(uploadUri);
    const task = storageRef.put(blob);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage('');

      return url;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  if (!userData) {
    return <ProgressBar indeterminate color={Colors.blue500} />;
  }
  if (!editMode) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar
            rounded
            containerStyle={{ backgroundColor: 'grey', marginTop: 30 }}
            size='xlarge'
            icon={
              !userData?.userImg
                ? { name: 'user', type: 'font-awesome' }
                : undefined
            }
            source={
              userData?.userImg
                ? {
                    uri: userData.userImg,
                  }
                : undefined
            }
          />
          <Text style={{ fontSize: 25, marginTop: 10 }}>
            {userData?.firstName + ' ' + userData?.lastName}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <FontAwesome name='phone' size={20} />
            <Text style={{ fontSize: 20, marginLeft: 5 }}>
              {userData?.phone || 'Brak'}
            </Text>
          </View>
        </View>
        <Button
          containerStyle={{ width: '100%', marginTop: 35 }}
          title='Edytuj dane'
          raised
          icon={{ type: 'font-awesome', name: 'edit', color: 'white' }}
          onPress={() => {
            setEditMode(true);
          }}
        />
        {reviews.length ? (
          <>
            <View
              style={{
                marginTop: 15,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 15 }}>Ocena: </Text>
                <Text style={{ fontSize: 20 }}>
                  {
                    +(
                      reviews.reduce((a, b) => +a + +b.rating, 0) /
                      reviews.length
                    ).toFixed(2)
                  }
                </Text>
                <Text style={{ fontSize: 15 }}>/5</Text>
              </View>
              <Rating
                imageSize={40}
                readonly
                startingValue={
                  reviews.reduce((a, b) => +a + +b.rating, 0) / reviews.length
                }
                tintColor='#F0F0F0'
              />
            </View>
            {reviews.map((review, i) => (
              <Card
                key={i}
                containerStyle={{
                  marginHorizontal: 0,
                  backgroundColor: '#e6f0ff',
                  paddingVertical: 8,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Rating
                      imageSize={20}
                      readonly
                      startingValue={review.rating}
                      tintColor='#e6f0ff'
                    />
                    <Text style={{ fontSize: 18, marginLeft: 5 }}>
                      {review.rating}
                    </Text>
                    <Text style={{ fontSize: 15 }}>/5</Text>
                  </View>
                  <Text>{review.description}</Text>
                </View>
              </Card>
            ))}
          </>
        ) : null}
      </ScrollView>
    );
  } else {
    return (
      <>
        {loading ? <ProgressBar indeterminate color={Colors.blue500} /> : null}
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 25,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Avatar
            rounded
            containerStyle={{ backgroundColor: 'grey', marginTop: 30 }}
            size='xlarge'
            icon={
              !image && !userData?.userImg
                ? { name: 'user', type: 'font-awesome' }
                : undefined
            }
            source={
              image || userData?.userImg
                ? {
                    uri: image || userData?.userImg,
                  }
                : undefined
            }
          />
          <Button
            containerStyle={{
              width: '100%',
              marginTop: 10,
            }}
            title='Wybierz zdjęcie'
            type='outline'
            icon={{ name: 'camera', type: 'font-awesome' }}
            onPress={() => {
              pickImage();
            }}
          />
        </View>

        <Formik
          initialValues={{
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            phone: (userData?.phone as string) || '',
          }}
          validationSchema={userInfoSchema}
          onSubmit={async (values) => {
            setLoading(true);
            let imgUrl = userData?.userImg;
            if (image) {
              imgUrl = await uploadImage();
            }
            await firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                ...values,
                userImg: imgUrl || '',
              });
            setEditMode(false);
            await fetchUserData();
            setLoading(false);
          }}>
          {(props) => (
            <ScrollView contentContainerStyle={styles.container}>
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
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

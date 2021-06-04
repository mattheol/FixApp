import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Rating, Text } from 'react-native-elements';
import { Colors, ProgressBar } from 'react-native-paper';
import { Review, User } from '../../models';

const ContractorProfileScreen = ({
  navigation,
  route: {
    params: { contractorId },
  },
}) => {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Array<Review>>([]);

  const fetchUserData = async () => {
    const userInfo = (
      await firebase.firestore().collection('users').doc(contractorId).get()
    ).data()! as User;

    const ratingInfo = (
      await firebase
        .firestore()
        .collection('reviews')
        .where('reviewedId', '==', contractorId)
        .get()
    ).docs.map((doc) => ({
      ...(doc.data() as any),
      reviewDocId: doc.id,
    })) as Array<Review>;
    setReviews(ratingInfo);
    setUserData(userInfo);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchUserData().then(() => setLoading(false));
    }, [])
  );

  if (!userData) {
    return <ProgressBar indeterminate color={Colors.blue500} />;
  }
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
                {reviews.reduce((a, b) => +a + +b.rating, 0) / reviews.length}
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
      ) : (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 18 }}>Brak ocen</Text>
          <Rating
            imageSize={40}
            readonly
            startingValue={0}
            tintColor='#F0F0F0'
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ContractorProfileScreen;

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

import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Input, Text, Rating } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Review } from '../models';

const reviewSchema = Yup.object().shape({
  rating: Yup.number(),
  description: Yup.string()
    .required('Pole wymagane')
    .min(3, 'Minimum 3 znaki')
    .max(30, 'Maksimum 30 znaków'),
});

const ReviewForm = ({ review, onFormCancel, onFormSubmit }) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>Wystaw ocenę</Text>
      <Formik
        initialValues={{
          rating: review?.rating === undefined ? 5 : review.rating,
          description: review?.description || '',
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values) => {
          onFormSubmit?.(values.rating, values.description);
        }}>
        {(props) => (
          <ScrollView contentContainerStyle={styles.container}>
            <Rating
              imageSize={35}
              startingValue={props.values.rating}
              tintColor='white'
              onFinishRating={(e) => {
                props.setFieldValue('rating', e);
              }}
              type='custom'
              ratingBackgroundColor='#F0F0F0'
            />
            <Input
              containerStyle={{ paddingTop: 20 }}
              style={{
                paddingLeft: 10,
              }}
              inputContainerStyle={{ borderWidth: 1, borderRadius: 10 }}
              errorMessage={
                props.touched.description && props.errors.description
                  ? props.errors.description
                  : undefined
              }
              value={props.values.description}
              onChangeText={(e: any) => {
                // props.handleChange(e);
                props.setFieldValue('description', e);
              }}
              multiline={true}
              numberOfLines={4}
              label='Opis'
              autoCorrect={true}
            />
            <View style={{ flexDirection: 'row' }}>
              <Button
                containerStyle={{ padding: 10, flex: 1 }}
                type='outline'
                title='Anuluj'
                onPress={() => {
                  onFormCancel?.();
                }}
              />
              <Button
                containerStyle={{ padding: 10, flex: 1 }}
                title='Zapisz'
                onPress={() => props.handleSubmit()}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ReviewForm;

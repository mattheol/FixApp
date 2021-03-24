import React from 'react';
import Image from 'react-native-scalable-image';
// @ts-ignore
import Onboarding from 'react-native-onboarding-swiper';
import { windowHeight } from '../utils/Dimensions';

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      skipLabel='Pomiń'
      nextLabel='Dalej'
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.navigate('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: (
            <Image
              height={windowHeight - 480}
              source={require('../assets/images/client.png')}
            />
          ),
          title: 'Dla klientów',
          subtitle:
            'Utwórz zlecenie i poczekaj aż zgłosi się do niego wykonawca',
        },
        {
          backgroundColor: '#fdeb93',
          image: (
            <Image
              height={windowHeight - 480}
              source={require('../assets/images/job.png')}
            />
          ),
          title: 'Dla wykonawców',
          subtitle:
            'Przeglądaj oferty z Twojej okolicy i znajdź interesujące Cię zlecenie',
        },
      ]}
    />
  );
};

export default OnboardingScreen;

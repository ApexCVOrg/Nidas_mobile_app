import React from 'react';
import { useRoute } from '@react-navigation/native';
import IntroductionScreen2 from './IntroductionScreen2';
import IntroductionScreen3 from './IntroductionScreen3';
import IntroductionScreen4 from './IntroductionScreen4';

type RouteParams = {
  bannerId: number;
  title: string;
  subtitle: string;
};

const IntroductionScreen = () => {
  const route = useRoute();
  const { bannerId } = route.params as RouteParams;

  // Route to specific screens based on bannerId
  switch (bannerId) {
    case 2:
      return <IntroductionScreen2 />;
    case 3:
      return <IntroductionScreen3 />;
    case 4:
      return <IntroductionScreen4 />;
    default:
      return <IntroductionScreen2 />; // Default fallback
  }
};



export default IntroductionScreen; 
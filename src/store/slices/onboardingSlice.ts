import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
}

interface OnboardingState {
  hasOnboarded: boolean;
  allowedNotifications: boolean;
  allowedLocation: boolean;
  userLocation: Location | null;
  userPreference: 'men' | 'women' | 'children' | null;
}

const initialState: OnboardingState = {
  hasOnboarded: false,
  allowedNotifications: false,
  allowedLocation: false,
  userLocation: null,
  userPreference: null,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.hasOnboarded = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.allowedNotifications = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.allowedLocation = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<Location>) => {
      state.userLocation = action.payload;
    },
    setUserPreference: (
      state,
      action: PayloadAction<'men' | 'women' | 'children'>
    ) => {
      state.userPreference = action.payload;
    },
    resetOnboarding: (state) => {
      return initialState;
    },
  },
});

export const {
  setOnboardingComplete,
  setNotificationPermission,
  setLocationPermission,
  setUserLocation,
  setUserPreference,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer; 
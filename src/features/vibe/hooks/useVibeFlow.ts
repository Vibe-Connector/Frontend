import { useReducer, useMemo } from 'react';
import type { VibeFlowState, VibeAction, VibeStep } from '../types';
import { MAX_MOOD_SELECTIONS, MAX_CUSTOM_MOODS } from '../constants';

const initialState: VibeFlowState = {
  currentStep: 1,
  direction: 'forward',
  selectedMoods: [],
  customMoods: [],
  selectedAmPm: 'AM',
  selectedTimeSlot: null,
  selectedWeather: null,
  selectedPlace: null,
  selectedCompanion: null,
};

function vibeReducer(state: VibeFlowState, action: VibeAction): VibeFlowState {
  switch (action.type) {
    case 'TOGGLE_MOOD': {
      const exists = state.selectedMoods.includes(action.moodId);
      if (exists) {
        return { ...state, selectedMoods: state.selectedMoods.filter((id) => id !== action.moodId) };
      }
      if (state.selectedMoods.length >= MAX_MOOD_SELECTIONS) return state;
      return { ...state, selectedMoods: [...state.selectedMoods, action.moodId] };
    }
    case 'ADD_CUSTOM_MOOD': {
      const trimmed = action.label.trim();
      if (!trimmed || state.customMoods.includes(trimmed)) return state;
      if (state.customMoods.length >= MAX_CUSTOM_MOODS) return state;
      return {
        ...state,
        customMoods: [...state.customMoods, trimmed],
        selectedMoods: [...state.selectedMoods, `custom:${trimmed}`],
      };
    }
    case 'REMOVE_CUSTOM_MOOD': {
      return {
        ...state,
        customMoods: state.customMoods.filter((m) => m !== action.label),
        selectedMoods: state.selectedMoods.filter((id) => id !== `custom:${action.label}`),
      };
    }
    case 'SET_AMPM':
      return { ...state, selectedAmPm: action.value };
    case 'SET_TIME_SLOT':
      return { ...state, selectedTimeSlot: action.timeId };
    case 'SET_WEATHER':
      return {
        ...state,
        selectedWeather: state.selectedWeather === action.weatherId ? null : action.weatherId,
      };
    case 'SET_PLACE':
      return { ...state, selectedPlace: action.placeId };
    case 'SET_COMPANION':
      return { ...state, selectedCompanion: action.companionId };
    case 'NEXT_STEP':
      if (state.currentStep >= 3) return state;
      return { ...state, currentStep: (state.currentStep + 1) as VibeStep, direction: 'forward' };
    case 'PREV_STEP':
      if (state.currentStep <= 1) return state;
      return { ...state, currentStep: (state.currentStep - 1) as VibeStep, direction: 'backward' };
    case 'RESET':
      return { ...initialState };
    case 'RESET_CURRENT_STEP': {
      switch (state.currentStep) {
        case 1:
          return { ...state, selectedMoods: [], customMoods: [] };
        case 2:
          return { ...state, selectedAmPm: 'AM', selectedTimeSlot: null, selectedWeather: null };
        case 3:
          return { ...state, selectedPlace: null, selectedCompanion: null };
        default:
          return state;
      }
    }
    default:
      return state;
  }
}

export function useVibeFlow() {
  const [state, dispatch] = useReducer(vibeReducer, initialState);

  const canProceed = useMemo(() => {
    switch (state.currentStep) {
      case 1:
        return state.selectedMoods.length > 0;
      case 2:
        return state.selectedTimeSlot !== null && state.selectedWeather !== null;
      case 3:
        return state.selectedPlace !== null && state.selectedCompanion !== null;
      default:
        return false;
    }
  }, [state.currentStep, state.selectedMoods, state.selectedTimeSlot, state.selectedWeather, state.selectedPlace, state.selectedCompanion]);

  const actions = useMemo(
    () => ({
      toggleMood: (moodId: string) => dispatch({ type: 'TOGGLE_MOOD', moodId }),
      addCustomMood: (label: string) => dispatch({ type: 'ADD_CUSTOM_MOOD', label }),
      removeCustomMood: (label: string) => dispatch({ type: 'REMOVE_CUSTOM_MOOD', label }),
      setAmPm: (value: 'AM' | 'PM') => dispatch({ type: 'SET_AMPM', value }),
      setTimeSlot: (timeId: string) => dispatch({ type: 'SET_TIME_SLOT', timeId }),
      setWeather: (weatherId: string) => dispatch({ type: 'SET_WEATHER', weatherId }),
      setPlace: (placeId: string) => dispatch({ type: 'SET_PLACE', placeId }),
      setCompanion: (companionId: string) => dispatch({ type: 'SET_COMPANION', companionId }),
      nextStep: () => dispatch({ type: 'NEXT_STEP' }),
      prevStep: () => dispatch({ type: 'PREV_STEP' }),
      reset: () => dispatch({ type: 'RESET' }),
      resetCurrentStep: () => dispatch({ type: 'RESET_CURRENT_STEP' }),
    }),
    [],
  );

  return { ...state, canProceed, ...actions };
}

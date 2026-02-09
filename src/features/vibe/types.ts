export interface MoodKeyword {
  id: string;
  label: string;
  color: string;
}

export interface TimeOption {
  id: string;
  label: string;
  hourStart: number;
  hourEnd: number;
}

export interface WeatherOption {
  id: string;
  label: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow';
}

export interface PlaceOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export interface CompanionOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export type VibeStep = 1 | 2 | 3;

export interface VibeFlowState {
  currentStep: VibeStep;
  direction: 'forward' | 'backward';

  // Step 1
  selectedMoods: string[];
  customMoods: string[];

  // Step 2
  selectedAmPm: 'AM' | 'PM';
  selectedTimeSlot: string | null;
  selectedWeather: string | null;

  // Step 3
  selectedPlace: string | null;
  selectedCompanion: string | null;
}

export type VibeAction =
  | { type: 'TOGGLE_MOOD'; moodId: string }
  | { type: 'ADD_CUSTOM_MOOD'; label: string }
  | { type: 'REMOVE_CUSTOM_MOOD'; label: string }
  | { type: 'SET_AMPM'; value: 'AM' | 'PM' }
  | { type: 'SET_TIME_SLOT'; timeId: string }
  | { type: 'SET_WEATHER'; weatherId: string }
  | { type: 'SET_PLACE'; placeId: string }
  | { type: 'SET_COMPANION'; companionId: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }
  | { type: 'RESET_CURRENT_STEP' };

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

  // Step 2 — Time
  selectedAmPm: 'AM' | 'PM';
  selectedHour: number | null;
  selectedMinute: number;

  // Step 2 — Weather (intensity bar)
  weatherIntensities: Record<string, number>;

  // Step 3
  selectedPlace: string | null;
  selectedCompanion: string | null;
}

export type VibeAction =
  | { type: 'TOGGLE_MOOD'; moodId: string }
  | { type: 'ADD_CUSTOM_MOOD'; label: string }
  | { type: 'REMOVE_CUSTOM_MOOD'; label: string }
  | { type: 'SET_AMPM'; value: 'AM' | 'PM' }
  | { type: 'SET_HOUR'; hour: number }
  | { type: 'SET_MINUTE'; minute: number }
  | { type: 'SET_WEATHER_INTENSITY'; weatherId: string; intensity: number }
  | { type: 'SET_PLACE'; placeId: string }
  | { type: 'SET_COMPANION'; companionId: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }
  | { type: 'RESET_CURRENT_STEP' };
